const splitString = (string, count = 2, separator = ' ') => {
	if (string === '') {
		return '';
	}
	
	return string.split(separator).slice(0, count).map(x => x[0]).join('');
};

export default splitString;