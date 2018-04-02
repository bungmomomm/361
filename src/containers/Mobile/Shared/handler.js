import handler, { config } from 'react-component-errors';

config.errorHandler = ({ component, error, method, props }) => {
	if (process.env.NODE_ENV !== 'production') {
		console.log(error);
	}
};

export default handler;
