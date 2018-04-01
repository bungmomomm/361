import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import {
	Header, Carousel, Tabs,
	Page, Level, Button, Grid, Article,
	Navigation, Svg, Image, SmartBanner, SEO
} from '@/components/mobile';
import styles from './home.scss';
import { actions } from '@/state/v4/Home';
import { actions as sharedActions } from '@/state/v4/Shared';
import Shared from '@/containers/Mobile/Shared';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import Footer from '@/containers/Mobile/Shared/footer';
import {
	TrackingRequest,
	homepageViewBuilder,
	impressionsPushedBuilder,
	sendGtm
} from '@/utils/tracking';
import { urlBuilder } from '@/utils';
import cookiesLabel from '@/data/cookiesLabel';

const renderSectionHeader = (title, options, cookies = null) => {
	return (
		<Level>
			<Level.Left><div className={styles.headline}>{title}</div></Level.Left>
			<Level.Right>
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
			</Level.Right>
		</Level>
	);
};

import handler from '@/containers/Mobile/Shared/handler';

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

		this.sbClose = this.sbClose.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.users.userProfile !== nextProps.users.userProfile) {
			this.trackPageViewHandler(nextProps.users);
		}
	}

	trackPageViewHandler(users) {
		const { shared } = this.props;
		const { userProfile } = users;
		if (userProfile) {
			const data = {
				emailHash: _.defaultTo(userProfile.enc_email, ''),
				userIdEncrypted: userProfile.enc_userid,
				userId: userProfile.id,
				ipAddress: shared.ipAddress,
				currentUrl: this.props.location.pathname
			};
			const PageViewReq = new TrackingRequest(data);
			const pageViewPayload = PageViewReq.getPayload(homepageViewBuilder);
			if (pageViewPayload) sendGtm(pageViewPayload);
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

			const images = featuredBanner.value()[0].images;
			const link = featuredBanner.value()[0].link.target;
			return (
				<Link
					to={link}
				>
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
		 * new-arrival,
		 * best-seller,
		 * recommended-products,
		 * recent-view
		 * */

		const { home, cookies } = this.props;
		const segment = home.activeSegment;
		const title = 'LIHAT SEMUA';
		const recommendationData = _.chain(home).get(`allSegmentData.${segment.key}.recomendationData.${type}`);
		if (recommendationData.value()) {
			const data = recommendationData.value();
			if (data.data && data.data.length > 0) {
				const link = `/promo/${type}?segment_id=${segment.id}`;

				const header = renderSectionHeader(data.title, {
					title,
					url: link
				}, cookies);
				return (
					<div>
						{ header }
						<Grid split={3} bordered>
							{
								data.data.map(({ images, pricing, path, product_id, product_title }, e) => (
									<div key={e}>
										<Link to={`${urlBuilder.buildPdp(product_title, product_id)}`}>
											<Image lazyload shape='square' alt='thumbnail' src={images[0].thumbnail} />
											<div className={styles.btnThumbnail}>
												<Button transparent color='secondary' size='small'>
													{pricing.formatted.effective_price}
												</Button>
											</div>
										</Link>
									</div>
								))
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
					<Grid split={3} bordered>
						{
							datanya.images.map((gambar, e) => {
								const embedUrl = _.chain(gambar).get('embed_url').value();
								const icode = (embedUrl.substr(embedUrl.indexOf('/p/')).split('/') || [])[2];

								return (
									<div key={e}>
										<Link to={`${detailHashTag}/${gambar.content_id}/${icode || ''}`}>
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
						datas.value().map(({ images, link }, c) => (
							<Link
								to={link.target || '/'}
								key={c}
							>
								<div>
									<Image lazyload alt='banner' src={images.thumbnail} />
								</div>
							</Link>
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
		if (dataTop.value() && dataBottm.value()) {
			bottomBanner = position === 'top' ? dataTop.value() : dataBottm.value();
		}
		if (bottomBanner.length > 0) {
			return (
				<div className='margin--medium-v'>
					{
						bottomBanner.map(({ images, link }, d) => (
							<Link
								to={link.target || '/'}
								key={d}
							>
								<div>
									<Image lazyload alt='banner' src={images.thumbnail} />
								</div>
							</Link>
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
			const header = renderSectionHeader('Popular Brand', {
				title: 'LIHAT SEMUA',
				url: '/brands'
			});
			return (
				<div>
					{
						header
					}
					<Grid split={3}>
						{
							featuredBrand.value().map((brand, e) => {
								const url = urlBuilder.setId(brand.brand_id).setName(brand.brand_name)
									.setCategoryId(this.props.home.activeSegment.id).buildFeatureBrand();
								return (
									<div className={styles.brandsImage} key={e}>
										<Link to={url} >
											<Image lazyload alt='thumbnail' src={brand.images.thumbnail} />
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

	renderMozaic() {
		const { home } = this.props;
		const segment = home.activeSegment.key;
		const mozaic = _.chain(home).get(`allSegmentData.${segment}.mozaic`);

		if (!mozaic.isEmpty().value()) {
			const header = renderSectionHeader('Artikel Mozaic', {
				title: mozaic.value().mainlink.text,
				url: mozaic.value().mainlink.link,
				isMozaic: true
			});
			return (
				<div className='border-top margin--medium-v'>
					{
						header
					}
					<Carousel className={styles.mozaic}>
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
		const { shared, dispatch } = this.props;

		const recommendation1 = !this.isLogin ? 'new-arrival' : 'recommended-products';
		const recommendation2 = !this.isLogin ? 'best-seller' : 'recent-view';
		return (
			<div style={this.props.style}>
				<Page color='white'>
					<SEO
						paramCanonical={process.env.MOBILE_UR}
					/>
					<Tabs
						current={this.props.shared.current}
						variants={this.props.home.segmen}
						onPick={(e) => this.handlePick(e)}
						type='minimal'
					/>
					{ <ForeverBanner {...shared.foreverBanner} dispatch={dispatch} /> }

					{this.renderHeroBanner()}

					{this.renderHashtag()}

					{this.renderSquareBanner()}

					{ this.renderRecommendation(recommendation1)}
					{ this.renderBottomBanner('top') }

					{ this.renderRecommendation(recommendation2)}
					{ this.renderBottomBanner('bottom') }

					{ this.renderFeaturedBrands() }

					{this.renderMozaic()}

					<Footer isShow={this.state.isFooterShow} />
				</Page>
				<SmartBanner
					title='MatahariMall'
					iconSrc='app-icon.png'
					author='PT Solusi Ecommerce Global'
					googlePlay='com.mataharimall.mmandroid'
					appStore='1033108124'
					isShow={this.state.showSmartBanner}
					onCloseBanner={this.sbClose}
					scroll={this.props.scroll}
				/>

				<Header
					lovelist={shared.totalLovelist}
					value={this.props.search.keyword}
				/>
				<Navigation active='Home' scroll={this.props.scroll} totalCartItems={shared.totalCart} botNav={this.props.botNav} isLogin={this.isLogin} />
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
	Home.trackImpresionHandler(mainPageData);
};


export default withCookies(connect(mapStateToProps)(Shared(Home, doAfterAnonymous)));
