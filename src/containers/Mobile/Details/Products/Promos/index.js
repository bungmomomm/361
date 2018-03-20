import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { urlBuilder } from '@/utils';
import _ from 'lodash';
import { Card, Grid, Carousel, Spinner } from '@/components/mobile';
import { Love } from '@/containers/Mobile/Widget';

// import { actions } from '@/state/v4/Lovelist';
// import { Promise } from 'es6-promise';

class Promos extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.isLogin = (typeof this.props.cookies.get('isLogin') === 'string' && this.props.cookies.get('isLogin') === 'true');
		this.token = this.props.cookies.get('user.token');
		this.loadingContent = (
			<div style={{ margin: '20% auto 20% auto' }}>
				<Spinner size='large' />
			</div>
		);
	}

	componentWillReceiveProps(nextProps) {

		// console.log('doing promo will receive....');
		// if ((this.props.promo.recommended_items !== nextProps.promo.recommended_items &&
		// 	this.props.promo.similar_items !== nextProps.promo.similar_items &&
		// 	this.props.promo.best_seller_items !== nextProps.promo.best_seller_items) && (!_.isEmpty(nextProps.promo.recommended_items))) {
		// 	// const { recommended_items } = this.props.promo;
		// 	const { recommended_items, similar_items, best_seller_items } = nextProps.promo;
		// 	const ids = recommended_items.products.map((item) => item.product_id);
		// 	if (!_.isEmpty(similar_items.products)) {
		// 		similar_items.products.forEach((item) => ids.push(item.product_id));
		// 	} else if (_.isEmpty(similar_items.products) && !_.isEmpty(best_seller_items.products)) {
		// 		best_seller_items.products.forEach((item) => ids.push(item.product_id));
		// 	}
			
		// 	if (!_.isEmpty(ids) && this.isLogin) {
		// 		ids.push(nextProps.productId);
		// 		const { dispatch } = nextProps;
		// 		const updateBulkieLovelist = async (productsIds) => {
		// 			const res = await dispatch(actions.bulkieCountByProduct(this.token, productsIds));
		// 			if (res.status === 200 && !_.isEmpty(res.data.data)) {
		// 				recommended_items.products.forEach((item) => {
		// 					const productFound = actions.getBulkItem(res.data.data, item.product_id);
		// 					console.log('productFound: ', productFound);
		// 					if (productFound) item.lovelistStatus = productFound.status;
		// 				});
		// 			}
		// 		};
		// 		updateBulkieLovelist(ids);
		// 	}
		// }
	}
	shouldComponentUpdate(nextProps, nextState) {
		return (this.props.promo.recommended_items !== nextProps.promo.recommended_items && 
			this.props.promo.similar_items !== nextProps.promo.similar_items && 
			this.props.promo.best_seller_items !== nextProps.promo.best_seller_items);
	}

	getBuiltItems = (products) => {
		let fragment = [];
		const itemsList = [];

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
				linkToPdp: urlBuilder.buildPdp(item.product_title, item.product_id),
				love: (
					<Love
						status={item.lovelistStatus}
						data={item.product_id}
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
