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

	static promoRecommendation(token, dispatch) {
		dispatch(new actions.promoRecommendationAction({
			token: this.userCookies
		}));
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
		this.initPage = this.initPage.bind(this);
	}

	componentDidMount() {
		this.initPage();
		this.constructor.promoRecommendation(this.userCookies, this.props.dispatch);
	}

	handlePick(current) {
		this.setState({ current });
		this.initPage(current);

	}

	initPage(activeSegment = 1) {
		this.constructor.initApp(this.userCookies, this.props.dispatch);
		this.constructor.mainData(this.userCookies, this.props.dispatch, activeSegment);
	}

	renderFeatureBanner() {
		const { home } = this.props;
		if (home.mainData.featuredBanner.length > 0) {
			return (
				<Carousel>
					{
						home.mainData.featuredBanner.map(({ images }, a) => (
							<Image key={a} alt='slide' src={images.mobile} />
						))
					}
				</Carousel>
			);
		}
		return null;
	}

	renderNewArrival() {
		const { home } = this.props;
		if (home.promoRecommendationData.newArrivalProducts.length > 0) {
			return (
				<Grid split={3}>
					{
						home.promoRecommendationData.newArrivalProducts.map(({ images, pricing }, e) => (
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

	renderBestSeller() {
		const { home } = this.props;
		if (home.promoRecommendationData.bestSellerProducts.length > 0) {
			return (
				<Grid split={3}>
					{
						home.promoRecommendationData.bestSellerProducts.map(({ images, pricing }, e) => (
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

	renderRecommendation() {
		const { home } = this.props;
		if (home.promoRecommendationData.recommendedProducts.length > 0) {
			return (
				<Grid split={3}>
					{
						home.promoRecommendationData.recommendedProducts.map(({ images, pricing }, e) => (
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

	renderRecentlyViewed() {
		const { home } = this.props;
		if (home.promoRecommendationData.recentlyViewedProducts.length > 0) {
			return (
				<Grid split={3}>
					{
						home.promoRecommendationData.recentlyViewedProducts.map(({ images, pricing }, e) => (
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
		if (typeof home.mainData.hashtag.images !== 'undefined' && home.mainData.hashtag.images.length > 0) {
			return (
				<Carousel>
					{
						home.mainData.hashtag.images.map(({ images, link }, b) => (
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
		if (home.mainData.middleBanner.length > 0) {
			return (
				<div>
					{
						home.mainData.middleBanner.map(({ images, link }, c) => (
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
		const bottomBanner = id === 1 ? home.mainData.bottomBanner1 : home.mainData.bottomBanner2;
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
		if (home.mainData.featuredBrand.length > 0) {
			return (
				<Grid split={3}>
					{
						home.mainData.featuredBrand.map(({ images, link }, e) => (
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
		if (!_.isEmpty(home.mainData.mozaic)) {
			return (
				<Carousel>
					{
						home.mainData.mozaic.posts.map((detail, i) => (
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

					{/* {this.renderOOTD()} */}
					{renderSectionHeader('New Arrival', { title: 'See all', url: 'http://www.google.com' })}
					{ this.renderNewArrival() }
					{this.renderBottomBanner(1)}
					{renderSectionHeader('Best Seller', { title: 'See all', url: 'http://www.google.com' })}
					{ this.renderBestSeller() }
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

export default withCookies(connect(mapStateToProps)(Shared(Home)));
