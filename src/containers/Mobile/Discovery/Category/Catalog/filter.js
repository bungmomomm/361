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

import handler from '@/containers/Mobile/Shared/handler';

@handler
class Filter extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			layout: 'price',
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

		case 'treeSegment':
			return <TreeSegment {...state} />;

		case 'result':
			return <Result {...state} />;

		default:
			return null;
		}
	}
}

export default Filter;
