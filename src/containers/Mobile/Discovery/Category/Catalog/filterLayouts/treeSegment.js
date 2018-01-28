import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Header, Divider, Page, Svg, List, Button } from '@/components/mobile';
import { Link } from 'react-router-dom';
import styles from './tree.scss';
import Action from './action';

// DUMMY DATA
const DUMMY_CATEGORY_WANITA = {
	meta: {
		total: 45
	},
	data: [
		{
			name: 'Clothing',
			id: 'Wanitaclothing',
			data: [
				{
					name: 'Atasan',
					id: 'Wanitaatasan',
					data: [
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
					data: [
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
					data: [
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
			data: [
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
			data: [
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
	data: [
		{
			name: 'Clothing',
			id: 'priaclothing',
			data: [
				{
					name: 'Atasan',
					id: 'priaatasan',
					data: [
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
					data: [
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
					data: [
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
			data: [
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
			data: [
				{
					name: 'Semua tas',
					id: 'priasemuaTas'
				}
			]
		}
	]
};

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
	
	handleTree(value, isParent) {
		if (isParent) {
			this.setState({
				activeTree: value !== this.state.activeTree ? value : null
			});
		} else {
			this.setState({ selected: value });
		}
	}

	renderChild(category, firstLevel) {
		const { selected, activeTree } = this.state;
		if (!firstLevel && activeTree !== category.id) {
			return null;
		}
		return (
			<div>
				{
					category.data.map((child, id) => {
						const hasChild = child.data && child.data.length > 0;
						const Label = hasChild ? <strong>{child.name}</strong> : child.name;
						const isChildSelected = _.find(child.data, { id: selected });
						return (
							<List key={id} className={hasChild && styles.parent}>
								<Button onClick={() => this.handleTree(child.id, hasChild)}>
									<List.Content>
										{Label} 
										{treeIcon(hasChild ? activeTree === child.id : selected === child.id, hasChild)}
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
		if (list.data.length < 1) {
			return null;
		}
		return list.data.map((category, idx) => <div key={idx}>{this.renderChild(category, true)}</div>);
	}

	render() {
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
					<Divider type='segment'> 
						<Divider.Content>Wanita <span>({DUMMY_CATEGORY_WANITA.meta.total} produk)</span></Divider.Content>
					</Divider>
					{this.renderTree(DUMMY_CATEGORY_WANITA)}
					<Divider type='segment'> 
						<Divider.Content>Pria <span>({DUMMY_CATEGORY_PRIA.meta.total} produk)</span></Divider.Content>
					</Divider>
					{this.renderTree(DUMMY_CATEGORY_PRIA)}
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action />
			</div>
		);
	}
}

export default TreeSegment;
