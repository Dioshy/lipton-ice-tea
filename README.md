# lipton ice tea

A one-page site, built in Dioshy's workshop. It is plain HTML, CSS and JavaScript: open `index.html`, or put the folder on any host.

- `index.html`: the page. Each section sits between `<!-- ws:name -->` markers.
- `styles/base.css`: colours, fonts and spacing as CSS variables. `styles/<section>.css`: one file per section.
- `scripts/<section>.js`: a section's motion, when it has any.
- Elements marked `data-fill` hold stand-in facts (prices, names, quotes) to replace with yours. `data-slot="photo"` marks where a photograph belongs.
- `assets/`: your pictures, once you've put some in.
- `.dioshy/workshop/`: the workshop's own notes (the brief, older versions). Not needed to host the site.
