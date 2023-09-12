export function convertArrayOfObjectsToCSV(data) {
	const csvRows = [];
	const headers = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));

	csvRows.push(headers.join(',')); // push the headers to the array as a row

	// loop through the array of objects and convert each object to a CSV row
	for (const item of data) {
		const values = headers.map(header => {
			const value = item[header];
			// escape any double quotes and wrap the value in quotes if it contains commas
			if (typeof value === 'string' && value.includes(',')) {
				return `"${value.replace(/"/g, '""')}"`;
			} else {
				return value;
			}
		});
		csvRows.push(values.join(','));
	}
	// join the rows into a single string with newline characters between rows
	return csvRows.join('\n');
}