import React, { PureComponent } from 'react';
import Lists from './layouts/lists';
// import ListsEnd from './layouts/listsEnd';
import Brands from './layouts/brands';
import Color from './layouts/color';
import Size from './layouts/size';
import Price from './layouts/price';
import Location from './layouts/locations';
import TreeSegment from './layouts/treeSegment';
import Result from './layouts/result';
import utils from './layouts/utils';

import _ from 'lodash';

const getSelected = (childs, source = false) => {
	if (!source) {
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

class Filter extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			filters: props.filters,
			selected: {},
			layout: 'result',
			params: {
				header: {
					title: 'Title'
				}
			}
		};
	}

	componentDidMount() {
		this.mapFilters();
	}

	componentWillReceiveProps(nextProps) {
		const { filters } = this.state;
		this.setState({
			filters: nextProps.filters || filters
		});
		this.mapFilters(nextProps.filters);
	}

	onListClick(e, layout) {
		this.setState({
			layout
		});
	}

	onFilterSectionClose(e) {
		const { layout } = this.state;
		if (layout !== 'result') {
			this.setState({
				layout: 'result'
			});
		} else {
			this.props.onClose(e);
		}
	}

	onFilterSelected(e, type, value) {
		const { onUpdateFilter } = this.props;
		onUpdateFilter(e, type, value);
	}

	onApply(e) {
		const { filters } = this.state;
		this.setState({
			layout: 'result'
		});
		const obj = utils.getFq(filters);
		this.props.onApply(e, obj);
	}

	
	getFacet(key) {
		const { filters } = this.state;
		const facet = _.first(_.filter(filters.facets, (f) => (f.id === key)));
		if (typeof facet !== 'undefined') {
			facet.enabled = 1;
			return facet;
		}
		return {
			enabled: 0,
			data: [],
			range: {
				min: 0,
				max: 0
			}
		};
	}

	mapFilters(newFilters) {
		const { selected } = this.state;
		let { filters } = this.state;
		if (newFilters) {
			filters = newFilters;
		}
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
		filters.facets = _.map(filters.facets, (facet) => {
			switch (facet.id) {
			case 'category':
			case 'custom_category_ids':
			case 'size':
				selected[facet.id] = [];
				[facet.data, selected[facet.id]] = updateChilds(facet.data, selected[facet.id]);
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
			return facet;
		});
		this.setState({
			selected
		});
		this.forceUpdate();
	}

	applyFilter(type, values, custom) {
		const { selected, filters } = this.state;
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

		filters.facets = _.map(filters.facets, (facet) => {
			if (facet.id === type) {
				switch (facet.id) {
				case 'category':
				case 'custom_category_ids':
				case 'size':
					if (facet.id === type) {
						selected[facet.id] = [];
						[facet.data, selected[facet.id]] = updateChilds(facet.data, results, selected[facet.id]);
					}
					break;
				case 'price':
					selected[facet.id] = [];
					if (custom) {
						selected[facet.id] = [_.values(custom)];
						facet.requested_range = custom;
					} else {
						delete facet.requested_range;
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
			}
			return facet;
		});

		this.setState({
			filters,
			selected,
			layout: 'result'
		});
	}

	render() {
		const { layout, filters, selected, ...state } = this.state;
		const { onReset, shown } = this.props;

		const brands = this.getFacet('brand');
		const colors = this.getFacet('color');
		const sizes = this.getFacet('size');
		const locations = this.getFacet('location');
		const priceData = this.getFacet('price');
		const prices = priceData.data;
		const range = priceData.range;
		const shippings = this.getFacet('shipping_methods');
		const categories = this.getFacet('category');
		const customCategoryType = this.getFacet('custom_category_ids');
		if (shown) {
			switch (layout) {
			/*
			case 'lists':
				return <Lists {...state} />;

			case 'listsEnd':
				return <ListsEnd {...state} />;
			*/
			case 'brand':
				return (
					<Brands 
						{...state} 
						title='brands' 
						data={brands.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values) => this.applyFilter(layout, values)}
					/>
				);
			case 'color':
				return (
					<Color 
						{...state} 
						data={colors.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values) => this.applyFilter(layout, values)}
					/>
				);
			
			case 'size':
				return (
					<Size 
						{...state} 
						data={sizes.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values) => this.applyFilter(layout, values)}
					/>
				);			
			case 'location':
				return (
					<Location 
						{...state} 
						data={locations.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values, custom) => this.applyFilter(layout, values, custom)}
					/>
				);
			
			case 'price':
				return (
					<Price 
						{...state} 
						data={prices} 
						range={range} 
						onChange={(e, value) => this.onFilterSelected(e, 'pricerange', value)} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values) => this.applyFilter(layout, values)}
					/>
				);			
			case 'shipping_methods':
				return (
					<Lists 
						{...state} 
						data={shippings.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values) => this.applyFilter(layout, values)}
					/>
				);
			case 'custom_category_ids':
				return (
					<TreeSegment 
						{...state} 
						data={customCategoryType.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values) => this.applyFilter(layout, values)}
					/>
				);		
			case 'category':
				return (
					<TreeSegment 
						{...state} 
						data={categories.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values) => this.applyFilter(layout, values)}
					/>
				);
			case 'result':
				return (
					<Result 
						{...state} 
						filters={filters}
						onReset={onReset} 
						selected={selected}
						onApply={(e) => this.onApply(e)} 
						onListClick={(e, key) => this.onListClick(e, key)} 
						onClose={(e) => this.onFilterSectionClose()} 
					/>
				);		
			default:
				return null;
			}
		}

		return null;
	}
}

export default Filter;
