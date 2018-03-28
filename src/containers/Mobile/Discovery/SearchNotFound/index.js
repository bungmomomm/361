import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import { Page, Card, Svg, Grid, Level, Carousel, Button } from '@/components/mobile';
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
					<div dangerouslySetInnerHTML={{ __html: banner.data.original }} />
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
					<div className='margin--medium-v flex-center flex-middle'><Svg src='ico_no_result-search.svg' /></div>
					<div className=' margin--small-v'>
						<strong className='font-bold font-large'>SORRY!</strong>
					</div>
					<div className='--disable-flex padding--medium-h'>
						Mohon maaf hasil pencarian untuk <br />
						<strong>{keyword || ''}</strong> tidak dapat ditemukan <br />
						<br />
						Silakan periksa pengejaan kata, atau menggunakan <br />
						kata kunci lain!
					</div>
					<span className='margin--medium-v'>
						<Button to='/search' inline size='medium' color='secondary'>CARI KEMBALI</Button>
					</span>
					{this.bannerRender()}
					{this.productRender()}
				</div>
			</Page>
		);
	}
};

export default SearchNotFound;
