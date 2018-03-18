const trimString = (string, max = 40, endText = '...') => {
	let newString;
	if (string.length >= max) {
		newString = string.substring(0, max) + endText;
	} else {
		newString = string;
	}

	return newString;
};

export default trimString;