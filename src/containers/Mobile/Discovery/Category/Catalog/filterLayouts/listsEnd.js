import React, { PureComponent } from 'react';
import { Header, Page, Svg, List } from '@/components/mobile';
import { Link } from 'react-router-dom';

class ListsEnd extends PureComponent {
	render() {
		const { params } = this.props;
		
		const HeaderPage = {
			left: (
				<Link to='/catalogcategory'>
					<Svg src={'ico_arrow-back-left.svg'} />
				</Link>
			),
			center: params.header.title,
			right: null
		};

		return (
			<div style={this.props.style}>
				<Page>
					<List>
						<List.Content>
							Style
							<Svg src='ico_check.svg' />
						</List.Content>
					</List>
					<List>
						<List.Content>
							Brand
							<Svg src='ico_empty.svg' />
						</List.Content>
					</List>
					<List>
						<List.Content>
							Warna
							<Svg src='ico_empty.svg' />
						</List.Content>
					</List>
					<List>
						<List.Content>
							Ukuran
							<Svg src='ico_empty.svg' />
						</List.Content>
					</List>
					<List>
						<List.Content>
							Lokasi
							<Svg src='ico_empty.svg' />
						</List.Content>
					</List>
					<List>
						<List.Content>
							Layanan Pengiriman
							<Svg src='ico_empty.svg' />
						</List.Content>
					</List>
				</Page>
				<Header.Modal {...HeaderPage} />
			</div>
		);
	}
}

export default ListsEnd;
