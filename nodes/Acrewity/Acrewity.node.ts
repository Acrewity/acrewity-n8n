import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

export class Acrewity implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Acrewity',
		name: 'acrewity',
		icon: 'file:acrewity.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + " (" + $parameter["resource"] + ")"}}',
		description: 'Consume the Acrewity API - 22+ utility services for data conversion, PDF processing, QR codes, barcodes, and more',
		defaults: {
			name: 'Acrewity',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'acrewityApi',
				required: true,
			},
		],
		properties: [
			// Resource Selection
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Barcode Generator', value: 'barcode_generator', description: 'Generate 1D barcodes (Code128, EAN, UPC, etc.)' },
					{ name: 'Email', value: 'email_access', description: 'Send emails via SMTP' },
					{ name: 'Excel to JSON', value: 'excel_to_json', description: 'Convert Excel files to JSON' },
					{ name: 'HTML to Markdown', value: 'html_to_markdown', description: 'Convert HTML to Markdown' },
					{ name: 'HTML to PDF', value: 'html_to_pdf', description: 'Convert HTML to PDF documents' },
					{ name: 'Image Converter', value: 'image_converter', description: 'Convert images between formats' },
					{ name: 'JSON Schema Validator', value: 'json_schema_validator', description: 'Validate JSON against schemas' },
					{ name: 'JSON to Excel', value: 'json_to_excel', description: 'Convert JSON to Excel files' },
					{ name: 'Markdown Table', value: 'markdown_table_generator', description: 'Generate Markdown tables' },
					{ name: 'Markdown to HTML', value: 'markdown_to_html', description: 'Convert Markdown to HTML' },
					{ name: 'PDF Extract Page', value: 'pdf_extract_page', description: 'Extract pages from PDFs' },
					{ name: 'PDF Merge', value: 'pdf_merge', description: 'Merge multiple PDF files' },
					{ name: 'PDF to HTML', value: 'pdf_to_html', description: 'Convert PDF to HTML' },
					{ name: 'PDF to Markdown', value: 'pdf_to_markdown', description: 'Convert PDF to Markdown' },
					{ name: 'QR Code', value: 'qr_code_generator', description: 'Generate QR codes' },
					{ name: 'Regex Matcher', value: 'regex_matcher', description: 'Match patterns in text' },
					{ name: 'Sitemap Generator', value: 'sitemap_generator', description: 'Extract links and generate XML sitemaps' },
					{ name: 'Text Diff', value: 'text_diff', description: 'Compare two texts' },
					{ name: 'Timezone Converter', value: 'timezone_converter', description: 'Convert between timezones' },
					{ name: 'URL Encoder/Decoder', value: 'url_encoder_decoder', description: 'Encode or decode URLs' },
					{ name: 'URL to Markdown', value: 'url_to_markdown', description: 'Convert web pages to Markdown' },
					{ name: 'UUID Generator', value: 'uuid_generator', description: 'Generate unique identifiers' },
				],
				default: 'uuid_generator',
			},

			// ============ UUID Generator ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['uuid_generator'] } },
				options: [
					{ name: 'Generate UUID', value: 'generate_uuid', action: 'Generate unique identifiers' },
				],
				default: 'generate_uuid',
			},
			{
				displayName: 'UUID Version',
				name: 'version',
				type: 'options',
				displayOptions: { show: { resource: ['uuid_generator'] } },
				options: [
					{ name: 'Version 1 (Time-Based)', value: 'v1' },
					{ name: 'Version 4 (Random)', value: 'v4' },
				],
				default: 'v4',
				description: 'The UUID version to generate',
			},
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				displayOptions: { show: { resource: ['uuid_generator'] } },
				default: 1,
				typeOptions: { minValue: 1, maxValue: 100 },
				description: 'Number of UUIDs to generate',
			},

			// ============ Barcode Generator ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['barcode_generator'] } },
				options: [
					{ name: 'Generate Barcode', value: 'generate_barcode', action: 'Generate a 1D barcode' },
				],
				default: 'generate_barcode',
			},
			{
				displayName: 'Text/Data',
				name: 'text',
				type: 'string',
				displayOptions: { show: { resource: ['barcode_generator'] } },
				default: '',
				required: true,
				description: 'Text or numbers to encode in the barcode',
			},
			{
				displayName: 'Barcode Format',
				name: 'barcodeFormat',
				type: 'options',
				displayOptions: { show: { resource: ['barcode_generator'] } },
				options: [
					{ name: 'Codabar', value: 'codabar' },
					{ name: 'Code 128', value: 'CODE128' },
					{ name: 'Code 39', value: 'CODE39' },
					{ name: 'EAN-13', value: 'EAN13' },
					{ name: 'EAN-8', value: 'EAN8' },
					{ name: 'ITF-14', value: 'ITF14' },
					{ name: 'UPC-A', value: 'UPC' },
				],
				default: 'CODE128',
				description: 'The barcode format/type to generate',
			},
			{
				displayName: 'Bar Width',
				name: 'barcodeWidth',
				type: 'number',
				displayOptions: { show: { resource: ['barcode_generator'] } },
				default: 2,
				typeOptions: { minValue: 1, maxValue: 4 },
				description: 'Bar width multiplier (1-4)',
			},
			{
				displayName: 'Height',
				name: 'barcodeHeight',
				type: 'number',
				displayOptions: { show: { resource: ['barcode_generator'] } },
				default: 100,
				typeOptions: { minValue: 50, maxValue: 300 },
				description: 'Barcode height in pixels (50-300)',
			},
			{
				displayName: 'Display Value',
				name: 'displayValue',
				type: 'boolean',
				displayOptions: { show: { resource: ['barcode_generator'] } },
				default: true,
				description: 'Whether to show the text below the barcode',
			},
			{
				displayName: 'Output Format',
				name: 'outputFormat',
				type: 'options',
				displayOptions: { show: { resource: ['barcode_generator'] } },
				options: [
					{ name: 'PNG', value: 'png' },
					{ name: 'SVG', value: 'svg' },
				],
				default: 'png',
				description: 'Output image format',
			},

			// ============ Regex Matcher ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['regex_matcher'] } },
				options: [
					{ name: 'Match Pattern', value: 'match_pattern', action: 'Match regex pattern in text' },
				],
				default: 'match_pattern',
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				displayOptions: { show: { resource: ['regex_matcher'] } },
				default: '',
				required: true,
				description: 'The text to search in',
			},
			{
				displayName: 'Pattern',
				name: 'pattern',
				type: 'string',
				displayOptions: { show: { resource: ['regex_matcher'] } },
				default: '',
				required: true,
				description: 'The regex pattern to match',
			},
			{
				displayName: 'Flags',
				name: 'flags',
				type: 'string',
				displayOptions: { show: { resource: ['regex_matcher'] } },
				default: 'g',
				description: 'Regex flags (g=global, i=case-insensitive, m=multiline)',
			},

			// ============ Text Diff ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['text_diff'] } },
				options: [
					{ name: 'Compare Text', value: 'compare_text', action: 'Compare two texts' },
				],
				default: 'compare_text',
			},
			{
				displayName: 'Text 1',
				name: 'text1',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: { show: { resource: ['text_diff'] } },
				default: '',
				required: true,
				description: 'The original text',
			},
			{
				displayName: 'Text 2',
				name: 'text2',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: { show: { resource: ['text_diff'] } },
				default: '',
				required: true,
				description: 'The text to compare against',
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				displayOptions: { show: { resource: ['text_diff'] } },
				options: [
					{ name: 'Unified', value: 'unified' },
					{ name: 'JSON', value: 'json' },
				],
				default: 'unified',
				description: 'Output format for the diff',
			},

			// ============ URL Encoder/Decoder ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['url_encoder_decoder'] } },
				options: [
					{ name: 'Encode', value: 'encode', action: 'Url encode text' },
					{ name: 'Decode', value: 'decode', action: 'Url decode text' },
				],
				default: 'encode',
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				displayOptions: { show: { resource: ['url_encoder_decoder'] } },
				default: '',
				required: true,
				description: 'The text to encode or decode',
			},

			// ============ Timezone Converter ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['timezone_converter'] } },
				options: [
					{ name: 'Convert Timezone', value: 'convert_timezone', action: 'Convert time between timezones' },
				],
				default: 'convert_timezone',
			},
			{
				displayName: 'Date/Time',
				name: 'datetime',
				type: 'string',
				displayOptions: { show: { resource: ['timezone_converter'] } },
				default: '',
				required: true,
				description: 'The datetime to convert (e.g., 2025-10-23T12:00:00)',
			},
			{
				displayName: 'From Timezone',
				name: 'fromTimezone',
				type: 'options',
				displayOptions: { show: { resource: ['timezone_converter'] } },
				options: [
					{ name: 'AEST (Australian Eastern)', value: 'AEST' },
					{ name: 'CET (Central European)', value: 'CET' },
					{ name: 'CST (Central)', value: 'CST' },
					{ name: 'EST (Eastern)', value: 'EST' },
					{ name: 'GMT', value: 'GMT' },
					{ name: 'JST (Japan)', value: 'JST' },
					{ name: 'MST (Mountain)', value: 'MST' },
					{ name: 'PST (Pacific)', value: 'PST' },
					{ name: 'UTC', value: 'UTC' },
				],
				default: 'UTC',
			},
			{
				displayName: 'To Timezone',
				name: 'toTimezone',
				type: 'options',
				displayOptions: { show: { resource: ['timezone_converter'] } },
				options: [
					{ name: 'AEST (Australian Eastern)', value: 'AEST' },
					{ name: 'CET (Central European)', value: 'CET' },
					{ name: 'CST (Central)', value: 'CST' },
					{ name: 'EST (Eastern)', value: 'EST' },
					{ name: 'GMT', value: 'GMT' },
					{ name: 'JST (Japan)', value: 'JST' },
					{ name: 'MST (Mountain)', value: 'MST' },
					{ name: 'PST (Pacific)', value: 'PST' },
					{ name: 'UTC', value: 'UTC' },
				],
				default: 'EST',
			},

			// ============ QR Code Generator ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['qr_code_generator'] } },
				options: [
					{ name: 'Generate QR Code', value: 'generate', action: 'Generate a QR code' },
				],
				default: 'generate',
			},
			{
				displayName: 'Text/URL',
				name: 'text',
				type: 'string',
				displayOptions: { show: { resource: ['qr_code_generator'] } },
				default: '',
				required: true,
				description: 'The text or URL to encode in the QR code',
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				displayOptions: { show: { resource: ['qr_code_generator'] } },
				options: [
					{ name: 'PNG', value: 'png' },
					{ name: 'SVG', value: 'svg' },
				],
				default: 'png',
			},
			{
				displayName: 'Size',
				name: 'size',
				type: 'number',
				displayOptions: { show: { resource: ['qr_code_generator'] } },
				default: 300,
				typeOptions: { minValue: 100, maxValue: 1000 },
				description: 'Size of the QR code in pixels',
			},

			// ============ Sitemap Generator ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['sitemap_generator'] } },
				options: [
					{ name: 'Extract Links', value: 'extract_links', action: 'Extract links from a web page' },
					{ name: 'Generate Sitemap', value: 'generate_sitemap', action: 'Generate XML sitemap from urls' },
				],
				default: 'extract_links',
			},
			// Extract Links parameters
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				displayOptions: { show: { resource: ['sitemap_generator'], operation: ['extract_links'] } },
				default: '',
				required: true,
				placeholder: 'https://example.com',
				description: 'URL of the page to extract links from',
			},
			{
				displayName: 'Same Domain Only',
				name: 'sameDomainOnly',
				type: 'boolean',
				displayOptions: { show: { resource: ['sitemap_generator'], operation: ['extract_links'] } },
				default: true,
				description: 'Whether to only return links from the same domain',
			},
			{
				displayName: 'Limit',
				name: 'linkLimit',
				type: 'number',
				displayOptions: { show: { resource: ['sitemap_generator'], operation: ['extract_links'] } },
				default: 100,
				typeOptions: { minValue: 1, maxValue: 100 },
				description: 'Maximum number of links to return (1-100)',
			},
			// Generate Sitemap parameters
			{
				displayName: 'URLs (JSON Array)',
				name: 'urls',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: { show: { resource: ['sitemap_generator'], operation: ['generate_sitemap'] } },
				default: '["https://example.com", "https://example.com/about"]',
				required: true,
				description: 'JSON array of URLs to include in the sitemap',
			},
			{
				displayName: 'Change Frequency',
				name: 'changefreq',
				type: 'options',
				displayOptions: { show: { resource: ['sitemap_generator'], operation: ['generate_sitemap'] } },
				options: [
					{ name: 'Always', value: 'always' },
					{ name: 'Daily', value: 'daily' },
					{ name: 'Hourly', value: 'hourly' },
					{ name: 'Monthly', value: 'monthly' },
					{ name: 'Never', value: 'never' },
					{ name: 'Weekly', value: 'weekly' },
					{ name: 'Yearly', value: 'yearly' },
				],
				default: 'weekly',
				description: 'How frequently the pages change',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'number',
				displayOptions: { show: { resource: ['sitemap_generator'], operation: ['generate_sitemap'] } },
				default: 0.5,
				typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 1 },
				description: 'Default priority for all URLs (0.0-1.0)',
			},
			{
				displayName: 'Include Last Modified',
				name: 'includeLastmod',
				type: 'boolean',
				displayOptions: { show: { resource: ['sitemap_generator'], operation: ['generate_sitemap'] } },
				default: true,
				description: 'Whether to include last modification date',
			},

			// ============ Markdown Table Generator ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['markdown_table_generator'] } },
				options: [
					{ name: 'Generate Table', value: 'generate_table', action: 'Generate a markdown table' },
				],
				default: 'generate_table',
			},
			{
				displayName: 'Headers (JSON Array)',
				name: 'headers',
				type: 'string',
				displayOptions: { show: { resource: ['markdown_table_generator'] } },
				default: '["Column1", "Column2", "Column3"]',
				required: true,
				description: 'Table headers as a JSON array',
			},
			{
				displayName: 'Rows (JSON Array of Arrays)',
				name: 'rows',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: { show: { resource: ['markdown_table_generator'] } },
				default: '[["Row1Col1", "Row1Col2", "Row1Col3"], ["Row2Col1", "Row2Col2", "Row2Col3"]]',
				required: true,
				description: 'Table rows as a JSON array of arrays',
			},

			// ============ JSON Schema Validator ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['json_schema_validator'] } },
				options: [
					{ name: 'Validate JSON', value: 'validate_json', action: 'Validate JSON against a schema' },
				],
				default: 'validate_json',
			},
			{
				displayName: 'Data (JSON)',
				name: 'data',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: { show: { resource: ['json_schema_validator'] } },
				default: '{}',
				required: true,
				description: 'The JSON data to validate',
			},
			{
				displayName: 'Schema (JSON)',
				name: 'schema',
				type: 'string',
				typeOptions: { rows: 6 },
				displayOptions: { show: { resource: ['json_schema_validator'] } },
				default: '{"type": "object", "properties": {}}',
				required: true,
				description: 'The JSON Schema to validate against',
			},

			// ============ URL to Markdown ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['url_to_markdown'] } },
				options: [
					{ name: 'Convert URL', value: 'url_to_markdown', action: 'Convert web page to markdown' },
				],
				default: 'url_to_markdown',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				displayOptions: { show: { resource: ['url_to_markdown'] } },
				default: '',
				required: true,
				placeholder: 'https://example.com',
				description: 'The URL of the web page to convert',
			},

			// ============ HTML to PDF ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['html_to_pdf'] } },
				options: [
					{ name: 'Convert to PDF', value: 'convert', action: 'Convert HTML to PDF' },
				],
				default: 'convert',
			},
			{
				displayName: 'HTML Content',
				name: 'html',
				type: 'string',
				typeOptions: { rows: 6 },
				displayOptions: { show: { resource: ['html_to_pdf'] } },
				default: '<html><body><h1>Hello World</h1></body></html>',
				required: true,
				description: 'The HTML content to convert to PDF',
			},

			// ============ HTML to Markdown ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['html_to_markdown'] } },
				options: [
					{ name: 'Convert to Markdown', value: 'convert', action: 'Convert html to markdown' },
				],
				default: 'convert',
			},
			{
				displayName: 'HTML Content',
				name: 'content',
				type: 'string',
				typeOptions: { rows: 6 },
				displayOptions: { show: { resource: ['html_to_markdown'] } },
				default: '',
				required: true,
				description: 'The HTML content to convert',
			},
			{
				displayName: 'Preserve Tables',
				name: 'preserve_tables',
				type: 'boolean',
				displayOptions: { show: { resource: ['html_to_markdown'] } },
				default: true,
				description: 'Whether to preserve table formatting',
			},

			// ============ Markdown to HTML ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['markdown_to_html'] } },
				options: [
					{ name: 'Convert to HTML', value: 'convert', action: 'Convert markdown to html' },
					{ name: 'Convert to Fragment', value: 'fragment', action: 'Convert markdown to html fragment' },
				],
				default: 'convert',
			},
			{
				displayName: 'Markdown Content',
				name: 'content',
				type: 'string',
				typeOptions: { rows: 6 },
				displayOptions: { show: { resource: ['markdown_to_html'] } },
				default: '',
				required: true,
				description: 'The Markdown content to convert',
			},
			{
				displayName: 'Include Styles',
				name: 'include_styles',
				type: 'boolean',
				displayOptions: { show: { resource: ['markdown_to_html'], operation: ['convert'] } },
				default: true,
				description: 'Whether to include CSS styles in the output',
			},
			{
				displayName: 'Highlight Code',
				name: 'highlight_code',
				type: 'boolean',
				displayOptions: { show: { resource: ['markdown_to_html'], operation: ['convert'] } },
				default: true,
				description: 'Whether to add syntax highlighting to code blocks',
			},

			// ============ Image Converter ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['image_converter'] } },
				options: [
					{ name: 'Convert Image', value: 'convert_image', action: 'Convert image format' },
				],
				default: 'convert_image',
			},
			{
				displayName: 'Image Source',
				name: 'imageSource',
				type: 'options',
				displayOptions: { show: { resource: ['image_converter'] } },
				options: [
					{ name: 'URL', value: 'url' },
					{ name: 'Base64 Data', value: 'base64' },
				],
				default: 'url',
				description: 'How to provide the image',
			},
			{
				displayName: 'Image URL',
				name: 'imageUrl',
				type: 'string',
				displayOptions: { show: { resource: ['image_converter'], imageSource: ['url'] } },
				default: '',
				required: true,
				description: 'URL of the image to convert',
			},
			{
				displayName: 'Image Data (Base64)',
				name: 'imageData',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: { show: { resource: ['image_converter'], imageSource: ['base64'] } },
				default: '',
				required: true,
				description: 'Base64 encoded image data (with or without data URI prefix)',
			},
			{
				displayName: 'Output Format',
				name: 'format',
				type: 'options',
				displayOptions: { show: { resource: ['image_converter'] } },
				options: [
					{ name: 'BMP', value: 'bmp' },
					{ name: 'GIF', value: 'gif' },
					{ name: 'ICO', value: 'ico' },
					{ name: 'JPEG', value: 'jpeg' },
					{ name: 'JPG', value: 'jpg' },
					{ name: 'PNG', value: 'png' },
					{ name: 'TIFF', value: 'tiff' },
					{ name: 'WebP', value: 'webp' },
				],
				default: 'jpeg',
			},
			{
				displayName: 'Quality',
				name: 'quality',
				type: 'number',
				displayOptions: { show: { resource: ['image_converter'], format: ['jpeg', 'jpg', 'png', 'webp'] } },
				default: 85,
				typeOptions: { minValue: 1, maxValue: 100 },
				description: 'Output quality (1-100). Applies to JPEG, PNG, and WebP formats.',
			},
			{
				displayName: 'Width',
				name: 'width',
				type: 'number',
				displayOptions: { show: { resource: ['image_converter'] } },
				default: 0,
				typeOptions: { minValue: 0, maxValue: 10000 },
				description: 'Output width in pixels (0 = keep original, max 10000)',
			},
			{
				displayName: 'Height',
				name: 'height',
				type: 'number',
				displayOptions: { show: { resource: ['image_converter'] } },
				default: 0,
				typeOptions: { minValue: 0, maxValue: 10000 },
				description: 'Output height in pixels (0 = keep original, max 10000)',
			},

			// ============ Excel to JSON ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['excel_to_json'] } },
				options: [
					{ name: 'List Sheets', value: 'list_sheets', action: 'List all sheet names in excel file' },
					{ name: 'Read Excel', value: 'read_excel', action: 'Read entire excel file' },
					{ name: 'Read Sheet', value: 'read_sheet', action: 'Read specific sheet from excel file' },
					{ name: 'Get Range', value: 'get_range', action: 'Get specific cell range from excel sheet' },
				],
				default: 'read_excel',
			},
			{
				displayName: 'Excel File (Base64)',
				name: 'file',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: { show: { resource: ['excel_to_json'] } },
				default: '',
				required: true,
				description: 'Base64 encoded Excel file content',
			},
			{
				displayName: 'Sheet Name',
				name: 'sheetName',
				type: 'string',
				displayOptions: { show: { resource: ['excel_to_json'], operation: ['read_sheet', 'get_range'] } },
				default: 'Sheet1',
				description: 'Name of the sheet to read',
			},
			{
				displayName: 'Cell Range',
				name: 'range',
				type: 'string',
				displayOptions: { show: { resource: ['excel_to_json'], operation: ['get_range'] } },
				default: 'A1:C10',
				required: true,
				description: 'Cell range in A1 notation (e.g., "A1:C10", "B2", "A:A" for entire column)',
			},
			{
				displayName: 'Include Detected Tables',
				name: 'includeDetectedTables',
				type: 'boolean',
				displayOptions: { show: { resource: ['excel_to_json'], operation: ['read_excel', 'read_sheet'] } },
				default: true,
				description: 'Whether to include intelligently detected tables in output',
			},

			// ============ JSON to Excel ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['json_to_excel'] } },
				options: [
					{ name: 'Create Excel', value: 'create_excel', action: 'Create excel from json' },
					{ name: 'Create Multi-Sheet Excel', value: 'create_multi_sheet', action: 'Create excel with multiple sheets' },
				],
				default: 'create_excel',
			},
			// Single sheet parameters
			{
				displayName: 'Data (JSON Array)',
				name: 'data',
				type: 'string',
				typeOptions: { rows: 6 },
				displayOptions: { show: { resource: ['json_to_excel'], operation: ['create_excel'] } },
				default: '[{"Name": "John", "Email": "john@example.com"}]',
				required: true,
				description: 'JSON array of objects to convert to Excel',
			},
			{
				displayName: 'Sheet Name',
				name: 'sheetName',
				type: 'string',
				displayOptions: { show: { resource: ['json_to_excel'], operation: ['create_excel'] } },
				default: 'Sheet1',
				description: 'Name of the Excel sheet',
			},
			// Multi-sheet parameters
			{
				displayName: 'Sheets (JSON Object)',
				name: 'sheets',
				type: 'string',
				typeOptions: { rows: 10 },
				displayOptions: { show: { resource: ['json_to_excel'], operation: ['create_multi_sheet'] } },
				default: '{\n  "Sheet1": [{"Name": "John", "Age": 30}],\n  "Sheet2": [{"Product": "A", "Price": 100}]\n}',
				required: true,
				description: 'JSON object with sheet names as keys. Values can be arrays of objects, or output from excel-to-json (detectedTable or cells format)',
			},
			{
				displayName: 'Include Headers',
				name: 'headers',
				type: 'boolean',
				displayOptions: { show: { resource: ['json_to_excel'] } },
				default: true,
				description: 'Whether to include headers row from object keys',
			},
			{
				displayName: 'Use Cells',
				name: 'useCells',
				type: 'boolean',
				displayOptions: { show: { resource: ['json_to_excel'], operation: ['create_multi_sheet'] } },
				default: false,
				description: 'Whether to use raw cell data (preserves exact cell positions). Requires sheets to have "cells" property.',
			},
			{
				displayName: 'Preserve Formulas',
				name: 'preserveFormulas',
				type: 'boolean',
				displayOptions: { show: { resource: ['json_to_excel'], operation: ['create_multi_sheet'], useCells: [true] } },
				default: false,
				description: 'Whether to preserve Excel formulas when using cells mode',
			},

			// ============ PDF Merge ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['pdf_merge'] } },
				options: [
					{ name: 'Merge PDFs', value: 'merge', action: 'Merge multiple PDF files' },
				],
				default: 'merge',
			},
			{
				displayName: 'PDF Files (JSON Array)',
				name: 'files',
				type: 'string',
				typeOptions: { rows: 6 },
				displayOptions: { show: { resource: ['pdf_merge'] } },
				default: '[]',
				required: true,
				description: 'JSON array of Base64-encoded PDF files to merge (e.g., ["base64data1", "base64data2"])',
			},

			// ============ PDF Extract Page ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['pdf_extract_page'] } },
				options: [
					{ name: 'Extract Page', value: 'extract', action: 'Extract a page from PDF' },
				],
				default: 'extract',
			},
			{
				displayName: 'PDF File (Base64)',
				name: 'pdf',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: { show: { resource: ['pdf_extract_page'] } },
				default: '',
				required: true,
				description: 'PDF file (Base64 encoded)',
			},
			{
				displayName: 'Page Number',
				name: 'pageNumber',
				type: 'number',
				displayOptions: { show: { resource: ['pdf_extract_page'] } },
				default: 1,
				typeOptions: { minValue: 1 },
				description: 'Page number to extract (1-based)',
			},

			// ============ PDF to HTML ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['pdf_to_html'] } },
				options: [
					{ name: 'Convert to HTML', value: 'convert', action: 'Convert PDF to HTML' },
					{ name: 'Get Metadata', value: 'metadata', action: 'Get PDF metadata' },
				],
				default: 'convert',
			},
			{
				displayName: 'PDF File (Base64)',
				name: 'base64_data',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: { show: { resource: ['pdf_to_html'] } },
				default: '',
				required: true,
				description: 'PDF file (Base64 encoded)',
			},
			{
				displayName: 'Include Styles',
				name: 'include_styles',
				type: 'boolean',
				displayOptions: { show: { resource: ['pdf_to_html'], operation: ['convert'] } },
				default: true,
				description: 'Whether to include CSS styles',
			},

			// ============ PDF to Markdown ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['pdf_to_markdown'] } },
				options: [
					{ name: 'Convert to Markdown', value: 'convert', action: 'Convert pdf to markdown' },
				],
				default: 'convert',
			},
			{
				displayName: 'PDF File (Base64)',
				name: 'base64_data',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: { show: { resource: ['pdf_to_markdown'] } },
				default: '',
				required: true,
				description: 'PDF file (Base64 encoded)',
			},

			// ============ Email Access ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['email_access'] } },
				options: [
					{ name: 'Send Email', value: 'send_email', action: 'Send an email via SMTP' },
					{ name: 'Fetch Emails (IMAP)', value: 'fetch_emails', action: 'Fetch emails from IMAP server' },
					{ name: 'Fetch Emails (POP3)', value: 'fetch_emails_pop3', action: 'Fetch emails from POP3 server' },
					{ name: 'Mark as Read', value: 'mark_as_read', action: 'Mark email as read via IMAP' },
				],
				default: 'send_email',
			},
			// Send Email fields
			{
				displayName: 'To',
				name: 'to',
				type: 'string',
				displayOptions: { show: { resource: ['email_access'], operation: ['send_email'] } },
				default: '',
				required: true,
				description: 'Recipient email address',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				displayOptions: { show: { resource: ['email_access'], operation: ['send_email'] } },
				default: '',
				required: true,
				description: 'Email subject',
			},
			{
				displayName: 'Body (Text)',
				name: 'text',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: { show: { resource: ['email_access'], operation: ['send_email'] } },
				default: '',
				description: 'Plain text email body',
			},
			{
				displayName: 'SMTP Host',
				name: 'smtp_host',
				type: 'string',
				displayOptions: { show: { resource: ['email_access'], operation: ['send_email'] } },
				default: '',
				required: true,
				placeholder: 'smtp.example.com',
				description: 'SMTP server hostname',
			},
			{
				displayName: 'SMTP Port',
				name: 'smtp_port',
				type: 'number',
				displayOptions: { show: { resource: ['email_access'], operation: ['send_email'] } },
				default: 587,
				description: 'SMTP server port',
			},
			{
				displayName: 'SMTP User',
				name: 'smtp_user',
				type: 'string',
				displayOptions: { show: { resource: ['email_access'], operation: ['send_email'] } },
				default: '',
				required: true,
				description: 'SMTP username/email',
			},
			{
				displayName: 'SMTP Password',
				name: 'smtp_pass',
				type: 'string',
				typeOptions: { password: true },
				displayOptions: { show: { resource: ['email_access'], operation: ['send_email'] } },
				default: '',
				required: true,
			},
			{
				displayName: 'From Email',
				name: 'from',
				type: 'string',
				displayOptions: { show: { resource: ['email_access'], operation: ['send_email'] } },
				default: '',
				required: true,
				description: 'Sender email address',
			},
			// IMAP fields (fetch_emails, mark_as_read)
			{
				displayName: 'IMAP Host',
				name: 'imap_host',
				type: 'string',
				displayOptions: { show: { resource: ['email_access'], operation: ['fetch_emails', 'mark_as_read'] } },
				default: '',
				required: true,
				placeholder: 'imap.example.com',
				description: 'IMAP server hostname',
			},
			{
				displayName: 'IMAP Port',
				name: 'imap_port',
				type: 'number',
				displayOptions: { show: { resource: ['email_access'], operation: ['fetch_emails', 'mark_as_read'] } },
				default: 993,
				description: 'IMAP server port',
			},
			{
				displayName: 'IMAP User',
				name: 'imap_user',
				type: 'string',
				displayOptions: { show: { resource: ['email_access'], operation: ['fetch_emails', 'mark_as_read'] } },
				default: '',
				required: true,
				description: 'IMAP username/email',
			},
			{
				displayName: 'IMAP Password',
				name: 'imap_pass',
				type: 'string',
				typeOptions: { password: true },
				displayOptions: { show: { resource: ['email_access'], operation: ['fetch_emails', 'mark_as_read'] } },
				default: '',
				required: true,
			},
			{
				displayName: 'Folder',
				name: 'folder',
				type: 'string',
				displayOptions: { show: { resource: ['email_access'], operation: ['fetch_emails'] } },
				default: 'INBOX',
				description: 'IMAP folder to read from',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: { show: { resource: ['email_access'], operation: ['fetch_emails', 'fetch_emails_pop3'] } },
				default: 50,
				typeOptions: { minValue: 1, maxValue: 100 },
				description: 'Max number of results to return',
			},
			{
				displayName: 'Email UID',
				name: 'email_uid',
				type: 'string',
				displayOptions: { show: { resource: ['email_access'], operation: ['mark_as_read'] } },
				default: '',
				required: true,
				description: 'UID of the email to mark as read',
			},
			// POP3 fields
			{
				displayName: 'POP3 Host',
				name: 'pop3_host',
				type: 'string',
				displayOptions: { show: { resource: ['email_access'], operation: ['fetch_emails_pop3'] } },
				default: '',
				required: true,
				placeholder: 'pop.example.com',
				description: 'POP3 server hostname',
			},
			{
				displayName: 'POP3 Port',
				name: 'pop3_port',
				type: 'number',
				displayOptions: { show: { resource: ['email_access'], operation: ['fetch_emails_pop3'] } },
				default: 995,
				description: 'POP3 server port',
			},
			{
				displayName: 'POP3 User',
				name: 'pop3_user',
				type: 'string',
				displayOptions: { show: { resource: ['email_access'], operation: ['fetch_emails_pop3'] } },
				default: '',
				required: true,
				description: 'POP3 username/email',
			},
			{
				displayName: 'POP3 Password',
				name: 'pop3_pass',
				type: 'string',
				typeOptions: { password: true },
				displayOptions: { show: { resource: ['email_access'], operation: ['fetch_emails_pop3'] } },
				default: '',
				required: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('acrewityApi');

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				// Build parameters based on resource and operation
				const parameters: Record<string, unknown> = {};

				// UUID Generator
				if (resource === 'uuid_generator') {
					parameters.version = this.getNodeParameter('version', i) as string;
					parameters.count = this.getNodeParameter('count', i) as number;
				}

				// Barcode Generator
				if (resource === 'barcode_generator') {
					parameters.text = this.getNodeParameter('text', i) as string;
					parameters.format = this.getNodeParameter('barcodeFormat', i) as string;
					parameters.width = this.getNodeParameter('barcodeWidth', i) as number;
					parameters.height = this.getNodeParameter('barcodeHeight', i) as number;
					parameters.displayValue = this.getNodeParameter('displayValue', i) as boolean;
					parameters.output_format = this.getNodeParameter('outputFormat', i) as string;
				}

				// Sitemap Generator
				if (resource === 'sitemap_generator') {
					if (operation === 'extract_links') {
						parameters.url = this.getNodeParameter('url', i) as string;
						parameters.same_domain_only = this.getNodeParameter('sameDomainOnly', i) as boolean;
						parameters.limit = this.getNodeParameter('linkLimit', i) as number;
					}
					if (operation === 'generate_sitemap') {
						parameters.urls = JSON.parse(this.getNodeParameter('urls', i) as string);
						parameters.changefreq = this.getNodeParameter('changefreq', i) as string;
						parameters.priority = this.getNodeParameter('priority', i) as number;
						parameters.include_lastmod = this.getNodeParameter('includeLastmod', i) as boolean;
					}
				}

				// Regex Matcher
				if (resource === 'regex_matcher') {
					parameters.text = this.getNodeParameter('text', i) as string;
					parameters.pattern = this.getNodeParameter('pattern', i) as string;
					parameters.flags = this.getNodeParameter('flags', i) as string;
				}

				// Text Diff
				if (resource === 'text_diff') {
					parameters.text1 = this.getNodeParameter('text1', i) as string;
					parameters.text2 = this.getNodeParameter('text2', i) as string;
					parameters.format = this.getNodeParameter('format', i) as string;
				}

				// URL Encoder/Decoder
				if (resource === 'url_encoder_decoder') {
					parameters.text = this.getNodeParameter('text', i) as string;
				}

				// Timezone Converter
				if (resource === 'timezone_converter') {
					parameters.datetime = this.getNodeParameter('datetime', i) as string;
					parameters.fromTimezone = this.getNodeParameter('fromTimezone', i) as string;
					parameters.toTimezone = this.getNodeParameter('toTimezone', i) as string;
				}

				// QR Code Generator
				if (resource === 'qr_code_generator') {
					parameters.text = this.getNodeParameter('text', i) as string;
					parameters.format = this.getNodeParameter('format', i) as string;
					parameters.size = this.getNodeParameter('size', i) as number;
				}

				// Markdown Table Generator
				if (resource === 'markdown_table_generator') {
					parameters.headers = JSON.parse(this.getNodeParameter('headers', i) as string);
					parameters.rows = JSON.parse(this.getNodeParameter('rows', i) as string);
				}

				// JSON Schema Validator
				if (resource === 'json_schema_validator') {
					parameters.data = JSON.parse(this.getNodeParameter('data', i) as string);
					parameters.schema = JSON.parse(this.getNodeParameter('schema', i) as string);
				}

				// URL to Markdown
				if (resource === 'url_to_markdown') {
					parameters.url = this.getNodeParameter('url', i) as string;
				}

				// HTML to PDF
				if (resource === 'html_to_pdf') {
					parameters.html = this.getNodeParameter('html', i) as string;
				}

				// HTML to Markdown
				if (resource === 'html_to_markdown') {
					parameters.content = this.getNodeParameter('content', i) as string;
					parameters.preserve_tables = this.getNodeParameter('preserve_tables', i) as boolean;
				}

				// Markdown to HTML
				if (resource === 'markdown_to_html') {
					parameters.content = this.getNodeParameter('content', i) as string;
					if (operation === 'convert') {
						parameters.include_styles = this.getNodeParameter('include_styles', i) as boolean;
						parameters.highlight_code = this.getNodeParameter('highlight_code', i) as boolean;
					}
				}

				// Image Converter
				if (resource === 'image_converter') {
					const imageSource = this.getNodeParameter('imageSource', i) as string;
					if (imageSource === 'url') {
						parameters.imageUrl = this.getNodeParameter('imageUrl', i) as string;
					} else {
						parameters.imageData = this.getNodeParameter('imageData', i) as string;
					}
					parameters.format = this.getNodeParameter('format', i) as string;
					// Quality only applies to certain formats
					const qualityFormats = ['jpeg', 'jpg', 'png', 'webp'];
					if (qualityFormats.includes(parameters.format as string)) {
						parameters.quality = this.getNodeParameter('quality', i) as number;
					}
					const width = this.getNodeParameter('width', i) as number;
					const height = this.getNodeParameter('height', i) as number;
					if (width > 0) {
						parameters.width = width;
					}
					if (height > 0) {
						parameters.height = height;
					}
				}

				// Excel to JSON
				if (resource === 'excel_to_json') {
					parameters.file = this.getNodeParameter('file', i) as string;
					if (operation === 'read_sheet' || operation === 'get_range') {
						parameters.sheetName = this.getNodeParameter('sheetName', i) as string;
					}
					if (operation === 'get_range') {
						parameters.range = this.getNodeParameter('range', i) as string;
					}
					if (operation === 'read_excel' || operation === 'read_sheet') {
						parameters.includeDetectedTables = this.getNodeParameter('includeDetectedTables', i) as boolean;
					}
				}

				// JSON to Excel
				if (resource === 'json_to_excel') {
					if (operation === 'create_excel') {
						parameters.data = JSON.parse(this.getNodeParameter('data', i) as string);
						parameters.sheetName = this.getNodeParameter('sheetName', i) as string;
						parameters.headers = this.getNodeParameter('headers', i) as boolean;
					}
					if (operation === 'create_multi_sheet') {
						parameters.sheets = JSON.parse(this.getNodeParameter('sheets', i) as string);
						parameters.headers = this.getNodeParameter('headers', i) as boolean;
						parameters.useCells = this.getNodeParameter('useCells', i) as boolean;
						if (parameters.useCells) {
							parameters.preserveFormulas = this.getNodeParameter('preserveFormulas', i) as boolean;
						}
					}
				}

				// PDF Merge
				if (resource === 'pdf_merge') {
					parameters.files = JSON.parse(this.getNodeParameter('files', i) as string);
				}

				// PDF Extract Page
				if (resource === 'pdf_extract_page') {
					parameters.pdf = this.getNodeParameter('pdf', i) as string;
					parameters.pageNumber = this.getNodeParameter('pageNumber', i) as number;
				}

				// PDF to HTML
				if (resource === 'pdf_to_html') {
					parameters.base64_data = this.getNodeParameter('base64_data', i) as string;
					if (operation === 'convert') {
						parameters.include_styles = this.getNodeParameter('include_styles', i) as boolean;
					}
				}

				// PDF to Markdown
				if (resource === 'pdf_to_markdown') {
					parameters.base64_data = this.getNodeParameter('base64_data', i) as string;
				}

				// Email Access
				if (resource === 'email_access') {
					if (operation === 'send_email') {
						parameters.to = this.getNodeParameter('to', i) as string;
						parameters.subject = this.getNodeParameter('subject', i) as string;
						parameters.text = this.getNodeParameter('text', i) as string;
						parameters.smtp_host = this.getNodeParameter('smtp_host', i) as string;
						parameters.smtp_port = this.getNodeParameter('smtp_port', i) as number;
						parameters.smtp_user = this.getNodeParameter('smtp_user', i) as string;
						parameters.smtp_pass = this.getNodeParameter('smtp_pass', i) as string;
						parameters.from = this.getNodeParameter('from', i) as string;
					}
					if (operation === 'fetch_emails') {
						parameters.imap_host = this.getNodeParameter('imap_host', i) as string;
						parameters.imap_port = this.getNodeParameter('imap_port', i) as number;
						parameters.imap_user = this.getNodeParameter('imap_user', i) as string;
						parameters.imap_pass = this.getNodeParameter('imap_pass', i) as string;
						parameters.folder = this.getNodeParameter('folder', i) as string;
						parameters.limit = this.getNodeParameter('limit', i) as number;
					}
					if (operation === 'mark_as_read') {
						parameters.imap_host = this.getNodeParameter('imap_host', i) as string;
						parameters.imap_port = this.getNodeParameter('imap_port', i) as number;
						parameters.imap_user = this.getNodeParameter('imap_user', i) as string;
						parameters.imap_pass = this.getNodeParameter('imap_pass', i) as string;
						parameters.email_uid = this.getNodeParameter('email_uid', i) as string;
					}
					if (operation === 'fetch_emails_pop3') {
						parameters.pop3_host = this.getNodeParameter('pop3_host', i) as string;
						parameters.pop3_port = this.getNodeParameter('pop3_port', i) as number;
						parameters.pop3_user = this.getNodeParameter('pop3_user', i) as string;
						parameters.pop3_pass = this.getNodeParameter('pop3_pass', i) as string;
						parameters.limit = this.getNodeParameter('limit', i) as number;
					}
				}

				// Make API request
				// Convert resource name to API service name (underscore to hyphen)
				const serviceName = resource.replace(/_/g, '-');

				const response = await this.helpers.httpRequest({
					method: 'POST' as IHttpRequestMethods,
					url: 'https://www.acrewity.com/api/services/execute',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${credentials.apiKey}`,
					},
					body: {
						service: serviceName,
						operation,
						parameters,
					},
					json: true,
				});

				returnData.push({
					json: response,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
