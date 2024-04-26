import express from 'express';
import cors from 'cors';
import multer from 'multer';
import csvToJson from 'convert-csv-to-json';

const app = express();
const port = process.env.PORT ?? 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage });

let userData: Array<Record<string, string>> = [];

app.use(cors());

app.post('/api/files', upload.single('file'), async (req, res) => {
	// 1. Extract file from request
	const { file } = req;

	// 2. Validate that we have a file
	if (!file) return res.status(400).json({ message: 'File is required' });

	// 3. Validate the mime type of the file(csv)
	if (file.mimetype !== 'text/csv')
		return res.status(400).json({ message: 'File must be CSV' });

	let json: Array<Record<string, string>> = [];
	try {
		// 4. Transform file (buffer) to string
		const rawCsv = file.buffer.toString('utf-8');
		console.log(rawCsv);

		// 5. Transform string to JSON
		json = csvToJson.fieldDelimiter(',').csvStringToJson(rawCsv);
		userData = json;
	} catch (error) {
		return res.status(500).json({ message: 'Error pasring the file' });
	}
	// 6. Save the JSON to db
	userData = json;

	// 7. Return the JSON
	return res
		.status(200)
		.json({ data: userData, message: 'File uploaded successfully' });
});

app.get('/api/users', async (req, res) => {
	// 1. Extract the query params p from the request
	const { q } = req.query;

	// 2. Validate the query params
	if (!q) return res.status(500).json({ message: 'Query param q is required' });

	// 3. Filter the data from the db based on the query params
	const search = q.toString().toLowerCase();
	const filteredData = userData.filter((row) => {
		return Object.values(row).some((value) =>
			value.toLowerCase().includes(search)
		);
	});

	// 4. Return 200 with the filtered data
	return res.status(200).json({ data: filteredData });
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
