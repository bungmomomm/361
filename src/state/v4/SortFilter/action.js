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
		urlFilter = `categories/products?${querystring.stringify(getUrlFilterForCategory(filters))}`;
		break;
	case 'search':
		urlFilter = `products/search?${querystring.stringify(getUrlFilterForSearch(filters))}`;
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
	return urlFilter;
};

const parseDataToFilter = (data) => {
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
	const selectedSort = _.filter(data.sorts, (sort) => (sort.is_selected === 1)).shift();
	data.sort = typeof selectedSort.q !== 'undefined' ? selectedSort.q : 'energy DESC';
	data.q = data.info.title;

	return data;
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
	const filterUrl = `${baseUrl}/${filterQuery}`;
	const [error, response] = await to(request({
		token,
		path: filterUrl,
		method: 'GET',
		fullPath: true
	}));

	if (error) {
		dispatch(actions.updateFilterFail(error));
		return Promise.reject([error, null]);
	}

	if (response.data.code === 200) {
		const responseData = _.chain(response);
		const params = parseDataToFilter(responseData.get('data.data').value());
		dispatch(actions.updateFilterSuccess(params.facets, params.facets, params.sorts, params.page, params.perPage));
		return Promise.resolve({
			data: responseData.get('data.data').value()
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

const resetFilter = () => dispatch => {
	dispatch(actions.updateFilterReset());
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
	case 'custom_category_ids':
		dispatch(actions.updateFilterCustomCategory(true, value));
		break;
	case 'brand':
		dispatch(actions.updateFilterBrand(true, value));
		break;
	case 'location':
		dispatch(actions.updateFilterLocation(true, value));
		break;
	case 'shipping_methods':
		dispatch(actions.updateFilterShipping(true, value));
		break;
	case 'price':
		dispatch(actions.updateFilterPrice(true, value));
		break;
	default:
		break;
	}
};


// SORT

const updateSort = (value) => (dispatch, getState) => {
	const { filters } = getState();
	const sorts = _.map(filters.sorts, (sort) => {
		sort.is_selected = false;
		if (sort.q === value.q) {
			sort.is_selected = true;
		}

		return sort;
	});
	
	dispatch(actions.updateSort(sorts));
};

const applySort = (token, type) => async (dispatch, getState) => {
	dispatch(actions.updateSortApply());
	const { filters, shared } = getState();
	const filterQuery = parseFilter(type, filters);
	const baseUrl = _.chain(shared).get('serviceUrl.product.url').value() || process.env.MICROSERVICES_URL;
	const filterUrl = `${baseUrl}/${filterQuery}`;
	const [error, response] = await to(request({
		token,
		path: filterUrl,
		method: 'GET',
		fullPath: true
	}));

	if (error) {
		dispatch(actions.updateSortFail(error));
		return Promise.reject([error, null]);
	}

	if (response.data.code === 200) {
		const responseData = _.chain(response);
		const params = parseDataToFilter(responseData.get('data.data').value());
		dispatch(actions.updateSortSuccess(params.facets, params.facets, params.sorts, params.page, params.perPage));
		return Promise.resolve({
			data: responseData.get('data.data').value()
		});
	}
	const errorMessage = new Error(response.error_message);
	dispatch(actions.updateSortFail(errorMessage));
	return Promise.reject(errorMessage);
};

export default {
	parseDataToFilter,
	applyFilter,
	doTest,
	updateFilter,
	resetFilter,
	updateSort,
	applySort
};