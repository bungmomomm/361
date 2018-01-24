import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { Header, Carousel, Tabs, Page, Level, Button, Grid, Article, Navigation, Svg, Image, Notification } from '@/components/mobile';
import styles from './home.scss';
import { actions } from '@/state/v4/Home';
import { actions as loveListAction } from '@/state/v4/Lovelist';
// import { renderIf } from '@/utils';
// import * as C from '@/constants';

class Home extends Component {
	static initApp(token, dispatch) {
		dispatch(new actions.initAction({
			token: this.userCookies
		}));
	}

	static mainData(token, dispatch) {
		dispatch(new actions.mainAction({
			token: this.userCookies
		}));
	}

	static lovelist(token, dispatch) {
		// const user is a dummy data only, in future will be removed
		const user = { loggedId: true, id: 123141, name: 'Ben' };
		dispatch(new loveListAction.countLoveList(token, user));

		// in future will use this commented dispatch (gets lovelist count based user logged in)
		// dispatch(new loveListAction.countLovelist(token, this.props.user.user));
	}

	static cart(token, dispatch) {
		dispatch(new actions.cartAction({
			token: this.userCookies
		}));
	}

	static newArrival(token, dispatch) {
		dispatch(new actions.newArrivalAction({
			token: this.userCookies
		}));
	}

	static bestSeller(token, dispatch) {
		dispatch(new actions.bestSellerAction({
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
	}

	componentDidMount() {
		this.constructor.initApp(this.userCookies, this.props.dispatch);
		this.constructor.mainData(this.userCookies, this.props.dispatch);
		this.constructor.lovelist(this.userCookies, this.props.dispatch);
		this.props.dispatch(new actions.lovelistAction({
			total: this.props.lovelist.count
		}));
		this.constructor.cart(this.userCookies, this.props.dispatch);
		this.constructor.newArrival(this.userCookies, this.props.dispatch);
		this.constructor.bestSeller(this.userCookies, this.props.dispatch);
		// this.slider.refs.frame.style.height = '500px';
		// this.mainNavCategories = C.MAIN_NAV_CATEGORIES;	
	}

	handlePick(current) {
		this.setState({ current });
	}

	renderFeatureBanner() {
		const { home } = this.props;
		if (typeof home.mainData.featureBanner !== 'undefined' && home.mainData.featureBanner.length > 0) {
			return (
				<Carousel>
					{
						home.mainData.featureBanner.map(({ images, link }, i) => (
							<Image key={i} alt='slide' src={images.mobile} />
						))
					}
				</Carousel>
			);
		}
		return null;
	}

	renderHashtag() {
		const { home } = this.props;
		if (typeof home.mainData.hashtag.images !== 'undefined' && home.mainData.hashtag.images.length > 0) {
			return (
				<div>
					{
						home.mainData.hashtag.images.map(({ images, link }, i) => (
							<div key={i} ><Image lazyload alt='thumbnail' src={images.mobile} /></div>
						))
					}
				</div>
			);
		}
		return null;
	}

	renderOOTD() {
		const { home } = this.props;
		if (typeof home.mainData.middlebanner !== 'undefined' && home.mainData.middlebanner.length > 0) {
			return (
				<div>
					{
						home.mainData.middleBanner.map(({ images, link }, i) => (
							<Image key={i} lazyload alt='banner' src={images.mobile} />
						))
					}
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
					<Grid split={3}>
						<div>
							<Image local lazyload alt='thumbnail' src='temp/thumb-2-1.jpg' />
							<Button className={styles.btnThumbnail} transparent color='secondary' size='small'>Rp. 1.000.000</Button>
						</div>
						<div>
							<Image local lazyload alt='thumbnail' src='temp/thumb-2-2.jpg' />
							<Button className={styles.btnThumbnail} transparent color='secondary' size='small'>Rp. 1.000.000</Button>
						</div>
						<div>
							<Image local lazyload alt='thumbnail' src='temp/thumb-2-3.jpg' />
							<Button className={styles.btnThumbnail} transparent color='primary' outline size='small'>Rp. 1.000.000</Button>
						</div>
					</Grid>
					<div className='margin--medium'>
						<Image local lazyload alt='banner' src='temp/banner-landscape-1.jpg' />
						<Image local lazyload alt='banner' src='temp/banner-landscape-2.jpg' />
					</div>
					{renderSectionHeader('Best Seller', { title: 'See all', url: 'http://www.google.com' })}
					<Grid split={3}>
						<div>
							<Image local lazyload alt='thumbnail' src='temp/thumb-2-1.jpg' />
							<Button className={styles.btnThumbnail} transparent color='secondary' size='small'>Rp. 1.000.000</Button>
						</div>
						<div>
							<Image local lazyload alt='thumbnail' src='temp/thumb-2-2.jpg' />
							<Button className={styles.btnThumbnail} transparent color='secondary' size='small'>Rp. 1.000.000</Button>
						</div>
						<div>
							<Image local lazyload alt='thumbnail' src='temp/thumb-2-3.jpg' />
							<Button className={styles.btnThumbnail} transparent color='primary' outline size='small'>Rp. 1.000.000</Button>
						</div>
					</Grid>
					<div className='margin--medium'>
						<Image local lazyload alt='banner' src='temp/banner-landscape-1.jpg' />
						<Image local lazyload alt='banner' src='temp/banner-landscape-2.jpg' />
					</div>
					{renderSectionHeader('Featured Brands', { title: 'See all', url: 'http://www.google.com' })}
					<Grid split={3}>
						<div>
							<Image lazyload alt='thumbnail' src='https://i.pinimg.com/originals/76/1d/c8/761dc83ce2eed1757bbe27f7adb672c2.png' />
						</div>
						<div>
							<Image lazyload alt='thumbnail' src='https://i.pinimg.com/originals/76/1d/c8/761dc83ce2eed1757bbe27f7adb672c2.png' />
						</div>
						<div>
							<Image lazyload alt='thumbnail' src='https://i.pinimg.com/originals/76/1d/c8/761dc83ce2eed1757bbe27f7adb672c2.png' />
						</div>
						<div>
							<Image lazyload alt='thumbnail' src='https://i.pinimg.com/originals/76/1d/c8/761dc83ce2eed1757bbe27f7adb672c2.png' />
						</div>
						<div>
							<Image lazyload alt='thumbnail' src='https://i.pinimg.com/originals/76/1d/c8/761dc83ce2eed1757bbe27f7adb672c2.png' />
						</div>
						<div>
							<Image lazyload alt='thumbnail' src='https://i.pinimg.com/originals/76/1d/c8/761dc83ce2eed1757bbe27f7adb672c2.png' />
						</div>
					</Grid>
					{renderSectionHeader('Mozaic Megazine', { title: 'See all', url: 'http://www.google.com' })}
					<Article />
				</Page>
				<Header lovelist={this.props.lovelist} />
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

export default withCookies(connect(mapStateToProps)(Home));