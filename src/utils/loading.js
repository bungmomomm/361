import Promise from 'es6-promise';

export default function async(component = null) {	
	const timeout = process.env.TIMEOUT || 10000;

	const promises = new Promise((resolve, reject) => {
		window.setTimeout(() => { 
			return resolve('loading_done');
		}, timeout);
	});
	
	return promises;
};
