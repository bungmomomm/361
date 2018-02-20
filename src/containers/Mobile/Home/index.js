import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link, Redirect } from 'react-router-dom';
import _ from 'lodash';
import SwipeReact from 'swipe-react';
import {
	Header, Carousel, Tabs,
	Page, Level, Button, Grid, Article,
	Navigation, Svg, Image
} from '@/components/mobile';
import styles from './home.scss';
import { actions } from '@/state/v4/Home';
import { actions as sharedActions } from '@/state/v4/Shared';
import Shared from '@/containers/Mobile/Shared';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import CONST from '@/constants';

const renderSectionHeader = (title, options) => {
	return (
		<Level>
			<Level.Left><div className={styles.headline}>{title}</div></Level.Left>
			<Level.Right><Link to={options.url || '/'} className={styles.readmore}>{options ? options.title : 'Lihat Semua'}<Svg src='ico_arrow_right_small.svg' /></Link></Level.Right>
		</Level>
	);
};


class Home extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			notification: {
				show: true
			},
			direction: ''
		};

		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');

		SwipeReact.config({
			left: () => {
				this.setState({
					direction: 'left'
				});
			},
			right: () => {
				this.setState({
					direction: 'right'
				});
			}
		});
		this.isLogin = this.props.cookies.get('isLogin');
	}

	handlePick(current) {
		const { segmen } = this.props.home;
		const { dispatch } = this.props;
		const willActiveSegment = segmen.find(e => e.id === current);
		// this.setState({ current: willActiveSegment.key });
		dispatch(new sharedActions.setCurrentSegment(willActiveSegment.key));
		dispatch(new actions.mainAction(this.userCookies, willActiveSegment));
		dispatch(new actions.recomendationAction(this.userCookies, willActiveSegment));
	}

	renderHeroBanner() {
		const { home } = this.props;
		const segment = home.activeSegment.key;
		const featuredBanner = _.chain(home).get(`allSegmentData.${segment}`).get('heroBanner');
		if (!featuredBanner.isEmpty().value()) {

			const images = featuredBanner.value()[0].images;
			const link = featuredBanner.value()[0].link.target;
			return (
				<Link to={link}>
					<div>
						<Image src={images.thumbnail} onClick={e => this.handleLink(link)} />
					</div>
				</Link>
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
		const title = 'LIHAT SEMUA';
		let link = '';
		let label = '';
		switch (type) {
		case 'best_seller_products':
			link = '/promo/best_seller'; label = 'Product Terlaris';
			break;
		case 'recommended_products':
			link = '/promo/recommended_products'; label = 'Recommmended';
			break;
		case 'recently_viewed_products':
			link = '/promo/recent_view'; label = 'Recently Viewed';
			break;
		default:
			link = '/promo/new_arrival'; label = 'Terbaru';
		}

		const obj = _.camelCase(type);
		const { home } = this.props;
		const segment = home.activeSegment.key;
		const datas = _.chain(home).get(`allSegmentData.${segment}`).get('recomendationData').get(obj);

		if (!datas.isEmpty().value()) {
			const header = renderSectionHeader(label, {
				title,
				url: link
			});
			return (
				<div>
					{ header }
					<Grid split={3} bordered>
						{
							datas.value().map(({ images, pricing }, e) => (
								<div key={e}>
									<Image lazyload alt='thumbnail' src={images[0].thumbnail} />
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
		if (!datas.isEmpty().value() && datas.value().id !== '') {
			const header = renderSectionHeader(datas.value().hashtag, {
				title: datas.value().mainlink.text,
				url: '/hashtags'
			});
			return (
				<div>
					{ header }
					<Image lazyload alt='thumbnail' src={datas.value().images[0].thumbnail} />
				</div>
			);
		}
		return null;
	}

	renderSquareBanner() {
		const { home } = this.props;
		const segment = home.activeSegment.key;
		const datas = _.chain(home).get(`allSegmentData.${segment}.squareBanner`);
		if (!datas.isEmpty().value()) {
			return (
				<div>
					{
						datas.value().map(({ images, link }, c) => (
							<Image key={c} lazyload alt='banner' src={images.thumbnail} />
						))
					}
				</div>
			);
		}
		return null;
	}

	renderBottomBanner(position = 'top') {
		const { home } = this.props;
		const segment = home.activeSegment.key;
		let bottomBanner = [];
		const dataTop = _.chain(home).get(`allSegmentData.${segment}.topLanscape`);
		const dataBottm = _.chain(home).get(`allSegmentData.${segment}.bottomLanscape`);
		if (!dataTop.isEmpty().value() && !dataBottm.isEmpty().value()) {
			bottomBanner = position === 'top' ? dataTop.value() : dataBottm.value();
		}
		if (bottomBanner.length > 0) {
			return (
				<div className='margin--medium'>
					{
						bottomBanner.map(({ images, link }, d) => (
							<Image key={d} lazyload alt='banner' src={images.thumbnail} />
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
						featuredBrand.value().map((brand, e) => {
							let url = '/';
							switch (brand.link.type) {
							case CONST.CATEGORY_TYPE.brand:
								url = `/brand/${brand.brand_id}/${encodeURIComponent(brand.brand_name.toLowerCase())}`;
								break;
							case CONST.CATEGORY_TYPE.category: // TODO : must change if api ready
								url = `/brand/${brand.brand_id}/${encodeURIComponent(brand.brand_name.toLowerCase())}`;
								break;
							default:
								url = `/category/${CONST.SEGMENT_DEFAULT_SELECTED.key}`;
								break;
							}
							return (
								<div key={e}>
									<Link to={url} >
										<Image lazyload alt='thumbnail' src={brand.images.thumbnail} />
									</Link>
								</div>
							);
						})
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
			const header = renderSectionHeader('Mozaic Artikel', {
				title: mozaic.value().mainlink.text,
				url: mozaic.value().mainlink.link
			});
			return (
				<div className='border-top margin--medium'>
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
		const { shared } = this.props;
		const { direction } = this.state;
		const foreverBannerData = shared.foreverBanner;
		foreverBannerData.show = this.state.notification.show;
		foreverBannerData.onClose = () => this.setState({ notification: { show: false } });

		if (direction === 'left') {
			return (
				<Redirect to='/hashtags' />
			);
		} else if (direction === 'right') {
			return (
				<Redirect to='/lovelist' />
			);
		}

		const recommendation1 = !this.isLogin ? 'new_arrival_products' : 'recommended_products';
		const recommendation2 = !this.isLogin ? 'best_seller_products' : 'recently_viewed_products';

		return (
			<div style={this.props.style} {...SwipeReact.events}>
				<Page>
					<Tabs
						current={this.props.shared.current}
						variants={this.props.home.segmen}
						onPick={(e) => this.handlePick(e)}
					/>

					{ <ForeverBanner {...foreverBannerData} /> }

					{this.renderHeroBanner()}

					{this.renderHashtag()}

					{this.renderSquareBanner()}

					{ this.renderRecommendation(recommendation1)}
					{ this.renderBottomBanner('top') }

					{ this.renderRecommendation(recommendation2)}
					{ this.renderBottomBanner('bottom') }
					{renderSectionHeader('Brand Terpopuler', { title: 'LIHAT SEMUA', url: '/brands' })}
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
	const { shared, home, dispatch, cookies } = props;

	const activeSegment = home.segmen.find(e => e.key === home.activeSegment);

	const promoService = _.chain(shared).get('serviceUrl.promo').value() || false;

	dispatch(new actions.mainAction(cookies.get('user.token'), activeSegment, promoService));
	dispatch(new actions.recomendationAction(cookies.get('user.token'), activeSegment, promoService));
};


export default withCookies(connect(mapStateToProps)(Shared(Home, doAfterAnonymous)));
