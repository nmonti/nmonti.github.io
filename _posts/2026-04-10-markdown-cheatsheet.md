---
layout: post
title: "Markdown Cheatsheet for Bloggers"
date: 2026-04-10 10:00:00 -0500
categories: [reference]
tags: [markdown, writing]
---

Jekyll posts are written in Markdown — a lightweight syntax that converts to clean HTML. Here's a quick reference.

## Headings

```markdown
# H1
## H2
### H3
```

## Text formatting

```markdown
**bold**, _italic_, ~~strikethrough~~, `inline code`
```

Renders as: **bold**, _italic_, ~~strikethrough~~, `inline code`

## Lists

```markdown
- Unordered item
- Another item
  - Nested item

1. First
2. Second
3. Third
```

## Links and images

```markdown
[Link text](https://example.com)
![Alt text](/assets/image.png)
```

## Code blocks

Use triple backticks with an optional language hint for syntax highlighting:

````markdown
```python
def greet(name):
    return f"Hello, {name}!"
```
````

```python
def greet(name):
    return f"Hello, {name}!"
```

## Blockquotes

```markdown
> This is a blockquote.
> It can span multiple lines.
```

> This is a blockquote.
> It can span multiple lines.

## Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell A   | Cell B   | Cell C   |
| Cell D   | Cell E   | Cell F   |
```

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell A   | Cell B   | Cell C   |
| Cell D   | Cell E   | Cell F   |

That covers the essentials. Jekyll also supports HTML in Markdown files if you need more control over layout.
