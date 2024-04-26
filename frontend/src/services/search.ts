import { API_HOST } from '../config';
import { type ApiSearchResponse, type Data } from '../types';

export const searchData = async (search: string): Promise<[Error?, Data?]> => {
	try {
		const res = await fetch(`${API_HOST}/api/users?q=${search}`);

		if (!res.ok)
			return [new Error(`Failed to search data': ${res.statusText}`)];
		const json = (await res.json()) as ApiSearchResponse;
		return [undefined, json.data];
	} catch (error) {
		if (error instanceof Error) return [error];
		else return [new Error('An unknown error occurred')];
	}
};
