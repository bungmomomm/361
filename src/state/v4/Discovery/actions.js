import { request } from '@/utils';
import { promos, loading } from './reducer';
// import { promo } from '@/data/translations';

const configs = {
	defaultPage: 30
};

const promoAction = (token, promoType, query = {}) => (dispatch) => {
	dispatch(loading({ loading: true }));

	const url = `${process.env.MICROSERVICES_URL}${promoType}`;
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
		const promo = {};

		promo[promoType] = response.data.data;

		dispatch(promos({ promo }));
		dispatch(loading({ loading: false }));
	});
};

export default {
	promoAction
};
