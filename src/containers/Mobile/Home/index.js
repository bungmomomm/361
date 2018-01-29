import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import {
	Header, Carousel, Tabs,
	Page, Level, Button, Grid, Article,
	Navigation, Svg, Image, Notification
} from '@/components/mobile';
import styles from './home.scss';
import { actions } from '@/state/v4/Home';
import Shared from '@/containers/Mobile/Shared';

class Home extends Component {
	static initApp(token, dispatch) {
		dispatch(new actions.initAction(token));
	}

	static mainData(token, dispatch, activeSegment) {
		dispatch(new actions.mainAction(token, activeSegment));
	}

	static recomendation(token, dispatch, activeSegment) {
		dispatch(new actions.recomendationAction(this.userCookies, activeSegment));
	}
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			current: 1, // wanita
			notification: {
				show: true
			}
		};

		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
	}

	componentDidMount() {
		this.initPage(1, this.props.dispatch);
	}

	handlePick(current) {
		this.setState({ current });
		this.initPage(current, this.props.dispatch);
		
	}

	initPage(activeSegment = 1, dispatch) {
		this.constructor.initApp(this.userCookies, dispatch);
		this.constructor.mainData(this.userCookies, dispatch, activeSegment);
		this.constructor.recomendation(this.userCookies, dispatch, activeSegment);
	}

	mappingSegmentValue() {
		return this.state.current === 1 ? 'woman' : (this.state.current === 2 ? 'man' : 'kids');
	}

	renderFeatureBanner() {
		const { home } = this.props;
		const segment = this.mappingSegmentValue();
		if (!_.isEmpty(home.allSegmentData[segment]) 
			&& typeof home.allSegmentData[segment].featuredBanner !== 'undefined' 
			&& home.allSegmentData[segment].featuredBanner.length > 0) {
			return (
				<Carousel>
					{
						home.allSegmentData[segment].featuredBanner.map(({ images }, a) => (
							<Image key={a} alt='slide' src={images.mobile} />
						))
					}
				</Carousel>
			);
		}
		return null;
	}

	renderRecommendation(type = 'new_arrival_products') {
		/**
		 * Registered object 
		 * new_arrival_products, 
		 * best_seller_products,
		 * recommended_products,
		 * recently_viewed_products
		 * */ 

		const obj = _.camelCase(type);
		const { home } = this.props;
		const segment = this.mappingSegmentValue();
		const segmentData = home.allSegmentData[segment];
		// const datas = _.chain(home).get(`allSegmentData.${segment}.hashtag`);
		if (!_.isEmpty(segmentData) && typeof segmentData.recomendationData !== 'undefined' && segmentData.recomendationData[obj].length > 0) {
			return (
				<Grid split={3}>
					{
						segmentData.recomendationData[obj].map(({ images, pricing }, e) => (
							<div key={e}>
								<Image lazyload alt='thumbnail' src={images.mobile} />
								<Button className={styles.btnThumbnail} transparent color='secondary' size='small'>{pricing.formatted.effective_price}</Button>
							</div>
						))
					}
				</Grid>
			);
		}
		return null;
	}

	renderHashtag() {
		const { home } = this.props;
		const segment = this.mappingSegmentValue();
		const datas = _.chain(home).get(`allSegmentData.${segment}.hashtag`);
		if (!datas.isEmpty().value()) {
			return (
				<Carousel>
					{
						datas.value().images.map(({ images, link }, b) => (
							<div key={b} ><Image lazyload alt='thumbnail' src={images.mobile} /></div>
						))
					}
				</Carousel>
			);
		}
		return null;
	}

	renderOOTD() {
		const { home } = this.props;
		const segment = this.mappingSegmentValue();
		if (!_.isEmpty(home.allSegmentData[segment]) && home.allSegmentData[segment].middleBanner.length > 0) {
			return (
				<div>
					{
						home.allSegmentData[segment].middleBanner.map(({ images, link }, c) => (
							<Image key={c} lazyload alt='banner' src={images.mobile} />
						))
					}
				</div>
			);
		}
		return null;
	}

	renderBottomBanner(id = 1) {
		const { home } = this.props;
		const segment = this.mappingSegmentValue();
		let bottomBanner = [];
		if (!_.isEmpty(home.allSegmentData[segment]) 
			&& (home.allSegmentData[segment].bottomBanner1.length && home.allSegmentData[segment].bottomBanner2.length)) {
			bottomBanner = id === 1 ? home.allSegmentData[segment].bottomBanner1 : home.allSegmentData[segment].bottomBanner2;
		}
		if (bottomBanner.length > 0) {
			return (
				<div className='margin--medium'>
					{
						bottomBanner.map(({ images, link }, d) => (
							<Image key={d} lazyload alt='banner' src={images.mobile} />
						))
					}
				</div>
			);
		}

		return null;

	}

	renderFeaturedBrands() {
		const { home } = this.props;
		const segment = this.mappingSegmentValue();
		if (!_.isEmpty(home.allSegmentData[segment]) 
			&& home.allSegmentData[segment].featuredBrand.length > 0) {
			return (
				<Grid split={3}>
					{
						home.allSegmentData[segment].featuredBrand.map(({ images, link }, e) => (
							<div key={e}>
								<Image lazyload alt='thumbnail' src={images.mobile} />
							</div>
						))
					}
				</Grid>
			);
		}

		return null;
	}

	renderMozaic() {
		const { home } = this.props;
		const segment = this.mappingSegmentValue();
		if (!_.isEmpty(home.allSegmentData[segment]) 
			&& !_.isEmpty(home.allSegmentData[segment].mozaic)) {
			return (
				<Carousel>
					{
						home.allSegmentData[segment].mozaic.posts.map((detail, i) => (
							<Article posts={detail} key={i} />
						))
					}
				</Carousel>
			);
		}

		return null;
	}

	render() {
		const renderSectionHeader = (title, options) => {
			return (
				<Level>
					<Level.Left><div className={styles.headline}>{title}</div></Level.Left>
					<Level.Right><Link to={options.url || '/'} className={styles.readmore}>{options ? options.title : 'Lihat Semua'}<Svg src='ico_arrow_right_small.svg' /></Link></Level.Right>
				</Level>
			);
		};
		const { shared } = this.props;
		return (
			<div style={this.props.style}>
				<Page>
					<Tabs
						current={this.state.current}
						variants={this.props.home.segmen}
						onPick={(e) => this.handlePick(e)}
					/>

					<Notification color='pink' show={this.state.notification.show} onClose={(e) => this.setState({ notification: { show: false } })}>
						<div>Up to 70% off Sale</div>
						<p>same color on all segments</p>
					</Notification>

					{this.renderFeatureBanner()}

					{renderSectionHeader('#MauGayaItuGampang', { title: 'See all', url: 'http://www.google.com' })}

					{this.renderHashtag()}

					{this.renderOOTD()}
					{renderSectionHeader('New Arrival', { title: 'See all', url: 'http://www.google.com' })}
					{ this.renderRecommendation('new_arrival_products')}
					{this.renderBottomBanner(1)}
					{renderSectionHeader('Best Seller', { title: 'See all', url: 'http://www.google.com' })}
					{ this.renderRecommendation('best_seller_products')}
					{this.renderBottomBanner(2)}
					{renderSectionHeader('Featured Brands', { title: 'See all', url: 'http://www.google.com' })}
					{this.renderFeaturedBrands()}

					{renderSectionHeader('Mozaic Megazine', { title: 'See all', url: 'http://www.google.com' })}
					{this.renderMozaic()}
				</Page>
				<Header lovelist={shared.totalLovelist} />
				<Navigation active='Home' />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		...state
	};
};

const doAfterAnonymous = (props) => {
	console.log('code here if you need anon token or token');
	// this.initPage(activeSegment = 1, dispatch);
};

export default withCookies(connect(mapStateToProps)(Shared(Home, doAfterAnonymous)));
