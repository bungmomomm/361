import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import {
	Header, Carousel, Tabs,
	Page, Level, Button, Grid, Article,
	Navigation, Svg, Image, SmartBanner
} from '@/components/mobile';
import styles from './home.scss';
import { actions } from '@/state/v4/Home';
import { actions as sharedActions } from '@/state/v4/Shared';
import Shared from '@/containers/Mobile/Shared';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import Footer from '@/containers/Mobile/Shared/footer';
import CONST from '@/constants';

const renderSectionHeader = (title, options) => {
	return (
		<Level>
			<Level.Left><div className={styles.headline}>{title}</div></Level.Left>
			<Level.Right>
				{
					options.isMozaic ? 
						<a href={options.url || '/'} target='_blank' className={styles.readmore}>{options ? options.title : 'Lihat Semua'}<Svg src='ico_arrow_right_small.svg' /></a>
						:
						<Link to={options.url || '/'} className={styles.readmore}>
							{options ? options.title : 'Lihat Semua'}<Svg src='ico_arrow_right_small.svg' />
						</Link>
				}
			</Level.Right>
		</Level>
	);
};


class Home extends Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');

		this.isLogin = this.props.cookies.get('isLogin');

		this.state = {
			isFooterShow: true, 
			showSmartBanner: this.props.cookies.get('sb-show') !== '0' && true
		};

		this.sbClose = this.sbClose.bind(this);
	}

	handlePick(current) {
		const { segmen } = this.props.home;
		const { dispatch } = this.props;
		const willActiveSegment = segmen.find(e => e.id === current);
		// this.setState({ current: willActiveSegment.key });
		dispatch(new sharedActions.setCurrentSegment(willActiveSegment.key));
		dispatch(new actions.mainAction(willActiveSegment, this.userCookies));
		dispatch(new actions.recomendationAction(willActiveSegment, this.userCookies));
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
		const { home, dispatch } = this.props;
		const segment = home.activeSegment.key;
		const featuredBanner = _.chain(home).get(`allSegmentData.${segment}`).get('heroBanner');
		if (!featuredBanner.isEmpty().value()) {

			const images = featuredBanner.value()[0].images;
			const link = featuredBanner.value()[0].link.target;
			return (
				<Link
					to={link}
					onClick={
						() => {
							dispatch(new sharedActions.logSinglePage('HOME'));
						}
					}
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
		
		const { home } = this.props;
		const segment = home.activeSegment;
		const title = 'LIHAT SEMUA';
		const datas = _.chain(home).get(`allSegmentData.${segment.key}`).get('recomendationData').get(type);
		
		if (!datas.isEmpty().value()) {
			const data = datas.value();
			const link = `/promo/${type}?segment_id=${segment.id}`;

			const header = renderSectionHeader(data.title, {
				title,
				url: link
			});
			return (
				<div>
					{ header }
					<Grid split={3} bordered>
						{
							data.data.map(({ images, pricing, path }, e) => (
								<div key={e}>
									<Link to={`/${path}`}>
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
							datanya.images.map((gambar, e) => (
								<div key={e}>
									<Link to={`${detailHashTag}/${gambar.content_id}`}>
										<Image lazyload shape='square' alt='thumbnail' src={gambar.images.thumbnail} />
									</Link>
								</div>
								
							))
						}
					</Grid>
				</div>
			);
		}
		return null;
	}

	renderSquareBanner() {
		const { home, dispatch } = this.props;
		const segment = home.activeSegment.key;
		const datas = _.chain(home).get(`allSegmentData.${segment}.squareBanner`);
		if (!datas.isEmpty().value()) {
			return (
				<div className='margin--medium-v'>
					{
						datas.value().map(({ images, link }, c) => (
							<Link
								to={link.target || '/'}
								key={c}
								onClick={
									() => {
										dispatch(new sharedActions.logSinglePage('HOME'));
									}
								}
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
		const { home, dispatch } = this.props;
		const segment = home.activeSegment.key;
		let bottomBanner = [];
		const dataTop = _.chain(home).get(`allSegmentData.${segment}.topLanscape`);
		const dataBottm = _.chain(home).get(`allSegmentData.${segment}.bottomLanscape`);
		if (!dataTop.isEmpty().value() && !dataBottm.isEmpty().value()) {
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
								onClick={
									() => {
										dispatch(new sharedActions.logSinglePage('HOME'));
									}
								}
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

		const recommendation1 = this.isLogin === 'false' ? 'best-seller' : 'recommended-products';
		const recommendation2 = this.isLogin === 'false' ? 'new-arrival' : 'recent-view';
		return (
			<div style={this.props.style}>
				<Page color='white'>
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
				<Navigation active='Home' scroll={this.props.scroll} totalCartItems={shared.totalCart} />
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

const doAfterAnonymous = async (props) => {
	const { home, dispatch, cookies } = props;

	const activeSegment = home.segmen.find(e => e.key === home.activeSegment.key);

	const tokenHeader = cookies.get('user.token');

	await dispatch(new actions.mainAction(activeSegment, tokenHeader));
	await dispatch(new actions.recomendationAction(activeSegment, tokenHeader));
};


export default withCookies(connect(mapStateToProps)(Shared(Home, doAfterAnonymous)));
