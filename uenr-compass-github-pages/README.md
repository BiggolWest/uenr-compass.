# UENR Compass

A responsive Next.js campus wayfinding starter for the University of Energy and Natural Resources.

This is a public student-facing website: campus search and navigation do not require student accounts. Once deployed to a public web host, all students can use it from the shared URL.

## Run locally

1. Install Node.js 20.9 or newer.
2. Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_SITE_URL` to the final public domain when you have it. The current map uses OpenStreetMap; Google Maps walking links open without an app API key.
3. Run `npm install`, then `npm run dev`.
4. Open `http://localhost:3000`.

## Publish for students

Run `npm run build`. Next.js writes the public static website to the `out` folder. Upload that folder to a public static host (for example, Vercel, Netlify, or the university web server) and share its URL with students. Set `NEXT_PUBLIC_SITE_URL` before building so canonical discovery metadata, `robots.txt`, and `sitemap.xml` use the actual domain. No account system is needed for the current campus guide.

## Publish with GitHub Pages

Push this project to a GitHub repository on the `main` branch. In the repository, open **Settings → Pages** and set the source to **GitHub Actions**. The included workflow builds the static export with the repository URL prefix and publishes it automatically. For a project repository named `uenr-compass`, the site URL will be `https://YOUR-USERNAME.github.io/uenr-compass/`.

## What is included

- Responsive campus explorer shell with accessible search, directory, saved places, route options, and light/dark themes.
- Live OpenStreetMap campus map with the currently mapped campus destinations, browser GPS tracking, distance-to-destination, and outbound walking directions.
- Dark mode switches the map to a dark basemap. Saved destinations and student-added pins are stored in the current browser using local storage.
- React 19, Next.js 16 App Router, Tailwind CSS configuration, Lucide icons, and a shadcn/ui-style Button primitive.

## Before using for real directions

The map uses OpenStreetMap tiles and mapped UENR features. Location tracking uses browser GPS after a student taps “Track my location”; distance is computed in the browser. Google Maps and Apple Maps links open walking directions for the selected coordinates. Room interiors and some campus paths are not mapped consistently and need verification with UENR before relying on them. User-added pins are local to each browser; a shared production directory needs a university-managed data source and a review workflow. GPS requires HTTPS on the public site and the student's permission.
