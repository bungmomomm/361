export default (err) => {
	if (typeof err === 'object') err.redux = true;
	return err;
};
