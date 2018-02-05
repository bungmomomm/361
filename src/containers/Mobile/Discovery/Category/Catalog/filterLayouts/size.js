import React, { PureComponent } from 'react';
import { Header, Page, Svg, List, Button } from '@/components/mobile';
import Action from './action';
import _ from 'lodash';

class Size extends PureComponent {
	render() {
		const { onClose, onClick, filters } = this.props;
		const sizes = _.filter(filters.facets, (facet) => facet.id === 'size');
		let sizeFilters = [];
		if (sizes.length > 0) {
			sizeFilters = sizes[0].data;
		}
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
		
		const sizeList = _.map(sizeFilters, (size) => {
			const icon = size.is_selected ? <Svg src='ico_check.svg' /> : <Svg src='ico_empty.svg' />;
			return (
				<List><Button align='left' wide onClick={(e) => onClick(e, size)}><List.Content>{size.facetdisplay} {icon}</List.Content></Button></List>
			);
		});

		return (
			<div style={this.props.style}>
				<Page>
					{sizeList}
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action />
			</div>
		);
	}
}

export default Size;
