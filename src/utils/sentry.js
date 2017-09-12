const LogExceptionSentry = (ex, context) => {
	window.Raven.config('https://af6e3248ca6f4d8d8c3e669f6fd6e4e4@sentry.io/215821').install();
	window.Raven.captureException(ex, {
		extra: context
	});
};

export default {
	LogExceptionSentry
};