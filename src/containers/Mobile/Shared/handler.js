import handler, { config } from 'react-component-errors';

config.errorHandler = ({ component, error, method, props }) => {
	// console.log('error component:', component);
	// console.log('error method:', method);
	// console.log(error);
};

export default handler;
