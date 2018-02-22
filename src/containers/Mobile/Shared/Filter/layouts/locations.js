import React, { PureComponent } from 'react';
import { Header, Page, Svg, List, Button } from '@/components/mobile';
import Action from './action';
// import styles from './tree.scss';

import _ from 'lodash';

const updateChilds = (childs, value) => {
	childs = _.map(childs, (facetData) => {
		if (facetData.facetrange === value.facetrange) {
			facetData.is_selected = facetData.is_selected === 1 ? 0 : 1;
		}
		if (facetData.childs && facetData.childs.length > 0) {
			facetData.childs = updateChilds(facetData.childs, value);
		}
		return facetData;
	});

	return childs;
};

class Location extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			activeTree: null,
			selected: null,
			data: props.data || []
		};
	}
	
	onApply(e) {
		const { data } = this.state;
		const { onApply } = this.props;
		const result = _.filter(data, (facetData) => {
			return (facetData.is_selected === 1);
		});
		console.log(result);
		onApply(e, result);
	}

	onClick(e, value) {
		const { data } = this.state;
		this.setState({
			data: updateChilds(data, value)
		});
	}

	render() {
		const { onClose, title } = this.props;
		const { data } = this.state;
		const HeaderPage = {
			left: (
				<Button onClick={onClose}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: title || 'Default',
			right: null
		};

		const Icon = (active) => {
			if (active) {
				return <Svg src='ico_check.svg' />;
			}
			return <Svg src='ico_empty.svg' />;
		};

		return (
			<div style={this.props.style}>
				<Page>
					<div>
						{_.map(data, (value, id) => {
							return (
								<List key={id}><Button onClick={(e) => this.onClick(e, value)}><List.Content>{value.facetdisplay} {Icon(value.is_selected)}</List.Content></Button></List>
							);
						})}
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action hasApply onApply={(e) => this.onApply(e)} />
			</div>
		);
	}
}

export default Location;
