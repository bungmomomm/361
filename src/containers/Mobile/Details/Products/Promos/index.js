import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { urlBuilder } from '@/utils';
import _ from 'lodash';
import { Card, Grid, Carousel, Spinner } from '@/components/mobile';
import { Love } from '@/containers/Mobile/Widget';
import cookiesLabel from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Promos extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.isLogin = (typeof this.props.cookies.get(cookiesLabel.isLogin) === 'string' && this.props.cookies.get(cookiesLabel.isLogin) === 'true');
		this.token = this.props.cookies.get(cookiesLabel.userToken);
		this.loadingContent = (
			<div style={{ margin: '20% auto 20% auto' }}>
				<Spinner size='large' />
			</div>
		);
	}

	shouldComponentUpdate(nextProps, nextState) {
		const { recommended_items, similar_items, best_seller_items } = nextProps.promo;
		return (this.props.promo.recommended_items.products !== recommended_items.products &&
			this.props.promo.similar_items.products !== similar_items.products &&
			this.props.promo.best_seller_items !== best_seller_items.products);
	}

	getBuiltItems = (products) => {
		let fragment = [];
		const itemsList = [];
		const productClicked = (e) => console.log('Ouch, don\'t do that!!!');

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
				productOnClick: productClicked,
				linkToPdp: urlBuilder.buildPdp(item.product_title, item.product_id),
				love: (
					<Love
						status={item.lovelistStatus}
						data={item.product_id}
						inline={false}
						total={item.lovelistTotal}
						onNeedLogin={this.props.loginNow}
					/>
				)
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
					<div className='margin--medium-v'>
						<div className='font-medium padding--medium-h'><strong>Anda Mungkin Suka</strong></div>
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
					<div className='border-top margin--medium-v'>
						<div className='margin--medium-v padding--medium-h font-medium'><strong>Produk Serupa</strong></div>
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
					<div className='border-top margin--medium-v '>
						<div className='margin--medium-v padding--medium-h font-medium'><strong>Produk Terlaris</strong></div>
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
