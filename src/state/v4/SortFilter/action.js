import { actions } from './reducer';
import { request } from '@/utils';
import _ from 'lodash';
import querystring from 'querystring';
import { to } from 'await-to-js';

const fqMap = {
	size: 'size',
	brand: 'brand',
	color: 'color',
	price: 'price',
	category: 'category',
	location: 'location',
	shipping_methods: 'shipping_methods',
	custom_category_ids: 'custom_category_ids'
};

const fqAttributeMap = {
	size: 'attribute_103_value',
	brand: 'brand_name',
	color: 'attribute_102_value',
	price: 'effective_price',
	category: 'category_ids',
	location: 'store_location',
	shipping_methods: 'shipping_methods',
	custom_category_ids: 'custom_category_ids'
};


const getCategoryFq = (categories, source) => {
	source.forEach((category) => {
		const isExist = _.find(categories, (c) => {
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
	const data = {};
	const fq = {};

	let categories = [];
	
	_.forEach(fqMap, (facetName, key) => {
		let facetCollection = _.filter(filters.facets, (facetGroup) => {
			return facetGroup.id === key;
		});
		if (typeof facetCollection[0] !== 'undefined') {
			facetCollection = facetCollection[0];
		} else {
			facetCollection = {
				data: []
			};
		}
		fq[facetName] = [];
		switch (facetName) {
		case 'category':
		case 'custom_category_ids':
			// child category
			categories = getCategoryFq(categories, facetCollection.data);
			_.forEach(categories, (facetData) => {
				if (facetData.is_selected) {
					fq[facetName].push(facetData.facetrange);
				} else {
					_.remove(fq[facetName], (v) => {
						return v === facetData.facetrange;
					});
				}
			});			
			break;
		case 'price':
			// range
			_.forEach(facetCollection.data, (facetData) => {
				if (facetData.is_selected) {
					fq[facetName].push(facetData.facetrange);
				} else {
					_.remove(fq[facetName], (v) => {
						return v === facetData.facetrange;
					});
				}
			});
			break;
		default:
			_.forEach(facetCollection.data, (facetData) => {
				if (facetData.is_selected) {
					fq[facetName].push(facetData.facetrange);
				} else {
					_.remove(fq[facetName], (v) => {
						return v === facetData.facetrange;
					});
				}
			});
			break;
		}
		data[facetName] = facetCollection;
		if (fq[facetName].length > 0) {
			fqAll.push(fq[facetName].map((value) => (`${fqAttributeMap[key]}:${value}`)).join(','));
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

const getUrlFilterForSearch = (query, filters) => {
	return {
		...getPage(filters),
		category_id: filters.category_id,
		brand_id: filters.brand_id,
		q: filters.query,
		fq: getFq(filters)
	};
};

const parseFilter = (type, filters) => {
	let urlFilter;
	switch (type) {
	case 'category':
		urlFilter = getUrlFilterForCategory(filters);
		break;
	case 'search':
		urlFilter = getUrlFilterForSearch(filters);
		break;
	default:
		break;
	}
	// q = q
	// brand_id = brand_id
	// store_id = store_id

	// category_id = category_id
	// page = page
	// per_page = per_page
	// fq = fq
	// sort = sort
	// return urlFilter;
	return querystring.stringify(urlFilter);
};

const parseDataToFilter = (data) => {
	const params = {
		filters: {},
	};
	const filters = {};
	data.facets.forEach((facet) => {
		if (facet.id !== 'price') {
			filters[fqMap[facet.id]] = {
				active: true,
				value: facet.data
			};
		} else {
			filters[fqMap[facet.id]] = {
				active: true,
				range: facet.range,
				value: facet.data
			};
		}

		filters[fqMap[facet.id]].value = filters[fqMap[facet.id]].value.map((value) => {
			return {
				...value,
				id: value.facetrange
			};
		});
	});

	// sort
	params.sorts = data.sorts;
	const selectedSort = params.sorts.filter((sort) => params.is_selected).shift();
	params.sort = typeof selectedSort.q !== 'undefined' ? selectedSort.q : 'energy DESC';
	params.q = data.info.title;
};

// const isSuccess = (response) => {
// 	return true;
// };

/**
 * type should be, category, branch, store
 */

const applyFilter = (token, type, filters) => async (dispatch, getState) => {
	dispatch(actions.updateFilter());
	const { shared } = getState();
	const filterQuery = parseFilter(type, filters);
	const baseUrl = _.chain(shared).get('serviceUrl.product.url').value() || process.env.MICROSERVICES_URL;
	const filterUrl = `${baseUrl}?${filterQuery}`;
	const [error, response] = await to(request({
		token,
		path: filterUrl,
		method: 'GET',
		fullPath: true
	}));

	if (error) {
		dispatch(actions.updateFilterFail(error));
		return Promise.reject(error);
	}

	if (response.code === 200) {
		filters = parseDataToFilter(response.data);
		dispatch(actions.updateFilterSuccess(filters));
		return Promise.resolve({
			data: response.data
		});
	}
	const errorMessage = new Error(response.error_message);
	dispatch(actions.updateFilterFail(errorMessage));
	return Promise.reject(errorMessage);
};

const doTest = (t) => dispatch => {
	console.log(t);
	dispatch(actions.doTest(t));
};

const updateFilter = (type, value, opt) => dispatch => {
	switch (type) {
	case 'color':
		dispatch(actions.updateFilterColor(true, value));
		break;
	case 'size':
		dispatch(actions.updateFilterSize(true, value));
		break;
	case 'category':
		dispatch(actions.updateFilterCategory(true, value));
		break;
	case 'brand':
		dispatch(actions.updateFilterBrand(true, value));
		break;
	case 'location':
		dispatch(actions.updateFilterLocation(true, value));
		break;
	case 'price':
		dispatch(actions.updateFilterPrice(true, value));
		break;
	default:
		break;
	}
};

export default {
	parseDataToFilter,
	applyFilter,
	doTest,
	updateFilter
};