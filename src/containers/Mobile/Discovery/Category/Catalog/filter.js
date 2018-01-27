import React, { PureComponent } from 'react';

import Lists from './filterLayouts/lists';
import ListsEnd from './filterLayouts/listsEnd';
import Brands from './filterLayouts/brands';
import Color from './filterLayouts/color';
import Size from './filterLayouts/Size';
import Price from './filterLayouts/price';
import Tree from './filterLayouts/tree';


class Filter extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			layout: 'tree',
			params: {
				header: {
					title: 'Title'
				}
			}
		};
	}
	render() {
		const { layout, ...state } = this.state;
		
		switch (layout) {
		case 'lists':
			return <Lists {...state} />;

		case 'listsEnd':
			return <ListsEnd {...state} />;
		
		case 'brands':
			return <Brands {...state} />;
		
		case 'color':
			return <Color {...state} />;
	
		case 'size':
			return <Size {...state} />;
		
		case 'price':
			return <Price {...state} />;
		
		case 'tree':
			return <Tree {...state} />;
	
		default:
			return null;
		}
	}
}

export default Filter;
