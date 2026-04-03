# Samuel Kambasha Website Template - Recreation Prompt

Use this prompt to recreate the exact website template. Copy this entire file and paste it to Claude.

---

## PROMPT START

Create a 4-page consulting website with the following specifications:

### Site Configuration
```json
{
  "CONSULTANT_NAME": "Samuel Kambasha",
  "PROFILE_PHOTO": "LinkdInPhoto.png",
  "SITE_TITLE": "Samuel Kambasha | Applied AI & Analytics Consulting",
  "LOGO_TEXT": "Samuel Kambasha",
  "HEADLINE": "Applied AI orchestration for modern businesses.",
  "SUBHEADLINE": "Practical AI automations for small and mid-sized businesses—built to ship and deliver ROI.",
  "HERO_CTA_TEXT": "Book a Call",
  "TARGET_AUDIENCE": "Small to medium-sized businesses",
  "INDUSTRY": "Fintech, Banking, professional services",
  "LOCATION": "Melbourne, Australia",
  "YEARS_EXPERIENCE": "15+ years",
  "SPECIALISATION": "AI orchestration and automation design",
  "PRIMARY_COLOR": "#1a365d",
  "SECONDARY_COLOR": "#2d5a87",
  "ACCENT_COLOR": "#e67e22",
  "HEADING_FONT": "Newsreader",
  "BODY_FONT": "Inter",
  "EMAIL": "sam@aiworkforce.au",
  "LINKEDIN_URL": "https://www.linkedin.com/in/samuel-kambasha-86b4a471/",
  "FOOTER_TAGLINE": "AI that ships."
}
```

### Pages Required
1. **index.html** - Home page with hero, problem/solution, services overview, CTA
2. **services.html** - Detailed services with deliverables and process steps
3. **about.html** - About page with credentials sidebar
4. **contact.html** - Contact form with details sidebar

### Services (3 services)

**Service 1: AI-Enabled Decision Systems**
- Duration: 4-8 weeks
- Description: I design and deliver AI systems that let your team interact with data, documents, and processes using natural language—with reliability and governance built in.
- Deliverables: Secure document Q&A and knowledge retrieval systems | Voice-enabled assistants for internal or customer-facing use | Natural language data access layers and query interfaces | Automated analysis and decision-support pipelines

**Service 2: Automation & Systems Integration**
- Duration: 3-6 weeks
- Description: I build end-to-end automation of data flows and business processes, connecting your systems and reducing manual effort across analytics, operations, and reporting.
- Deliverables: Automated and resilient data pipelines | System integration and orchestration workflows | Notification, alerting, and exception-handling systems | Data quality checks and operational monitoring

**Service 3: Advanced Analytics & Data Science**
- Duration: 2-6 weeks
- Description: I apply statistical modelling and data science to drive insight, prediction, and better decisions—focused on commercial outcomes rather than academic models.
- Deliverables: Analytical insights and decision-ready reporting | Predictive models and scoring frameworks | Forecasts and scenario analysis | Measurement frameworks and model documentation

### Content Sections

**Problem Statement:**
"You know AI could help your business but don't know where to start. Tools don't integrate. Projects don't ship."

**Solution Statement:**
"I identify high-impact opportunities and build AI automations that work with your existing systems."

**About Intro:**
"Our Approach - How we tackle complex data challenges. Data work is rarely straightforward. Requirements change, systems are fragmented, and priorities compete. We bring structure and clear thinking without rigid frameworks, working pragmatically with what already exists."

### Design Specifications

**Typography:**
- Headings: Newsreader (serif), weight 500
- Body: Inter (sans-serif), weight 400-500
- H1: 3rem (responsive down to 2.25rem)
- H2: 2.25rem (responsive down to 1.75rem)
- Body: 1rem, line-height 1.6

**Colors:**
- Primary: #1a365d (dark blue)
- Secondary: #2d5a87 (medium blue)
- Accent: #e67e22 (orange)
- Text: #1a1a1a
- Text Light: #666666
- Background: #ffffff
- Background Alt: #f8f9fa
- Border: #e5e7eb

**Layout:**
- Max width: 1200px
- Narrow content: 720px
- Spacing scale: 0.5rem, 1rem, 1.5rem, 2rem, 3rem, 5rem
- Sticky navigation with border-bottom
- Footer with dark background (#1a1a1a)

**Components:**
- Buttons: Primary (filled) and Secondary (outlined), 4px border-radius
- Cards: 1px border, 8px border-radius, subtle hover shadow
- FAQ accordion with +/- toggle
- Mobile hamburger menu
- Process steps with numbered circles

### Features
- Responsive design (breakpoints at 768px and 992px)
- Mobile navigation toggle
- FAQ accordion functionality
- Optional sections that hide when data is empty (using data-optional attributes)
- Smooth scroll for anchor links
- Contact form (Formspree integration)
- Social links in footer (LinkedIn, Twitter, GitHub, YouTube, Podcast icons)

### File Structure
```
/
├── index.html
├── services.html
├── about.html
├── contact.html
├── styles.css
├── script.js
├── LinkdInPhoto.png
└── site-config.json
```

Create all files with the exact styling and layout described. The site should be professional, minimal, and focused on converting visitors to booking calls.

---

## PROMPT END

---

## Quick Reference - Key CSS Variables

```css
:root {
    --color-primary: #1a365d;
    --color-secondary: #2d5a87;
    --color-accent: #e67e22;
    --color-text: #1a1a1a;
    --color-text-light: #666666;
    --color-text-muted: #999999;
    --color-background: #ffffff;
    --color-background-alt: #f8f9fa;
    --color-border: #e5e7eb;
    --font-heading: 'Newsreader', Georgia, serif;
    --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --max-width: 1200px;
    --max-width-narrow: 720px;
}
```

## Quick Reference - Page Structure

### index.html
- Navigation (sticky)
- Hero with photo and CTA
- Stats section (optional)
- Problem section
- Solution section
- Services grid (3 cards)
- Testimonials (optional)
- Client logos (optional)
- FAQ (optional)
- Newsletter (optional)
- CTA block
- Footer

### services.html
- Navigation
- Page header
- Service details (3 sections with deliverables)
- Process steps (Discovery, Proposal, Delivery)
- FAQ (optional)
- CTA block
- Footer

### about.html
- Navigation
- Page header
- About content with sidebar
- Testimonials (optional)
- CTA block
- Footer

### contact.html
- Navigation
- Page header
- Booking widget OR contact form
- Contact info sidebar
- Footer
