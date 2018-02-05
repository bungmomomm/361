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
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			current: 'wanita', // wanita
			notification: {
				show: true
			}
		};

		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
	}

	componentDidMount() {
		this.initApp();
	}

	handlePick(current) {
		const { segmen } = this.props.home;
		const { dispatch } = this.props;
		const willActiveSegment = segmen.find(e => e.id === current);
		this.setState({ current: willActiveSegment.key });

		dispatch(new actions.mainAction(this.userCookies, willActiveSegment));
		dispatch(new actions.recomendationAction(this.userCookies, willActiveSegment));
	}

	initApp() {
		const { dispatch } = this.props;
		dispatch(new actions.initAction(this.userCookies))
		.then(segmentData => {
			const activeSegment = segmentData.find(e => e.key === this.state.current);
			
			dispatch(new actions.mainAction(this.userCookies, activeSegment));
			dispatch(new actions.recomendationAction(this.userCookies, activeSegment));
		});
	}

	renderSectionHeader(title, options) {
		const { home } = this.props;
		console.log(home);
		return (
			<Level>
				<Level.Left><div className={styles.headline}>{title}</div></Level.Left>
				<Level.Right><Link to={options.url || '/'} className={styles.readmore}>{options ? options.title : 'Lihat Semua'}<Svg src='ico_arrow_right_small.svg' /></Link></Level.Right>
			</Level>
		);
	}

	renderFeatureBanner() {
		const { home } = this.props;
		const segment = home.activeSegment.key;
		const featuredBanner = _.chain(home).get(`allSegmentData.${segment}`).get('featuredBanner');
		if (!featuredBanner.isEmpty().value()) {
			return (
				<Carousel>
					{
						featuredBanner.value().map(({ images }, a) => (
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
		let title = ''; 
		let link = '';
		let label = '';
		switch (type) {
		case 'best_seller_products':
			title = 'LIHAT SEMUA';
			link = '/best_seller';
			label = 'Best Seller';
			break;
		case 'recommended_products':
			title = 'LIHAT SEMUA';
			link = '/recommended_products';
			label = 'Recommmended';
			break;
		case 'recently_viewed_products':
			title = 'LIHAT SEMUA';
			link = '/recent_view';
			label = 'Recently Viewed';
			break;
		default: 
			title = 'LIHAT SEMUA';
			link = '/new_arrival';
			label = 'New Arrival';
		}

		const obj = _.camelCase(type);
		const { home } = this.props;
		const segment = home.activeSegment.key;
		const datas = _.chain(home).get(`allSegmentData.${segment}`).get('recomendationData').get(obj);
		if (!datas.isEmpty().value()) {
			const header = this.renderSectionHeader(label, {
				title, 
				url: link
			});
			return (
				<div>
					{ header }
					<Grid split={3}>
						{
							datas.value().map(({ images, pricing }, e) => (
								<div key={e}>
									<Image lazyload alt='thumbnail' src={images.mobile} />
									<Button className={styles.btnThumbnail} transparent color='secondary' size='small'>{pricing.formatted.effective_price}</Button>
								</div>
							))
						}
					</Grid>
				</div>
			);
		}
		return null;
	}

	renderHashtag() {
		const { home } = this.props;
		const segment = home.activeSegment.key;
		const datas = _.chain(home).get(`allSegmentData.${segment}.hashtag`);
		if (!datas.isEmpty().value()) {
			const header = this.renderSectionHeader(datas.value().hashtag, {
				title: datas.value().mainlink.text, 
				url: '/hashtags'
			});
			return (
				<div>
					{ header }
					<Carousel>
						{
							datas.value().images.map(({ images, link }, b) => (
								<div key={b} ><Image lazyload alt='thumbnail' src={images.mobile} /></div>
							))
						}
					</Carousel>
				</div>
			);
		}
		return null;
	}

	renderOOTD() {
		const { home } = this.props;
		const segment = home.activeSegment.key;
		const datas = _.chain(home).get(`allSegmentData.${segment}.middleBanner`);
		if (!datas.isEmpty().value()) {
			return (
				<div>
					{
						datas.value().map(({ images, link }, c) => (
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
		const segment = home.activeSegment.key;
		let bottomBanner = [];
		const dataBottomBanner1 = _.chain(home).get(`allSegmentData.${segment}.bottomBanner1`);
		const dataBottomBanner2 = _.chain(home).get(`allSegmentData.${segment}.bottomBanner2`);
		if (!dataBottomBanner1.isEmpty().value() && !dataBottomBanner2.isEmpty().value()) {
			bottomBanner = id === 1 ? dataBottomBanner1.value() : dataBottomBanner2.value();
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
		const segment = home.activeSegment.key;
		const featuredBrand = _.chain(home).get(`allSegmentData.${segment}.featuredBrand`);
		if (!featuredBrand.isEmpty().value()) {
			return (
				<Grid split={3}>
					{
						featuredBrand.value().map(({ images, link }, e) => (
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
		const segment = home.activeSegment.key;
		const mozaic = _.chain(home).get(`allSegmentData.${segment}.mozaic`);

		if (!mozaic.isEmpty().value()) {
			const header = this.renderSectionHeader('Mozaic Megazine', {
				title: mozaic.value().mainlink.text,
				url: mozaic.value().mainlink.link
			});
			return (
				<div>
					{
						header
					}
					<Carousel>
						{
							mozaic.value().posts.map((detail, i) => (
								<Article posts={detail} key={i} />
							))
						}
					</Carousel>
				</div>
				
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

					{this.renderHashtag()}

					{this.renderOOTD()}
					
					{ this.renderRecommendation('new_arrival_products')}
					{ this.renderBottomBanner(1) }
					
					{ this.renderRecommendation('best_seller_products')}
					{ this.renderBottomBanner(2) }
					{renderSectionHeader('Featured Brands', { title: 'See all', url: 'http://www.google.com' })}
					{ this.renderFeaturedBrands() }
					
					{this.renderMozaic()}
				</Page>
				<Header lovelist={shared.totalLovelist} value={this.props.search.keyword} />
				<Navigation active='Home' />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		home: state.home, 
		search: state.search, 
		shared: state.shared
	};
};

const doAfterAnonymous = (props) => {
	console.log('code here if you need anon token or token');
	// this.initPage(activeSegment = 1, dispatch);
};

export default withCookies(connect(mapStateToProps)(Shared(Home, doAfterAnonymous)));
