import { API_HOST } from '../config';
import { type ApiUploadResponse, type Data } from '../types';

export const uploadFile = async (file: File): Promise<[Error?, Data?]> => {
	const formData = new FormData();
	formData.append('file', file);

	try {
		const res = await fetch(`${API_HOST}/api/files`, {
			method: 'POST',
			body: formData,
		});

		if (!res.ok)
			return [new Error(`Failed to upload file': ${res.statusText}`)];
		const json = (await res.json()) as ApiUploadResponse;
		return [undefined, json.data];
	} catch (error) {
		if (error instanceof Error) return [error];
		else return [new Error('An unknown error occurred')];
	}
};
