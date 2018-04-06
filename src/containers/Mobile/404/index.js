import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import Shared from '@/containers/Mobile/Shared';
import handler from '@/containers/Mobile/Shared/handler';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import { GridView } from '@/containers/Mobile/Discovery/View';

import { Header, Page, Navigation, Svg, Spinner, Level } from '@/components/mobile';

import { actions as searchActions } from '@/state/v4/SearchResults';

import Discovery from '../Discovery/Utils';
import styles from './search.scss';
import cookiesLabel from '@/data/cookiesLabel';

@handler
class Page404 extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			notification: {
				show: true
			}
		};
		this.isLogin = this.props.cookies.get(cookiesLabel.isLogin) === 'true';
	}

	forceLoginNow() {
		const { history, location } = this.props;
		history.push(`/login?redirect_uri=${encodeURIComponent(location.pathname + location.search)}`);
	}

	renderHeader() {
		const { history } = this.props;

		let back = () => {
			history.go(-2);
		};
		if (history.length === 0) {
			back = () => {
				history.push('/');
			};
		}

		const HeaderPage = {
			left: (
				<button onClick={back}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</button>
			),
			center: '404',
		};

		return <Header.Modal {...HeaderPage} />;
	}

	renderBanner() {
		const { promoData } = this.props;
		const promoBanner = promoData.filter(e => e.type === 'promo_banner')[0].data;
		return promoBanner && (
			<div dangerouslySetInnerHTML={{ __html: promoBanner.original }} />
		);
	}

	renderRecomendation() {
		const { recommendationData } = this.props;
		return recommendationData && (
			<div className='margin--large-v margin--none-t'>
				<Level>
					<Level.Left><strong className='font-medium'>{recommendationData.title || 'Produk Rekomendasi'}</strong></Level.Left>
					<Level.Right>
						<Link to='/promo/recommended_products' className='text-muted font-small'>
							LIHAT SEMUA<Svg src='ico_arrow_right_small.svg' />
						</Link>
					</Level.Right>
				</Level>
				<GridView
					carousel
					forceLoginNow={() => this.forceLoginNow()}
					products={recommendationData.products}
				/>
			</div>
		);
	}

	render() {
		const { promoData, shared, dispatch } = this.props;

		return (
			<div className='text-center' style={this.props.style}>
				<Page color='white'>
					{<ForeverBanner {...shared.foreverBanner} dispatch={dispatch} />}
					{
						(promoData.length === 0) ? (
							<div className='margin--large-v'>
								<Spinner />
							</div>
						) : (
							<div className={styles.container} >
								<div className='margin--medium-v flex-center flex-middle'><Svg src='mm_ico_no_404_alt.svg' /></div>
								<div className=' margin--small-v'>
									<strong className='font-bold font-large'>OOPS!</strong>
								</div>
								<div>
									Maaf, halaman yang kamu tuju tidak ditemukan. <br />
									Periksa kembali link yang kamu tuju.
								</div>

								{this.renderBanner()}
								{this.renderRecomendation()}
							</div>
						)
					}
				</Page>
				{this.renderHeader()}
				<Navigation active='Home' botNav={this.props.botNav} isLogin={this.isLogin} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { lovelist, searchResults } = state;
	const getRecommendationData = _.find(searchResults.promoData, { type: 'recommended' }) || false;
	let recommendationData = null;
	if (getRecommendationData) {
		recommendationData = {
			title: getRecommendationData.title,
			products: Discovery.mapPromoProducts(getRecommendationData.data, lovelist)
		};
	}

	return {
		home: state.home,
		shared: state.shared,
		promoData: state.searchResults.promoData,
		recommendationData
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies } = props;
	await dispatch(searchActions.promoAction(cookies.get(cookiesLabel.userToken)));
};

export default withCookies(
	connect(mapStateToProps)(
		Shared(
			Page404,
			doAfterAnonymous
		)
	)
);

