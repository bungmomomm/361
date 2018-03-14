import React, { PureComponent } from 'react';
import Lists from './layouts/lists';
// import ListsEnd from './layouts/listsEnd';
import Brands from './layouts/brands';
import Color from './layouts/color';
import Size from './layouts/size';
import Price from './layouts/price';
// import Location from './layouts/locations';
import TreeSegment from './layouts/treeSegment';
import Result from './layouts/result';
import utils from './layouts/utils';
import styles from './filter.scss';
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
			resetDisabled: true,
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

	onReset(e) {
		const { filters } = this.state;
		let resetDisabled = false;
		const updateChilds = (c) => {
			c = _.map(c, (facetData) => {
				facetData.is_selected = 0;
				if (facetData.childs) {
					facetData.childs = updateChilds(facetData.childs);
				}
				return facetData;
			});

			return c;
		};
		const selected = {};
		filters.facets = _.map(filters.facets, (facet) => {
			switch (facet.id) {
			case 'category':
			case 'custom_category_ids':
			case 'size':
				facet.data = updateChilds(facet.data);
				break;
			default:
				facet.data = _.map(facet.data, (facetData) => {
					facetData.is_selected = 0;
					return facetData;
				});
				break;
			}
			
			selected[facet.id] = [{
				facetdisplay: 'Semua'
			}];
			resetDisabled = true;
			return facet;
		});

		this.setState({
			resetDisabled,
			filters,
			selected
		});
		this.forceUpdate();
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
		let { filters, resetDisabled } = this.state;
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
		resetDisabled = true;
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
			if (selected[facet.id].length < 1) {
				selected[facet.id].push({
					facetdisplay: 'Semua'
				});
			} else {
				resetDisabled = false;
			}
			return facet;
		});
		
		this.setState({
			resetDisabled,
			selected
		});
		this.forceUpdate();
	}

	applyFilter(type, values, custom) {
		const { selected, filters } = this.state;
		let { resetDisabled } = this.state;
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
		resetDisabled = true;
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
						selected[facet.id] = [custom];
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
				
				if (selected[facet.id].length < 1) {
					selected[facet.id].push({
						facetdisplay: 'Semua'
					});
				} else {	
					resetDisabled = false;
				}
			}
			return facet;
		});
		console.log(resetDisabled);
		this.setState({
			resetDisabled,
			filters,
			selected,
			layout: 'result'
		});
	}

	render() {
		const { layout, filters, selected, resetDisabled, ...state } = this.state;
		const { shown } = this.props;

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

		let filterView;
		if (shown) {
			switch (layout) {
			case 'brand':
				filterView = (
					<Brands 
						{...state} 
						title='brands' 
						data={brands.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values) => this.applyFilter(layout, values)}
					/>
				);
				break;
			case 'color':
				filterView = (
					<Color 
						{...state} 
						data={colors.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values) => this.applyFilter(layout, values)}
					/>
				);
			
				break;
			case 'size':
				filterView = (
					<Size 
						{...state} 
						data={sizes.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values) => this.applyFilter(layout, values)}
					/>
				);			
				break;
			case 'location':
				filterView = (
					<TreeSegment 
						{...state} 
						data={locations.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values, custom) => this.applyFilter(layout, values, custom)}
					/>
				);
			
				break;
			case 'price':
				filterView = (
					<Price 
						{...state} 
						data={prices} 
						range={range} 
						onChange={(e, value) => this.onFilterSelected(e, 'pricerange', value)} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values, custom) => this.applyFilter(layout, values, custom)}
					/>
				);			
				break;
			case 'shipping_methods':
				filterView = (
					<Lists 
						{...state} 
						title='Layanan Pengiriman' 
						data={shippings.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values) => this.applyFilter(layout, values)}
					/>
				);
				break;
			case 'custom_category_ids':
				filterView = (
					<TreeSegment 
						{...state} 
						data={customCategoryType.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values) => this.applyFilter(layout, values)}
					/>
				);		
				break;
			case 'category':
				filterView = (
					<TreeSegment 
						{...state} 
						data={categories.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values) => this.applyFilter(layout, values)}
					/>
				);
				break;
			case 'result':
				filterView = (
					<Result 
						{...state} 
						filters={filters}
						resetDisabled={resetDisabled}
						onReset={(e) => this.onReset(e)} 
						selected={selected}
						onApply={(e) => this.onApply(e)} 
						onListClick={(e, key) => this.onListClick(e, key)} 
						onClose={(e) => this.onFilterSectionClose()} 
					/>
				);	
				break;	
			default:
				filterView = null;
			}
		}
		return (
			<div>
				<div className={styles.filterBackground} />
				{filterView}
			</div>
		);
	}
}

export default Filter;
