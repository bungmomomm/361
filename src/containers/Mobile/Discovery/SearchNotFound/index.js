import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import { GridView } from '@/containers/Mobile/Discovery/View';
import handler from '@/containers/Mobile/Shared/handler';

import { Page, Svg, Level, Button } from '@/components/mobile';

@handler
class SearchNotFound extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
	}

	forceLoginNow() {
		const { forceLoginNow } = this.props;
		if (forceLoginNow) {
			forceLoginNow();
		}
	}

	bannerRender() {
		const { data } = this.props;
		
		let bannerView = null;
		if (data) {
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
		if (data && data.recommendationData) {
			const productList = data.recommendationData.products;
			productView = (
				<div className='margin--large-v margin--none-t'>
					<Level>
						<Level.Left><strong className='font-medium'>{data.title || 'Produk Rekomendasi'}</strong></Level.Left>
						<Level.Right>
							<Link to='/promo/recommended_products' className='text-muted font-small'>
								LIHAT SEMUA<Svg src='ico_arrow_right_small.svg' />
							</Link>
						</Level.Right>
					</Level>
					<GridView
						carousel
						forceLoginNow={() => this.forceLoginNow()}
						products={productList}
					/>
				</div>
			);
		}

		return productView;
	}

	render() {
		const { keyword, renderForeverBanner } = this.props;

		return (
			<Page color='white'>
				{renderForeverBanner()}
				<div className='text-center' >
					<div className='margin--medium-v flex-center flex-middle'><Svg src='ico_no_result-search.svg' /></div>
					<div className=' margin--small-v'>
						<strong className='font-bold font-large'>SORRY!</strong>
					</div>
					<div className='--disable-flex padding--medium-h' style={{ overflowWrap: 'break-word' }}>
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
