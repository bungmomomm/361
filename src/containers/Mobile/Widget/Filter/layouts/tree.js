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

import classNames from 'classnames';
import _ from 'lodash';

const treeIcon = (active, HasTree, isChildSelected) => {
	if (HasTree) {
		if (active) {
			return isChildSelected ? <Svg src='ico_check_chevron-up.svg' /> : <Svg src='ico_chevron-up.svg' />;
		}
		return isChildSelected ? <Svg src='ico_check_chevron-down.svg' /> : <Svg src='ico_chevron-down.svg' />;
	}
	if (active) {
		return <Svg src='ico_check.svg' />;
	}
	return <Svg src='ico_empty.svg' />;
};
import handler from '@/containers/Mobile/Shared/handler';

@handler
class TreeSegment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTree: [],
			defaultOpen: false,
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
				}, {
					open: false
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

		const filterBox = classNames(
			!firstLevel ? styles.childs : null
		);
		return (
			<div className={filterBox}>
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
									<List.Content className={child.open && styles.treeSelected} onClick={(e) => this.handleTree(e, child, hasChild)}>
										<div className={styles.treeLabel}>{Label} <span className='font-color--primary-ext-2'> ({child.count}) produk</span></div>
										{treeIcon(hasChild ? child.open : child.is_selected, hasChild, isChildSelected)}
									</List.Content>
									{renderChild && this.renderChild(child)}
								</List>
							);
						}
						return (
							<List key={id} className={(hasChild && styles.parent)}>
								<List.Content className={child.open && styles.segment} onClick={(e) => this.handleTree(e, child, hasChild)}>
									<div className={styles.treeLabel}>{Label} <span className='font-color--primary-ext-2'>({child.count})</span></div>
									{treeIcon(hasChild ? child.open : child.is_selected, hasChild, isChildSelected)}
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
		const { onClose, title } = this.props;
		const { data, resetDisabled } = this.state;
		const HeaderPage = {
			left: (
				<Button onClick={onClose}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: _.capitalize(title) || 'Default',
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
