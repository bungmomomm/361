import React, { Component } from 'react';
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
import utils from './utils';
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

class TreeSegment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTree: [],
			defaultOpen: true,
			data: props.data || [],
			resetDisabled: utils.getSelected(props.data).length < 1
		};
	}

	onClick(e, value) {
		let { data } = this.state;
		data = utils.updateChilds(data, value, {
			is_selected: value.is_selected === 1 ? 0 : 1
		});
		const selected = utils.getSelected(data);
		this.setState({
			resetDisabled: selected.length < 1,
			data
		});
	}

	onApply(e) {
		const { data } = this.state;
		const { onApply } = this.props;
		const result = utils.getSelected(data);
		onApply(e, result);
	}

	handleTree(e, value, isParent) {
		const { data } = this.state;
		this.setState({
			defaultOpen: false
		});
		if (isParent) {
			this.setState({
				data: utils.updateChilds(data, value, {
					open: !value.open
				})
			});
		} else {
			this.onClick(e, value);
		}
	}

	reset() {
		const { data } = this.state;
		this.setState({
			resetDisabled: true,
			data: utils.resetChilds(data)
		});
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
						const Label = child.facetdisplay;
						const isChildSelected = utils.isDescendantSelected(child.childs);
						let renderChild = false;
						if ((defaultOpen && isChildSelected) || (!defaultOpen && hasChild && child.open)) {
							renderChild = true;
						}
						if (firstLevel && hasChild) {
							return (
								<List key={id} className={child.open ? styles.segment : styles.closed}>
									<List.Content className={child.open && styles.selected} onClick={(e) => this.handleTree(e, child, hasChild)}>
										<div className={styles.label}>{Label} <span className='font-color--primary-ext-2'> ({child.count}) produk</span></div>
										{treeIcon(hasChild ? child.open : child.is_selected, hasChild)}
									</List.Content>
									{renderChild && this.renderChild(child)}
								</List>
							);
						}
						return (
							<List key={id} className={(hasChild && styles.parent)}>
								<List.Content className={child.open && styles.segment} onClick={(e) => this.handleTree(e, child, hasChild)}>
									<div className={styles.label}>{Label} <span className='font-color--primary-ext-2'>({child.count})</span></div>
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
		const { data, resetDisabled } = this.state;
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
				<Page color='white' style={{ marginTop: '15px' }}>
					{this.renderChild(categories, true)}
					{/* {this.renderTree(categories)} */}
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action resetDisabled={resetDisabled} hasReset onReset={(e) => this.reset()} hasApply onApply={(e) => this.onApply(e)} />
			</div>
		);
	}
}

export default TreeSegment;
