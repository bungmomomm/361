import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import { Page, Card, Notification, Image, Svg, Grid, Level, Carousel } from '@/components/mobile';
import { hyperlink } from '@/utils';
// import styles from './search.scss';

class SearchNotFound extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
	}

	bannerRender() {
		const { data } = this.props;
		let bannerView = null;
		if (data && data.length > 0) {
			const banner = _.find(data, { type: 'promo_banner' }) || false;
			if (banner) {
				bannerView = (
					<div style={this.inlineStyle}>
						<hr />
						<div>[Promo Banner]</div>
						<p>{banner.title}</p>
						{banner.data.thumbnail}
						<hr />
					</div>
				);
			}
		}

		return bannerView;
	}

	productRender() {
		const { data } = this.props;
		let productView = null;
		if (data && data.length > 0) {
			const products = _.find(data, { type: 'recommended' }) || false;
			if (products) {
				productView = (
					<div className='margin--large-v margin--none-t'>
						<Level>
							<Level.Left><strong className='font-medium'>Produk Rekomendasi</strong></Level.Left>
							<Level.Right>
								<Link to='/promo/recommended_products' className='text-muted font-small'>
									LIHAT SEMUA<Svg src='ico_arrow_right_small.svg' />
								</Link>
							</Level.Right>
						</Level>
						<Grid split={1}>
							<Carousel slidesToShow={2}>
								{
									_.map(products.data, (product, index) => {
										const linkToPdp = hyperlink('', ['product', product.product_id], null);
										return (
											<Card.CatalogGrid
												key={index}
												style={{ width: '100%' }}
												images={product.images}
												productTitle={product.product_title}
												brandName={product.brand.name}
												pricing={product.pricing}
												linkToPdp={linkToPdp}
											/>
										);
									})
								}
							</Carousel>
						</Grid>
					</div>
				);
			}
		}

		return productView;
	}

	render() {
		const { keyword } = this.props;

		return (
			<Page color='white'>
				<div className='text-center' >
					<div className='margin--medium-v flex-center flex-middle'><Svg src='mm_ico_no_404_alt.svg' /></div>
					<div className=' margin--small-v'>
						<strong className='font-bold font-large'>SORRY!</strong>
					</div>
					<div>
						{'Mohon maaf hasil pencarian untuk "'}{keyword || ''}
						{ '" tidak dapat ditemukan. Silakan periksa pengejaan kata, atau menggunakan kata kunci lain!'}
					</div>
					<div className='flex-row margin--large-v margin--none-b'>
						<Link className='border-white-right' to='/'><Image local src='temp/promo404-1.jpg' /></Link>
						<Link to='/'><Image local src='temp/promo404-2.jpg' /></Link>
					</div>
					<Notification color='yellow' show disableClose>
						<div className='margin--medium-v padding--medium-h' style={{ color: '#F57C00' }}>
							Jika anda mengalami kesulitan silahkan hubungi<br />
							<strong>Customer Support kami di: 1500038</strong>
						</div>
					</Notification>
					{this.productRender()}
				</div>
			</Page>
		);
	}
};

export default SearchNotFound;
