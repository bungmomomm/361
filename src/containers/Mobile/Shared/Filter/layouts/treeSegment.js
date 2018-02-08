import React, { PureComponent } from 'react';
import _ from 'lodash';
import {
	Header, 
	Divider, 
	Page, 
	Svg, 
	List, 
	Button 
} from '@/components/mobile';
import styles from './tree.scss';
import Action from './action';
import renderIf from '@/utils/renderIf';

// DUMMY DATA
/*
const DUMMY_CATEGORY_WANITA = {
	meta: {
		total: 45
	},
	childs: [
		{
			name: 'Clothing',
			id: 'Wanitaclothing',
			childs: [
				{
					name: 'Atasan',
					id: 'Wanitaatasan',
					childs: [
						{
							name: 'Kaos & Polo Shirt',
							id: 'WanitaKaosPoloShirt'
						},
						{
							name: 'Blouse',
							id: 'Wanitablouse'
						}
					]
				},
				{
					name: 'Bawahan',
					id: 'Wanitabawahan',
					childs: [
						{
							name: 'Kaos & Polo Shirt',
							id: 'WanitaKaosPoloShirt'
						},
						{
							name: 'Blouse',
							id: 'Wanitablouse'
						}
					]
				},
				{
					name: 'Pakaian Dalam',
					id: 'WanitabawahanDalam',
					childs: [
						{
							name: 'Kaos & Polo Shirt',
							id: 'WanitaKaosPoloShirt'
						},
						{
							name: 'Blouse',
							id: 'Wanitablouse'
						}
					]
				}
			]
		},
		{
			name: 'Shoes',
			id: 'Wanitashoes',
			childs: [
				{
					name: 'Semua Sepatu',
					id: 'WanitasemuaSepatu'
				},
				{
					name: 'Sneakers',
					id: 'Wanitasneakers'
				}
			]
		},
		{
			name: 'Tas',
			id: 'Wanitatas',
			childs: [
				{
					name: 'Semua tas',
					id: 'WanitasemuaTas'
				}
			]
		}
	]
};

const DUMMY_CATEGORY_PRIA = {
	meta: {
		total: 102
	},
	childs: [
		{
			name: 'Clothing',
			id: 'priaclothing',
			childs: [
				{
					name: 'Atasan',
					id: 'priaatasan',
					childs: [
						{
							name: 'Kaos & Polo Shirt',
							id: 'priaKaosPoloShirt'
						},
						{
							name: 'Blouse',
							id: 'priablouse'
						}
					]
				},
				{
					name: 'Bawahan',
					id: 'priabawahan',
					childs: [
						{
							name: 'Kaos & Polo Shirt',
							id: 'priaKaosPoloShirt'
						},
						{
							name: 'Blouse',
							id: 'priablouse'
						}
					]
				},
				{
					name: 'Pakaian Dalam',
					id: 'priabawahan',
					childs: [
						{
							name: 'Kaos & Polo Shirt',
							id: 'priaKaosPoloShirt'
						},
						{
							name: 'Blouse',
							id: 'priablouse'
						}
					]
				}
			]
		},
		{
			name: 'Shoes',
			id: 'priashoes',
			childs: [
				{
					name: 'Semua Sepatu',
					id: 'priasemuaSepatu'
				},
				{
					name: 'Sneakers',
					id: 'priasneakers'
				}
			]
		},
		{
			name: 'Tas',
			id: 'priatas',
			childs: [
				{
					name: 'Semua tas',
					id: 'priasemuaTas'
				}
			]
		}
	]
};
*/
// END DUMMY DATA

const treeIcon = (active, HasTree) => {
	if (HasTree) {
		return active ? <Svg src='ico_chevron-up.svg' /> : <Svg src='ico_chevron-down.svg' />;
	}
	if (active) {
		return <Svg src='ico_check.svg' />;
	}
	return <Svg src='ico_empty.svg' />;
};

class TreeSegment extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			activeTree: []
		};
	}
	
	handleTree(e, value, isParent) {
		if (isParent) {
			this.setState({
				activeTree: value.facetrange !== this.state.activeTree ? value.facetrange : null
			});
		} else {
			this.props.onClick(e, value);
		}
	}

	renderChild(category, firstLevel) {
		const { activeTree } = this.state;
		if (!firstLevel && activeTree !== category.facetrange) {
			return null;
		}
		if (typeof category.childs === 'undefined') {
			return null;
		}
		return (
			<div>
				{
					category.childs.map((child, id) => {
						const hasChild = typeof child.childs !== 'undefined' && child.childs.length > 0;
						const Label = hasChild ? <strong>{child.facetdisplay}</strong> : child.facetdisplay;
						const isChildSelected = _.find(child.childs, { is_selected: 1 });
						return (
							<div key={id}>
								{renderIf(hasChild && firstLevel)(
									<Divider type='segment'>
										<Divider.Content>{child.facetdisplay} <span>({child.count} produk)</span></Divider.Content>
									</Divider>
								)}
								<List className={hasChild && styles.parent}>
									<Button onClick={(e) => this.handleTree(e, child, hasChild)}>
										<List.Content>
											{ Label }
											{treeIcon(hasChild ? activeTree === child.facetrange : child.is_selected, hasChild)}
										</List.Content>
									</Button>
									{(hasChild || isChildSelected) && this.renderChild(child)}
								</List>
							</div>
						);
					})
				}
			</div>
		);
	}

	renderTree(category) {
		return this.renderChild(category, true);
	}

	render() {
		const { onClose, data } = this.props;
		const HeaderPage = {
			left: (
				<Button onClick={onClose}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: 'Kategori',
			right: null
		};

		const categories = {
			childs: data
		};

		return (
			<div style={this.props.style}>
				<Page>
					{this.renderTree(categories)}
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action />
			</div>
		);
	}
}

export default TreeSegment;
