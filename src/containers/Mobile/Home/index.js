import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import _ from 'lodash';
import {
	Header, Carousel,
	Page, Image, SmartBanner, SEO
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
import cookiesLabel from '@/data/cookiesLabel';
import { Utils } from '@/utils/tracking/lucidworks';
import { Collector } from '@/utils/tracking/emarsys';

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

	render() {
		const { shared, dispatch } = this.props;

		return (
			<div className={!shared.foreverBanner.show ? styles['am-top'] : ''} style={this.props.style}>
				<Page color='white'>
					<SEO
						paramCanonical={process.env.MOBILE_URL}
					/>
					{ <ForeverBanner marginTop={'35px'} {...shared.foreverBanner} dispatch={dispatch} /> }
				</Page>
				{/* Sample Carousel */}
				<Carousel>
					<Image local src='banner-home-361.png' />
					<Image local src='banner-home-361.png' />
					<Image local src='banner-home-361.png' />
				</Carousel>
				<div className='container'>
					<div className='margin--large-v row'>
						<div className='col-xs-12 col-md-4 col-lg-4'><Image local src='banner-promo-01.png' /></div>
						<div className='col-xs-12 col-md-4 col-lg-4'><Image local src='banner-promo-02.png' /></div>
						<div className='col-xs-12 col-md-4 col-lg-4'><Image local src='banner-promo-03.png' /></div>
					</div>
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
				<Header
					lovelist={shared.totalLovelist}
					value={this.props.search.keyword}
				/>
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
