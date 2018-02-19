import React, { PureComponent } from 'react';
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
			<div className={!firstLevel && styles.childs}>
				{
					category.childs.map((child, id) => {
						const hasChild = typeof child.childs !== 'undefined' && child.childs.length > 0;
						const Label = hasChild ? <strong>{child.facetdisplay}</strong> : child.facetdisplay;
						const isChildSelected = _.find(child.childs, { is_selected: 1 });
						if (firstLevel) {
							return (
								<List key={id} className={activeTree === child.facetrange ? styles.segment : styles.closed}>
									<List.Content className={activeTree === child.facetrange && styles.selected} onClick={(e) => this.handleTree(e, child, hasChild)}>
										<div className={styles.label}>{Label} <span> ({child.count}) produk</span></div>
										{treeIcon(hasChild ? activeTree === child.facetrange : child.is_selected, hasChild)}
									</List.Content>
									{(hasChild || isChildSelected) && this.renderChild(child)}
								</List>
								// <div key={id}>

								// 	<Divider type={activeTree === child.facetrange ? 'segment' : 'closed'} onClick={(e) => this.handleTree(e, child, hasChild)}>
								// 		<Divider.Content>{child.facetdisplay} <span>({child.count} produk)</span></Divider.Content>
								// 	</Divider>
								// 	{ (hasChild || isChildSelected) && this.renderChild(child) }
								// </div>
							);
						}
						return (
							<List key={id} className={(hasChild && styles.parent)}>
								<List.Content className={activeTree === child.facetrange && styles.selected} onClick={(e) => this.handleTree(e, child, hasChild)}>
									{Label} ({child.count})
									{treeIcon(hasChild ? activeTree === child.facetrange : child.is_selected, hasChild)}
								</List.Content>
								{(hasChild || isChildSelected) && this.renderChild(child)}
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
