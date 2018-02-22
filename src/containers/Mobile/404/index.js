import React, { Component } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { actions } from '@/state/v4/Home';
import Shared from '@/containers/Mobile/Shared';
import { Header, Page, Navigation, Svg, Notification, Image, Grid, Button, Spinner, Level } from '@/components/mobile';
import styles from './search.scss';
import { connect } from 'react-redux';

class Page404 extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			notification: {
				show: true
			}
		};
	}

	renderRecomendation() {
		const activeSegment = _.chain(this.props).get('home.activeSegment');
		
		if (activeSegment.isEmpty().value()) return null;

		const listData = _.chain(this.props).get(`home.allSegmentData.${activeSegment.value()}.recomendationData.recommendedProducts`);

		if (listData.isEmpty().value()) {
			return (
				<div className='margin--large'>
					<Spinner />
				</div>
			)
		};
		
		return (
			<div className='margin--large margin--none-top'>
				<Level>
					<Level.Left><strong className='font-medium'>Recomended</strong></Level.Left>
					<Level.Right>
						<Link to='/promo/recommended_products' className='text-muted font-small'>
							LIHAT SEMUA<Svg src='ico_arrow_right_small.svg' />
						</Link>
					</Level.Right>
				</Level>
				<Grid split={3}>
					{
						listData.value().map(({ images, pricing }, e) => (
							<div className='thumbnail-small' key={e}>
								<Image lazyload alt='thumbnail' src={images[0].thumbnail} />
								<Button className={styles.btnThumbnail} transparent color='secondary' size='small'>{pricing.formatted.effective_price}</Button>
							</div>
						))
					}
				</Grid>
			</div>
		);
	}

	render() {
		const { history } = this.props;
		const HeaderPage = {
			left: (
				<button onClick={() => history.length < 2 ? history.push('/') : history.go(-2)}> 
					<Svg src={'ico_arrow-back-left.svg'} />
				</button>
			),
			center: '404',
		};
		return (
			<div className='text-center' style={this.props.style}>
				<Page>
					<div className={styles.container} >
						<div className='margin--medium flex-center'><Svg src='mm_ico_no_404_alt.svg' /></div>
						<div className=' margin--small'>
							<strong className='font-bold font-large'>OOPS!</strong>
						</div>
						<div>
							Maaf, halaman yang kamu tuju tidak ditemukan. <br />
							Periksa kembali link yang kamu tuju.
						</div>
						<div className='flex-row margin--large margin--none-bottom'>
							<Link className='border-white-right' to='/'><Image local src='temp/promo404-1.jpg' /></Link>
							<Link to='/'><Image local src='temp/promo404-2.jpg' /></Link>
						</div>
						<Notification color='yellow' show disableClose>
							<div className='margin--medium padding--medium' style={{ color: '#F57C00' }}>Jika anda mengalami kesulitan silahkan hubungi Customer Support kami di: 1500038</div>
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

const doAfterAnonymous = (props) => {
	props.dispatch(
		new actions.recomendationAction(
			props.cookies.get('user.token'),
			_.chain(props).get('home.segmen').find(d => d.key === props.home.activeSegment).value(),
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

