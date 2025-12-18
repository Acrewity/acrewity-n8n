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
		description: 'Consume the Acrewity API - 20+ utility services for data conversion, PDF processing, QR codes, and more',
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
					{ name: 'Email', value: 'email_access', description: 'Send emails via SMTP' },
					{ name: 'Excel to JSON', value: 'excel_to_json', description: 'Convert Excel files to JSON' },
					{ name: 'HTML to Markdown', value: 'html_to_markdown', description: 'Convert HTML to Markdown' },
					{ name: 'HTML to PDF', value: 'html_to_pdf', description: 'Convert HTML to PDF documents' },
					{ name: 'Image Converter', value: 'image_converter', description: 'Convert images between formats' },
					{ name: 'JSON Schema Validator', value: 'json_schema_validator', description: 'Validate JSON against schemas' },
					{ name: 'JSON to Excel', value: 'excel_editor', description: 'Convert JSON to Excel files' },
					{ name: 'Markdown Table', value: 'markdown_table_generator', description: 'Generate Markdown tables' },
					{ name: 'Markdown to HTML', value: 'markdown_to_html', description: 'Convert Markdown to HTML' },
					{ name: 'PDF Extract Page', value: 'pdf_extract_page', description: 'Extract pages from PDFs' },
					{ name: 'PDF Merge', value: 'pdf_merge', description: 'Merge multiple PDF files' },
					{ name: 'PDF to HTML', value: 'pdf_to_html', description: 'Convert PDF to HTML' },
					{ name: 'PDF to Markdown', value: 'pdf_to_markdown', description: 'Convert PDF to Markdown' },
					{ name: 'QR Code', value: 'qr_code_generator', description: 'Generate QR codes' },
					{ name: 'Regex Matcher', value: 'regex_matcher', description: 'Match patterns in text' },
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
					{ name: 'Version 1 (Time-Based)', value: 1 },
					{ name: 'Version 4 (Random)', value: 4 },
				],
				default: 4,
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
					{ name: 'Generate QR Code', value: 'generate_qr', action: 'Generate a QR code' },
				],
				default: 'generate_qr',
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
					{ name: 'Convert to PDF', value: 'convert_pdf', action: 'Convert HTML to PDF' },
				],
				default: 'convert_pdf',
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
				displayName: 'Image URL',
				name: 'imageUrl',
				type: 'string',
				displayOptions: { show: { resource: ['image_converter'] } },
				default: '',
				required: true,
				description: 'URL of the image to convert',
			},
			{
				displayName: 'Output Format',
				name: 'format',
				type: 'options',
				displayOptions: { show: { resource: ['image_converter'] } },
				options: [
					{ name: 'JPEG', value: 'jpeg' },
					{ name: 'PNG', value: 'png' },
					{ name: 'WebP', value: 'webp' },
				],
				default: 'jpeg',
			},
			{
				displayName: 'Quality',
				name: 'quality',
				type: 'number',
				displayOptions: { show: { resource: ['image_converter'] } },
				default: 85,
				typeOptions: { minValue: 1, maxValue: 100 },
				description: 'Output quality (1-100)',
			},

			// ============ Excel to JSON ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['excel_to_json'] } },
				options: [
					{ name: 'Convert to JSON', value: 'convert', action: 'Convert excel to json' },
				],
				default: 'convert',
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
				displayOptions: { show: { resource: ['excel_to_json'] } },
				default: 'Sheet1',
				description: 'Name of the sheet to convert',
			},

			// ============ JSON to Excel ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['excel_editor'] } },
				options: [
					{ name: 'Create Excel', value: 'create_excel', action: 'Create excel from json' },
				],
				default: 'create_excel',
			},
			{
				displayName: 'Data (JSON Array)',
				name: 'data',
				type: 'string',
				typeOptions: { rows: 6 },
				displayOptions: { show: { resource: ['excel_editor'] } },
				default: '[{"Name": "John", "Email": "john@example.com"}]',
				required: true,
				description: 'JSON array of objects to convert to Excel',
			},
			{
				displayName: 'Sheet Name',
				name: 'sheetName',
				type: 'string',
				displayOptions: { show: { resource: ['excel_editor'] } },
				default: 'Sheet1',
				description: 'Name of the Excel sheet',
			},

			// ============ PDF Merge ============
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['pdf_merge'] } },
				options: [
					{ name: 'Merge PDFs', value: 'merge', action: 'Merge two PDF files' },
				],
				default: 'merge',
			},
			{
				displayName: 'Source PDF (Base64)',
				name: 'source_pdf',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: { show: { resource: ['pdf_merge'] } },
				default: '',
				required: true,
				description: 'First PDF file (Base64 encoded)',
			},
			{
				displayName: 'Target PDF (Base64)',
				name: 'target_pdf',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: { show: { resource: ['pdf_merge'] } },
				default: '',
				required: true,
				description: 'Second PDF file to append (Base64 encoded)',
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
					{ name: 'Send Email', value: 'send_email', action: 'Send an email' },
				],
				default: 'send_email',
			},
			{
				displayName: 'To',
				name: 'to',
				type: 'string',
				displayOptions: { show: { resource: ['email_access'] } },
				default: '',
				required: true,
				description: 'Recipient email address',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				displayOptions: { show: { resource: ['email_access'] } },
				default: '',
				required: true,
				description: 'Email subject',
			},
			{
				displayName: 'Body (Text)',
				name: 'text',
				type: 'string',
				typeOptions: { rows: 4 },
				displayOptions: { show: { resource: ['email_access'] } },
				default: '',
				description: 'Plain text email body',
			},
			{
				displayName: 'SMTP Host',
				name: 'smtp_host',
				type: 'string',
				displayOptions: { show: { resource: ['email_access'] } },
				default: '',
				required: true,
				placeholder: 'smtp.example.com',
				description: 'SMTP server hostname',
			},
			{
				displayName: 'SMTP Port',
				name: 'smtp_port',
				type: 'number',
				displayOptions: { show: { resource: ['email_access'] } },
				default: 587,
				description: 'SMTP server port',
			},
			{
				displayName: 'SMTP User',
				name: 'smtp_user',
				type: 'string',
				displayOptions: { show: { resource: ['email_access'] } },
				default: '',
				required: true,
				description: 'SMTP username/email',
			},
			{
				displayName: 'SMTP Password',
				name: 'smtp_pass',
				type: 'string',
				typeOptions: { password: true },
				displayOptions: { show: { resource: ['email_access'] } },
				default: '',
				required: true,
			},
			{
				displayName: 'From Email',
				name: 'from',
				type: 'string',
				displayOptions: { show: { resource: ['email_access'] } },
				default: '',
				required: true,
				description: 'Sender email address',
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
					parameters.version = this.getNodeParameter('version', i) as number;
					parameters.count = this.getNodeParameter('count', i) as number;
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
					parameters.imageUrl = this.getNodeParameter('imageUrl', i) as string;
					parameters.format = this.getNodeParameter('format', i) as string;
					parameters.quality = this.getNodeParameter('quality', i) as number;
				}

				// Excel to JSON
				if (resource === 'excel_to_json') {
					parameters.file = this.getNodeParameter('file', i) as string;
					parameters.sheetName = this.getNodeParameter('sheetName', i) as string;
				}

				// JSON to Excel
				if (resource === 'excel_editor') {
					parameters.data = JSON.parse(this.getNodeParameter('data', i) as string);
					parameters.sheetName = this.getNodeParameter('sheetName', i) as string;
				}

				// PDF Merge
				if (resource === 'pdf_merge') {
					parameters.source_pdf = this.getNodeParameter('source_pdf', i) as string;
					parameters.target_pdf = this.getNodeParameter('target_pdf', i) as string;
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
					parameters.to = this.getNodeParameter('to', i) as string;
					parameters.subject = this.getNodeParameter('subject', i) as string;
					parameters.text = this.getNodeParameter('text', i) as string;
					parameters.smtp_host = this.getNodeParameter('smtp_host', i) as string;
					parameters.smtp_port = this.getNodeParameter('smtp_port', i) as number;
					parameters.smtp_user = this.getNodeParameter('smtp_user', i) as string;
					parameters.smtp_pass = this.getNodeParameter('smtp_pass', i) as string;
					parameters.from = this.getNodeParameter('from', i) as string;
				}

				// Make API request
				const response = await this.helpers.httpRequest({
					method: 'POST' as IHttpRequestMethods,
					url: 'https://www.acrewity.com/api/services/execute',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${credentials.apiKey}`,
					},
					body: {
						service: resource,
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
