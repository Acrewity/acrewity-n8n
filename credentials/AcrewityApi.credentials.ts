import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AcrewityApi implements ICredentialType {
	name = 'acrewityApi';

	displayName = 'Acrewity API';

	icon = 'file:acrewity.svg' as const;

	documentationUrl = 'https://acrewity.com/docs/api-reference';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Acrewity API key (starts with ak_). Get one from your Acrewity dashboard.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://www.acrewity.com',
			url: '/api/services/execute',
			method: 'POST',
			json: true,
			body: {
				service: 'uuid_generator',
				operation: 'generate_uuid',
				parameters: {
					version: 'v4',
					count: 1,
				},
			},
		},
	};
}
