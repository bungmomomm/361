import React, { PureComponent } from 'react';

import Lists from './layouts/lists';
import ListsEnd from './layouts/listsEnd';
import Brands from './layouts/brands';
import Color from './layouts/color';
import Size from './layouts/size';
import Price from './layouts/price';
import Location from './layouts/locations';
import TreeSegment from './layouts/treeSegment';
import Result from './layouts/result';

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

	onFilterSectionClose(e) {
		const { layout } = this.state;
		console.log(layout);
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
		this.setState({
			layout: 'result'
		});
		this.props.onApply(e);
	}

	getFacet(key) {
		const facet = _.first(_.filter(this.props.filters.facets, (f) => (f.id === key)));
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

	render() {
		const { layout, ...state } = this.state;
		const { onReset, filters, shown } = this.props;

		const categories = this.getFacet('category');
		const customCategoryType = this.getFacet('custom_category_ids');
		const locations = this.getFacet('location');
		const brands = this.getFacet('brand');
		const colors = this.getFacet('color');
		const sizes = this.getFacet('size');
		const shippings = this.getFacet('shipping_methods');
		const priceData = this.getFacet('price');
		const prices = priceData.data;
		const range = priceData.range;
		// console.log(categories);
		// console.log(categories, customCategoryType, locations, brands, colors, sizes, prices, range, layout, state, onApply, onReset, filters);

		if (shown) {
			switch (layout) {
			case 'lists':
				return <Lists {...state} />;

			case 'listsEnd':
				return <ListsEnd {...state} />;
			
			case 'brand':
				return (
					<Brands 
						{...state} 
						title='brands' 
						data={brands.data} 
						onClick={(e, value) => this.onFilterSelected(e, 'brand', value)} 
						onClose={(e) => this.onFilterSectionClose()}
					/>
				);			
			case 'color':
				return (
					<Color 
						{...state} 
						data={colors.data} 
						onClick={(e, value) => this.onFilterSelected(e, 'color', value)} 
						onClose={(e) => this.onFilterSectionClose()}
					/>
				);		
			case 'size':
				return (
					<Size 
						{...state} 
						data={sizes.data} 
						onClick={(e, value) => this.onFilterSelected(e, 'size', value)} 
						onClose={(e) => this.onFilterSectionClose()}
					/>
				);			
			case 'price':
				return (
					<Price 
						{...state} 
						prices={prices} 
						range={range} 
						onChange={(e, value) => this.onFilterSelected(e, 'pricerange', value)} 
						onClick={(e, value) => this.onFilterSelected(e, 'price', value)} 
						onClose={(e) => this.onFilterSectionClose()} 
					/>
				);			
			case 'location':
				return (
					<Location 
						{...state} 
						data={locations.data} 
						onClick={(e, value) => this.onFilterSelected(e, 'location', value)} 
						onClose={(e) => this.onFilterSectionClose()}
					/>
				);
			case 'shipping_methods':
				return (
					<Lists 
						{...state} 
						data={shippings.data} 
						onClick={(e, value) => this.onFilterSelected(e, 'shipping_methods', value)} 
						onClose={(e) => this.onFilterSectionClose()}
					/>
				);
			case 'custom_category_ids':
				return (
					<TreeSegment 
						{...state} 
						data={customCategoryType.data} 
						onClick={(e, value) => this.onFilterSelected(e, 'custom_category_ids', value)} 
						onClose={(e) => this.onFilterSectionClose()}
					/>
				);			
			case 'category':
				return (
					<TreeSegment 
						{...state} 
						data={categories.data} 
						onClick={(e, value) => this.onFilterSelected(e, 'category', value)} 
						onClose={(e) => this.onFilterSectionClose()}
					/>
				);
			case 'result':
				return (
					<Result 
						{...state} 
						filters={filters}
						onReset={onReset} 
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
