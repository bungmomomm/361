import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import styles from './Checkout.scss';

// component load
import { CheckoutHeader } from '@/components/Header';
import Loading from '@/components/Loading';
import { Container, Row, Col } from '@/components/Base';
import { renderIf } from '@/utils';

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

import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { addCoupon, removeCoupon, resetCoupon } from '@/state/Coupon/actions';
import { getAddresses, getO2OList } from '@/state/Adresses/actions';
import { getPlaceOrderCart, getCart, deleteCart } from '@/state/Cart/actions';
import { getAvailablePaymentMethod, changePaymentMethod, changePaymentOption, openNewCreditCard, selectCreditCard } from '@/state/Payment/actions';


class Checkout extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			enableAlamatPengiriman: true,
			enablePesananPengiriman: true,
			enablePembayaran: true,
			enableNewAddress: false,
			token: this.props.cookies.get('user.token'),
			refreshToken: this.props.cookies.get('user.rf.token'),
			addresses: {},
			soNumber: null,
			cart: [],
			stores: {},
			showModalO2o: false,
		};
		this.onAddCoupon = this.onAddCoupon.bind(this);
		this.onRemoveCoupon = this.onRemoveCoupon.bind(this);
		this.onResetCoupon = this.onResetCoupon.bind(this);
		this.onChoisedAddress = this.onChoisedAddress.bind(this);
		this.onChangeAddress = this.onChangeAddress.bind(this);
		this.onDeleteCart = this.onDeleteCart.bind(this);
		this.onPaymentMethodChange = this.onPaymentMethodChange.bind(this);
		this.onPaymentOptionChange = this.onPaymentOptionChange.bind(this);
		this.onNewCreditCard = this.onNewCreditCard.bind(this);
		this.onSelectCard = this.onSelectCard.bind(this);
		this.onGetListO2o = this.onGetListO2o.bind(this);
	}

	componentWillMount() {
		const { dispatch } = this.props;
		dispatch(getAddresses(this.state.token));
		dispatch(getCart(this.state.token));
		dispatch(getAvailablePaymentMethod(this.state.token));

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
		// const { dispatch } = this.props;
		// dispatch(getAddresses(this.state.token));
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			cart: nextProps.cart
		});
	}

	onAddCoupon(coupon) {
		const { dispatch, orderId } = this.props;
		if (coupon) {
			dispatch(addCoupon(this.state.token, orderId, coupon));
		}
	}

	onRemoveCoupon(event) {
		const { dispatch, orderId } = this.props;
		dispatch(removeCoupon(this.state.token, orderId));
	}

	onResetCoupon(event) {
		const { dispatch } = this.props;
		dispatch(resetCoupon());
	}

	onChoisedAddress(address) {
		const { dispatch } = this.props;
		dispatch(getPlaceOrderCart(this.state.token, address));
	}

	onChangeAddress(address) {
		this.setState({
			enableNewAddress: true
		});
	}

	onDeleteCart(cart) {
		const { dispatch } = this.props;
		dispatch(deleteCart(this.state.token, cart.data.id, this.props));

		this.setState({
			cart: this.props.cart,
		});

	}

	onPaymentMethodChange(event) {
		this.props.dispatch(changePaymentMethod(event.value, this.props.payments.paymentMethods));
	}

	onPaymentOptionChange(event, paymentMethod) {
		this.props.dispatch(changePaymentOption(event.value, paymentMethod, this.props.payments.paymentMethods));
	}

	onNewCreditCard(event) {
		this.props.dispatch(openNewCreditCard());
	}

	onSelectCard(event) {
		this.props.dispatch(selectCreditCard(event));
	}

	onGetListO2o() {
		const { dispatch } = this.props;
		this.setState({
			showModalO2o: true
		});
		dispatch(getO2OList(this.state.token));
	}

	render() {
		const {
			enableAlamatPengiriman,
			enablePesananPengiriman,
			enablePembayaran,
		} = this.state;

		const {
			coupon,
			cart,
			payments,
			user,
			addresses,
            stores,
		} = this.props;
		
		return (
			this.props.loading ? <Loading /> : (
				<div className='page'>
					<Helmet title='Checkout' />
					<CheckoutHeader user={user} />
					<div className={styles.checkout}>
						<Container>
							<Row>
								<Col grid={4} className={enableAlamatPengiriman ? '' : styles.disabled}>
									<div className={styles.title}>1. Pilih Metode & Alamat Pengiriman</div>
									{
										renderIf(addresses)(
											<CardPengiriman addresses={addresses} onChoisedAddress={this.onChoisedAddress} onChangeAddress={this.onChangeAddress} onGetListO2o={this.onGetListO2o} stores={stores} />
										)
									}
								</Col>
								<Col grid={4} className={enablePesananPengiriman ? '' : styles.disabled}>
									<div className={styles.title}>2. Rincian Pesanan & Pengiriman <span>(5 items)</span></div>
									{
										renderIf(cart)(
											<CardPesananPengiriman cart={this.state.cart} onDeleteCart={this.onDeleteCart} />
										)
									}
								</Col>
								<Col grid={4} className={enablePembayaran ? '' : styles.disabled}>
									<div className={styles.title}>3. Pembayaran</div>
									<CardPembayaran
										loadingButtonCoupon={coupon.loading}
										coupon={coupon.coupon}
										validCoupon={coupon.validCoupon}
										onAddCoupon={this.onAddCoupon}
										onRemoveCoupon={this.onRemoveCoupon}
										onResetCoupon={this.onResetCoupon}
										payments={payments}
										onPaymentMethodChange={this.onPaymentMethodChange}
										onPaymentOptionChange={this.onPaymentOptionChange}
										onNewCreditCard={this.onNewCreditCard}
										onSelectCard={this.onSelectCard}
									/>
								</Col>
							</Row>
						</Container>
					</div>
					<NewAddressModalbox shown={this.state.enableNewAddress} />
					<ElockerModalbox shown={this.state.showModalO2o} stores={!stores ? null : stores} />
					<PaymentSuccessModalbox />
					<PaymentErrorModalbox />
					<VerifikasiNoHandponeModalbox />
				</div>
			)
		);
	}
};

Checkout.propTypes = {
	cookies: instanceOf(Cookies).isRequired
};


const mapStateToProps = (state) => {
	return {
		orderId: 1,
		coupon: state.coupon,
		addresses: state.addresses.data,
		cart: state.cart.cart,
		payments: state.payments,
		stores: state.addresses.o2o,
	};
};

export default withCookies(connect(mapStateToProps)(Checkout));