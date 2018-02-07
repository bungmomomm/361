import React, { PureComponent } from 'react';

import Lists from './filterLayouts/lists';
import ListsEnd from './filterLayouts/listsEnd';
import Brands from './filterLayouts/brands';
import Color from './filterLayouts/color';
import Size from './filterLayouts/size';
import Price from './filterLayouts/price';
import Location from './filterLayouts/locations';
import TreeSegment from './filterLayouts/treeSegment';
import Result from './filterLayouts/result';

import _ from 'lodash';


class Filter extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			layout: 'result',
			params: {
				header: {
					title: 'Title'
				}
			}
		};
	}
	onListClick(e, layout) {
		this.setState({
			layout
		});
	}

	onFilterSectionClose() {
		this.setState({
			layout: 'result'
		});
	}

	onFilterSelected(e, type, value) {
		const { onUpdateFilter } = this.props;
		onUpdateFilter(e, type, value);
	}

	render() {
		const { layout, ...state } = this.state;
		const { onApply, filters } = this.props;

		let categories = _.filter(filters.facets, (f) => f.id === 'category')[0];
		let productType = _.filter(filters.facets, (f) => f.id === 'custom_category_ids')[0];
		const locations = _.filter(filters.facets, (f) => f.id === 'location')[0];
		const price = _.filter(filters.facets, (f) => f.id === 'price')[0];
		const prices = price.data;
		const range = price.range;

		categories = {
			childs: categories.data
		};

		productType = {
			childs: productType.data
		};
		
		switch (layout) {
		case 'lists':
			return <Lists {...state} filters={filters} />;

		case 'listsEnd':
			return <ListsEnd {...state} filters={filters} />;
		
		case 'brand':
			return <Brands {...state} filters={filters} onClick={(e, value) => this.onFilterSelected(e, 'brand', value)} onClose={(e) => this.onFilterSectionClose()} />;
		
		case 'color':
			return <Color {...state} filters={filters} onClick={(e, value) => this.onFilterSelected(e, 'color', value)} onClose={(e) => this.onFilterSectionClose()} />;
	
		case 'size':
			return <Size {...state} filters={filters} onClick={(e, value) => this.onFilterSelected(e, 'size', value)} onClose={(e) => this.onFilterSectionClose()} />;
		
		case 'price':
			return <Price {...state} filters={filters} prices={prices} range={range} onClick={(e, value) => this.onFilterSelected(e, 'price', value)} onClose={(e) => this.onFilterSectionClose()} />;
		
		case 'location':
			return <Location {...state} filters={filters} data={locations} onClick={(e, value) => this.onFilterSelected(e, 'location', value)} onClose={(e) => this.onFilterSectionClose()} />;
		
		case 'custom_category_ids':
			return <TreeSegment {...state} filters={filters} data={productType} onClick={(e, value) => this.onFilterSelected(e, 'custom_category_ids', value)} onClose={(e) => this.onFilterSectionClose()} />;
		
		case 'category':
			return <TreeSegment {...state} filters={filters} data={categories} onClick={(e, value) => this.onFilterSelected(e, 'category', value)} onClose={(e) => this.onFilterSectionClose()} />;
		
		case 'result':
			return <Result {...state} filters={filters} onApply={onApply} onListClick={(e, key) => this.onListClick(e, key)} />;
	
		default:
			return null;
		}
	}
}

export default Filter;
