import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import styles from './Checkout.scss';

// component load
import { Container, Row, Col, Loading, CheckoutHeader } from '@/components';
import { renderIf } from '@/utils';

import { Validator } from 'ree-validate';

// Checkout Component
import NewAddressModalbox from './components/Modal/NewAddressModalbox';
import ElockerModalbox from './components/Modal/ElockerModalbox';
import PaymentSuccessModalbox from './components/Modal/PaymentSuccessModalbox';
import PaymentErrorModalbox from './components/Modal/PaymentErrorModalbox';
import VerifikasiNoHandponeModalbox from './components/Modal/VerifikasiNoHandponeModalbox';
import Vt3dsModalBox from './components/Modal/Vt3dsModalBox';
import EcashModalBox from './components/Modal/EcashModalBox';

// Section Component
import CardPesananPengiriman from './components/CardPesananPengiriman';
import CardPembayaran from './components/CardPembayaran';
import CardPengiriman from './components/CardPengiriman';

import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { addCoupon, removeCoupon, resetCoupon } from '@/state/Coupon/actions';
import { 
	getAddresses, 
	getO2OList, 
	getO2OProvinces, 
	getCityProvince, 
	getDistrict, 
	saveAddress 
} from '@/state/Adresses/actions';
import { getPlaceOrderCart, getCart, updateQtyCart, updateGosend } from '@/state/Cart/actions';
import {
	getAvailablePaymentMethod,
	changePaymentMethod,
	changePaymentOption,
	openNewCreditCard,
	selectCreditCard,
	changeCreditCardNumber,
	changeCreditCardYear,
	changeCreditCardMonth,
	changeCreditCardCvv,
	vtModalBoxOpen,
	ecashModalBoxOpen,
	paymentError,
	pay,
	bankNameChange,
	applyBin
} from '@/state/Payment/actions';
import { 
	paymentMethodName
} from '@/state/Payment/constants';

class Checkout extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.validator = new Validator({
			dropship_name: 'required|max:100',
			dropship_phone: 'required|numeric|min:6|max:14',
		});
		this.state = {
			enableAlamatPengiriman: true,
			enablePesananPengiriman: false,
			enablePembayaran: false,
			enableNewAddress: false,
			token: this.props.cookies.get('user.token'),
			refreshToken: this.props.cookies.get('user.rf.token'),
			addresses: {},
			soNumber: null,
			cart: this.props.cart,
			listo2o: {},
			latesto2o: {},
			o2oProvinces: {},
			selectedLocker: null,
			selectedAddress: null,
			showModalO2o: false,
			selectO2oFromModal: false,
			dropshipper: false,
			formDropshipper: {
				dropship_name: '',
				dropship_phone: '',
			},
			errorDropship: null,
			isValidDropshipper: true,
			formDataAddress: {},
			cityProv: this.props.cityProv, 
			district: this.props.district,
			restrictO2o: false,
			loadingUpdateCart: false,
			addressTabActive: true,
			isValidPayment: false,
			tahun: []
		};
		
		this.onAddCoupon = this.onAddCoupon.bind(this);
		this.onRemoveCoupon = this.onRemoveCoupon.bind(this);
		this.onResetCoupon = this.onResetCoupon.bind(this);
		this.onChoisedAddress = this.onChoisedAddress.bind(this);
		this.onChangeAddress = this.onChangeAddress.bind(this);
		this.onDeleteCart = this.onDeleteCart.bind(this);
		this.onUpdateQty = this.onUpdateQty.bind(this);
		this.onPaymentMethodChange = this.onPaymentMethodChange.bind(this);
		this.onPaymentOptionChange = this.onPaymentOptionChange.bind(this);
		this.onNewCreditCard = this.onNewCreditCard.bind(this);
		this.onSelectCard = this.onSelectCard.bind(this);
		this.onGetListO2o = this.onGetListO2o.bind(this);
		this.onGetO2oProvinces = this.onGetO2oProvinces.bind(this);
		this.onOpenModalO2o = this.onOpenModalO2o.bind(this);
		this.onSelectedLocker = this.onSelectedLocker.bind(this);
		this.setDropship = this.setDropship.bind(this);
		this.checkDropship = this.checkDropship.bind(this);
		this.submitDropship = this.submitDropship.bind(this);
		this.getDistricts = this.getDistricts.bind(this);
		this.onDoPayment = this.onDoPayment.bind(this);
		this.activeShippingTab = this.activeShippingTab.bind(this);
		this.onSubmitAddress = this.onSubmitAddress.bind(this);

		this.onCardNumberChange = this.onCardNumberChange.bind(this);
		this.onCardMonthChange = this.onCardMonthChange.bind(this);
		this.onCardYearChange = this.onCardYearChange.bind(this);
		this.onCardCvvChange = this.onCardCvvChange.bind(this);
		this.onVt3dsModalBoxClose = this.onVt3dsModalBoxClose.bind(this);
		this.onMandiriEcashClose = this.onMandiriEcashClose.bind(this);
		this.closeModalElocker = this.closeModalElocker.bind(this);
		this.shippingMethodGosend = this.shippingMethodGosend.bind(this);
		this.onBankChange = this.onBankChange.bind(this);
	}

	componentWillMount() {
		const { dispatch } = this.props;
		dispatch(getAddresses(this.state.token)).then(defaultAddress => {
			if (typeof defaultAddress.type !== 'undefined') {
				this.setState({
					selectedAddress: defaultAddress
				});
			}
		});
		dispatch(getCart(this.state.token));
		dispatch(getAvailablePaymentMethod(this.state.token));
		const t = new Date();
		const thisYear = t.getFullYear();
		let year = 0;
		const tahun = [];
		for (year = thisYear; year < (thisYear + 10); year++) {
			tahun.push({
				value: year,
				label: year
			});
		}
		this.setState({
			tahun
		});
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
			cart: nextProps.cart,
			loadingUpdateCart: nextProps.loadingUpdateCart
		});
		if ((!this.props.isPickupable || this.props.isPickupable === '0') && !this.state.addressTabActive) {
			this.setState({
				restrictO2o: true
			});
		} else {
			this.setState({
				restrictO2o: false
			});
		}
	}

	onAddCoupon(coupon) {
		const { dispatch, soNumber } = this.props;
		if (coupon) {
			dispatch(addCoupon(this.state.token, soNumber, coupon));
		}
	}

	onRemoveCoupon(event) {
		const { dispatch, soNumber } = this.props;
		dispatch(removeCoupon(this.state.token, soNumber));
	}

	onResetCoupon(event) {
		const { dispatch } = this.props;
		dispatch(resetCoupon());
	}

	onChoisedAddress(address) {
		console.log(this.state);
		const { dispatch } = this.props;
		const billing = this.props.billing.length > 0 ? this.props.billing[0] : false;
		if (!!address.type && address.type !== 'pickup') {
			this.setState({
				selectedAddress: address
			});
		}
		this.setState({
			enablePesananPengiriman: true,
			enablePembayaran: true,
		});
		return dispatch(getPlaceOrderCart(this.state.token, address, billing));
	}

	onChangeAddress(address, flagAdd) {
		const { dispatch } = this.props;
		dispatch(getCityProvince(this.state.token));
		let formDataAddress = {
			isEdit: false
		};
		if (flagAdd !== 'add') {
			console.log(address);
			const editAddress = address.attributes;
			formDataAddress = {
				id: address.id,
				label: editAddress.addressLabel,
				nama: editAddress.fullname,
				noHP: editAddress.phone,
				kota: editAddress.city,
				provinsi: editAddress.province,
				kotProv: `${editAddress.city}, ${editAddress.province}`,
				kecamatan: editAddress.district,
				kodepos: editAddress.zipcode,
				address: editAddress.address,
				latitude: editAddress.latitude,
				longitude: editAddress.longitude,
				isEdit: true
			};
			this.getDistricts(`${editAddress.city}, ${editAddress.province}`);
		}
		
		this.setState({
			enableNewAddress: true,
			formDataAddress
		});
	}

	onDeleteCart(cart) {
		const { dispatch } = this.props;
		dispatch(updateQtyCart(this.state.token, 0, cart.data.id, this.props));

		this.setState({
			cart: this.props.cart,
			loadingUpdateCart: true,
		});

	}

	onUpdateQty(qty, id) {
		const { dispatch } = this.props;
		dispatch(updateQtyCart(this.state.token, qty, id, this.props));

		this.setState({
			cart: this.props.cart,
		});
	}

	onPaymentMethodChange(event) {
		this.props.dispatch(changePaymentMethod(event.value, this.props.payments.paymentMethods));
	}

	onPaymentOptionChange(event, paymentMethod) {
		const { dispatch } = this.props;
		const option = event.value;
		if (option) {
			const selectedPaymentOption = this.props.payments.paymentMethods.payments[paymentMethod.id].paymentItems.filter((item) => parseInt(item.value, 10) === parseInt(option, 10))[0];
			let cardNumber = '';
			let bankName = '';
			switch (selectedPaymentOption.paymentMethod) {
			case paymentMethodName.COMMERCE_VERITRANS_INSTALLMENT:
			case paymentMethodName.COMMERCE_VERITRANS:
				cardNumber = this.props.payments.selectedCard ? this.props.payments.selectedCard.value : '';
				bankName = this.props.payments.selectedBank ? this.props.payments.selectedBank.value : '';
				break;
			default:
				break;
			}
			dispatch(changePaymentOption(selectedPaymentOption));
			dispatch(applyBin(this.state.token, selectedPaymentOption.value, cardNumber, bankName));
		}
	}

	onNewCreditCard(event) {
		this.props.dispatch(openNewCreditCard());
	}

	onSelectCard(event) {
		this.props.dispatch(selectCreditCard(event));
		const selectedPaymentOption = this.props.payments.selectedPayment.paymentItems[0];
		this.props.dispatch(applyBin(this.state.token, selectedPaymentOption.value, event, ''));
	}

	onGetListO2o(provinceId) {
		const { dispatch } = this.props;
		dispatch(getO2OList(this.state.token, provinceId));
	}
	
	onGetO2oProvinces() {
		const { dispatch } = this.props;
		dispatch(getO2OProvinces(this.state.token));
	}

	onOpenModalO2o() {
		this.setState({
			showModalO2o: true
		});
	}

	onSelectedLocker(selectedLocker, isSelectFromModal = false) {
		const TempElocker = this.props.latesto2o;
		for (let key = 0; key < TempElocker.length; key++) {
			if (TempElocker[key].value === selectedLocker.id) {
				isSelectFromModal = false;
			}
		}
		this.setState({
			selectedLocker,
			showModalO2o: false,
			selectO2oFromModal: isSelectFromModal,
		});
		selectedLocker.type = 'pickup';
		this.onChoisedAddress(selectedLocker);
	}

	onRequestVtToken(installment = false) {
		const { dispatch } = this.props;
		let bankName = '';
		const cardDetail = {
			card_cvv: this.props.payments.selectedCardDetail.cvv,
			secure: true,
			gross_amount: this.props.payments.total,
		};

		if (installment) {
			cardDetail.card_number = this.props.payments.selectedCard.value;
			cardDetail.bank = this.props.payments.selectedBank.value;
			cardDetail.installment = true;
			cardDetail.installment_term = this.props.payments.selectedInstallment.term;
		} else {
			if (this.props.payments.twoClickEnabled) {
				cardDetail.token_id = this.props.payments.selectedCard.value;
				cardDetail.two_click = true;
			} else {
				cardDetail.card_number = this.props.payments.selectedCard.value;
				cardDetail.card_exp_month = this.props.payments.selectedCardDetail.month;
				cardDetail.card_exp_year = this.props.payments.selectedCardDetail.year;
			}

			if (typeof this.props.payments.selectedBank !== 'undefined' && this.props.payments.selectedBank.value.toLowerCase() === 'bca') {
				cardDetail.channel = 'migs';
			}
		}

		const card = () => (cardDetail);

		
		const onVtCreditCardCallback = (response) => {
			if (response.redirect_url) {
				if (response.bank) {
					bankName = response.bank;
				}
				dispatch(vtModalBoxOpen(true, response.redirect_url));
			} else if (parseInt(response.status_code, 10) === 200) {
				dispatch(vtModalBoxOpen(false));
				dispatch(
					pay(
						this.state.token, 
						this.props.soNumber, 
						this.props.payments.selectedPaymentOption,
						{
							amount: this.props.payments.total,
							status: 'success',
							status_code: response.status_code,
							status_message: response.status_message,
							card: {
								masked: this.props.payments.selectedCard.label,
								value: response.token_id,
								bank: bankName,
								detail: this.props.payments.selectedCardDetail
							}
						}
					)
				);
			} else {
				dispatch(vtModalBoxOpen(false));
				dispatch(paymentError('Silahkan periksa data kartu kredit Anda.'));
			}
		};
		
		const onVtInstallmentCallback = (response) => {
			if (response.redirect_url) {
				// const payment = {
				// 	token_id: response.token_id
				// };
				if (response.bank) {
					bankName = response.bank;
				}
				dispatch(vtModalBoxOpen(true, response.redirect_url));
			} else if (parseInt(response.status_code, 10) === 200) {
				dispatch(vtModalBoxOpen(false));
				dispatch(
					pay(
						this.state.token, 
						this.props.soNumber, 
						this.props.payments.selectedPaymentOption,
						{
							card: {
								value: this.props.payments.selectedCard.value,
								bank: this.props.payments.selectedBank.value,
								detail: this.props.payments.selectedCardDetail
							},
							term: {
								
							}
						}
					)
				);
			} else {
				dispatch(vtModalBoxOpen(false));
				dispatch(paymentError('Silahkan periksa data kartu kredit Anda.'));
			}	
		};
		dispatch(
			pay(
				this.state.token,
				this.props.soNumber,
				this.props.payments.selectedPaymentOption,
				{
					amount: this.props.payments.total,
					card: {
						value: this.props.payments.selectedCard.value
					}
				},
				'cc',
				card,
				installment ? onVtInstallmentCallback : onVtCreditCardCallback
			)
		);
	}

	onVt3dsModalBoxClose() {
		const { dispatch } = this.props;
		dispatch(vtModalBoxOpen(false));
	}

	onMandiriEcashClose() {
		const { dispatch } = this.props;
		dispatch(ecashModalBoxOpen(false));
	}

	onDoPayment() {
		const { dispatch } = this.props;
		if (typeof this.props.payments.paymentMethod !== 'undefined') {
			let mode = 'complete';		
			switch (this.props.payments.paymentMethod) {
			case paymentMethodName.COMMERCE_VERITRANS_INSTALLMENT:
			case paymentMethodName.COMMERCE_VERITRANS:
				this.onRequestVtToken((this.props.payments.paymentMethod === paymentMethodName.COMMERCE_VERITRANS_INSTALLMENT));
				break;
			default:
				if (this.props.payments.selectedPaymentOption) {
					if (this.props.payments.selectedPaymentOption.uniqueConstant === 'mandiri_ecash') {
						mode = 'mandiri_ecash';
					} else if (this.props.payments.selectedPaymentOption.uniqueConstant === 'bca_klikpay') {
						mode = 'bca_klikpay';
					}
				}
				dispatch(
					pay(
						this.state.token, 
						this.props.soNumber, 
						this.props.payments.selectedPaymentOption,
						false,
						mode
					)
				);
				break;
			}
		}
	}

	onSubmitAddress(formData) {
		console.log(formData);
		const { dispatch } = this.props;
		dispatch(saveAddress(this.state.token, formData));
		this.setState({
			enableNewAddress: false
		});
	}
	onCardNumberChange(event) {
		console.log(event, this.state.test);
		if (event.valid) {
			this.props.dispatch(changeCreditCardNumber(event.ccNumber));
			const selectedPaymentOption = this.props.payments.selectedPayment.paymentItems[0];
			this.props.dispatch(applyBin(this.state.token, selectedPaymentOption.value, event, ''));
		}
	}
	onCardMonthChange(monthData) {
		console.log(event, this.state.test);
		this.props.dispatch(changeCreditCardMonth(monthData.value));
	}
	onCardYearChange(yearData) {
		console.log(event, this.state.test);
		this.props.dispatch(changeCreditCardYear(yearData.value));
	}
	onCardCvvChange(event) {
		console.log(event, this.state.test);
		this.props.dispatch(changeCreditCardCvv(event.target.value));
	}

	onBankChange(bank) {
		const { dispatch } = this.props;
		const selectedPaymentOption = this.props.payments.selectedPayment.paymentItems[0];
		dispatch(bankNameChange(this.state.token, bank, selectedPaymentOption));
	}
	
	getDistricts(cityAndProvince) {
		const { dispatch } = this.props;
		dispatch(getDistrict(this.state.token, cityAndProvince));
	}
	
	setDropship(checked, dropshipName = 'dropship_name', value = '', onClick = false) {
		let formDropshipper = this.state.formDropshipper;
		if (dropshipName) {
			formDropshipper[`${dropshipName}`] = value;
		}
		if (!checked) {
			formDropshipper = {
				dropship_name: '',
				dropship_phone: '',
			};
		}
		this.setState({
			dropshipper: checked,
			formDropshipper,
			isValidDropshipper: false,
			errorDropship: checked ? this.state.errorDropship : null,
		});
		if (onClick) {
			const tempSelectedAddress = this.state.selectedAddress;
			tempSelectedAddress.attributes.is_dropshipper = checked;
			this.onChoisedAddress(tempSelectedAddress);
		}
	}

	checkDropship(field = 'all') {
		if (this.state.dropshipper) {
			let formDropshipper = {};
			if (field !== 'all') {
				formDropshipper[`${field}`] = this.state.formDropshipper[`${field}`];
			} else {
				formDropshipper = this.state.formDropshipper;
			}
			this.validator.validateAll(formDropshipper)
			.then(success => {
				if (success) {
					this.setState({
						isValidDropshipper: field !== 'all' ? this.state.isValidDropshipper : true
					});
				} else {
					const { errorBag } = this.validator;
					this.setState({
						isValidDropshipper: false,
						errorDropship: errorBag
					});
				}
			});
		} else {
			this.setState({
				isValidDropshipper: true
			});
			this.onDoPayment();
		}
	}

	submitDropship() {
		if (this.state.isValidDropshipper) {
			const tempSelectedAddress = this.state.selectedAddress;
			tempSelectedAddress.attributes.is_dropshipper = this.state.dropshipper;
			tempSelectedAddress.attributes.dropship_name = this.state.formDropshipper.dropship_name;
			tempSelectedAddress.attributes.dropship_phone = this.state.formDropshipper.dropship_phone;
			this.onChoisedAddress(tempSelectedAddress).then(() => {
				this.setState({
					isValidPayment: true,
				});
				this.onDoPayment();
			});
		} else {
			this.checkDropship();
		}
	}

	activeShippingTab(active) {
		if ((!this.props.isPickupable || this.props.isPickupable === '0') && !active) {
			this.setState({
				restrictO2o: true
			});
		} else {
			this.setState({
				restrictO2o: false
			});
		}
		this.setState({
			addressTabActive: active
		});
		if ((!this.state.selectedLocker && !active) || (!this.state.selectedAddress && active)) {
			this.setState({
				enablePesananPengiriman: false,
				enablePembayaran: false,
			});
		} else if ((this.state.selectedAddress && active) || (this.state.selectedLocker && !active)) {
			this.setState({
				enablePesananPengiriman: true,
				enablePembayaran: true,
			});
		}
	}

	closeModalElocker() {
		this.setState({
			showModalO2o: false
		});
	}

	shippingMethodGosend(methodId, storeId) {
		const { dispatch } = this.props;
		dispatch(updateGosend(this.state.token, storeId, methodId, this.props));
	}

	render() {
		const {
			enableAlamatPengiriman,
			enablePesananPengiriman,
			enablePembayaran,
			formDataAddress
		} = this.state;

		const {
			coupon,
			// cart,
			payments,
			user,
			addresses,
            listo2o,
			latesto2o,
			o2oProvinces,
			isPickupable		
		} = this.props;
		
		return (
			this.props.loading ? <Loading /> : (
				<div className='page'>
					<Helmet title='Checkout' />
					<CheckoutHeader user={user} />
					<div className={styles.checkout}>
						<Container className={styles.fullHeight}>
							<Row className={styles.fullHeight}>
								<Col flex grid={4} className={enableAlamatPengiriman ? '' : styles.disabled}>
									<div className={styles.title}>1. Pilih Metode & Alamat Pengiriman</div>
									<CardPengiriman 
										selectedAddress={this.state.selectedAddress}
										addresses={addresses} 
										onChoisedAddress={this.onChoisedAddress} 
										onChangeAddress={this.onChangeAddress} 
										onGetO2oProvinces={this.onGetO2oProvinces} 
										onGetListO2o={this.onGetListO2o} 
										listo2o={listo2o} 
										onOpenModalO2o={this.onOpenModalO2o} 
										latesto2o={latesto2o} 
										selectedLocker={this.state.selectedLocker ? this.state.selectedLocker : (latesto2o ? latesto2o[0] : null)} 
										onSelectedLocker={this.onSelectedLocker} 
										selectO2oFromModal={this.state.selectO2oFromModal} 
										isPickupable={isPickupable} 
										dropshipper={this.state.dropshipper} 
										setDropship={this.setDropship} 
										checkDropship={this.checkDropship} 
										errorDropship={this.state.errorDropship} 
										activeShippingTab={this.activeShippingTab} 
									/>
								</Col>
								<Col flex grid={4} className={enablePesananPengiriman || this.state.restrictO2o ? '' : styles.disabled}>
									<div className={styles.title}>2. Rincian Pesanan & Pengiriman <span>({this.props.totalItems} items)</span></div>
									{
										<CardPesananPengiriman 
											loading={this.state.loadingUpdateCart} 
											cart={!this.state.cart ? [] : this.state.cart} 
											onDeleteCart={this.onDeleteCart} 
											onUpdateQty={this.onUpdateQty} 
											restrictO2o={this.state.restrictO2o} 
											shippingMethodGosend={this.shippingMethodGosend}
											selectedAddress={this.state.selectedAddress}
										/>
									}
								</Col>
								<Col flex grid={4} className={enablePembayaran && !this.state.restrictO2o ? '' : styles.disabled}>
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
										dropshipper={this.state.dropshipper}
										checkDropship={this.submitDropship}
										isValidDropshipper={this.state.isValidPayment}
										onDoPayment={this.onDoPayment}
										onCardNumberChange={this.onCardNumberChange}
										onCardMonthChange={this.onCardMonthChange}
										onCardYearChange={this.onCardYearChange}
										onCardCvvChange={this.onCardCvvChange}
										tahun={this.state.tahun}
										onBankChange={this.onBankChange}
									/>
								</Col>
							</Row>
						</Container>
					</div>
					{ 
						renderIf(this.props.cityProv)(
							<NewAddressModalbox 
								shown={this.state.enableNewAddress} 
								formDataAddress={formDataAddress} 
								cityProv={this.props.cityProv} 
								district={this.props.district} 
								getDistricts={this.getDistricts} 
								onSubmitAddress={this.onSubmitAddress} 
							/>
						)
					}
					<ElockerModalbox closeModalElocker={this.closeModalElocker} shown={this.state.showModalO2o} listo2o={!listo2o ? null : listo2o} o2oProvinces={!o2oProvinces ? null : o2oProvinces} onGetListO2o={this.onGetListO2o} onSelectedLocker={this.onSelectedLocker} />
					<PaymentSuccessModalbox shown={this.props.payments.paymentSuccess} />
					<PaymentErrorModalbox shown={this.props.payments.paymentError} />
					<VerifikasiNoHandponeModalbox />
					<Vt3dsModalBox
						shown={this.props.payments.show3ds}
						src={this.props.payments.vtRedirectUrl}
						onClose={this.onVt3dsModalBoxClose}
					/>
					<EcashModalBox shown={this.props.payments.showEcash} src={this.props.payments.mandiriRedirectUrl} onClose={this.onMandiriEcashClose} />
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
		soNumber: state.cart.soNumber,
		coupon: state.coupon,
		addresses: state.addresses.addresses,
		billing: state.addresses.billing,
		cart: state.cart.data,
		loadingUpdateCart: state.cart.loading,
		payments: state.payments,
		listo2o: state.addresses.o2o,
		latesto2o: state.addresses.latesto2o,
		o2oProvinces: state.addresses.o2oProvinces,
		isPickupable: state.cart.isPickupable,
		cityProv: state.addresses.cityProv, 
		district: state.addresses.district,
		totalItems: state.cart.totalItems,
	};
};

export default withCookies(connect(mapStateToProps)(Checkout));