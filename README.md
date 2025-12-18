# n8n-nodes-acrewity

This is an n8n community node for [Acrewity](https://acrewity.com) - a unified API platform with 20+ utility services.

## Features

This node provides access to all Acrewity API services:

### Data & Utilities
- **UUID Generator** - Generate unique identifiers (v1, v4)
- **Regex Matcher** - Pattern matching and text extraction
- **Text Diff** - Compare two texts and highlight differences
- **URL Encoder/Decoder** - Safely encode and decode URLs
- **Timezone Converter** - Convert times between timezones
- **JSON Schema Validator** - Validate JSON against schemas

### Content Processing
- **URL to Markdown** - Convert web pages to Markdown
- **HTML to Markdown** - Convert HTML content to Markdown
- **Markdown to HTML** - Convert Markdown to HTML with syntax highlighting
- **HTML to PDF** - Generate PDF documents from HTML

### Document Generation
- **QR Code Generator** - Generate QR codes (PNG/SVG)
- **Markdown Table Generator** - Create formatted Markdown tables

### File Conversion
- **Image Converter** - Convert between JPEG, PNG, WebP
- **Excel to JSON** - Parse Excel files to JSON
- **JSON to Excel** - Create Excel files from JSON data

### PDF Operations
- **PDF Merge** - Combine multiple PDF files
- **PDF Extract Page** - Extract specific pages from PDFs
- **PDF to HTML** - Convert PDFs to HTML
- **PDF to Markdown** - Convert PDFs to Markdown

### Communication
- **Email Access** - Send emails via SMTP

## Installation

### In n8n Desktop/Self-hosted

1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `@acrewity/n8n-nodes-acrewity`
4. Click **Install**

### Manual Installation

```bash
npm install @acrewity/n8n-nodes-acrewity
```

## Credentials

To use this node, you need an Acrewity API key:

1. Sign up at [acrewity.com](https://acrewity.com)
2. Go to your Dashboard > API Keys
3. Create a new API key
4. Copy the key (starts with `ak_`)

In n8n:
1. Go to **Credentials**
2. Create new **Acrewity API** credential
3. Paste your API key

## Usage

1. Add the **Acrewity** node to your workflow
2. Select a **Resource** (service type)
3. Select an **Operation**
4. Fill in the required parameters
5. Execute!

### Example: Generate UUIDs

1. Resource: `UUID Generator`
2. Operation: `Generate UUID`
3. UUID Version: `Version 4 (Random)`
4. Count: `5`

### Example: Convert HTML to PDF

1. Resource: `HTML to PDF`
2. Operation: `Convert to PDF`
3. HTML Content: `<html><body><h1>Invoice #123</h1>...</body></html>`

## API Documentation

Full API documentation is available at [acrewity.com/docs](https://acrewity.com/docs)

## Credits

Each API operation costs **1 credit**. Check your credit balance in the Acrewity dashboard.

## Support

- **Documentation**: [acrewity.com/docs](https://acrewity.com/docs)
- **Issues**: [GitHub Issues](https://github.com/Acrewity/n8n-nodes-acrewity/issues)
- **Contact**: [acrewity.com/contact](https://acrewity.com/contact)

## License

[MIT](LICENSE.md)
