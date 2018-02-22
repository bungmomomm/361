import React, { PureComponent } from 'react';
import { Header, Page, Svg, List, Button, Badge } from '@/components/mobile';
import Action from './action';
import _ from 'lodash';
import { isHexColor, renderIf } from '@/utils';

class Color extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			data: props.data || []
		};
		this.props = props;
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
		const { onClose, data } = this.props;
		const HeaderPage = {
			left: (
				<Button onClick={onClose}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: 'Warna',
			right: null
		};
		const dataList = _.map(data, (color, key) => {
			const selected = color.is_selected ? <Svg src='ico_check.svg' /> : <Svg src='ico_empty.svg' />;
			return (
				<Button key={key} align='left' wide onClick={(e) => this.onClick(e, color)}>
					<List.Content>
						{renderIf(isHexColor(color.colorcode))(
							<Badge circle colorCode={color.colorcode} size='medium' filter={color} />
						)}
						{renderIf(!isHexColor(color.colorcode))(
							<div>
								img
							</div>
						)}
						{color.facetdisplay} {selected}
					</List.Content>
				</Button>
			);
		});

		return (
			<div style={this.props.style}>
				<Page>
					<List>
						{dataList}
					</List>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action hasApply onApply={(e) => this.onApply(e)} />
			</div>
		);
	}
}

export default Color;
