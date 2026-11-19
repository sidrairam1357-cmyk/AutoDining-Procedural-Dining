# AutoDining — product promotion page

One Click. Complete Dining. — a static website (plain HTML, CSS, JavaScript; no libraries, no build step).

## Run it locally in Chrome
1. Unzip the archive. Keep the folder structure as it is.
2. Open the unzipped `autodining-website` folder and double-click `index.html` (or right-click → Open with → Google Chrome).
   Everything uses relative paths, so it works straight from disk.
3. Optional local server (same result): open a terminal in the folder and run `python -m http.server 8000`, then visit http://localhost:8000

## Set your Superhive link
Open `js/script.js` and set `PRODUCT_URL` at the top. Until it is set, the "Get AutoDining" buttons in the call-to-action show a "link not set yet" message.

## Folders
- `index.html` — the page
- `css/style.css`, `js/script.js`
- `images/gallery/` full-size renders (WebP), `images/thumbs/` grid thumbnails, `images/posters/` video poster frames
- `videos/` promo videos (720p web versions) and short workflow clips cut from the Blender screen recordings
- `fonts/` Inter (subset)

The original full-quality files are untouched on your side; this site uses web-optimised copies.
