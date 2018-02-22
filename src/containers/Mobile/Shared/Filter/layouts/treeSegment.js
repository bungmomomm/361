import React, { Component } from 'react';
import _ from 'lodash';
import {
	Header, 
	// Divider, 
	Page, 
	Svg, 
	List, 
	Button 
} from '@/components/mobile';
import styles from './tree.scss';
import Action from './action';
// import renderIf from '@/utils/renderIf';

const treeIcon = (active, HasTree) => {
	if (HasTree) {
		return active ? <Svg src='ico_chevron-up.svg' /> : <Svg src='ico_chevron-down.svg' />;
	}
	if (active) {
		return <Svg src='ico_check.svg' />;
	}
	return <Svg src='ico_empty.svg' />;
};

const isDescendantSelected = (childs, isSelected) => {
	if (typeof isSelected === 'undefined') {
		isSelected = false;
	}
	childs = _.forEach(childs, (facetData) => {
		if (facetData.is_selected) {
			isSelected = true;
		}
		if (facetData.childs && facetData.childs.length > 0) {
			isSelected = isDescendantSelected(facetData.childs, isSelected);
		}
	});
	return isSelected;
};

const updateChilds = (childs, item, fields) => {
	childs = _.map(childs, (facetData) => {
		if (facetData.facetrange === item.facetrange) {
			_.forIn(fields, (value, key) => {
				facetData[key] = value;
			});
		}
		if (facetData.childs && facetData.childs.length > 0) {
			facetData.childs = updateChilds(facetData.childs, item, fields);
		}
		return facetData;
	});

	return childs;
};

const getSelected = (childs, source) => {
	if (typeof source === 'undefined') {
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

class TreeSegment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTree: [],
			defaultOpen: true,
			data: props.data || []
		};
	}

	onClick(e, value) {
		const { data } = this.state;

		this.setState({
			data: updateChilds(data, value, {
				is_selected: value.is_selected === 1 ? 0 : 1
			})
		});
	}

	onApply(e) {
		const { data } = this.state;
		const { onApply } = this.props;
		const result = getSelected(data);
		onApply(e, result);
	}

	handleTree(e, value, isParent) {
		const { data } = this.state;
		this.setState({
			defaultOpen: false
		});
		if (isParent) {
			this.setState({
				data: updateChilds(data, value, {
					open: !value.open
				})
			});
		} else {
			this.onClick(e, value);
		}
	}

	renderChild(category, firstLevel) {
		const { defaultOpen } = this.state;
		
		if (typeof category.childs === 'undefined') {
			return null;
		}
		return (
			<div className={!firstLevel && styles.childs}>
				{
					category.childs.map((child, id) => {
						const hasChild = typeof child.childs !== 'undefined' && child.childs.length > 0;
						const Label = hasChild ? <strong>{child.facetdisplay}</strong> : child.facetdisplay;
						const isChildSelected = isDescendantSelected(child.childs);
						let renderChild = false;
						if ((defaultOpen && isChildSelected) || (!defaultOpen && hasChild && child.open)) {
							renderChild = true;
						}
						if (firstLevel && hasChild) {
							return (
								<List key={id} className={child.open ? styles.segment : styles.closed}>
									<List.Content className={child.open && styles.selected} onClick={(e) => this.handleTree(e, child, hasChild)}>
										<div className={styles.label}>{Label} <span> ({child.count}) produk</span></div>
										{treeIcon(hasChild ? child.open : child.is_selected, hasChild)}
									</List.Content>

									{renderChild && this.renderChild(child)}
								</List>
							);
						}
						return (
							<List key={id} className={(hasChild && styles.parent)}>
								<List.Content className={child.open && styles.segment} onClick={(e) => this.handleTree(e, child, hasChild)}>
									{Label} ({child.count})
									{treeIcon(hasChild ? child.open : child.is_selected, hasChild)}
								</List.Content>
								{renderChild && this.renderChild(child)}
							</List>
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
		const { onClose } = this.props;
		const { data } = this.state;
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
					{this.renderChild(categories, true)}
					{/* {this.renderTree(categories)} */}
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action hasApply onApply={(e) => this.onApply(e)} />
			</div>
		);
	}
}

export default TreeSegment;
