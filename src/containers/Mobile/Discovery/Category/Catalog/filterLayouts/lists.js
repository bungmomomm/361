import React, { PureComponent } from 'react';
import { Header, Page, Svg, List } from '@/components/mobile';
import { Link } from 'react-router-dom';
import Action from './action';

class Lists extends PureComponent {
	render() {
		const HeaderPage = {
			left: (
				<Link to='/catalogcategory'>
					<Svg src={'ico_close.svg'} />
				</Link>
			),
			center: 'Filter',
			right: null
		};

		return (
			<div style={this.props.style}>
				<Page>
					<List>
						<List.Content>Style</List.Content>
					</List>
					<List>
						<List.Content>Brand</List.Content>
					</List>
					<List>
						<List.Content>Warna</List.Content>
					</List>
					<List>
						<List.Content>Ukuran</List.Content>
					</List>
					<List>
						<List.Content>Lokasi</List.Content>
					</List>
					<List>
						<List.Content>Layanan Pengiriman</List.Content>
					</List>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action />
			</div>
		);
	}
}

export default Lists;
