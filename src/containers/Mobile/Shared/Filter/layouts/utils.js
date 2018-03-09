import querystring from 'querystring';
import _ from 'lodash';
import currency from 'currency.js';

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
	const fq = {};
	let categories = [];
	_.forEach(filters.facets, (facet) => {
		fq[facet.id] = [];
		categories = [];
		switch (facet.id) {
		case 'category':
		case 'custom_category_ids':
		case 'size':
			// child category
			categories = getCategoryFq(categories, facet.data);
			_.forEach(categories, (value) => {
				if (value.is_selected === 1) {
					fq[facet.id].push(value.facetrange);
				} else {
					_.remove(fq[facet.id], (v) => {
						return v === value.facetrange;
					});
				}
			});
			break;
		case 'price':
			if (facet.requested_range) {
				fq[facet.id] = [(`${facet.requested_range.min}-${facet.requested_range.max}`)];
			} else {
				_.forEach(facet.data, (value) => {
					if (value.is_selected === 1) {
						fq[facet.id].push(value.facetrange);
					} else {
						_.remove(fq[facet.id], (v) => {
							return v === value.facetrange;
						});
					}
				});
			}
			break;
		default:
			_.forEach(facet.data, (value) => {
				if (value.is_selected === 1) {
					fq[facet.id].push(value.facetrange);
				} else {
					_.remove(fq[facet.id], (v) => {
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
		fq: getFq(filters)
	};
};

const getUrlFilterForSearch = (filters) => {
	return {
		...getPage(filters),
		fq: getFq(filters)
	};
};

const getFilter = (filters) => {
	return {
		...getPage(filters),
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
	const selectedSort = _.filter(data.sorts, (sort) => (sort.is_selected === 1)).shift();
	data.sort = typeof selectedSort.q !== 'undefined' ? selectedSort.q : 'energy DESC';
	data.q = data.info.title;

	return data;
};

const resetChilds = (childs) => {
	childs = _.map(childs, (facetData) => {
		facetData.is_selected = 0;
		if (facetData.childs) {
			facetData.childs = resetChilds(facetData.childs);
		}
		return facetData;
	});
	return childs;
};

const isDescendantSelected = (childs, isSelected) => {
	if (typeof isSelected === 'undefined') {
		isSelected = false;
	}
	childs = _.forEach(childs, (facetData) => {
		if (facetData.is_selected) {
			isSelected = true;
		}
		if (facetData.childs && facetData.childs.length > 0) {
			isSelected = isDescendantSelected(facetData.childs, isSelected);
		}
	});
	return isSelected;
};

const updateChilds = (childs, item, fields) => {
	childs = _.map(childs, (facetData) => {
		if (facetData.facetrange === item.facetrange) {
			_.forIn(fields, (value, key) => {
				facetData[key] = value;
			});
		}
		if (facetData.childs && facetData.childs.length > 0) {
			facetData.childs = updateChilds(facetData.childs, item, fields);
		}
		return facetData;
	});

	return childs;
};

const getSelected = (childs, source) => {
	if (typeof source === 'undefined') {
		source = [];
	}
	_.forEach(childs, (facetData) => {
		if (facetData.is_selected === 1) {
			source.push(facetData);
		}

		if (facetData.childs && facetData.childs.length > 0) {
			source = getSelected(facetData.childs, source);
		}
	});

	return source;
};

const toIdr = (value) => {
	return currency(value, { symbol: 'Rp', precision: 0, formatWithSymbol: true }).format();
};
export default {
	getCategoryFq,
	getFq,
	getPage,
	getUrlFilterForCategory,
	getUrlFilterForSearch,
	parseFilter,
	getFilter,
	updateChilds,
	resetChilds,
	isDescendantSelected,
	getSelected,
	toIdr
};