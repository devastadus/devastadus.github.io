# Solar Aces — Website

Single-page static site for Solar Aces. No build step — `index.html` + `assets/`.

## Edit the links (one spot)

Open `index.html` and find this block near the bottom:

```js
const STEAM_URL = "";     // paste your Steam store URL when the page is live
const YOUTUBE_URL = "";   // paste your Devastadus channel URL
```

Every Wishlist button and YouTube link on the page updates automatically.

## Add screenshots / trailer

In the `#media` section, replace the `media-slot` placeholders:

```html
<div class="media-slot filled"><img src="assets/your-screenshot.jpg" alt="..."></div>
```

For the trailer, swap a slot for a YouTube embed iframe once it's public.

## Deploy — GitHub Pages (free)

```bash
cd ~/dev/solar-aces-web
git init && git add . && git commit -m "Solar Aces site"
gh repo create solar-aces-web --public --source=. --push
```

Then on GitHub: repo → Settings → Pages → Source: `main` branch, `/ (root)`.
Live at `https://<username>.github.io/solar-aces-web/` in about a minute.

## Deploy — Netlify (also free)

Drag the folder onto https://app.netlify.com/drop — done. Netlify adds forms,
redirects, and instant deploy previews if you want them later.

Either works fine for this site; custom domains are free on both.
