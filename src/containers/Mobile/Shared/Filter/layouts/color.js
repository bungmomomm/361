import React, { PureComponent } from 'react';
import { Header, Page, Svg, List, Button, Badge } from '@/components/mobile';
import Action from './action';
import _ from 'lodash';

class Color extends PureComponent {
	render() {
		const { onClose, onClick, data } = this.props;
		const HeaderPage = {
			left: (
				<Button onClick={onClose}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: 'Warna',
			right: null
		};
		const colorList = _.map(data, (color, key) => {
			const icon = color.is_selected ? <Svg src='ico_check.svg' /> : <Svg src='ico_empty.svg' />;
			return (
				<Button key={key} align='left' wide onClick={(e) => onClick(e, color)}><List.Content><Badge circle colorCode={color.colorcode} size='medium' filter={color} />{color.facetdisplay} {icon}</List.Content></Button>
			);
		});

		return (
			<div style={this.props.style}>
				<Page>
					<List>
						{colorList}
					</List>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action />
			</div>
		);
	}
}

export default Color;
