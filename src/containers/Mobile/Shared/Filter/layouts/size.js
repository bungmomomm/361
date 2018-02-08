import React, { PureComponent } from 'react';
import { Header, Page, Svg, List, Button } from '@/components/mobile';
import Action from './action';
import _ from 'lodash';

class Size extends PureComponent {
	render() {
		const { onClose, onClick, data } = this.props;
		const HeaderPage = {
			left: (
				<Button onClick={onClose}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: 'Ukuran',
			right: null
		};

		// to do: use below logic when implement
		// const icon = <Svg src='ico_check.svg' />;
		
		const sizeList = _.map(data, (size, id) => {
			const icon = size.is_selected ? <Svg src='ico_check.svg' /> : <Svg src='ico_empty.svg' />;
			return (
				<Button key={id} align='left' wide onClick={(e) => onClick(e, size)}><List.Content>{size.facetdisplay} {icon}</List.Content></Button>
			);
		});

		return (
			<div style={this.props.style}>
				<Page>
					<List>
						{sizeList}
					</List>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action />
			</div>
		);
	}
}

export default Size;
