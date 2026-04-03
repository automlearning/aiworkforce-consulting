# Consultant Site Generator

A global CLI tool to generate professional consultant websites from templates.

## Installation

### Option 1: Install Globally (Recommended)

```bash
cd "C:\Users\life6\OneDrive\50. Claude Code\01. AiworkforceLandingPage\site-generator"
npm install -g .
```

Now you can run `create-site` from anywhere on your machine.

### Option 2: Run Without Installing

```bash
cd "C:\Users\life6\OneDrive\50. Claude Code\01. AiworkforceLandingPage\site-generator"
node bin/cli.js
```

## Usage

### Interactive Mode

Just run the command and follow the prompts:

```bash
create-site
```

### List Available Templates

```bash
create-site --list
```

### Use a Specific Template

```bash
create-site premium-consultant
```

### Use Pre-filled Values

Create a JSON file with your values and pass it:

```bash
create-site --config my-values.json --output ./my-new-site
```

### Specify Output Directory

```bash
create-site --output ./my-consulting-site
```

## Command Options

| Option | Shorthand | Description |
|--------|-----------|-------------|
| `--template <name>` | `-t` | Use specific template |
| `--config <file>` | `-c` | JSON file with pre-filled values |
| `--output <dir>` | `-o` | Output directory (default: ./generated-site) |
| `--list` | `-l` | List available templates |
| `--help` | `-h` | Show help message |

## Available Templates

### Premium Consultant

A premium, understated website for solo consultants targeting executive clients.

- 4 pages: Home, Services, About, Contact
- Mobile responsive
- Premium typography
- Easy customisation

## Adding New Templates

1. Create a folder in `templates/` with your template name
2. Add a `config.json` file with questions and file list
3. Create template files with `{{PLACEHOLDER}}` variables

### config.json Structure

```json
{
  "templateName": "My Template",
  "description": "Description of the template",
  "version": "1.0.0",
  "questions": [
    {
      "id": "VARIABLE_NAME",
      "question": "What is your name?",
      "type": "text",
      "required": true,
      "placeholder": "John Smith"
    }
  ],
  "files": [
    "index.html",
    "styles.css"
  ]
}
```

## Uninstall

```bash
npm uninstall -g consultant-site-generator
```

## License

MIT
