import React, { PureComponent } from 'react';
import _ from 'lodash';
import {
	Header, 
	// Divider, 
	Page, 
	Svg, 
	List, 
	Button } from '@/components/mobile';
import { Link } from 'react-router-dom';
import styles from './tree.scss';
import Action from './action';

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
			activeTree: [],
			selected: null,
		};
	}
	
	handleTree(e, value, isParent) {
		if (isParent) {
			this.setState({
				activeTree: value.facetrange !== this.state.activeTree ? value.facetrange : null
			});
		} else {
			this.props.onClick(e, value);
			// this.setState({ selected: value });
		}
	}

	renderChild(category, firstLevel) {
		const { activeTree } = this.state;
		if (!firstLevel && activeTree !== category.facetrange) {
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
							<List key={id} className={hasChild && styles.parent}>
								<Button onClick={(e) => this.handleTree(e, child, hasChild)}>
									<List.Content>
										{Label} 
										{treeIcon(hasChild ? activeTree === child.facetrange : child.is_selected, hasChild)}
									</List.Content>
								</Button>
								{(hasChild || isChildSelected) && this.renderChild(child)}
							</List>
						);
					})
				}
			</div>
		);
	}

	renderTree(list) {
		return this.renderChild(list, true);
	}

	render() {
		const { data } = this.props;
		console.log(data);
		const HeaderPage = {
			left: (
				<Link to='/catalogcategory'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Kategori',
			right: null
		};

		return (
			<div style={this.props.style}>
				<Page>
					{/* <Divider type='segment'> 
						<Divider.Content>Wanita <span>({DUMMY_CATEGORY_WANITA.meta.total} produk)</span></Divider.Content>
					</Divider>
					{this.renderTree(DUMMY_CATEGORY_WANITA)}
					<Divider type='segment'> 
						<Divider.Content>Pria <span>({DUMMY_CATEGORY_PRIA.meta.total} produk)</span></Divider.Content>
					</Divider> */}
					{this.renderTree(data)}
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action />
			</div>
		);
	}
}

export default TreeSegment;
