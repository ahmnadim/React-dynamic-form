import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function List() {
	const [headers, setHeaders] = useState(null);
	const [rows, setRows] = useState([]);
	const [reorder, setReorder] = useState();
	const [reorderResponse, setReorderResponse] = useState(null);
	const [searchTexts, setSearchTexts] = useState({});
	const [searchResults, setSearchResults] = useState([]);
	const [sortType, setSortType] = useState('');
	const [sortableKey, setSortableKey] = useState('');
	const [searchResultsstatus, setSearchResultsstatus] = useState(false);

	let reorderTime;

	const navigate = useNavigate()

	useEffect(async () => {
		const res = await fetch('http://localhost/api/list.php');
		const data = await res.json();
		console.log('List: ', data);
		setHeaders(data.data.headers[0]);
		setRows(data.data.rows);
		return () => {
			if (reorderTime) {
				clearTimeout(reorderTime);
			}
		};
	}, []);

	const reorderApi = async () => {
		const res = await fetch('http://localhost/api/reorder.php', {
			method: 'POST',
			body: JSON.stringify(reorder),
		});
		const data = await res.json();
		console.log('reorder: ', data);
		setReorderResponse(data);
		reorderTime = setTimeout(() => {
			setReorderResponse(null);
		}, 4000);
	};

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
		const dragItem = newRows[dragItemIndex];
		newRows.splice(+dragItemIndex, 1);
		newRows.splice(targetItemIndex, 0, dragItem);
		setRows(newRows);
		setReorder(newRows);
		reorderApi(newRows);
	};

	const sortList = (e, headerKey, item) => {
		if (!item.sortable) return;
		setSortableKey(headerKey);
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

	const searchTextChange = (e, headerKey) => {
		const { name, value } = e.target;
		const _searchTexts = { ...searchTexts };
		_searchTexts[headerKey] = value;
		setSearchTexts(_searchTexts);
	};

	const onClear = (e) => {
		setSearchResultsstatus(false);
	};

	const onSearch = (e) => {
		let searchResult = [];

		let _searchTexts = { ...searchTexts };
		let _rows = [...rows];
		Object.keys(_searchTexts).map((text, i) => {
			if (_searchTexts[text] != '' || _searchTexts[text].length != 0) {
				searchResult = _rows.filter((row) => {
					if (
						row[text]
							.toString()
							.toLowerCase()
							.includes(_searchTexts[text].toString().toLowerCase())
					) {
						return row;
					}
				});
				// console.log('searchResults: ', searchResult, _searchTexts);
				_rows = searchResult;
			}
		});

		setSearchResults(searchResult);
		setSearchResultsstatus(true);
		console.log(searchResult, searchResultsstatus);
	};

	const redirectToUpdate = (e, id) => {
		const url = '/update/:id'.replace(":id", id)
		navigate(url)
	}

	if (!headers) return <h2>No data yet!</h2>;

	return (
		<>
			<div className='container'>
				{reorderResponse !== null && reorderResponse.messages && (
					<div className='alert-container'>
						{reorderResponse.messages.map((msg, i) => {
							return (
								<p
									key={`${msg}-${i}`}
									className={
										reorderResponse?.status == 'success'
											? 'success-alert'
											: 'danger-alert'
									}
								>
									{msg}
								</p>
							);
						})}
					</div>
				)}
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
												onChange={(e) => searchTextChange(e, headerKey)}
											/>
										</th>
									);
								}
							})}
							<th className='searchBox'>
								<input
									type='button'
									value={'Search'}
									onClick={(e) => onSearch(e)}
								/>
							</th>
							{searchResultsstatus ? (
								<th className='searchBox'>
									<input
										type='button'
										value={'Clear'}
										onClick={(e) => onClear(e)}
									/>
								</th>
							) : null}
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
											{item.sortable && headerKey == sortableKey ? (
												sortType == 'desc' ? (
													<img src='https://img.icons8.com/material-outlined/24/000000/sort-down.png' />
												) : (
													<img src='https://img.icons8.com/material-outlined/24/000000/sort-up.png' />
												)
											) : null}
										</th>
									);
								}
							})}
						</tr>
					</thead>
					<tbody>
						{searchResultsstatus && searchResults.length == 0 ? (
							<tr><td><h2>No data found.</h2></td></tr>
						) : searchResultsstatus ? (
							searchResults.map((row, rowIndex) => {
								return (
									<tr
										key={`row-${rowIndex}`}
										draggable={true}
										onDragStart={(e) => dragStartHandler(e, rowIndex)}
										onDragOver={(e) => dragEnterHandler(e, rowIndex)}
										onDrop={(e) => handleDragEnd(e, rowIndex)}
										onClick={(e) => redirectToUpdate(e, row['id'])}
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
							})
						) : (
							rows.map((row, rowIndex) => {
								return (
									<tr
										key={`row-${rowIndex}`}
										draggable={true}
										onDragStart={(e) => dragStartHandler(e, rowIndex)}
										onDragOver={(e) => dragEnterHandler(e, rowIndex)}
										onDrop={(e) => handleDragEnd(e, rowIndex)}
										onClick={(e) => redirectToUpdate(e, row['id'])}
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
														{row[headerKey] && row[headerKey]}
													</td>
												);
											}
										})}
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>
		</>
	);
}

export default List;
