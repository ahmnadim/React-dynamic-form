import React, { useEffect, useState, useRef } from 'react';

function List() {
	const [headers, setHeaders] = useState(null);
	const [rows, setRows] = useState([]);

	useEffect(async () => {
		const res = await fetch('http://localhost/api/list.php');
		const data = await res.json();
		console.log('List: ', data);
		setHeaders(data.data.headers[0]);
		setRows(data.data.rows);
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

	if (!headers) return <h2>No data yet!</h2>;

	return (
		<>
			<div className='container'>
				<table className='table'>
					<thead>
						<tr>
							{Object.keys(headers).map((headerKey, i) => {
								const item = headers[headerKey];
								if (!item.hidden) {
									return (
										<th scope='col' key={`${headerKey}`}>
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
			</div>
		</>
	);
}

export default List;
