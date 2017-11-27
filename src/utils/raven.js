const Raven = (type, level, extra) => {
	window.Raven.captureMessage(type, {
		level,
		extra
	});
    
	return window.Raven;
};


export default {
	Raven
};
