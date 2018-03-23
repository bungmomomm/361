import querystring from 'querystring';
import _ from 'lodash';
import currency from 'currency.js';
const toIdr = (value) => {
	return currency(value, { symbol: 'Rp', precision: 0, formatWithSymbol: true }).format();
};
const applyAndGetSelected = (facets, selected, disabled, type, values, custom) => {
	const results = _.map(values, (value) => {
		return value.facetrange;
	});
	const updateChilds = (c, r, s) => {
		c = _.map(c, (facetData) => {
			const isExist = _.find(r, (v) => {
				return v === facetData.facetrange;
			});
			facetData.is_selected = 0;
			if (isExist) {
				s.push(facetData);
				facetData.is_selected = 1;
			}
			[c, s] = updateChilds(facetData.childs, r, s);
			return facetData;
		});
		return [c, s];
	};
	disabled = true;
	facets = _.map(facets, (facet) => {
		if (facet.id === type) {
			switch (facet.id) {
			case 'category':
			case 'custom_category_ids':
			case 'location':
			case 'size':
				if (facet.id === type) {
					selected[facet.id] = [];
					[facet.data, selected[facet.id]] = updateChilds(facet.data, results, selected[facet.id]);
				}
				break;
			case 'price':
				selected[facet.id] = [];
				if (custom) {
					selected[facet.id] = [custom];
					facet.selected_range = custom;
				} else {
					delete facet.selected_range;
					facet.data = _.map(facet.data, (facetData) => {
						const isExist = _.find(results, (v) => {
							return v === facetData.facetrange;
						});
						facetData.is_selected = 0;
						if (isExist) {
							selected[facet.id].push(facetData);
							facetData.is_selected = 1;
						}
						return facetData;
					});
				}
				break;
			default:
				selected[facet.id] = [];
				facet.data = _.map(facet.data, (facetData) => {
					if (facet.id === type) {
						const isExist = _.find(results, (v) => {
							return v === facetData.facetrange;
						});
						facetData.is_selected = 0;
						if (isExist) {
							selected[facet.id].push(facetData);
							facetData.is_selected = 1;
						}
					}
					return facetData;
				});
				break;
			}

			if (selected[facet.id].length < 1) {
				selected[facet.id].push({
					facetdisplay: 'Semua'
				});
			} else {
				disabled = false;
			}
		}
		return facet;
	});

	return {
		facets,
		selected,
		disabled
	};
};

const mapFilters = (facets, selected, disabled) => {
	const updateChilds = (c, s) => {
		c = _.map(c, (facetData) => {
			if (facetData.is_selected) {
				s.push(facetData);
			}
			[c, s] = updateChilds(facetData.childs, s);
			return facetData;
		});

		return [c, s];
	};
	disabled = true;
	facets = _.map(facets, (facet) => {
		switch (facet.id) {
		case 'category':
		case 'custom_category_ids':
		case 'location':
		case 'size':
			selected[facet.id] = [];
			[facet.data, selected[facet.id]] = updateChilds(facet.data, selected[facet.id]);
			break;
		case 'price':
			selected[facet.id] = [];
			if (facet.selected_range) {
				selected[facet.id] = [{
					facetdisplay: `${toIdr(facet.selected_range.min)} - ${toIdr(facet.selected_range.max)}`
				}];
			}
			break;
		default:
			selected[facet.id] = [];
			facet.data = _.map(facet.data, (facetData) => {
				if (facetData.is_selected) {
					selected[facet.id].push(facetData);
				}
				return facetData;
			});
			break;
		}
		if (selected[facet.id].length < 1) {
			selected[facet.id].push({
				facetdisplay: 'Semua'
			});
		} else {
			disabled = false;
		}
		return facet;
	});
	return {
		facets,
		selected,
		disabled
	};
};

const getCategoryFq = (categories, source) => {
	source.forEach((category) => {
		const isExist = _.find(categories, (c) => {
			return c.facetrange === category.facetrange;
		});
		if (typeof (category.childs) !== 'undefined' && category.childs.length > 0) {
			categories = getCategoryFq(categories, category.childs);
		} else if (typeof isExist === 'undefined') {
			categories.push(category);
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
		case 'location':
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
			if (facet.selected_range) {
				fq[facet.id] = [(`${facet.selected_range.min}-${facet.selected_range.max}`)];
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

const updateChilds = (childs, item, fields, fieldAll = []) => {
	childs = _.map(childs, (facetData) => {
		_.forIn(fieldAll, (value, key) => {
			facetData[key] = value;
		});
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

const isFiltered = (facets) => {
	let filtered = [];
	_.forEach(facets, (facet) => {
		filtered = getSelected(facet.data, filtered);
	});
	return filtered.length > 0;
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
	isFiltered,
	applyAndGetSelected,
	mapFilters,
	toIdr
};