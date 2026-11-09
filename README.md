# Collins Osas — Portfolio

Personal portfolio of **Ojiezele Collins Osas**, Frontend Developer (React, Next.js, TypeScript & React Native).

Built from scratch with plain **HTML, CSS and JavaScript** — no frameworks, libraries or templates.

**Live site:** _add link after deployment_

---

## Features

- **Light & dark themes** — follows the visitor's system setting, remembers their choice, and applies it before first paint (no flash)
- **Fully responsive** — tested down to 320px, with a slide-in mobile menu and blurred backdrop
- **Case-study project layout** with browser and code-editor mockups
- **Experience / Education tabs** with keyboard (arrow-key) navigation
- **Scroll animations** — section reveals, animated counters, typing effect and a looping tech marquee
- **Contact form** with inline validation that opens the visitor's email app, plus one-click copy for the email address
- **Accessible** — semantic landmarks, ARIA tab pattern, visible focus states and `prefers-reduced-motion` support
- **Lightweight** — optimised, lazy-loaded images and zero dependencies

## Tech stack

| Layer     | Tools                                                        |
| --------- | ------------------------------------------------------------ |
| Markup    | HTML5                                                        |
| Styling   | CSS3 — custom properties, Grid, Flexbox, media queries       |
| Behaviour | Vanilla JavaScript (ES6+) — IntersectionObserver, matchMedia |
| Fonts     | Anton, Inter, Unbounded, JetBrains Mono (Google Fonts)       |
| Hosting   | Vercel                                                       |

## Project structure

```
collins-portfolio/
├── index.html          # Page markup
├── style.css           # Design tokens, components, themes, breakpoints
├── script.js           # Interactions (menu, theme, tabs, animations, form)
├── 404.html            # Not-found page
├── images/             # Portrait, about photo, project screenshot
├── assets/             # Downloadable CV (PDF)
├── robots.txt
├── .editorconfig
├── .prettierrc
└── .gitignore
```

## Running locally

No build step is needed.

```bash
git clone https://github.com/SKD-W/collins-portfolio.git
cd collins-portfolio
```

Then open `index.html` in a browser, or serve the folder for the most accurate preview:

```bash
npx serve .
```

## Deployment

The site is static, so it deploys anywhere. On **Vercel**:

1. Push the repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Leave the framework preset as **Other** and click **Deploy**.

`404.html` is picked up automatically as the not-found page.

## Customising

- **Colours and theme** — edit the tokens at the top of `style.css` (`:root` for dark, `[data-theme="light"]` for light).
- **Content** — all text lives in `index.html`; the code-editor card is defined in `initCodeCard()` in `script.js`.
- **Images** — replace the files in `images/` (keep the same names, or update the paths in `index.html`).
- **CV** — replace `assets/Ojiezele-Collins-Osas-CV.pdf`.

## Contact

- Email: [user.collins.add@gmail.com](mailto:user.collins.add@gmail.com)
- LinkedIn: [Osas Collins](https://www.linkedin.com/in/osas-collins-7057a8264)

---

© Ojiezele Collins Osas. Code is free to read and learn from; please don't reuse the personal content (text, photos, CV) as your own.

# collins-portfolio
