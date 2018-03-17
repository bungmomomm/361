import React, { Component } from 'react';
import { Card, Grid, Carousel, Spinner } from '@/components/mobile';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { urlBuilder } from '@/utils';
import _ from 'lodash';

class Promos extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.loadingContent = (
			<div style={{ margin: '20% auto 20% auto' }}>
				<Spinner size='large' />
			</div>
		);
	}

	componentWillReceiveProps(nextProps) {}
	shouldComponentUpdate(nextProps, nextState) {
		return (this.props.promo !== nextProps.promo);
	}

	getBuiltItems = (products) => {
		let fragment = [];
		const itemsList = [];

		console.log('building promo products...');
		// builds items
		products.forEach((item, idx) => {
			const data = {
				key: idx,
				images: item.images,
				productTitle: item.product_title,
				brandName: item.brand.name,
				pricing: {
					discount: item.pricing.formatted.discount,
					...item.pricing
				},
				linkToPdp: urlBuilder.buildPdp(item.product_title, item.product_id)
			};

				// set fragment value
			fragment = ((idx + 1) % 2 !== 0) ? [<Card.CatalogGrid {...data} />] : [...fragment, <Card.CatalogGrid {...data} />];

				// push fragment into
			if ((idx + 1) % 2 === 0 || products.length === (idx + 1)) {
				itemsList.push(fragment);
			}
		});

		return itemsList;
	}

	render() {
		const { promo, loading } = this.props;
		const recommended = this.getBuiltItems(promo.recommended_items.products);
		const similar = this.getBuiltItems(promo.similar_items.products);
		const bestSeller = this.getBuiltItems(promo.best_seller_items.products);
		
		return (
			<div className='flex' style={{ backgroundColor: '#fff', marginTop: '15px' }}>
				{/* ----------------------------	RECOMMENDATION PRODUCTS---------------------------- */}
				{!_.isEmpty(recommended) && (
					<div className='padding--medium-h margin--medium-v'>
						<div className='font-medium'><strong>Anda Mungkin Suka</strong></div>
						{loading && this.loadingContent}
						{!loading && (
							<div className='flex'>{
								<Carousel className='margin--medium-v'>
									{recommended.map((item, i) => <Grid split={2} key={i}>{item}</Grid>)}
								</Carousel>
							}
							</div>
						)}
					</div>
				)}
				{/* ----------------------------	END OF RECOMMENDATION ---------------------------- */}

				{/* ----------------------------	SIMILAR / BEST SELLER ---------------------------- */}
				{!_.isEmpty(similar) && (
					<div className='border-top padding--medium-h margin--medium-v'>
						<div className='margin--medium-v padding--small-h font-medium'><strong>Produk Serupa</strong></div>
						{loading && this.loadingContent}
						{!loading && (
							<div className='flex'>{
								<Carousel className='margin--medium-v'>
									{similar.map((item, i) => <Grid split={2} key={i}>{item}</Grid>)}
								</Carousel>
							}
							</div>
						)}
					</div>
				)}
				{_.isEmpty(similar) && !_.isEmpty(bestSeller) && (
					<div className='border-top padding--medium-h margin--medium-v '>
						<div className='margin--medium-v padding--small-h font-medium'><strong>Produk Terlaris</strong></div>
						{loading && this.loadingContent}
						{!loading && (
							<div className='flex'>{
								<Carousel className='margin--medium-v'>
									{bestSeller.map((item, i) => <Grid split={2} key={i}>{item}</Grid>)}
								</Carousel>
							}
							</div>
						)}
					</div>
				)}
				{/* ----------------------------	END OF SIMILAR / BEST SELLER ---------------------------- */}
			</div>
		);
	}
}

export default withCookies(connect()(Promos));
