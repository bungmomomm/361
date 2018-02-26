import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Page, Card } from '@/components/mobile';
import styles from './search.scss';
import { Link } from 'react-router-dom';

class SearchNotFound extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;

		this.inlineStyle = {
			textAlign: 'center',
			margin: '10px auto 10px auto'
		};
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
						{banner.data.mobile}
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
					<div style={this.inlineStyle}>
						<hr />
						<div>[Recommended Products]</div>
						<p>{products.title}</p>
						{
							products.data.map((product, index) => (
								<Card.CatalogGrid
									key={index}
									images={product.images}
									productTitle={product.product_title}
									brandName={product.brand}
									pricing={product.pricing}
								/>
							))
						}
						<hr />
					</div>
				);
			}
		}

		return productView;
	}

	render() {
		const { keyword } = this.props;

		return (
			<Page>
				<div className={styles.container} >
					<div style={this.inlineStyle}>[Image]</div>
					<div style={this.inlineStyle}>
						{'Mohon maaf hasil pencarian untuk "'}{keyword || ''}
						{ '" tidak dapat ditemukan. Silakan periksa pengejaan kata, atau menggunakan kata kunci lain!'}
					</div>
					<div><button><Link to={{ pathname: '/search' }}>Cari kembali</Link></button></div>
					{this.bannerRender()}
					<div style={this.inlineStyle}>
						Jika anda mengalami kesulitan silahkan hubungi<br />
						<strong>Customer Support kami di: 1500038</strong>
					</div>
					{this.productRender()}
					<div style={this.inlineStyle}>[Footer]</div>
				</div>
			</Page>
		);
	}
};

export default SearchNotFound;
