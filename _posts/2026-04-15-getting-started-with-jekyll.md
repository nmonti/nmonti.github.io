---
layout: post
title: "Getting Started with Jekyll"
date: 2026-04-15 09:00:00 -0500
categories: [tutorial]
tags: [jekyll, ruby, static-sites]
---

Jekyll is one of the most popular static site generators, and for good reason. This post walks through setting it up from scratch.

## Prerequisites

You'll need Ruby installed. On Ubuntu/Debian:

```bash
sudo apt install ruby-full build-essential
```

On macOS with Homebrew:

```bash
brew install ruby
```

## Installing Jekyll

```bash
gem install jekyll bundler
```

## Creating a new site

```bash
jekyll new my-blog
cd my-blog
bundle exec jekyll serve
```

Visit `http://localhost:4000` to see your site running locally.

## Project structure

```
my-blog/
├── _config.yml       # Site configuration
├── _posts/           # Blog posts (Markdown)
├── _layouts/         # HTML templates
├── _includes/        # Reusable partials
├── assets/           # CSS, images, JS
└── index.md          # Home page
```

## Writing your first post

Create a file in `_posts/` with the naming format `YYYY-MM-DD-title.md`:

```markdown
---
layout: post
title: "My First Post"
date: 2026-04-15
categories: [blog]
---

Hello, world! This is my first Jekyll post.
```

The front matter (between `---`) sets metadata. Jekyll uses it to build the page correctly.

## Deploying to GitHub Pages

Push your repo to GitHub and enable GitHub Pages in the repository settings — Jekyll builds automatically on every push to `main`.
