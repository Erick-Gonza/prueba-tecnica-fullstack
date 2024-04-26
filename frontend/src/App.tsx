import { useState } from 'react';
import './App.css';
import { uploadFile } from './services/uploadFile';
import { Toaster, toast } from 'sonner';
import { Data } from './types';
import { Search } from './steps/Search';

const APP_STATUS = {
	IDLE: 'idle',
	ERROR: 'error',
	READY_UPLOAD: 'ready_upload',
	UPLOADING: 'uploading',
	READY_USAGE: 'ready_usage',
} as const;

const BUTTON_TEXT = {
	[APP_STATUS.READY_UPLOAD]: 'Upload File',
	[APP_STATUS.UPLOADING]: 'Uploading...',
};

type AppStatusType = (typeof APP_STATUS)[keyof typeof APP_STATUS];

function App() {
	const [appStatus, setAppStatus] = useState<AppStatusType>(APP_STATUS.IDLE);
	const [data, setData] = useState<Data>([]);
	const [file, setFile] = useState<File | null>(null);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const [file] = event.target.files ?? [];
		if (file) {
			setFile(file);
			setAppStatus(APP_STATUS.READY_UPLOAD);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (appStatus !== APP_STATUS.READY_UPLOAD || !file) {
			return;
		}
		setAppStatus(APP_STATUS.UPLOADING);

		const [error, newData] = await uploadFile(file);

		console.log({ newData });
		if (error) {
			setAppStatus(APP_STATUS.ERROR);
			toast.error(error.message);
			return;
		}

		setAppStatus(APP_STATUS.READY_USAGE);
		if (newData) setData(newData);
		toast.success('File uploaded successfully');
	};

	const showButton =
		appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING;
	const showInput = appStatus !== APP_STATUS.READY_USAGE;

	return (
		<>
			<Toaster />
			<h2>Upload CSV & Search</h2>
			{showInput && (
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="file">File</label>
						<input
							disabled={appStatus === APP_STATUS.UPLOADING}
							name="file"
							type="file"
							accept=".csv"
							onChange={handleInputChange}
						/>
					</div>

					{showButton && (
						<button disabled={appStatus === APP_STATUS.UPLOADING}>
							{BUTTON_TEXT[appStatus]}
						</button>
					)}
				</form>
			)}

			{appStatus === APP_STATUS.READY_USAGE && <Search initialData={data} />}
		</>
	);
}

export default App;
