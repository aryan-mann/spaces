# AGENTS.md - Our Spaces

## What is this project?

**Our Spaces** is a web application for discovering "third spaces" in San Francisco - places where people can gather, work, read, or simply exist without necessarily having to purchase something. Think libraries, parks, POPOs (Privately Owned Public Open Spaces), hotel lobbies, bookstores, and community centers.

The goal is to make these community spaces more discoverable and better utilized.

## Tech Stack

- **Framework:** SvelteKit 2.x with Svelte 5
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Sass
- **Package Manager:** Bun (preferred)
- **Map:** MapLibre GL
- **Search:** Fuse.js
- **Hosting:** Cloudflare Pages (via Wrangler)

## How to Run

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Deploy to Cloudflare Pages
bun run deploy
```

## How to Test

Use the **agent-browser CLI** for testing:

```bash
# Run agent-browser tests
agent-browser test

# Or run the test suite
bun test
```

## How to Add New Places

Spaces are stored in `/src/lib/spaces_sf.jsonc` (JSON with comments).

### Space Schema

```json
{
	"name": "Space Name",
	"type": "Cafe | POPO | Park | Library | Hotel | Museum | Community Center | Bookstore | Rooftop | Plaza",
	"description": "Brief description of the space",
	"location": [
		{
			"address": "Full street address",
			"coordinates": { "lat": 37.1234, "lng": -122.5678 }
		}
	],
	"openingHours": {
		"Mo": [9, 17],
		"Tu": [9, 17],
		"We": [9, 17],
		"Th": [9, 17],
		"Fr": [9, 17],
		"Sa": [10, 16],
		"Su": [12, 16]
	},
	// OR use: "openingHours": "always open"
	"vetted": true,
	"rating": 4,
	"tags": [
		"free wifi",
		"quiet",
		"work friendly",
		"power plugs",
		"outdoor",
		{ "label": "wifi", "detail": "Network: FreeWiFi" }
	],
	"images": ["image_name.webp"],
	"authorNote": "Optional insider tip"
}
```

### Adding a New Space

1. Open `/src/lib/spaces_sf.jsonc`
2. Add a new JSON object following the schema above
3. Ensure coordinates are accurate (use Google Maps or similar)
4. Set `"vetted": true` only after visiting/verifying the space
5. Include relevant tags for filtering
6. Test locally with `bun run dev`
7. Commit and push changes

To see all existing space types and tags used in the project:

```bash
# List all unique space types
cat src/lib/spaces_sf.jsonc | grep '"type"' | sort | uniq

# List all unique tags
cat src/lib/spaces_sf.jsonc | grep -E '"[a-z]+"' | sort | uniq
```

## Important Notes

- **Data source:** All spaces are manually curated in `spaces_sf.jsonc`
- **Images:** Store in `/static/images/` with descriptive names
- **Coordinates:** Use decimal degrees (lat, lng)
- **Hours:** Use 24-hour format [open, close], or "always open"
- **Vetting:** Mark as vetted only after personal verification
- **NEVER deploy without explicit user consent** - Always ask before running `bun run deploy`
