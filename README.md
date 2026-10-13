# Cristobal Gonzalez personal site

A React and Vite personal website featuring work in medical device supplier quality, trail running, Martini and Tux, zodiac profiles, and a Jacksonville Jaguars tracker.

## Run locally

Install Node.js 20 or newer, then run:

```sh
npm install
npm run dev
```

For a production build, run `npm run build`. The generated site is in `dist/`.

## GitHub Pages

The app is configured for the repository URL `https://crgonzalezJAX.github.io/Cristobal_Gonzalez_SM/`. Pushing to `main` triggers `.github/workflows/deploy-pages.yml`, which builds the app and publishes `dist/`.

In the repository's **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**. This setting is required for the workflow to publish. The repository must also have GitHub Pages available under its GitHub plan and visibility settings.

## Jaguars data

The tracker requests ESPN's public NFL scoreboard, Jaguars schedule, and standings endpoints in the visitor's browser. It refreshes when the page opens, once a minute while the page is visible, and when the visitor presses **Refresh**. If the feeds are unavailable, the page offers a direct ESPN link. These endpoints are not a contracted API and may change; a production site that needs guaranteed availability should use a licensed sports data provider and a server-side proxy.

## Personal content

The bio and cat descriptions use only the details provided. Edit `src/App.jsx` to add more personal details later. No personal photos are used.
