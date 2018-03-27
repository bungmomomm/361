import _ from 'lodash';

const trimString = (string, max = 40, endText = '...') => {
	let newString;
	if (string.length >= max) {
		newString = _.truncate(string, {
			length: max,
			omission: endText,
			separator: ' '
		});
	} else {
		newString = string;
	}

	return newString;
};

export default trimString;