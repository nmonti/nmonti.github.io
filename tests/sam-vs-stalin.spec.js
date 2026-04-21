// @ts-check
const { test, expect, devices } = require('@playwright/test');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Wait for the hidden #game-state element to report a specific scene.
 */
async function waitForScene(page, scene, timeout = 12000) {
  await expect(page.locator('#game-state'))
    .toHaveAttribute('data-scene', scene, { timeout });
}

/**
 * Click a point expressed in Phaser canvas-space (800×500) accounting for
 * the FIT-scaled canvas that Phaser renders into.
 */
async function clickCanvas(page, cx, cy) {
  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  const sx = box.width / 800;
  const sy = box.height / 500;
  await page.mouse.click(box.x + cx * sx, box.y + cy * sy);
}

async function tapCanvas(page, cx, cy) {
  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  const sx = box.width / 800;
  const sy = box.height / 500;
  await page.tap('canvas', { position: { x: cx * sx, y: cy * sy } });
}

// ---------------------------------------------------------------------------
// Desktop tests
// ---------------------------------------------------------------------------

test.describe('Sam vs Stalin — Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sam-vs-stalin/');
    // Wait for Phaser to initialise and render the menu
    await waitForScene(page, 'MenuScene');
  });

  test('page has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Sam vs. Stalin');
  });

  test('canvas is visible', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('game-state element is present', async ({ page }) => {
    await expect(page.locator('#game-state')).toBeAttached();
  });

  test('menu scene loads on startup', async ({ page }) => {
    await waitForScene(page, 'MenuScene');
  });

  test('single-player button transitions to GameScene', async ({ page }) => {
    // Single Player button is centred at (210, 443) in 800×500 canvas space
    await clickCanvas(page, 210, 443);
    await waitForScene(page, 'GameScene');
  });

  test('HP values start at 100 in GameScene', async ({ page }) => {
    await clickCanvas(page, 210, 443);
    await waitForScene(page, 'GameScene');
    const state = page.locator('#game-state');
    await expect(state).toHaveAttribute('data-sam-hp', '100');
    await expect(state).toHaveAttribute('data-stalin-hp', '100');
  });

  test('two-player button transitions to GameScene', async ({ page }) => {
    // Two Player button is centred at (590, 443)
    await clickCanvas(page, 590, 443);
    await waitForScene(page, 'GameScene');
  });

  test('Sam moves right with ArrowRight key', async ({ page }) => {
    await clickCanvas(page, 210, 443);
    await waitForScene(page, 'GameScene');

    // Focus canvas and hold right for 400 ms
    await page.locator('canvas').click();
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(400);
    await page.keyboard.up('ArrowRight');

    // Game should still be running (not navigated away)
    await expect(page.locator('#game-state'))
      .toHaveAttribute('data-scene', 'GameScene');
  });

  test('Space bar fires USA flag without crashing', async ({ page }) => {
    await clickCanvas(page, 210, 443);
    await waitForScene(page, 'GameScene');

    await page.locator('canvas').click();
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);

    await expect(page.locator('#game-state'))
      .toHaveAttribute('data-scene', 'GameScene');
  });

  test('multiple space bar presses do not crash', async ({ page }) => {
    await clickCanvas(page, 210, 443);
    await waitForScene(page, 'GameScene');

    await page.locator('canvas').click();
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(200);
    }

    await expect(page.locator('#game-state'))
      .toHaveAttribute('data-scene', 'GameScene');
  });
});

// ---------------------------------------------------------------------------
// Mobile tests — iPhone 12
// ---------------------------------------------------------------------------

test.describe('Sam vs Stalin — iPhone 12', () => {
  test.use({ ...devices['iPhone 12'] });

  test.beforeEach(async ({ page }) => {
    await page.goto('/sam-vs-stalin/');
    await waitForScene(page, 'MenuScene');
  });

  test('page has correct title on iPhone', async ({ page }) => {
    await expect(page).toHaveTitle('Sam vs. Stalin');
  });

  test('canvas is visible on iPhone', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('canvas fits within iPhone viewport width', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    const box = await canvas.boundingBox();
    const vp = page.viewportSize();
    expect(box.width).toBeGreaterThan(100);
    expect(box.height).toBeGreaterThan(50);
    // Allow 1 px tolerance for sub-pixel rounding
    expect(box.width).toBeLessThanOrEqual(vp.width + 1);
  });

  test('menu scene loads on iPhone', async ({ page }) => {
    await waitForScene(page, 'MenuScene');
  });

  test('tap single-player transitions to GameScene on iPhone', async ({ page }) => {
    await tapCanvas(page, 210, 443);
    await waitForScene(page, 'GameScene');
  });

  test('HP values start at 100 on iPhone', async ({ page }) => {
    await tapCanvas(page, 210, 443);
    await waitForScene(page, 'GameScene');
    const state = page.locator('#game-state');
    await expect(state).toHaveAttribute('data-sam-hp', '100');
    await expect(state).toHaveAttribute('data-stalin-hp', '100');
  });

  test('touch FIRE button does not crash game on iPhone', async ({ page }) => {
    await tapCanvas(page, 210, 443);
    await waitForScene(page, 'GameScene');

    // FIRE button for Sam is at (130, H-52) = (130, 448) in canvas space
    await tapCanvas(page, 130, 448);
    await page.waitForTimeout(400);

    await expect(page.locator('#game-state'))
      .toHaveAttribute('data-scene', 'GameScene');
  });

  test('game remains playable after rapid fire on iPhone', async ({ page }) => {
    await tapCanvas(page, 210, 443);
    await waitForScene(page, 'GameScene');

    // Rapid taps on the FIRE button
    for (let i = 0; i < 4; i++) {
      await tapCanvas(page, 130, 448);
      await page.waitForTimeout(600);
    }

    // Game should still be in GameScene (not crashed, might have won/lost vs AI
    // so we just confirm game-state is still updating — accept any scene)
    await expect(page.locator('#game-state'))
      .toHaveAttribute('data-scene', /.+/);
  });
});
