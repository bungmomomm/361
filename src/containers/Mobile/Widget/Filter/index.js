import React, { PureComponent } from 'react';
import Lists from './layouts/lists';
// import ListsEnd from './layouts/listsEnd';
import Brands from './layouts/brands';
import Color from './layouts/color';
import Size from './layouts/size';
import Price from './layouts/price';
// import Location from './layouts/locations';
import TreeSegment from './layouts/treeSegment';
import Tree from './layouts/tree';
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
			this.onApply(undefined);
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
		const { resetDisabled, selected } = this.state;
		let { filters } = this.state;
		if (newFilters) {
			filters = newFilters;
		}
		const response = utils.mapFilters(filters.facets, selected, resetDisabled);
		this.setState({
			resetDisabled: response.disabled,
			selected: response.selected
		});
		this.forceUpdate();
	}

	applyFilter(type, values, custom) {
		const { filters } = this.state;
		let { resetDisabled, selected } = this.state;
		const response = utils.applyAndGetSelected(
			filters.facets,
			selected,
			resetDisabled,
			type,
			values,
			custom
		);

		filters.facets = response.facets;
		resetDisabled = response.disabled;
		selected = response.selected;

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

		let data;
		let filterView;
		if (shown) {
			switch (layout) {
			case 'brand':
				data = this.getFacet('brand');
				filterView = (
					<Brands 
						{...state} 
						title={data.title} 
						data={data.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values) => this.applyFilter(layout, values)}
					/>
				);
				break;
			case 'color':
				data = this.getFacet('color');
				filterView = (
					<Color 
						{...state} 
						title={data.title}
						data={data.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values) => this.applyFilter(layout, values)}
					/>
				);
			
				break;
			case 'size':
				data = this.getFacet('size');
				filterView = (
					<Size 
						{...state} 
						title={data.title}
						data={data.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values) => this.applyFilter(layout, values)}
					/>
				);			
				break;
			case 'location':
				data = this.getFacet('location');
				filterView = (
					<Tree 
						{...state} 
						title={data.title}
						data={data.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values, custom) => this.applyFilter(layout, values, custom)}
					/>
				);
			
				break;
			case 'price':
				data = this.getFacet('price');
				filterView = (
					<Price 
						{...state} 
						title={data.title}
						data={data.data} 
						range={data.range} 
						onChange={(e, value) => this.onFilterSelected(e, 'pricerange', value)} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values, custom) => this.applyFilter(layout, values, custom)}
					/>
				);			
				break;
			case 'shipping_methods':
				data = this.getFacet('shipping_methods');
				filterView = (
					<Lists 
						{...state} 
						title={data.title}
						data={data.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values) => this.applyFilter(layout, values)}
					/>
				);
				break;
			case 'custom_category_ids':
				data = this.getFacet('custom_category_ids');
				filterView = (
					<TreeSegment 
						{...state} 
						title={data.title}
						data={data.data} 
						onClick={(e, value) => this.onFilterSelected(e, layout, value)} 
						onClose={(e) => this.onFilterSectionClose()}
						onApply={(e, values) => this.applyFilter(layout, values)}
					/>
				);		
				break;
			case 'category':
				data = this.getFacet('category');
				filterView = (
					<TreeSegment 
						{...state} 
						title={data.title}
						data={data.data} 
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
