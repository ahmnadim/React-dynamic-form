import React, { useEffect, useState, useRef } from 'react';

function List() {
	const [headers, setHeaders] = useState(null);
	const [rows, setRows] = useState([]);
	const [searchTexts, setSearchTexts] = useState({});
	const [searchResults, setSearchResults] = useState([]);
	const [sortType, setSortType] = useState('');

	useEffect(async () => {
		const res = await fetch('http://localhost/api/list.php');
		const data = await res.json();
		console.log('List: ', data);
		setHeaders(data.data.headers[0]);
		setRows(
			data.data.rows.sort((a, b) =>
				a['id'] > b['id'] ? 1 : b['id'] > a['id'] ? -1 : 0
			)
		);
		setSortType('asc');
	}, []);

	const dragItem = useRef();
	const dragItemNode = useRef();

	const dragStartHandler = (e, dragItemIndex) => {
		e.dataTransfer.setData('dragItem', dragItemIndex);
	};
	const dragEnterHandler = (e, targetItemIndex) => {
		e.preventDefault();
		e.dataTransfer.setData('targetItemIndex', targetItemIndex);
	};

	const handleDragEnd = (e, targetItemIndex) => {
		const dragItemIndex = e.dataTransfer.getData('dragItem');
		if (targetItemIndex === dragItemIndex) return;

		let newRows = [...rows];
		const temp = newRows[dragItemIndex];
		newRows[dragItemIndex] = newRows[targetItemIndex];
		newRows[targetItemIndex] = temp;

		setRows(newRows);
	};

	const sortList = (e, headerKey, item) => {
		if (!item.sortable) return;
		const _rows = [...rows];
		if (sortType === 'asc') {
			_rows.sort((a, b) =>
				a[headerKey] < b[headerKey] ? 1 : b[headerKey] < a[headerKey] ? -1 : 0
			);
			setSortType('desc');
		} else {
			_rows.sort((a, b) =>
				a[headerKey] > b[headerKey] ? 1 : b[headerKey] > a[headerKey] ? -1 : 0
			);
			setSortType('asc');
		}
		setRows(_rows);
	};

	const onSearch = (e, headerKey) => {
		let searchResult = [];
		const { name, value } = e.target;
		const _searchTexts = { ...searchTexts };
		_searchTexts[headerKey] = value;
		setSearchTexts(_searchTexts);
		let _rows = [...rows];
		Object.keys(_searchTexts).map((text, i) => {
			searchResult = _rows.filter((row) => {
				if (row[text].toString().toLowerCase().includes(value.toLowerCase())) {
					return row;
				}
			});
			console.log('searchResults: ', searchResult, _searchTexts);
			_rows = searchResult;
		});

		setSearchResults(searchResult);
	};

	if (!headers) return <h2>No data yet!</h2>;

	return (
		<>
			<div className='container'>
				<div className='search'></div>
				<table className='table'>
					<thead>
						<tr>
							{Object.keys(headers).map((headerKey, i) => {
								if (
									!headers[headerKey].hidden &&
									headers[headerKey].searchable
								) {
									return (
										<th className='searchBox' key={`search-${i}`}>
											<input
												type='text'
												placeholder='search here...'
												onChange={(e) => onSearch(e, headerKey)}
											/>
										</th>
									);
								}
							})}
						</tr>
					</thead>
					<thead>
						<tr>
							{Object.keys(headers).map((headerKey, i) => {
								const item = headers[headerKey];
								if (!item.hidden) {
									return (
										<th
											scope='col'
											key={`${headerKey}`}
											className={item.sortable ? 'cursor-pointer' : ''}
											onClick={(e) => sortList(e, headerKey, item)}
										>
											{item.title}
										</th>
									);
								}
							})}
						</tr>
					</thead>
					<tbody>
						{rows.map((row, rowIndex) => {
							return (
								<tr
									key={`row-${rowIndex}`}
									draggable={true}
									onDragStart={(e) => dragStartHandler(e, rowIndex)}
									onDragOver={(e) => dragEnterHandler(e, rowIndex)}
									onDrop={(e) => handleDragEnd(e, rowIndex)}
								>
									{Object.keys(headers).map((headerKey, i) => {
										const item = headers[headerKey];
										if (!item.hidden) {
											return (
												<td
													scope='row'
													key={`t-data-${headerKey}-${rowIndex}-${i}`}
												>
													{' '}
													{row[headerKey]}
												</td>
											);
										}
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
				==========================================================================
				==========================================================================
				<table className='table'>
					<thead>
						<tr>
							{Object.keys(headers).map((headerKey, i) => {
								const item = headers[headerKey];
								if (!item.hidden) {
									return (
										<th
											scope='col'
											key={`${headerKey}`}
											className={item.sortable ? 'cursor-pointer' : ''}
											onClick={(e) => sortList(e, headerKey, item)}
										>
											{item.title}
										</th>
									);
								}
							})}
						</tr>
					</thead>
					<tbody>
						{searchResults.map((row, rowIndex) => {
							return (
								<tr
									key={`row-${rowIndex}`}
									draggable={true}
									onDragStart={(e) => dragStartHandler(e, rowIndex)}
									onDragOver={(e) => dragEnterHandler(e, rowIndex)}
									onDrop={(e) => handleDragEnd(e, rowIndex)}
								>
									{Object.keys(headers).map((headerKey, i) => {
										const item = headers[headerKey];
										if (!item.hidden) {
											return (
												<td
													scope='row'
													key={`t-data-${headerKey}-${rowIndex}-${i}`}
												>
													{' '}
													{row[headerKey]}
												</td>
											);
										}
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</>
	);
}

export default List;
