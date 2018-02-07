import React, { PureComponent } from 'react';
import { Header, Page, Svg, List, Button } from '@/components/mobile';
import Action from './action';
// import styles from './tree.scss';

import _ from 'lodash';

class Location extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			activeTree: null,
			selected: null,
		};
	}
	handleTree(e, value, isParent) {
		if (isParent) {
			this.setState({
				activeTree: value !== this.state.activeTree ? value : null
			});
		} else {
			this.props.onClick(e, value);
		}
	}
	render() {
		const { onClose, data, title } = this.props;
		const HeaderPage = {
			left: (
				<Button onClick={onClose}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: title || 'Default',
			right: null
		};

		const locations = data.data;

		// const { activeTree, selected } = this.state;

		const treeIcon = (active, HasTree) => {
			if (HasTree) {
				return active ? <Svg src='ico_chevron-up.svg' /> : <Svg src='ico_chevron-down.svg' />;
			}
			if (active) {
				return <Svg src='ico_check.svg' />;
			}
			return <Svg src='ico_empty.svg' />;
		};

		return (
			<div style={this.props.style}>
				<Page>
					<div>
						{_.map(locations, (location, id) => {
							return (
								<List key={id}><Button onClick={(e) => this.handleTree(e, location)}><List.Content>{location.facetdisplay} {treeIcon(location.is_selected)}</List.Content></Button></List>
							);
						})}
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action />
			</div>
		);
	}
}

export default Location;
