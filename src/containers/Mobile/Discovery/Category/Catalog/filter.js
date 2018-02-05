import React, { PureComponent } from 'react';

import Lists from './filterLayouts/lists';
import ListsEnd from './filterLayouts/listsEnd';
import Brands from './filterLayouts/brands';
import Color from './filterLayouts/color';
import Size from './filterLayouts/size';
import Price from './filterLayouts/price';
import Tree from './filterLayouts/tree';
import TreeSegment from './filterLayouts/treeSegment';
import Result from './filterLayouts/result';


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

	onFilterColorSelected(e, type, color) {
		const { onUpdateFilter } = this.props;
		onUpdateFilter(e, type, color);
	}

	render() {
		const { layout, ...state } = this.state;
		const { onApply, filters } = this.props;
		
		switch (layout) {
		case 'lists':
			return <Lists {...state} filters={filters} />;

		case 'listsEnd':
			return <ListsEnd {...state} filters={filters} />;
		
		case 'brand':
			return <Brands {...state} filters={filters} onClose={(e) => this.onFilterSectionClose()} />;
		
		case 'color':
			return <Color {...state} filters={filters} onClick={(e, value) => this.onFilterSelected(e, 'color', value)} onClose={(e) => this.onFilterSectionClose()} />;
	
		case 'size':
			return <Size {...state} filters={filters} onClick={(e, value) => this.onFilterSelected(e, 'color', value)} onClose={(e) => this.onFilterSectionClose()} />;
		
		case 'price':
			return <Price {...state} filters={filters} />;
		
		case 'tree':
			return <Tree {...state} filters={filters} />;
		
		case 'treeSegment':
			return <TreeSegment {...state} filters={filters} />;
		
		case 'result':
			return <Result {...state} filters={filters} onApply={onApply} onListClick={(e, key) => this.onListClick(e, key)} />;
	
		default:
			return null;
		}
	}
}

export default Filter;
