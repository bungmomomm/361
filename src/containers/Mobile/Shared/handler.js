import handler, { config } from 'react-component-errors';

config.errorHandler = ({ component, error, method, props }) => {
	console.log(error);
};

export default handler;
