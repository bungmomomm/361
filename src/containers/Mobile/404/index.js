import React, { Component } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { actions } from '@/state/v4/SearchResults';
import Shared from '@/containers/Mobile/Shared';
import { Header, Page, Navigation, Svg, Grid, Card, Spinner, Level, Carousel } from '@/components/mobile';
import styles from './search.scss';
import { connect } from 'react-redux';
import { urlBuilder } from '@/utils';
import Parser from 'html-react-parser';

class Page404 extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			notification: {
				show: true
			}
		};
		this.isLogin = this.props.cookies.get('isLogin');
	}

	renderBanner() {
		const { promoData } = this.props;
		const promoBanner = promoData.filter(e => e.type === 'promo_banner')[0].data;
		return promoBanner && (
			<div>
				{ Parser(promoBanner.original)}
			</div>
		);
	}

	renderRecomendation() {
		const { promoData } = this.props;
		const recommendationData = promoData.filter(e => e.type === 'recommended')[0].data;
		return recommendationData && (
			<div className='margin--large-v margin--none-t'>
				<Level>
					<Level.Left><strong className='font-medium'>Produk Rekomendasi</strong></Level.Left>
					<Level.Right>
						<Link to='/promo/recommended_products' className='text-muted font-small'>
							LIHAT SEMUA<Svg src='ico_arrow_right_small.svg' />
						</Link>
					</Level.Right>
				</Level>
				<Grid split={1}>
					<Carousel slidesToShow={2}>
						{
							_.map(recommendationData, (product, index) => {
								const linkToPdp = urlBuilder.buildPdp(product.product_title, product.product_id);
								return (
									<Card.CatalogGrid
										key={index}
										style={{ width: '100%' }}
										images={product.images}
										productTitle={product.product_title}
										brandName={product.brand.name}
										pricing={product.pricing}
										linkToPdp={linkToPdp}
									/>
								);
							})
						}
					</Carousel>
				</Grid>
			</div>
		);
	}

	render() {
		const { history, promoData } = this.props;
		const HeaderPage = {
			left: (
				<button onClick={() => (history.length < 2 ? history.push('/') : history.go(-2))}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</button>
			),
			center: '404',
		};
		return (
			<div className='text-center' style={this.props.style}>
				<Page color='white'>
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

								{this.renderBanner() }
								{this.renderRecomendation()}
							</div>
						)
					}
				</Page>
				<Header.Modal {...HeaderPage} />
				<Navigation active='Home' />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		home: state.home,
		shared: state.shared,
		promoData: state.searchResults.promoData,
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies } = props;
	await dispatch(actions.promoAction(cookies.get('user.token')));
};

export default withCookies(
	connect(mapStateToProps)(
		Shared(
			Page404,
			doAfterAnonymous
		)
	)
);

