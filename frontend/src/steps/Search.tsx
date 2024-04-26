import { useEffect, useState } from 'react';
import { Data } from '../types';
import { toast } from 'sonner';
import { searchData } from '../services/search';
import { useDebounce } from '@uidotdev/usehooks';

const DEBOUNCE_TIME = 500;

export const Search = ({ initialData }: { initialData: Data }) => {
	const [data, setData] = useState<Data>(initialData);
	const [search, setSearch] = useState(() => {
		const searchParams = new URLSearchParams(window.location.search);
		return searchParams.get('q') || '';
	});

	const debounceSearch = useDebounce(search, DEBOUNCE_TIME);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
	};

	useEffect(() => {
		const newPathname =
			debounceSearch === '' ? window.location.pathname : `?q=${debounceSearch}`;

		window.history.replaceState({}, '', newPathname);
	}, [debounceSearch]);

	useEffect(() => {
		if (!debounceSearch) {
			setData(initialData);
			return;
		}

		searchData(debounceSearch).then((res) => {
			const [err, newData] = res;
			if (err) {
				toast.error(err.message);
				return;
			}

			if (newData) setData(newData);
		});
	}, [debounceSearch, initialData]);

	return (
		<div>
			<h2>Search</h2>
			<form action="">
				<input
					type="search"
					onChange={handleSearch}
					placeholder="Search info..."
				/>
			</form>
			<ul>
				{data.map((row) => (
					<li key={row.id}>
						<article>
							{Object.entries(row).map(([key, value]) => (
								<p key={key}>
									<strong>{key}</strong>: {value}
								</p>
							))}
						</article>
					</li>
				))}
			</ul>
		</div>
	);
};
