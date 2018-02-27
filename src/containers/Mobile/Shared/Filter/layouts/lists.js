import React, { PureComponent } from 'react';
import { Header, Page, Svg, List, Button } from '@/components/mobile';
import Action from './action';
import _ from 'lodash';

class Lists extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			data: props.data || []
		};
	}

	onClick(e, value) {
		let { data } = this.state;

		data = _.map(data, (facetData) => {
			if (facetData.facetrange === value.facetrange) {
				facetData.is_selected = facetData.is_selected === 1 ? 0 : 1;
			}
			return facetData;
		});

		this.setState({
			data
		});
	}

	onApply(e) {
		const { data } = this.state;
		const { onApply } = this.props;
		const result = _.filter(data, (facetData) => {
			return (facetData.is_selected === 1);
		});
		onApply(e, result);
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
			center: _.capitalize(title) || 'Default',
			right: null
		};

		const lists = _.map(data, (value, id) => {
			const icon = value.is_selected ? <Svg src='ico_check.svg' /> : <Svg src='ico_empty.svg' />;
			return (
				<Button key={id} align='left' wide onClick={(e) => this.onClick(e, value)}><List.Content>{value.facetdisplay} {icon}</List.Content></Button>
			);
		});

		return (
			<div style={this.props.style}>
				<Page hideFooter>
					<List>
						{lists}
					</List>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action hasApply onApply={(e) => this.onApply(e)} />
			</div>
		);
	}
}

export default Lists;
