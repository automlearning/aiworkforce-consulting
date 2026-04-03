# Premium Consultant Template

A premium, understated website template for solo consultants and advisors targeting executive clients.

## Features

- Clean, professional design
- Mobile responsive
- Premium typography (Inter + Newsreader)
- 4 pages: Home, Services, About, Contact
- Customisable via simple placeholder replacement

## Quick Start

### Option 1: Interactive Mode

Run the generator and answer the questions:

```bash
cd templates/premium-consultant
node generate.js
```

### Option 2: Use a Config File

Create a JSON file with your values (see `sample-data.json` for reference), then:

```bash
node generate.js --config my-values.json
```

### Option 3: Specify Output Directory

```bash
node generate.js --output ../my-new-site
```

## Customisable Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `CONSULTANT_NAME` | Your full name | Samuel Kambasha |
| `HEADLINE` | Main tagline | From Analytics Spend to Boardroom Evidence |
| `SUBHEADLINE` | One sentence value proposition | I help banking leaders prove the value of their data investments... |
| `TARGET_AUDIENCE` | Who you serve | Chief Data Officers in banking |
| `INDUSTRY` | Your industry focus | banking and financial services |
| `LOCATION` | Your location | Sydney, Australia |
| `EMAIL` | Contact email | hello@example.com |
| `LINKEDIN_URL` | LinkedIn profile URL | https://linkedin.com/in/... |
| `SERVICE_1_NAME` | First service name | Analytics ROI Audit |
| `SERVICE_1_DESCRIPTION` | First service description | A structured review of... |
| `SERVICE_1_DURATION` | First service duration | 4–6 weeks |
| `SERVICE_2_NAME` | Second service name | Strategy Workshop |
| `SERVICE_2_DESCRIPTION` | Second service description | A focused engagement to... |
| `SERVICE_2_DURATION` | Second service duration | 2–3 days |
| `SERVICE_3_NAME` | Third service name | Roadmap Development |
| `SERVICE_3_DESCRIPTION` | Third service description | A strategic planning... |
| `SERVICE_3_DURATION` | Third service duration | 6–8 weeks |
| `YEARS_EXPERIENCE` | Years of experience | 15 years |
| `SPECIALISATION` | Your area of expertise | Analytics strategy |

## Preview Your Site

After generating, preview locally:

```bash
cd generated-site
npx serve
```

Then open http://localhost:3000 in your browser.

## Deployment

The generated site is static HTML/CSS/JS. Deploy to:

- **Netlify**: Drag and drop the folder
- **Vercel**: `vercel deploy`
- **GitHub Pages**: Push to a `gh-pages` branch
- **Any web host**: Upload via FTP

## Customising Further

### Colours

Edit `styles.css` and modify the CSS custom properties at the top:

```css
:root {
    --color-primary: #1a1f36;      /* Main dark colour */
    --color-highlight: #c9a962;    /* Accent colour */
    --color-bg-warm: #faf9f7;      /* Background tint */
}
```

### Fonts

The template uses Google Fonts. To change fonts, update the `<link>` tags in each HTML file and the `--font-sans` / `--font-serif` variables in `styles.css`.

### Adding Pages

1. Copy an existing HTML file
2. Update the content
3. Add the new page to the navigation in all files

## File Structure

```
premium-consultant/
├── config.json         # Template configuration and questions
├── generate.js         # Generator script
├── sample-data.json    # Example values
├── README.md           # This file
├── index.html          # Homepage template
├── services.html       # Services page template
├── about.html          # About page template
├── contact.html        # Contact page template
├── styles.css          # Stylesheet
└── script.js           # JavaScript
```

## License

Free to use for personal and commercial projects.
