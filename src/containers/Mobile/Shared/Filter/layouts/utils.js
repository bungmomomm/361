import querystring from 'querystring';
import { find, forEach, filter, remove } from 'lodash';

const getCategoryFq = (categories, source) => {
	source.forEach((category) => {
		const isExist = find(categories, (c) => {
			return c.facetrange === category.facetrange;
		});
		if (typeof isExist === 'undefined') {
			categories.push(category);
		}
		if (typeof (category.childs) !== 'undefined' && category.childs.length > 0) {
			categories = getCategoryFq(categories, category.childs);
		}
	});
	
	return categories;
};

const getFq = (filters) => {
	const fqAll = [];
	const fq = {};
	let categories = [];
	forEach(filters.facets, (facet) => {
		fq[facet.id] = [];
		switch (facet.id) {
		case 'category':
		case 'custom_category_ids':
			// child category
			categories = getCategoryFq(categories, facet.data);
			forEach(categories, (value) => {
				if (value.is_selected === 1) {
					fq[facet.id].push(value.facetrange);
				} else {
					remove(fq[facet.id], (v) => {
						return v === value.facetrange;
					});
				}
			});
			break;
		case 'size':

			break;
		default:
			forEach(facet.data, (value) => {
				if (value.is_selected === 1) {
					fq[facet.id].push(value.facetrange);
				} else {
					remove(fq[facet.id], (v) => {
						return v === value.facetrange;
					});
				}
			});
			break;
		}
		if (fq[facet.id].length > 0) {
			fqAll.push(fq[facet.id].map((value) => (`${facet.id}:${value}`)).join(','));
		}
	});

	return fqAll.join(',');
};

const getPage = (filters) => {
	return {
		page: filters.page,
		per_page: filters.perPage,
		sort: filters.sort
	};
};

const getUrlFilterForCategory = (filters) => {
	return {
		...getPage(filters),
		category_id: filters.category_id,
		fq: getFq(filters)
	};
};

const getUrlFilterForSearch = (filters) => {
	return {
		...getPage(filters),
		category_id: filters.category_id,
		brand_id: filters.brand_id,
		q: filters.q,
		fq: getFq(filters)
	};
};

const parseFilter = (data) => {
	// get sort
	const queryString = data.links.next.split('?');
	const sortParams = querystring.parse(queryString[1]);
	data.page = sortParams.page;
	data.perPage = sortParams.per_page;
	if (typeof sortParams.category_id !== 'undefined') {
		data.categoryID = sortParams.category_id;
	}
	data.facets = data.facets;
	data.sorts = data.sorts;
	const selectedSort = filter(data.sorts, (sort) => (sort.is_selected === 1)).shift();
	data.sort = typeof selectedSort.q !== 'undefined' ? selectedSort.q : 'energy DESC';
	data.q = data.info.title;

	return data;
};

export default {
	getCategoryFq,
	getFq,
	getPage,
	getUrlFilterForCategory,
	getUrlFilterForSearch,
	parseFilter
};