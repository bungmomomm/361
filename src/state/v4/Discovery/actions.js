import { request } from '@/utils';
import { promos } from './reducer';
import { actions as scrollerActions } from '@/state/v4/Scroller';
// import { promo } from '@/data/translations';

const configs = {
	defaultPage: 30
};

const promoAction = () => (dispatch, getState) => {
	const { scroller } = getState();
	const query = scroller.nextData && scroller.nextData.query ? scroller.nextData.query : {};
	const token = scroller.nextData && scroller.nextData.token ? scroller.nextData.token : false;
	const promoType = scroller.nextData && scroller.nextData.promoType ? scroller.nextData.promoType : false;

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

		const nextLink = promo[promoType].links && promo[promoType].links.next ? new URL(promo[promoType].links.next).searchParams : false;
		dispatch(scrollerActions.onScroll({
			nextData: { token, promoType, query: { page: nextLink ? nextLink.get('page') : false } },
			nextPage: nextLink !== false,
			loading: false
		}));
	});
};

export default {
	promoAction
};
