import _ from 'lodash';

export default (...args) => {
	const debounced = _.debounce(...args);
	return (e) => {
		e.persist();
		return debounced(e);
	};
};
