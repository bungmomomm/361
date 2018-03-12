import React, { Component } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { actions } from '@/state/v4/Home';
import Shared from '@/containers/Mobile/Shared';
import { Header, Page, Navigation, Svg, Notification, Image, Grid, Card, Spinner, Level, Carousel } from '@/components/mobile';
import styles from './search.scss';
import { connect } from 'react-redux';
import { urlBuilder } from '@/utils';

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

	renderRecomendation() {
		const recommendation = this.isLogin === 'true' ? 'best-seller' : 'recommended-products';
		const activeSegment = _.chain(this.props).get('home.activeSegment');
		const listData = _.chain(this.props).get(`home.allSegmentData.${activeSegment.value().key}.recomendationData.${recommendation}.data`);
		if (listData.isEmpty().value()) {
			return (
				<div className='margin--large-v'>
					<Spinner />
				</div>
			);
		};
		return (
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
							_.map(listData.value(), (product, index) => {
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
		const { history } = this.props;
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
					<div className={styles.container} >
						<div className='margin--medium-v flex-center flex-middle'><Svg src='mm_ico_no_404_alt.svg' /></div>
						<div className=' margin--small-v'>
							<strong className='font-bold font-large'>OOPS!</strong>
						</div>
						<div>
							Maaf, halaman yang kamu tuju tidak ditemukan. <br />
							Periksa kembali link yang kamu tuju.
						</div>
						<div className='flex-row margin--large-v margin--none-b'>
							<Link className='border-white-right' to='/'><Image local src='temp/promo404-1.jpg' /></Link>
							<Link to='/'><Image local src='temp/promo404-2.jpg' /></Link>
						</div>
						<Notification color='yellow' show disableClose>
							<div className='margin--medium-v padding--medium-h' style={{ color: '#F57C00' }}>Jika anda mengalami kesulitan silahkan hubungi Customer Support kami di: 1500038</div>
						</Notification>
						{this.renderRecomendation()}
					</div>
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
		shared: state.shared
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies } = props;

	const tokenHeader = cookies.get('user.token');

	await dispatch(
		new actions.recomendationAction(
			_.chain(props).get('home.segmen').find(d => d.key === props.home.activeSegment.key).value(),
			tokenHeader,
			_.chain(props).get('shared.serviceUrl.promo').value()
		)
	);
};

export default withCookies(
	connect(mapStateToProps)(
		Shared(
			Page404,
			doAfterAnonymous
		)
	)
);

