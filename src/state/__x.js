export default (err) => {
	if (typeof err === 'object') err.redux = true;
	if (typeof err === 'string') err = { error_message: err, redux: true };
	return err;
};
