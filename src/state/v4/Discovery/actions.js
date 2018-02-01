import { request } from '@/utils';
import { promos } from './reducer';
// import { promo } from '@/data/translations';

const configs = {
	defaultPage: 30
};

const promoAction = (token, promoType, query = {}) => (dispatch) => {
	
	const url = `${process.env.MICROSERVICES_URL}${promoType}`;
	console.log(url);
	if (!query.page) {
		query.page = 1;
	}
	query.per_page = configs.defaultPage;

	return request({
		token,
		path: url,
		method: 'GET',
		query,
		fullpath: true
	}).then(response => {
		console.log(response);
		const promo = {};

		promo[promoType] = response.data.data;
		
		dispatch(promos({ promo }));
	});
};

export default {
	promoAction
};