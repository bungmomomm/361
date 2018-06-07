import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import {
	Header, Carousel, Badge,
	/* Page,  */ Level, Button, Grid, /* Article, Navigation, */
	Svg, Image, SmartBanner, SEO, Spinner
} from '@/components/mobile';
import styles from './home.scss';
import { actions } from '@/state/v4/Home';
import { actions as sharedActions } from '@/state/v4/Shared';
import Shared from '@/containers/Mobile/Shared';
/* import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner'; */
import Footer from '@/containers/Mobile/Shared/footer';
import {
	TrackingRequest,
	homepageViewBuilder,
	impressionsPushedBuilder,
	sendGtm,
	sendLocation
} from '@/utils/tracking';
import { urlBuilder } from '@/utils';
import cookiesLabel from '@/data/cookiesLabel';
import { Utils } from '@/utils/tracking/lucidworks';
import { Collector } from '@/utils/tracking/emarsys';

const renderSectionHeader = (title, options = null, cookies = null) => {
	const headerLink = options !== null && (
		<div>
			{
				options.isMozaic ?
					<a href={options.url || '/'} target='_blank' className={styles.readmore}>{options ? options.title : 'Lihat Semua'}<Svg src='ico_arrow_right_small.svg' /></a>
					:
					<Link
						to={options.url || '/'}
						className={styles.readmore}
					>
						{options ? options.title : 'Lihat Semua'}<Svg src='ico_arrow_right_small.svg' />
					</Link>
			}
		</div>
	);

	return (
		<div className='margin--large-v text-center'>
			<h3 className='text-uppercase text-center font-color--primary-ext-1'>{title}</h3>
			{headerLink}
		</div>
	);
};

const trackPageViewHandler = (props) => {
	const { shared, users } = props;
	const { userProfile } = users;
	if (userProfile) {
		const data = {
			emailHash: _.defaultTo(userProfile.enc_email, ''),
			userIdEncrypted: userProfile.enc_userid,
			userId: userProfile.id,
			ipAddress: shared.ipAddress || userProfile.ip_address,
			currentUrl: props.location.pathname,
			fusionSessionId: Utils.getSessionID(),
		};
		const PageViewReq = new TrackingRequest(data);
		const pageViewPayload = PageViewReq.getPayload(homepageViewBuilder);
		if (pageViewPayload) sendGtm(pageViewPayload);
	}
};

import handler from '@/containers/Mobile/Shared/handler';
import classNames from 'classnames';

@handler
class Home extends Component {

	static trackImpresionHandler(homeData) {
		homeData = _.chain(homeData);
		const ImpressionsReq = new TrackingRequest();
		const promotions = [];
		promotions.push(homeData.get('heroBanner[0].impression').value());
		promotions.push(homeData.get('squareBanner[0].impression').value());
		promotions.push(homeData.get('squareBanner[1].impression').value());
		promotions.push(homeData.get('topLanscape[0].impression').value());
		promotions.push(homeData.get('topLanscape[1].impression').value());
		promotions.push(homeData.get('bottomLanscape[0].impression').value());
		promotions.push(homeData.get('bottomLanscape[1].impression').value());
		ImpressionsReq.setPromotions(promotions);
		const impressionsPayload = ImpressionsReq.getPayload(impressionsPushedBuilder);
		if (impressionsPayload) sendGtm(impressionsPayload);
	}


	constructor(props) {
		super(props);
		this.props = props;

		this.source = this.props.cookies.get(cookiesLabel.userSource);

		this.isLogin = this.props.cookies.get(cookiesLabel.isLogin) === 'true';

		this.state = {
			isFooterShow: true,
			showSmartBanner: this.props.cookies.get('sb-show') !== '0' && true
		};

		this.checkedImage = [];
		this.checkedStatus = [];
		this.sbClose = this.sbClose.bind(this);

		this.urlPromotionEnhancer = (url, id, name, creative, position) => {
			return `${url}?icn=${name}&icid=${id}&creid=${creative}&bannerid=${position}`;
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.users.userProfile !== nextProps.users.userProfile) {
			trackPageViewHandler(nextProps);
		}
	}

	async handlePick(current) {
		const { segmen } = this.props.home;
		const { cookies, dispatch } = this.props;
		const willActiveSegment = segmen.find(e => e.id === current);
		dispatch(new sharedActions.setCurrentSegment(willActiveSegment.key));
		const mainPageData = await dispatch(new actions.mainAction(willActiveSegment, cookies.get(cookiesLabel.userToken)));
		Home.trackImpresionHandler(mainPageData);
		dispatch(new actions.recomendationAction(willActiveSegment, cookies.get(cookiesLabel.userToken)));
	}

	sbClose() {
		const { cookies } = this.props;
		const currentDate = new Date();
		const limitDate = 1 * 30;
		currentDate.setDate(currentDate.getDate() + limitDate);

		cookies.set('sb-show', 0, { domain: process.env.SESSION_DOMAIN, path: '/', expires: currentDate });
		this.setState({
			showSmartBanner: false
		});
	}

	renderHeroBanner() {
		const { home } = this.props;
		const segment = home.activeSegment.key;
		const featuredBanner = _.chain(home).get(`allSegmentData.${segment}`).get('heroBanner');
		if (!featuredBanner.isEmpty().value()) {
			const bannerData = featuredBanner.value();
			const images = bannerData[0].images;
			let link = bannerData[0].link.target;
			if (link !== '') {
				const promotion = bannerData[0].impression;
				link = this.urlPromotionEnhancer(link, promotion.id, promotion.name, promotion.creative, promotion.position);
			}

			const isStatic = bannerData[0].link.type === 'url_web';
			return (
				isStatic ?
					<a
						href={link}
						onClick={
							() => {
								sendLocation(link);
							}
						}
					>
						<div>
							<Image src={images.thumbnail} onClick={e => this.handleLink(link)} />
						</div>
					</a> :
					<Link
						to={link}
						onClick={
							() => {
								sendLocation(link);
							}
						}
					>
						<div>
							<Image src={images.thumbnail} onClick={e => this.handleLink(link)} />
						</div>
					</Link>
			);
		}

		return (
			<div style={{ margin: '20px auto 20px auto' }}>
				<Spinner />
			</div>);
	}

	renderRecommendation(type = 'new_arrival_products') {
		/**
		 * Registered object
		 * new-arrival,
		 * best-seller,
		 * recommended-products,
		 * recent-view
		 * */

		const { home, cookies } = this.props;
		const { className, isLoved, linkToPdp, lovelistDisabled } = this.props;
		const segment = home.activeSegment;
		const title = 'LIHAT SEMUA';
		const loveIcon = (isLoved) ? 'ico_love-filled.svg' : 'ico_lovelist.svg';
		const createClassName = classNames(styles.container, styles.grid, className);
		const recommendationData = _.chain(home).get(`allSegmentData.${segment.key}.recomendationData.${type}`);
		if (recommendationData.value()) {
			const data = recommendationData.value();
			if (data.data && data.data.length > 0) {
				const link = `/promo/${type}?segment_id=${segment.id}`;

				const header = renderSectionHeader(data.title, { title,
					url: link
				}, cookies);
				return (
					<div>
						{ header }
						<Grid split={4} bordered className='margin--xlarge-b'>
							{
								data.data.map(({ images, pricing, path, product_id, product_title }, e) => {
									const pdpUriBuilder = `${urlBuilder.buildPdp(product_title, product_id)}`;
									return (
										<div className={createClassName} key={e}>
											<Link
												to={linkToPdp || '/'}
												className={styles.imgContainer}
											>
												<div className={`${styles.imgWrapper} placeholder-image`}>
													<Image lazyload alt='thumbnail' src={images[0].thumbnail} />
												</div>
											</Link>
											<Level className={styles.action}>
												<Level.Item>
													<Link to={linkToPdp || '/'}>
														<div className={styles.title}>
															<span className='font-color--primary-ext-1'>361 NIX Casual Sneakers 2 Line Pink Ox Blood</span>
														</div>
													</Link>
												</Level.Item>
												<Level.Right>
													<Button onClick={this.props.onBtnLovelistClick} data-id={data.id} disabled={lovelistDisabled} >
														<Svg src={loveIcon} />
													</Button>
												</Level.Right>
											</Level>
											<Link
												to={pdpUriBuilder}
												onClick={
													() => {
														sendLocation(pdpUriBuilder);
													}
												}
											>
												<Level className={styles.footer}>
													<Level.Item>
														<div className={styles.blockPrice}>
															<div className={styles.price}>Rp1.450.000</div>
															<div className={styles.discount}>Rp2.450.000</div>
														</div>
													</Level.Item>
													<Level.Right>
														<Badge rounded color='red'>
															<span>20%</span>
														</Badge>
													</Level.Right>
												</Level>
											</Link>
										</div>
									);
								})
							}
						</Grid>
					</div>
				);
			}
		}
		return null;
	}

	renderHashtag() {
		const { home } = this.props;
		const segment = home.activeSegment.key;
		const datas = _.chain(home).get(`allSegmentData.${segment}.hashtag`);
		const baseHashtagUrl = '/mau-gaya-itu-gampang';
		if (!datas.isEmpty().value() && datas.value().id !== '') {
			const datanya = datas.value();
			const header = renderSectionHeader(datanya.hashtag, {
				title: datanya.mainlink.text,
				url: baseHashtagUrl
			});

			const detailHashTag = `${baseHashtagUrl}/${datanya.hashtag.replace('#', '')}-${datanya.campaign_id}`;

			return (
				<div>
					{ header }
					<Grid split={4} bordered>
						{
							datanya.images.map((gambar, e) => {
								const embedUrl = _.chain(gambar).get('embed_url').value();
								const icode = (embedUrl.substr(embedUrl.indexOf('/p/')).split('/') || [])[2];
								const hashtagLink = `${detailHashTag}/${gambar.content_id}/${icode || ''}`;
								return (
									<div key={e}>
										<Link
											to={hashtagLink}
											onClick={
												() => {
													sendLocation(hashtagLink);
												}
											}
										>
											<Image lazyload shape='square' alt='thumbnail' src={gambar.images.thumbnail} />
										</Link>
									</div>
								);
							})
						}
					</Grid>
				</div>
			);
		}
		return null;
	}

	renderSquareBanner() {
		const { home } = this.props;
		const segment = home.activeSegment.key;
		const datas = _.chain(home).get(`allSegmentData.${segment}.squareBanner`);
		if (datas.value()) {
			return (
				<div className='margin--medium-v'>
					{
						datas.value().map(({ images, link, impression }, c) => {
							const isStatic = link.type === 'url_web';
							let url = link.target;
							if (url !== '') {
								url = this.urlPromotionEnhancer(url, impression.id, impression.name, impression.creative, impression.position);
							}
							return (
								isStatic ?
									<a
										href={url || '/'}
										key={c}
										onClick={
											() => {
												sendLocation(url);
											}
										}
									>
										<div>
											<Image lazyload alt='banner' src={images.thumbnail} />
										</div>
									</a> :
									<Link
										to={url || '/'}
										key={c}
										onClick={
											() => {
												sendLocation(url);
											}
										}
									>
										<div>
											<Image lazyload alt='banner' src={images.thumbnail} />
										</div>
									</Link>
							);
						})
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
		if (dataTop.value() && dataBottm.value()) {
			bottomBanner = position === 'top' ? dataTop.value() : dataBottm.value();
		}
		if (bottomBanner.length > 0) {
			return (
				<div className='margin--medium-v'>
					{
						bottomBanner.map(({ images, link, impression }, d) => {
							let url = link.target;
							if (url !== '') {
								url = this.urlPromotionEnhancer(url, impression.id, impression.name, impression.creative, impression.position);
							}
							return (
								<Link
									to={url || '/'}
									key={d}
									onClick={
										() => {
											sendLocation(url);
										}
									}
								>
									<div className='margin--normal-v'>
										<Image lazyload alt='banner' width='100%' src={images.thumbnail} />
									</div>
								</Link>
							);
						})
					}
				</div>
			);
		}

		return null;

	}

	render() {
		const { shared /* , dispatch */ } = this.props;
		const recommendation1 = !this.isLogin ? 'new-arrival' : 'recommended-products';
		const recommendation2 = !this.isLogin ? 'best-seller' : 'recent-view';
		return (
			<div className={!shared.foreverBanner.show ? styles['am-top'] : ''} style={this.props.style}>
				<Header
					lovelist={shared.totalLovelist}
					value={this.props.search.keyword}
				/>
				<SEO
					paramCanonical={process.env.MOBILE_URL}
				/>
				{/* <ForeverBanner marginTop={'35px'} {...shared.foreverBanner} dispatch={dispatch} /> */}
				<Carousel>
					<Image local src='banner-home-361.png' />
					<Image local src='banner-home-361.png' />
					<Image local src='banner-home-361.png' />
				</Carousel>
				<div className='container' color='white'>

					{/* this.renderHeroBanner() */}

					{/* this.renderHashtag() */}

					{/* this.renderSquareBanner() */}
					<div className='margin--xlarge-v row'>
						<div className='col-xs-12 col-md-4 col-lg-4'><Image local src='banner-promo-01.png' /></div>
						<div className='col-xs-12 col-md-4 col-lg-4'><Image local src='banner-promo-02.png' /></div>
						<div className='col-xs-12 col-md-4 col-lg-4'><Image local src='banner-promo-03.png' /></div>
					</div>

					{ this.renderRecommendation(recommendation1)}
					{ this.renderBottomBanner('top') }

					{ this.renderRecommendation(recommendation2)}

					{ /* this.renderBottomBanner('bottom') */}
				</div>
				<Footer isShow={this.state.isFooterShow} />

				{
					process.env.SHOW_SMART_BANNER === 'true' && (
						<SmartBanner
							title='MatahariMall'
							iconSrc='app-icon.png'
							author='Harga lebih murah di App'
							googlePlay='com.mataharimall.mmandroid'
							appStore='1033108124'
							isShow={this.state.showSmartBanner}
							onCloseBanner={this.sbClose}
							scroll={this.props.scroll}
						/>
					)
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		home: state.home,
		search: state.search,
		shared: state.shared,
		users: state.users
	};
};

const doAfterAnonymous = async (props) => {
	const { home, dispatch, cookies, shared } = props;

	const activeSegment = home.segmen.find(e => e.key === shared.current);

	const tokenHeader = cookies.get(cookiesLabel.userToken);

	const mainPageData = await dispatch(new actions.mainAction(activeSegment, tokenHeader));
	await dispatch(new actions.recomendationAction(activeSegment, tokenHeader));
	trackPageViewHandler(props);
	Home.trackImpresionHandler(mainPageData);
	Collector.push();
};


export default withCookies(connect(mapStateToProps)(Shared(Home, doAfterAnonymous)));
