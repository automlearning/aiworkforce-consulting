#!/usr/bin/env node

/**
 * Premium Consultant Template Generator
 *
 * This script generates a customised website from the Premium Consultant template
 * by replacing placeholders with user-provided values.
 *
 * Usage:
 *   node generate.js                    # Interactive mode - prompts for all values
 *   node generate.js --config data.json # Use a JSON file with pre-filled values
 *   node generate.js --output ./mysite  # Specify output directory
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const TEMPLATE_DIR = __dirname;
const CONFIG_FILE = path.join(TEMPLATE_DIR, 'config.json');
const DEFAULT_OUTPUT_DIR = path.join(process.cwd(), 'generated-site');

// Load template configuration
function loadConfig() {
    const configPath = CONFIG_FILE;
    if (!fs.existsSync(configPath)) {
        console.error('Error: config.json not found in template directory');
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

// Create readline interface for user input
function createInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}

// Prompt user for a single value
function prompt(rl, question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

// Collect all user inputs interactively
async function collectInputs(config) {
    const rl = createInterface();
    const values = {};

    console.log('\n' + '='.repeat(60));
    console.log(`  ${config.templateName} - Website Generator`);
    console.log('='.repeat(60));
    console.log('\nPlease answer the following questions to generate your website.\n');

    for (const question of config.questions) {
        const placeholder = question.placeholder ? ` (e.g., ${question.placeholder})` : '';
        const required = question.required ? ' *' : '';

        let answer = '';
        while (!answer && question.required) {
            answer = await prompt(rl, `${question.question}${required}${placeholder}\n> `);
            if (!answer && question.required) {
                console.log('This field is required. Please enter a value.\n');
            }
        }

        // Use placeholder as default if no answer provided for optional fields
        values[question.id] = answer || question.placeholder || '';
        console.log('');
    }

    rl.close();
    return values;
}

// Load values from a JSON file
function loadValuesFromFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`Error: Config file not found: ${filePath}`);
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Replace all placeholders in content
function replacePlaceholders(content, values) {
    let result = content;
    for (const [key, value] of Object.entries(values)) {
        const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        result = result.replace(placeholder, value);
    }
    return result;
}

// Generate the website
function generateSite(config, values, outputDir) {
    // Create output directory
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('\nGenerating website...\n');

    // Process each template file
    for (const file of config.files) {
        const inputPath = path.join(TEMPLATE_DIR, file);
        const outputPath = path.join(outputDir, file);

        if (!fs.existsSync(inputPath)) {
            console.log(`  Warning: Template file not found: ${file}`);
            continue;
        }

        const content = fs.readFileSync(inputPath, 'utf8');
        const processed = replacePlaceholders(content, values);
        fs.writeFileSync(outputPath, processed, 'utf8');
        console.log(`  Created: ${file}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('  Website generated successfully!');
    console.log('='.repeat(60));
    console.log(`\nOutput directory: ${outputDir}`);
    console.log('\nTo preview your site:');
    console.log(`  cd "${outputDir}"`);
    console.log('  npx serve');
    console.log('');
}

// Save values to a JSON file for reuse
function saveValues(values, outputDir) {
    const valuesPath = path.join(outputDir, 'site-config.json');
    fs.writeFileSync(valuesPath, JSON.stringify(values, null, 2), 'utf8');
    console.log(`\nConfiguration saved to: ${valuesPath}`);
    console.log('You can reuse this file with: node generate.js --config site-config.json\n');
}

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        configFile: null,
        outputDir: DEFAULT_OUTPUT_DIR
    };

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--config' && args[i + 1]) {
            options.configFile = args[i + 1];
            i++;
        } else if (args[i] === '--output' && args[i + 1]) {
            options.outputDir = args[i + 1];
            i++;
        } else if (args[i] === '--help' || args[i] === '-h') {
            console.log(`
Premium Consultant Template Generator

Usage:
  node generate.js                      Interactive mode
  node generate.js --config data.json   Use pre-filled values from JSON file
  node generate.js --output ./mysite    Specify output directory

Options:
  --config <file>   JSON file with pre-filled values
  --output <dir>    Output directory (default: ./generated-site)
  --help, -h        Show this help message
`);
            process.exit(0);
        }
    }

    return options;
}

// Main function
async function main() {
    const options = parseArgs();
    const config = loadConfig();

    let values;

    if (options.configFile) {
        // Load values from file
        values = loadValuesFromFile(options.configFile);
        console.log(`\nLoaded configuration from: ${options.configFile}`);
    } else {
        // Interactive mode
        values = await collectInputs(config);
    }

    // Generate the site
    generateSite(config, values, options.outputDir);

    // Save values for future use
    saveValues(values, options.outputDir);
}

// Run the generator
main().catch(console.error);
