import handler, { config } from 'react-component-errors';

config.errorHandler = ({ component, error, method, props }) => {
	if (process.env.NODE_ENV !== 'production') {
		console.log(error);
	} else {
		const sentry = window.Raven;
		if (sentry) {
			sentry.captureException(error);
		}
	}
};

export default handler;
