import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import styles from './Checkout.scss';

// component load
import { Container, Row, Col, Loading, CheckoutHeader, Notification } from '@/components';
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
import { addCoupon, removeCoupon, resetCoupon, resendOtp, verifyOtp } from '@/state/Coupon/actions';
import {
	getAddresses,
	getO2OList,
	getO2OProvinces,
	getCityProvince,
	getDistrict,
	saveAddress
} from '@/state/Adresses/actions';
import { getPlaceOrderCart, getCart, updateQtyCart, updateCartWithoutSO, deleteCart, updateGosend, o2oChoise } from '@/state/Cart/actions';
import {
	changePaymentMethod,
	changePaymentOption,
	getAvailablePaymentMethod,
	openNewCreditCard,
	selectCreditCard,
	changeCreditCardNumber,
	changeCreditCardYear,
	changeCreditCardMonth,
	changeCreditCardCvv,
	vtModalBoxOpen,
	ecashModalBoxOpen,
	paymentError,
	paymentSuccess,
	pay,
	bankNameChange,
	applyBin,
	changeOvoNumber,
	changeBillingNumber,
	termChange,
	changeInstallmentCCNumber,
	changeInstallmentCCMonth,
	changeInstallmentCCYear,
	changeInstallmentCCCvv,
	saveCC,
	getAvailabelPaymentSelection
} from '@/state/Payment/actions';

import { getRefreshToken } from '@/state/Auth/actions';

import {
	paymentMethodName
} from '@/state/Payment/constants';

class Checkout extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.validator = new Validator({
			dropship_name: 'required|max:100',
			dropship_phone: 'required|numeric|min:6|max:14'
		});
		this.cardValidator = new Validator({
			year: 'required|min_value:10|min:1',
			month: 'required|min_value:1',
			cvv: 'required|min_value:1'
		});
		this.state = {
			enableAlamatPengiriman: true,
			enablePesananPengiriman: false,
			enablePembayaran: false,
			enableNewAddress: false,
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
			loadingCardPengiriman: false,
			tahun: [],
			showModalOtp: false,
			phoneNumber: null,
			notifInfo: true,
			appliedBin: null,
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
		this.onOvoNumberChange = this.onOvoNumberChange.bind(this);
		this.closeModalShippingAddress = this.closeModalShippingAddress.bind(this);
		this.onTermChange = this.onTermChange.bind(this);
		this.onInstallmentCCNumberChange = this.onInstallmentCCNumberChange.bind(this);
		this.onInstallmentCCMonthChange = this.onInstallmentCCMonthChange.bind(this);
		this.onInstallmentCCYearChange = this.onInstallmentCCYearChange.bind(this);
		this.onInstallmentCCCvvChange = this.onInstallmentCCCvvChange.bind(this);
		this.onCloseSuccessBox = this.onCloseSuccessBox.bind(this);
		this.onCloseErrorBox = this.onCloseErrorBox.bind(this);
		this.onSubmitPhoneNumber = this.onSubmitPhoneNumber.bind(this);
		this.onSubmitOtp = this.onSubmitOtp.bind(this);
		this.onVerificationClose = this.onVerificationClose.bind(this);
		this.onResendOtp = this.onResendOtp.bind(this);
		this.onVerity = this.onVerity.bind(this);
		this.onRequestSprintInstallment = this.onRequestSprintInstallment.bind(this);
		this.onSaveCcOption = this.onSaveCcOption.bind(this);
		this.onReload = this.onReload.bind(this);
		this.onBillingNumberChange = this.onBillingNumberChange.bind(this);
		this.onCheckProductJabodetabek = this.onCheckProductJabodetabek.bind(this);
	}

	componentWillMount() {
		const { dispatch } = this.props;

		if (this.props.cookies.get('user.exp') < new Date().getTime()) {
			dispatch(getRefreshToken({
				userToken: this.props.cookies.get('user.token'),
				userRFToken: this.props.cookies.get('user.rf.token')
			})).then((newToken) => {
				this.props.cookies.set('user.exp', newToken.expToken, { domain: '.mataharimall.com' });
				this.props.cookies.set('user.rf.token', newToken.userRFToken, { domain: '.mataharimall.com' });
				this.props.cookies.set('user.token', newToken.userToken, { domain: '.mataharimall.com' });

				this.onReload(dispatch);
			}).catch((error) => {
				this.setState({
					notifInfo: false,
					notifMessage: error.response.data.errorMessage,
					enablePembayaran: false
				});
			});
		} else {
			this.onReload(dispatch);
		}


		const t = new Date();
		const thisYear = t.getFullYear();
		let year = 0;
		const tahun = [{
			value: null,
			label: '-- pilih tahun --'
		}];
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
		// dispatch(getAddresses(this.props.cookies.get('user.token')));
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.cityProv !== nextProps.cityProv) {
			this.setState({
				loadingCardPengiriman: false
			});
		}
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

		if (!nextProps.coupon.validCoupon && nextProps.coupon.code === 403) {
			this.setState({
				showModalOtp: true
			});
		}
	}

	onReload(dispatch) {
		dispatch(getAddresses(this.props.cookies.get('user.token'))).then(defaultAddress => {
			if (typeof defaultAddress.type !== 'undefined') {
				this.setState({
					selectedAddress: defaultAddress,
					enablePesananPengiriman: true,
					enablePembayaran: true
				});
				dispatch(getPlaceOrderCart(this.props.cookies.get('user.token'), defaultAddress)).then(() => {
					this.setState({
						notifInfo: true,
					});
				}).catch((error) => {
					this.setState({
						notifInfo: true,
						notifMessage: error.response.data.errorMessage,
						enablePembayaran: false
					});
				});
			}
		});
		dispatch(getCart(this.props.cookies.get('user.token')));
		dispatch(getAvailablePaymentMethod(this.props.cookies.get('user.token')));
	}

	onAddCoupon(coupon) {
		const { dispatch, soNumber } = this.props;
		if (coupon) {
			dispatch(addCoupon(this.props.cookies.get('user.token'), soNumber, coupon));
		}
	}

	onRemoveCoupon(event) {
		const { dispatch, soNumber } = this.props;
		dispatch(removeCoupon(this.props.cookies.get('user.token'), soNumber));
	}

	onResetCoupon(event) {
		const { dispatch } = this.props;
		dispatch(resetCoupon());
	}

	onChoisedAddress(address, updatePaymentMethodList = true) {
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

		// set shipping cost to 0 before selected address
		// prevent product jabodetabek ship to outside
		dispatch(o2oChoise(this.props.cart));

		return dispatch(getPlaceOrderCart(this.props.cookies.get('user.token'), address, billing, updatePaymentMethodList)).then(() => {
			this.setState({
				notifInfo: true
			});
		}).catch((error) => {
			this.setState({
				notifInfo: true,
				notifMessage: error.response.data.errorMessage,
				enablePembayaran: false
			});
		});
	}

	onChangeAddress(address, flagAdd) {
		const { dispatch } = this.props;

		if (typeof this.props.cityProv === 'undefined') {
			dispatch(getCityProvince(this.props.cookies.get('user.token')));
		}
		const editAddress = address.attributes;
		const edit = flagAdd !== 'add';
		const formDataAddress = {
			id: edit ? address.id : '',
			label: edit ? editAddress.addressLabel : '',
			nama: edit ? editAddress.fullname : '',
			noHP: edit ? editAddress.phone : '',
			kota: edit ? editAddress.city : '',
			provinsi: edit ? editAddress.province : '',
			kotProv: edit ? `${editAddress.city}, ${editAddress.province}` : '',
			kecamatan: edit ? editAddress.district : '',
			kodepos: edit ? editAddress.zipcode : '',
			address: edit ? editAddress.address : '',
			latitude: edit ? editAddress.latitude : '',
			longitude: edit ? editAddress.longitude : '',
			isEdit: edit
		};
		this.getDistricts(`${editAddress.city}, ${editAddress.province}`);

		this.setState({
			enableNewAddress: true,
			loadingCardPengiriman: false,
			formDataAddress
		});
	}

	onCheckProductJabodetabek(newCart) {
		let enablePembayaran = true;
		if (this.state.selectedAddress.attributes.isJabodetabekArea === '0' && newCart.payload.cart.length > 0) {
			
			newCart.payload.cart.forEach((value, index) => {
				
				value.store.products.forEach((v, i) => {
					if (v.fgLocation !== '0') {
						enablePembayaran = false;
					}
				});
			});
			this.setState({
				enablePembayaran
			});
		}
	}

	onDeleteCart(cart) {
		const { dispatch } = this.props;
		if (this.props.soNumber) {
			dispatch(updateQtyCart(this.props.cookies.get('user.token'), 0, cart.data.id, this.props)).then(newCart => {
				this.onCheckProductJabodetabek(newCart);
			}).catch((error) => {
				console.log(error);
			});
		} else {
			dispatch(deleteCart(this.props.cookies.get('user.token'), cart.data.id, this.props)).then(newCart => {
				
				this.onCheckProductJabodetabek(newCart);
			}).catch((error) => {
				console.log(error);
			});
		}
		
		this.setState({
			cart: this.props.cart,
			loadingUpdateCart: true,
		});

	}

	onUpdateQty(qty, id) {
		const { dispatch } = this.props;
		if (this.props.soNumber) {
			dispatch(updateQtyCart(this.props.cookies.get('user.token'), qty, id, this.props));
		} else {
			dispatch(updateCartWithoutSO(this.props.cookies.get('user.token'), qty, id));
		}

		this.setState({
			cart: this.props.cart,
		});
	}

	onPaymentMethodChange(event) {
		this.props.dispatch(changePaymentMethod(event.value, this.props.payments.paymentMethods, this.props.cookies.get('user.token')));
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
			dispatch(applyBin(this.props.cookies.get('user.token'), selectedPaymentOption.value, cardNumber, bankName));
			this.setState({
				appliedBin: {
					selectedPaymentOption,
					cardNumber,
					bankName
				}
			});
		}
	}

	onNewCreditCard(event) {
		this.props.dispatch(openNewCreditCard());
	}

	onSelectCard(event) {
		if (event) {
			this.props.dispatch(selectCreditCard(event));
			const selectedPaymentOption = getAvailabelPaymentSelection(this.props.payments.selectedPayment);
			this.props.dispatch(applyBin(this.props.cookies.get('user.token'), selectedPaymentOption.value, event, ''));
			this.setState({
				appliedBin: {
					selectedPaymentOption,
					cardNumber: event,
					bankName: ''
				}
			});
		} else {
			this.props.dispatch(selectCreditCard(false));
		}
	}

	onGetListO2o(provinceId) {
		const { dispatch } = this.props;
		dispatch(getO2OList(this.props.cookies.get('user.token'), provinceId));
	}

	onGetO2oProvinces() {
		const { dispatch } = this.props;
		dispatch(getO2OProvinces(this.props.cookies.get('user.token')));
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

	onRequestSprintInstallment(mode) {
		const { dispatch } = this.props;
		dispatch(
			pay(
				this.props.cookies.get('user.token'),
				this.props.soNumber,
				this.props.payments.selectedPaymentOption,
				{
					card: {
						value: this.props.payments.selectedCard.value,
						bank: this.props.payments.selectedBank.value,
						detail: this.props.payments.selectedCardDetail
					},
					term: this.props.payments.term,
					cardNumber: this.props.payments.selectedCard.value,
					cardCVV: this.props.payments.selectedCardDetail.cvv,
					cardMonth: this.props.payments.selectedCardDetail.month,
					cardYear: this.props.payments.selectedCardDetail.year,
					amount: this.props.payments.total,
				},
				mode
			)
		);
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
			cardDetail.installment_term = this.props.payments.term.term;
			cardDetail.card_exp_month = this.props.payments.selectedCardDetail.month;
			cardDetail.card_exp_year = this.props.payments.selectedCardDetail.year;
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
						this.props.cookies.get('user.token'),
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
							},
							saveCC: this.props.payments.saveCC,
							ovoPhoneNumber: this.props.payments.ovoPhoneNumber,
							billingPhoneNumber: this.props.payments.billingPhoneNumber
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
						this.props.cookies.get('user.token'),
						this.props.soNumber,
						this.props.payments.selectedPaymentOption,
						{
							card: {
								value: response.token_id,
								bank: bankName,
								detail: this.props.payments.selectedCardDetail
							},
							saveCC: this.props.payments.saveCC,
							term: this.props.payments.term,
							ovoPhoneNumber: this.props.payments.ovoPhoneNumber,
							billingPhoneNumber: this.props.payments.billingPhoneNumber
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
				this.props.cookies.get('user.token'),
				this.props.soNumber,
				this.props.payments.selectedPaymentOption,
				{
					amount: this.props.payments.total,
					card: {
						value: this.props.payments.selectedCard.value
					},
					ovoPhoneNumber: this.props.payments.ovoPhoneNumber,
					billingPhoneNumber: this.props.payments.billingPhoneNumber
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

	onOvoNumberChange(event) {
		const { dispatch } = this.props;
		dispatch(changeOvoNumber(event.target.value));
	}

	onTermChange(term) {
		const { dispatch } = this.props;
		this.props.payments.selectedPaymentOption = getAvailabelPaymentSelection(this.props.payments.selectedPayment);
		dispatch(termChange(term));
	}

	onDoPayment() {
		const { dispatch } = this.props;
		if (typeof this.props.payments.paymentMethod !== 'undefined') {
			let mode = 'complete';
			switch (this.props.payments.paymentMethod) {
			case paymentMethodName.COMMERCE_VERITRANS_INSTALLMENT:
			case paymentMethodName.COMMERCE_VERITRANS:
				if (!this.props.payments.twoClickEnabled) {
					this.cardValidator.validateAll({
						year: this.props.payments.selectedCardDetail.year,
						month: this.props.payments.selectedCardDetail.month,
						cvv: this.props.payments.selectedCardDetail.cvv
					}).then(success => {
						if (success) {
							this.onRequestVtToken((this.props.payments.paymentMethod === paymentMethodName.COMMERCE_VERITRANS_INSTALLMENT));
						} else {
							dispatch(paymentError('Silahkan periksa data kartu kredit Anda.'));
						}
					});
				} else {
					this.onRequestVtToken((this.props.payments.paymentMethod === paymentMethodName.COMMERCE_VERITRANS_INSTALLMENT));
				}
				break;
			case paymentMethodName.COMMERCE_SPRINT_ASIA:
				mode = 'sprint';
				this.onRequestSprintInstallment(mode);
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
							this.props.cookies.get('user.token'),
							this.props.soNumber,
							this.props.payments.selectedPaymentOption,
							{
								ovoPhoneNumber: this.props.payments.ovoPhoneNumber,
								billingPhoneNumber: this.props.payments.billingPhoneNumber
							},
							mode
						)
					);
				break;
			}
		}
	}

	onSubmitAddress(formData) {
		const { dispatch } = this.props;

		dispatch(saveAddress(this.props.cookies.get('user.token'), formData));
		this.setState({
			enableNewAddress: false
		});
	}
	onCardNumberChange(event) {
		if (event.valid) {
			this.props.dispatch(changeCreditCardNumber(event.ccNumber));
			const selectedPaymentOption = getAvailabelPaymentSelection(this.props.payments.selectedPayment);
			this.props.dispatch(applyBin(this.props.cookies.get('user.token'), selectedPaymentOption.value, event.ccNumber, ''));
			this.setState({
				appliedBin: {
					selectedPaymentOption,
					cardNumber: event.ccNumber,
					bankName: ''
				}
			});
		}
	}

	onCardMonthChange(monthData) {
		this.props.dispatch(changeCreditCardMonth(monthData.value));
	}
	onCardYearChange(yearData) {
		this.props.dispatch(changeCreditCardYear(yearData.value));
	}
	onCardCvvChange(event) {
		this.props.dispatch(changeCreditCardCvv(event.target.value));
	}

	onBankChange(bank) {
		if (bank.value !== null) {
			const { dispatch } = this.props;
			const selectedPaymentOption = getAvailabelPaymentSelection(this.props.payments.selectedPayment);
			dispatch(bankNameChange(this.props.cookies.get('user.token'), bank, selectedPaymentOption));
		}
	}
	onInstallmentCCNumberChange(event) {
		if (event.valid) {
			this.props.dispatch(changeInstallmentCCNumber(event.ccNumber));
			const selectedPaymentOption = getAvailabelPaymentSelection(this.props.payments.selectedPayment);
			const bank = (!this.props.payments.selectedBank) ? '' : this.props.payments.selectedBank.value.value;
			this.props.dispatch(applyBin(this.props.cookies.get('user.token'), selectedPaymentOption.value, event, bank));
			this.setState({
				appliedBin: {
					selectedPaymentOption,
					cardNumber: event,
					bankName: bank
				}
			});
		}
	}
	onInstallmentCCMonthChange(monthData) {
		this.props.dispatch(changeInstallmentCCMonth(monthData.value));
	}
	onInstallmentCCYearChange(yearData) {
		this.props.dispatch(changeInstallmentCCYear(yearData.value));
	}
	onInstallmentCCCvvChange(event) {
		this.props.dispatch(changeInstallmentCCCvv(event.target.value));
	}

	onSaveCcOption(state, value) {
		this.props.dispatch(saveCC(state, value));
	}

	onCloseErrorBox() {
		this.props.dispatch(paymentError(false));
	}

	onCloseSuccessBox() {
		this.props.dispatch(paymentSuccess(false));
	}

	onSubmitPhoneNumber(phone) {
		const { dispatch } = this.props;
		dispatch(resendOtp(this.props.cookies.get('user.token'), phone));
		this.setState({
			phoneNumber: phone
		});
	}

	onBillingNumberChange(event) {
		const { dispatch } = this.props;
		dispatch(changeBillingNumber(event.target.value));
	}

	onSubmitOtp(otp) {
		const { dispatch } = this.props;
		dispatch(verifyOtp(this.props.cookies.get('user.token'), this.state.phoneNumber, otp, this.props));
	}

	onVerificationClose(event) {
		this.setState({
			showModalOtp: false
		});
	}

	onResendOtp(event) {
		const { dispatch } = this.props;
		dispatch(resendOtp(this.props.cookies.get('user.token'), this.state.phoneNumber));
	}

	onVerity(response) {
		console.log(this.state, response);
	}

	getDistricts(cityAndProvince) {
		const { dispatch } = this.props;
		dispatch(getDistrict(this.props.cookies.get('user.token'), cityAndProvince));
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
		const { dispatch } = this.props;		
		if (this.state.isValidDropshipper) {
			const tempSelectedAddress = this.state.selectedAddress;
			tempSelectedAddress.attributes.is_dropshipper = this.state.dropshipper;
			tempSelectedAddress.attributes.dropship_name = this.state.formDropshipper.dropship_name;
			tempSelectedAddress.attributes.dropship_phone = this.state.formDropshipper.dropship_phone;
			this.onChoisedAddress(tempSelectedAddress, false).then(() => {
				if (this.state.appliedBin) {
					const selectedPaymentOption = this.state.appliedBin.selectedPaymentOption;
					dispatch(applyBin(this.props.cookies.get('user.token'), selectedPaymentOption.value, this.state.appliedBin.cardNumber, this.state.appliedBin.bankName)).then(() => {
						this.onDoPayment(); 
					}).catch((error) => {

					});
				}
				this.setState({
					isValidPayment: true,
				});
			});
		} else {
			this.checkDropship();
		}
	}

	activeShippingTab(addressTabActive) {
		const { dispatch } = this.props;
		if (!addressTabActive) {
			dispatch(o2oChoise(this.props.cart));

		} else {
			dispatch(getPlaceOrderCart(this.props.cookies.get('user.token'), this.state.selectedAddress)).then(() => {
				this.setState({
					notifInfo: true,
				});
			}).catch((error) => {
				this.setState({
					notifInfo: true,
					notifMessage: error.response.data.errorMessage,
					enablePembayaran: false
				});
			});
		}
		
		
		if ((!this.props.isPickupable || this.props.isPickupable === '0') && !addressTabActive) {
			this.setState({
				restrictO2o: true
			});
		} else {
			this.setState({
				restrictO2o: false
			});
		}
		this.setState({
			addressTabActive
		});
		if ((!this.state.selectedLocker && !addressTabActive) || (!this.state.selectedAddress && addressTabActive)) {
			this.setState({
				enablePesananPengiriman: !addressTabActive,
				enablePembayaran: false,
			});
		} else if ((this.state.selectedAddress && addressTabActive) || (this.state.selectedLocker && !addressTabActive)) {
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

	closeModalShippingAddress() {
		this.setState({
			enableNewAddress: false
		});
	}

	shippingMethodGosend(methodId, storeId) {
		const { dispatch } = this.props;
		dispatch(updateGosend(this.props.cookies.get('user.token'), storeId, methodId, this.props));
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
										cart={this.state.cart}
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
										loading={this.state.loadingCardPengiriman}
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
											addressTabActive={this.state.addressTabActive}
											gosendInfo={this.props.gosendInfo}
											onChangeAddress={this.onChangeAddress}
										/>
									}
								</Col>
								<Col flex grid={4} className={enablePembayaran && !this.state.restrictO2o ? '' : styles.disabled}>
									<div className={styles.title}>3. Pembayaran</div>
									<CardPembayaran
										loading={payments.loading || this.state.loadingUpdateCart || this.state.loadingCardPengiriman}
										loadingUpdateCart={this.state.loadingUpdateCart}
										loadingCardPengiriman={this.state.loadingCardPengiriman}
										saveCC={payments.saveCC}
										loadingButtonCoupon={coupon.loading}
										coupon={coupon.coupon}
										validCoupon={coupon.validCoupon}
										messageCoupon={coupon.message}
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
										onOvoNumberChange={this.onOvoNumberChange}
										onBillingNumberChange={this.onBillingNumberChange}
										onTermChange={this.onTermChange}
										onInstallmentCCNumberChange={this.onInstallmentCCNumberChange}
										onInstallmentCCMonthChange={this.onInstallmentCCMonthChange}
										onInstallmentCCYearChange={this.onInstallmentCCYearChange}
										onInstallmentCCCvvChange={this.onInstallmentCCCvvChange}
										onSaveCcOption={this.onSaveCcOption}
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
								closeModalShippingAddress={this.closeModalShippingAddress}
							/>
						)
					}
					<ElockerModalbox closeModalElocker={this.closeModalElocker} shown={this.state.showModalO2o} listo2o={!listo2o ? null : listo2o} o2oProvinces={!o2oProvinces ? null : o2oProvinces} onGetListO2o={this.onGetListO2o} onSelectedLocker={this.onSelectedLocker} />
					<PaymentSuccessModalbox shown={this.props.payments.paymentSuccess} onClose={this.onCloseSuccessBox} />
					<PaymentErrorModalbox 
						shown={this.props.payments.paymentError} 
						paymentErrorMessage={this.props.payments.paymentErrorMessage}
						onClose={this.onCloseErrorBox} 
					/>
					<VerifikasiNoHandponeModalbox
						shown={this.state.showModalOtp}
						onSubmitPhoneNumber={this.onSubmitPhoneNumber}
						onSubmitOtp={this.onSubmitOtp}
						onResendOtp={this.onResendOtp}
						onVerificationClose={this.onVerificationClose}
						otp={coupon.otp}
					/>
					<Vt3dsModalBox
						shown={this.props.payments.show3ds}
						src={this.props.payments.vtRedirectUrl}
						onClose={this.onVt3dsModalBoxClose}
					/>
					<EcashModalBox shown={this.props.payments.showEcash} src={this.props.payments.mandiriRedirectUrl} onClose={this.onMandiriEcashClose} />
					{
						renderIf(!this.state.notifInfo)(
							<Notification shown={this.state.notifInfo || false} content={this.state.notifMessage} />
						)
					}

				</div>
			)
		);
	}
};

Checkout.propTypes = {
	cookies: instanceOf(Cookies).isRequired
};

const getBillingAddress = (state) => {
	if (
		typeof state === 'undefined'
	) {
		return false;
	}
	if (
		typeof state.addresses === 'undefined'
	) {
		return false;
	}
	if (
		typeof state.addresses.billing === 'undefined'
	) {
		return false;
	}
	return state.addresses.billing[0];
};

const getOvoInfo = (state) => {
	if (
		typeof state === 'undefined'
	) {
		return false;
	}
	if (
		typeof state.cart === 'undefined'
	) {
		return false;
	}
	if (
		typeof state.cart.ovoInfo === 'undefined'
	) {
		return false;
	}
	return state.cart.ovoInfo;
};

const mapStateToProps = (state) => {
	const billingAddress = getBillingAddress(state);
	if (state.payments.billingPhoneNumber === null) {
		state.payments.billingPhoneNumber = billingAddress ? billingAddress.attributes.phone : null;
	}
	state.payments.ovoInfo = getOvoInfo(state);
	if (state.payments.ovoPhoneNumber === null) {
		state.payments.ovoPhoneNumber = state.payments.ovoInfo ? state.payments.ovoInfo.ovoId : null;
	}
	return {
		billingAddress: getBillingAddress(state),
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
		gosendInfo: state.cart.gosendInfo,
	};
};

export default withCookies(connect(mapStateToProps)(Checkout));