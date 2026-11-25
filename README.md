# Odylop Wedding Planner – interactive design preview

Three independent visual directions, sharing functional demo behavior. Static HTML/CSS/JS, no build dependency. The 27 WebP photos are derived from the original generated mockups in `references/`; these are illustrative, not Odylop's actual portfolio. The preview does not send or store personal data. Prices and service details are illustrative. Wordmark is typeset, not an official supplied logo.

## Run

```sh
python3 -m http.server 8000
```

- Botanical: http://localhost:8000/?theme=botanical-luxury
- Editorial: http://localhost:8000/?theme=timeless-editorial
- Romantic: http://localhost:8000/?theme=modern-romantic

Each theme has package dialogs, gallery, consultation simulation and a sample budget calculator. CSS is responsive. Use an external HTTP server for publishing; no backend is included. Google Fonts are optional with local serif/sans fallbacks. To make separate branch deployments, change the default theme in app.js per branch, or keep a single deployment with these three URLs.

Asset fidelity: crops preserve visible original pixels before WebP compression. They remain low-resolution, especially editorial package photos. Hero backgrounds and ornaments are rebuilt with CSS/SVG. No HD reconstruction or official brand asset verification has been performed. Visual match is approximate, not pixel-identical.