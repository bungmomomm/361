const splitString = (string, separator = ' ') => {
	if (string === '') {
		return '';
	}

	const arr = string.split(separator).slice(0);
	const getInitial = arr.map((x, index) => {
		return index === 0 || index === 1 ? x.slice(0, 1).toUpperCase() : null;
	}).join('');

	return getInitial;
};

export default splitString;