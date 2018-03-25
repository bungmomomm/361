import Utils from './utils';

const info = {
	reference: '',
	query: '',
	page: 0,
	limit: 1,
};

export default class PageTracker {
	static trackReference = (route) => {
		try {
			const { group } = route;
			if (typeof group !== 'undefined' && group !== null && group !== '') {
				info.reference = group;
				Utils.storeInfo(JSON.stringify(info));
			}
		} catch (error) { console.log(error); }
	}

	static trackPage = (page = 0) => {
		try {
			if (typeof page !== 'undefined' && page !== null && page !== '') {
				info.page = page;
				Utils.storeInfo(JSON.stringify(info));
			}
		} catch (error) { console.log(error); }
	}

	static trackQuery = (query = '') => {
		try {
			if (typeof query !== 'undefined' && query !== null && query !== '') {
				info.query = query;
				Utils.storeInfo(JSON.stringify(info));
			}
		} catch (error) { console.log(error); }
	}
}