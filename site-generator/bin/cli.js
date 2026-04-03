#!/usr/bin/env node

/**
 * Consultant Site Generator CLI
 *
 * A global CLI tool to generate professional websites from templates.
 *
 * Usage:
 *   create-site                     # Interactive mode - select template, answer questions
 *   create-site --list              # List available templates
 *   create-site --template <name>   # Use specific template
 *   create-site --config <file>     # Use pre-filled values from JSON
 *   create-site --output <dir>      # Specify output directory
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Get templates directory (relative to this script)
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

// ANSI colours for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Create readline interface
function createInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}

// Prompt user for input
function prompt(rl, question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

// List available templates
function listTemplates() {
    const templates = [];

    if (!fs.existsSync(TEMPLATES_DIR)) {
        return templates;
    }

    const items = fs.readdirSync(TEMPLATES_DIR);

    for (const item of items) {
        const itemPath = path.join(TEMPLATES_DIR, item);
        const configPath = path.join(itemPath, 'config.json');

        if (fs.statSync(itemPath).isDirectory() && fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            templates.push({
                name: item,
                displayName: config.templateName || item,
                description: config.description || 'No description',
                version: config.version || '1.0.0'
            });
        }
    }

    return templates;
}

// Display available templates
function showTemplates() {
    const templates = listTemplates();

    console.log('\n' + colors.bright + 'Available Templates:' + colors.reset + '\n');

    if (templates.length === 0) {
        console.log('  No templates found.\n');
        return;
    }

    templates.forEach((template, index) => {
        console.log(`  ${colors.cyan}${index + 1}. ${template.displayName}${colors.reset} (${template.name})`);
        console.log(`     ${colors.dim}${template.description}${colors.reset}\n`);
    });
}

// Select a template interactively
async function selectTemplate(rl) {
    const templates = listTemplates();

    if (templates.length === 0) {
        console.log('\nNo templates found. Please add templates to the templates folder.\n');
        process.exit(1);
    }

    console.log('\n' + colors.bright + '='.repeat(60) + colors.reset);
    console.log(colors.bright + '  Consultant Site Generator' + colors.reset);
    console.log(colors.bright + '='.repeat(60) + colors.reset);

    showTemplates();

    let selection = '';
    while (!selection) {
        const answer = await prompt(rl, `Select a template (1-${templates.length}): `);
        const num = parseInt(answer, 10);

        if (num >= 1 && num <= templates.length) {
            selection = templates[num - 1].name;
        } else {
            console.log('Invalid selection. Please enter a number.\n');
        }
    }

    return selection;
}

// Load template configuration
function loadTemplateConfig(templateName) {
    const configPath = path.join(TEMPLATES_DIR, templateName, 'config.json');

    if (!fs.existsSync(configPath)) {
        console.error(`Error: Template "${templateName}" not found or missing config.json`);
        process.exit(1);
    }

    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

// Collect user inputs interactively
async function collectInputs(rl, config) {
    const values = {};

    console.log('\n' + colors.bright + `Configuring: ${config.templateName}` + colors.reset);
    console.log(colors.dim + 'Answer the following questions to generate your website.\n' + colors.reset);

    for (const question of config.questions) {
        const placeholder = question.placeholder ? ` ${colors.dim}(e.g., ${question.placeholder})${colors.reset}` : '';
        const required = question.required ? colors.yellow + ' *' + colors.reset : '';

        let answer = '';
        while (!answer && question.required) {
            answer = await prompt(rl, `${question.question}${required}${placeholder}\n${colors.cyan}>${colors.reset} `);
            if (!answer && question.required) {
                console.log(colors.yellow + 'This field is required.\n' + colors.reset);
            }
        }

        values[question.id] = answer || question.placeholder || '';
        console.log('');
    }

    return values;
}

// Load values from JSON file
function loadValuesFromFile(filePath) {
    const fullPath = path.resolve(filePath);

    if (!fs.existsSync(fullPath)) {
        console.error(`Error: Config file not found: ${fullPath}`);
        process.exit(1);
    }

    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

// Replace placeholders in content
function replacePlaceholders(content, values) {
    let result = content;
    for (const [key, value] of Object.entries(values)) {
        const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        result = result.replace(placeholder, value);
    }
    return result;
}

// Copy directory recursively
function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Generate the website
function generateSite(templateName, config, values, outputDir) {
    const templateDir = path.join(TEMPLATES_DIR, templateName);
    const fullOutputDir = path.resolve(outputDir);

    // Create output directory
    if (!fs.existsSync(fullOutputDir)) {
        fs.mkdirSync(fullOutputDir, { recursive: true });
    }

    console.log('\n' + colors.bright + 'Generating website...' + colors.reset + '\n');

    // Process each template file
    for (const file of config.files) {
        const inputPath = path.join(templateDir, file);
        const outputPath = path.join(fullOutputDir, file);

        if (!fs.existsSync(inputPath)) {
            console.log(`  ${colors.yellow}Warning: Template file not found: ${file}${colors.reset}`);
            continue;
        }

        const content = fs.readFileSync(inputPath, 'utf8');
        const processed = replacePlaceholders(content, values);

        // Ensure directory exists for nested files
        const outputFileDir = path.dirname(outputPath);
        if (!fs.existsSync(outputFileDir)) {
            fs.mkdirSync(outputFileDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, processed, 'utf8');
        console.log(`  ${colors.green}✓${colors.reset} ${file}`);
    }

    // Save configuration for future reference
    const configOutputPath = path.join(fullOutputDir, 'site-config.json');
    fs.writeFileSync(configOutputPath, JSON.stringify(values, null, 2), 'utf8');
    console.log(`  ${colors.green}✓${colors.reset} site-config.json`);

    console.log('\n' + colors.bright + '='.repeat(60) + colors.reset);
    console.log(colors.green + '  Website generated successfully!' + colors.reset);
    console.log(colors.bright + '='.repeat(60) + colors.reset);
    console.log(`\n  Output: ${colors.cyan}${fullOutputDir}${colors.reset}`);
    console.log('\n  To preview your site:');
    console.log(`    ${colors.dim}cd "${fullOutputDir}"${colors.reset}`);
    console.log(`    ${colors.dim}npx serve${colors.reset}`);
    console.log('');
}

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        list: false,
        template: null,
        configFile: null,
        outputDir: './generated-site'
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--list':
            case '-l':
                options.list = true;
                break;
            case '--template':
            case '-t':
                options.template = args[++i];
                break;
            case '--config':
            case '-c':
                options.configFile = args[++i];
                break;
            case '--output':
            case '-o':
                options.outputDir = args[++i];
                break;
            case '--help':
            case '-h':
                showHelp();
                process.exit(0);
            default:
                if (!args[i].startsWith('-')) {
                    // Assume it's a template name
                    options.template = args[i];
                }
        }
    }

    return options;
}

// Show help
function showHelp() {
    console.log(`
${colors.bright}Consultant Site Generator${colors.reset}

Generate professional consultant websites from templates.

${colors.bright}Usage:${colors.reset}
  create-site                           Interactive mode
  create-site <template>                Use specific template
  create-site --list                    List available templates
  create-site --config values.json      Use pre-filled values
  create-site --output ./my-site        Specify output directory

${colors.bright}Options:${colors.reset}
  -t, --template <name>    Template to use
  -c, --config <file>      JSON file with pre-filled values
  -o, --output <dir>       Output directory (default: ./generated-site)
  -l, --list               List available templates
  -h, --help               Show this help message

${colors.bright}Examples:${colors.reset}
  create-site premium-consultant
  create-site -t premium-consultant -o ./my-consulting-site
  create-site --config my-values.json --output ./new-site
`);
}

// Main function
async function main() {
    const options = parseArgs();

    // List templates
    if (options.list) {
        showTemplates();
        return;
    }

    const rl = createInterface();

    try {
        // Select or use specified template
        let templateName = options.template;
        if (!templateName) {
            templateName = await selectTemplate(rl);
        }

        // Validate template exists
        const templates = listTemplates();
        const templateExists = templates.some(t => t.name === templateName);
        if (!templateExists) {
            console.error(`\nError: Template "${templateName}" not found.`);
            console.log('Available templates:');
            templates.forEach(t => console.log(`  - ${t.name}`));
            process.exit(1);
        }

        // Load template config
        const config = loadTemplateConfig(templateName);

        // Get values
        let values;
        if (options.configFile) {
            values = loadValuesFromFile(options.configFile);
            console.log(`\nLoaded configuration from: ${options.configFile}`);
        } else {
            values = await collectInputs(rl, config);
        }

        // Generate site
        generateSite(templateName, config, values, options.outputDir);

    } finally {
        rl.close();
    }
}

// Run
main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
