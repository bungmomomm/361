import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import styles from './Checkout.scss';

// component load
import { CheckoutHeader } from '@/components/Header';
import Loading from '@/components/Loading';
import { Container, Row, Col } from '@/components/Base';
	
// Checkout Component
import NewAddressModalbox from './components/Modal/NewAddressModalbox';
import ElockerModalbox from './components/Modal/ElockerModalbox';
import PaymentSuccessModalbox from './components/Modal/PaymentSuccessModalbox';
import PaymentErrorModalbox from './components/Modal/PaymentErrorModalbox';
import VerifikasiNoHandponeModalbox from './components/Modal/VerifikasiNoHandponeModalbox';

// Section Component
import CardPesananPengiriman from './components/CardPesananPengiriman';
import CardPembayaran from './components/CardPembayaran';
import CardPengiriman from './components/CardPengiriman';

import { PropTypes, instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { request } from '@/utils';
import { addCoupon, removeCoupon, resetCoupon } from '@/state/Coupon/actions';

class Checkout extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			enableAlamatPengiriman: true,
			enablePesananPengiriman: true,
			enablePembayaran: true,
			cookie: {
				name: this.props.cookies.get('name') || 'Ben'
			},
			token: this.props.cookies.get('user.token'),
			refreshToken: this.props.cookies.get('user.rf.token')
		};
		this.onAddCoupon = this.onAddCoupon.bind(this);
		this.onRemoveCoupon = this.onRemoveCoupon.bind(this);
		this.onResetCoupon = this.onResetCoupon.bind(this);
	}

	componentWillMount() {
		const k = {
			token: this.state.token,
			path: 'me/carts/1',
			method: 'POST'
		};

		const x = request(k);
		console.log(x);

		window.dataLayer.push({
			event: 'checkout',
			userID: '10c53c28efe87fe0c27262ba36f11d5d',
			emailaddress: '8b5fb124f94a8f1185af1794a9524703',
			ecommerce: {  
				checkout: {  
					actionField: {  
						step: 1, 
						option: 'Login Email'
					},
					products: [
						{  
							id: '839783',
							name: 'Samsung B109E Keystone 3 - Hitam',
							price: '270000',
							brand: 'Samsung',
							category: 'Handphone & Tablet Handphone Handphone Basic',
							variant: '',
							quantity: '1'
						}, {
							id: '4630647',
							name: 'Hydrowhey 3.5Lbs - Hero - Khusus O2O',
							price: '2300000',
							brand: 'Optimum Nutrition',
							category: 'Kesehatan & Kecantikan Kesehatan Suplemen Kesehatan dan Pelangsing Nutrisi Olahraga',
							variant: '',
							quantity: '1'
						}
					]
				}
			}
		});
	} 

	componentDidMount() {
		// const { dispatch } = this.props;
		// dispatch(addCoupon('test'));
	}

	onAddCoupon(coupon) {
		console.log('coupon', coupon);
		const { dispatch } = this.props;
		dispatch(addCoupon(coupon));
	}

	onRemoveCoupon(event) {
		const { dispatch } = this.props;
		dispatch(removeCoupon());
	}

	onResetCoupon(event) {
		const { dispatch } = this.props;
		dispatch(resetCoupon());
	}

	render() {
		const {
			enableAlamatPengiriman,
			enablePesananPengiriman,
			enablePembayaran
		} = this.state;

		const {
			coupon
		} = this.props;
		
		return (
			this.props.loading ? <Loading /> : (
				<div className='page'>
					<Helmet title='Checkout' />
					<CheckoutHeader />
					<div className={styles.checkout}>
						<Container>
							<Row>
								<Col grid={4} className={enableAlamatPengiriman ? '' : styles.disabled}>
									<div className={styles.title}>1. Pilih Metode & Alamat Pengiriman</div>
									<CardPengiriman />
								</Col>
								<Col grid={4} className={enablePesananPengiriman ? '' : styles.disabled}>
									<div className={styles.title}>2. Rincian Pesanan & Pengiriman <span>(5 items)</span></div>
									<CardPesananPengiriman />
								</Col>
								<Col grid={4} className={enablePembayaran ? '' : styles.disabled}>
									<div className={styles.title}>3. Pembayaran</div>
									<CardPembayaran onAddCoupon={this.onAddCoupon} loadingButtonCoupon={coupon.loading} coupon={coupon.coupon} validCoupon={coupon.validCoupon} onRemoveCoupon={this.onRemoveCoupon} onResetCoupon={this.onResetCoupon} />
								</Col>
							</Row>
						</Container>
					</div>
					<NewAddressModalbox />
					<ElockerModalbox />
					<PaymentSuccessModalbox />
					<PaymentErrorModalbox />
					<VerifikasiNoHandponeModalbox />
				</div>
			)
		);
	}
};

Checkout.propTypes = {
	cookies: instanceOf(Cookies).isRequired,
	dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
	return {
		...state
	};
};

export default withCookies(connect(mapStateToProps)(Checkout));