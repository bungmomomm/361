import Utils from './utils';
import { references } from './config';

const info = {
	reference: references.home,
	query: '',
	page: 0,
	limit: 0,
};

export default class PageTracker {

	static trackPage = (page = 0, limit = 1) => {
		try {
			if (Utils.notEmptyVal(page)) {
				info.page = page;
				info.limit = limit;
				Utils.storeInfo(JSON.stringify(info));
			}
		} catch (error) { console.log(error); }
	}

	static trackQuery = (query = '') => {
		try {
			if (Utils.notEmptyVal(query)) {
				info.query = query;
				Utils.storeInfo(JSON.stringify(info));
			}
		} catch (error) { console.log(error); }
	}

	static trackRoute = (route) => {
		try {
			const { group } = route;
			const { search } = route.location || window.location.search;

			// default group value is 'home'
			if (Utils.isEmpty(group)) PageTracker.resetInfo();
			else info.reference = group;

			// extract data from 'search' same value with window.location.search
			if (Utils.notEmptyVal(search)) {
				const params = PageTracker.extractRouteParams(search);
				const { fq, page, per_page, query } = params;

				if (Utils.notEmptyVal(query) && Utils.notEmptyVal(fq)) info.query = `${query}|${fq}`;
				else {
					if (Utils.notEmptyVal(query)) info.query = query;
					if (Utils.notEmptyVal(fq)) info.query = fq;
				}

				if (Utils.notEmptyVal(page)) info.page = page;
				if (Utils.notEmptyVal(per_page)) info.limit = params.per_page;
			}
			Utils.storeInfo(JSON.stringify(info));
		} catch (error) { console.log(error); }
	}

	static resetInfo = () => {
		info.reference = references.home;
		info.limit = 0;
		info.page = 0;
		info.query = 0;
		Utils.storeInfo(JSON.stringify(info));
	}

	static extractRouteParams = (route) => {
		const query = route.substring(1);
		const params = query.split('&');
		const founds = {};

		for (let i = 0; i < params.length; i++) {
			const param = params[i].split('=');
			founds[param[0]] = param[1];
		}
		return founds;
	};
}