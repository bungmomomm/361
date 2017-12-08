import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { T } from '@/data/translations';

import { actions as cartActions } from '@/state/Cart';
import { actions as paymentAction } from '@/state/Payment';
import { actions as globalAction } from '@/state/Global';
import { componentState } from '@/utils';

import { paymentGroupName, paymentMethodName } from '@/state/Payment/constants';
import {
	// CreditCardInput,
	// CreditCardRadio,
	// Sprites
} from '@/components';

import { 
	// Group,
	Select,
	Checkbox,
	Button,
	Input,
	Icon,
	Level
	// Row,
	// Col
} from 'mm-ui';

import { pushDataLayer } from '@/utils/gtm';
// import { Bulan } from '@/data';

// import { renderIf } from '@/utils';

import ModalOVOCountdown from './components/Modal/ModalOVOCountdown';
import ModalErrorPayment from './components/Modal/ModalErrorPayment';
import Tooltip from '@/containers/Mobile/components/shared/Tooltip';
import Vt3dsModalBox from './components/Modal/Vt3dsModalBox';

// payment methods components
import PaymentInstallment from './components/Payments/PaymentInstallment';
import PaymentOvo from './components/Payments/PaymentOvo';
import PaymentSelection from './components/Payments/PaymentSelection';

import PaymentCreditCard from './components/Payments/PaymentCreditCard';

import styles from '../../../Mobile/mobile.scss';
import { getRefreshToken } from '@/state/Auth/actions';

class StepFour extends Component {
	static placeOrder(userToken, userRFToken, dispatch, selectedAddress, billing) {
		if (selectedAddress.type !== 'shipping') {
			// set type pickup for O2O
			selectedAddress.type = 'pickup';
		}
		billing = billing.length > 0 ? billing[0] : false;
		dispatch(new cartActions.getPlaceOrderCart(userToken, selectedAddress, billing))
		.catch((error) => {
			if (error.response.data.code === 405) {
				dispatch(getRefreshToken({
					userToken,
					userRFToken
				})).then((response) => {
					dispatch(new cartActions.getPlaceOrderCart(response.userToken, selectedAddress, billing));
				});
			}
		});
	}

	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			selectedPaymentMethod: null,
			selectedPaymentOption: null,
			termCondition: true,
			ovo: {
				ovoTimer: 30, 
				useDefault: true,
				ovoPhonePayment: this.props.payments.ovoPhonePayment || this.props.payments.ovoPhoneNumber,
				ovoPhonePaymentValid: this.props.payments.ovoPhoneNumber,
				autoLinkage: true,
			},
			appliedBin: null,
			installmentList: [],
			tahun: [],
			tooltips: null,
			cardValidLuhn: false,
			alreadySubmitPay: false,

		};
		this.isOvoPayment = this.props.payments.paymentMethod === 'e_wallet_ovo';
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.onSelectCard = this.onSelectCard.bind(this);
		this.loadBlockContent = false;
	}

	componentWillMount() {
		const t = new Date();
		const thisYear = t.getFullYear();
		const tahun = [{
			value: null,
			label: '-- tahun'
		}];
		for (let year = thisYear; year < (thisYear + 10); year++) {
			tahun.push({
				value: year,
				label: year
			});
		}
		this.setState({
			tahun
		});
	}
	
	componentWillReceiveProps(nextProps) {
		if (this.props.payments !== nextProps.payments) {
			this.isOvoPayment = nextProps.payments.paymentMethod === paymentMethodName.OVO;
			let ovo = this.state.ovo;
			
			if (this.isOvoPayment) {
				const ovoPay = nextProps.payments.selectedPayment.paymentItems[0];		
				ovo = {
					...ovo,
					ovoTimer: ovoPay.settings.countdown,
					ovoInterval: ovoPay.settings.interval
				};
			}
			this.setState({
				ovo: {
					...ovo,
					ovoPhonePayment: this.props.payments.ovoPhoneNumber,
					ovoPhonePaymentValid: this.props.payments.ovoPhoneNumber,
				}
			});
		}
		if (this.props.payments.selectedPayment !== nextProps.payments.selectedPayment) {
			this.enableButtonPayNow(
				nextProps.payments.paymentMethod === paymentMethodName.GRATIS ||
				nextProps.payments.paymentMethod === paymentMethodName.COD
			);
		}
		if (!this.loadBlockContent) {
			const { dispatch } = this.props;
			dispatch(new globalAction.getBlockContents(this.props.cookies.get('user.token'), ['660']))
			.catch((error) => {
				if (error.response.data.code === 405) {
					dispatch(getRefreshToken({
						userToken: this.userCookies,
						userRFToken: this.userRFCookies
					})).then((response) => {
						dispatch(new globalAction.getBlockContents(response.userToken, ['660']));
					});
				}
			});
			this.loadBlockContent = true;
		}
		if (nextProps.payments.selectedPaymentOption && this.props.payments.paymentMethod !== nextProps.payments.paymentMethod && nextProps.payments.paymentMethod === paymentMethodName.COMMERCE_VERITRANS_INSTALLMENT) {
			this.setInstallmentList(nextProps.payments.selectedPaymentOption.banks[0]);
		}
	}

	onRefreshToken(dispatch, callback = false) {
		dispatch(getRefreshToken({
			userToken: this.userCookies,
			userRFToken: this.userRFCookies
		})).then((newToken) => {
			this.props.cookies.set('user.exp', Number(newToken.expToken), { domain: process.env.SESSION_DOMAIN });
			this.props.cookies.set('user.rf.token', newToken.userRFToken, { domain: process.env.SESSION_DOMAIN });
			this.props.cookies.set('user.token', newToken.userToken, { domain: process.env.SESSION_DOMAIN });
			this.userCookies = newToken.userToken;
			this.userRFCookies = newToken.userRFToken;

			if (callback) {
				this.callback();
			}
		});
	}

	onRequestVtToken(installment = false) {
		const { dispatch, soNumber } = this.props;
		let bankName = '';
		const cardDetail = {
			card_cvv: this.props.payments.selectedCardDetail.cvv,
			secure: true,
			gross_amount: this.props.payments.total,
		};

		if (installment) {
			cardDetail.card_number = this.props.payments.selectedCard.value;
			cardDetail.bank = this.props.payments.selectedBank.value.value;
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

			if (typeof this.props.payments.selectedBank !== 'undefined' && this.props.payments.selectedBank.value.value.toLowerCase() === 'bca') {
				cardDetail.channel = 'migs';
			}
		}

		const card = () => (cardDetail);

		const onVtCreditCardCallback = (response) => {
			if (response.redirect_url) {
				if (response.bank) {
					bankName = response.bank;
				}
				dispatch(new paymentAction.vtModalBoxOpen(true, response.redirect_url));
			} else if (parseInt(response.status_code, 10) === 200) {
				dispatch(new paymentAction.vtModalBoxOpen(false));
				dispatch(
					new paymentAction.pay(
						this.props.cookies.get('user.token'),
						this.props.soNumber,
						this.props.payments.selectedPaymentOption === false ? this.state.selectedPayment : this.props.payments.selectedPaymentOption,
						{
							amount: this.props.payments.total,
							status: 'success',
							status_code: response.status_code,
							status_message: response.status_message,
							card: {
								masked: this.props.payments.selectedCard.label,
								value: response.token_id,
								bank: {
									value: bankName
								},
								detail: this.props.payments.selectedCardDetail
							},
							saveCC: this.props.payments.saveCC,
							ovoPhoneNumber: this.props.payments.ovoPhoneNumber,
							billingPhoneNumber: this.props.payments.billingPhoneNumber
						},
						'complete',
						false,
						false,
						this.getAffTracking()
					)
				).catch((error) => {
					if (error.response.data.code === 405) {
						const cvCall = () => {
							this.onVtCreditCardCallback(response);
						};
						this.onRefreshToken(dispatch, cvCall);
						
					} else {
						this.onPaymentFailed();
					}
				});
			} else {
				dispatch(new paymentAction.vtModalBoxOpen(false));
				dispatch(new paymentAction.paymentError('Silahkan periksa data kartu kredit Anda.'));
				dispatch(
					new paymentAction.failAuthTokenCC(
						this.userCookies,
						soNumber
					)
				);
				this.onPaymentFailed();
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
				dispatch(new paymentAction.vtModalBoxOpen(true, response.redirect_url));
			} else if (parseInt(response.status_code, 10) === 200) {
				dispatch(new paymentAction.vtModalBoxOpen(false));
				dispatch(
					new paymentAction.pay(
						this.props.cookies.get('user.token'),
						this.props.soNumber,
						this.props.payments.selectedPaymentOption === false ? this.state.selectedPayment : this.props.payments.selectedPaymentOption,
						{
							amount: this.props.payments.total,
							card: {
								value: response.token_id,
								bank: {
									value: bankName
								},
								detail: this.props.payments.selectedCardDetail
							},
							saveCC: this.props.payments.saveCC,
							term: this.props.payments.term,
							ovoPhoneNumber: this.props.payments.ovoPhoneNumber,
							billingPhoneNumber: this.props.payments.billingPhoneNumber
						},
						'complete',
						false,
						false,
						this.getAffTracking()
					)
				).catch((error) => {
					if (error.response.data.code === 405) {
						const vtCall = () => {
							this.onVtInstallmentCallback(response);
						};
						this.onRefreshToken(dispatch, vtCall);
						
					} else {
						this.onPaymentFailed();
					}
				});
			} else {
				dispatch(new paymentAction.vtModalBoxOpen(false));
				dispatch(new paymentAction.paymentError('Silahkan periksa data kartu kredit Anda.'));
				dispatch(
					new paymentAction.failAuthTokenCC(
						this.userCookies,
						soNumber
					)
				);
				this.onPaymentFailed();
			}
		};
		dispatch(
			new paymentAction.pay(
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
				installment ? onVtInstallmentCallback : onVtCreditCardCallback,
				this.getAffTracking()
			)
		).catch((error) => {
			if (error.response.data.code === 405) {
				this.onRefreshToken(dispatch);
			} else {
				this.onPaymentFailed();
			}
		});
	}

	onPaymentFailed() {
		const { dispatch, stepState, billing } = this.props;
		const selectedAddress = stepState.stepOne.tabIndex > 0 ? stepState.stepOne.selectedAddressO2O : stepState.stepOne.selectedAddress;
		this.constructor.placeOrder(this.userCookies, this.userRFCookies, dispatch, selectedAddress, billing);
		this.setState({
			alreadySubmitPay: false
		});
	}

	onDoPayment() {
		const { dispatch } = this.props;
		let mode = 'complete';
		pushDataLayer('checkout', 'checkout', { step: 8 });
		if (typeof this.props.payments.paymentMethod !== 'undefined') {
			switch (this.props.payments.paymentMethod) {
			case paymentMethodName.COMMERCE_VERITRANS_INSTALLMENT:
				this.onRequestVtToken((this.props.payments.paymentMethod === paymentMethodName.COMMERCE_VERITRANS_INSTALLMENT));
				break;
			case paymentMethodName.COMMERCE_VERITRANS:
				this.onRequestVtToken((this.props.payments.paymentMethod === paymentMethodName.COMMERCE_VERITRANS_INSTALLMENT));
				break;
			case paymentMethodName.COMMERCE_SPRINT_ASIA:
				mode = 'sprint';
				this.onRequestSprintInstallment(mode);
				break;
			case paymentMethodName.OVO:
				if (this.props.payments.ovoPaymentNumber) {
					const ovoPhoneNumber = this.state.ovo.autoLinkage ? this.props.payments.ovoPaymentNumber : this.props.payments.ovoPhoneNumber;
					dispatch(
						new paymentAction.pay(
							this.userCookies,
							this.props.soNumber,
							this.props.payments.selectedPaymentOption === false ? this.state.selectedPayment : this.props.payments.selectedPaymentOption,
							{
								e_wallet: {
									id: this.props.payments.ovoPaymentNumber
								},
								ovoPhoneNumber,
								billingPhoneNumber: this.props.payments.billingPhoneNumber
							},
							this.props.payments.selectedPaymentOption.uniqueConstant,
							false,
							false,
							this.getAffTracking()
						)
					).then(() => {
						this.setState({
							showModalOvo: true
						});
					})
					.catch((error) => {
						if (error.response.data.code === 405) {
							const doPay = () => {
								this.onDoPayment();
							};
							this.onRefreshToken(dispatch, doPay);
						} else {
							this.onPaymentFailed();
						}
						this.setState({
							showModalOvo: false
						});
					});
				}
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
					new paymentAction.pay(
						this.userCookies,
						this.props.soNumber,
						this.props.payments.selectedPaymentOption === false ? this.state.selectedPayment : this.props.payments.selectedPaymentOption,
						{
							ovoPhoneNumber: this.props.payments.ovoPhoneNumber,
							billingPhoneNumber: this.props.payments.billingPhoneNumber
						},
						mode,
						false,
						false,
						this.getAffTracking()
					)
				).catch((error) => {
					if (error.response.data.code === 405) {
						const doPay = () => {
							this.onDoPayment();
						};
						this.onRefreshToken(dispatch, doPay);
					} else {
						this.onPaymentFailed();
					}
				});
				break;
			}
		}
	}

	onCardNumberChange(event) {
		const selectedPaymentOption = new paymentAction.getAvailabelPaymentSelection(this.props.payments.selectedPayment);
		if (event.valid) {
			this.props.dispatch(new paymentAction.changeCreditCardNumber(event.ccNumber));
			this.props.dispatch(new paymentAction.applyBin(this.userCookies, selectedPaymentOption.value, event.ccNumber, ''));
			this.setState({
				appliedBin: {
					selectedPaymentOption,
					cardNumber: event.ccNumber,
					bankName: ''
				},
				cardValidLuhn: true
			});
		} else {
			this.props.dispatch(new paymentAction.applyBin(this.userCookies, -1, event.ccNumber, ''));
			this.setState({
				appliedBin: {
					selectedPaymentOption,
					cardNumber: '',
					bankName: ''
				},
				cardValidLuhn: false
			});
		}
	}

	onSelectCard(event) {
		let value = false;
		if (typeof event.value !== 'undefined') {
			if (event.value !== null) {
				value = event.value;
			}
		} else {
			value = event;
		}
		if (value) {
			this.props.dispatch(new paymentAction.selectCreditCard(value));
			const selectedPaymentOption = new paymentAction.getAvailabelPaymentSelection(this.props.payments.selectedPayment);
			this.props.dispatch(new paymentAction.applyBin(this.props.cookies.get('user.token'), selectedPaymentOption.value, value, ''));
			this.setState({
				appliedBin: {
					selectedPaymentOption,
					cardNumber: value,
					bankName: ''
				}
			});
		} else {
			this.props.dispatch(new paymentAction.selectCreditCard(false));
		}
	}

	onCloseErrorBox() {
		const { dispatch } = this.props;
		dispatch(new paymentAction.paymentError(false));
	}

	onCloseSuccessBox() {
		const { dispatch } = this.props;
		dispatch(new paymentAction.paymentSuccess(false));
	}

	onTermChange(term) {
		const { dispatch } = this.props;
		const selectedPaymentOption = new paymentAction.getAvailabelPaymentSelection(this.props.payments.selectedPayment);
		this.props.payments.selectedPaymentOption = selectedPaymentOption;
		const bank = (!this.props.payments.selectedBank) ? '' : this.props.payments.selectedBank.value.value;
		const cardNumber = this.state.appliedBin ? this.state.appliedBin.cardNumber : '';
		dispatch(new paymentAction.applyBin(this.userCookies, selectedPaymentOption.value, cardNumber, bank, term.term));
		dispatch(new paymentAction.termChange(term));
	}

	onRequestSprintInstallment(mode) {
		const { dispatch } = this.props;
		dispatch(
			new paymentAction.pay(
				this.userCookies,
				this.props.soNumber,
				this.props.payments.selectedPaymentOption,
				{
					card: {
						value: this.props.payments.selectedCard.value,
						bank: this.props.payments.selectedBank.value,
						detail: this.props.payments.selectedCardDetail,
						type: this.props.payments.selectedCard.type,
					},
					term: this.props.payments.term,
					cardNumber: this.props.payments.selectedCard.value,
					cardCVV: this.props.payments.selectedCardDetail.cvv,
					cardMonth: this.props.payments.selectedCardDetail.month,
					cardYear: this.props.payments.selectedCardDetail.year,
					amount: this.props.payments.total,
					paymentMethod: this.props.payments.paymentMethod,
					ovoPhoneNumber: this.props.payments.ovoPhoneNumber,
					billingPhoneNumber: this.props.payments.billingPhoneNumber
				},
				mode,
				false,
				false,
				this.getAffTracking()
			)
		).catch((error) => {
			if (error.response.data.code === 405) {
				const sprintCall = () => {
					this.onRequestSprintInstallment(mode);
				};
				this.onRefreshToken(dispatch, sprintCall);
				
			} else {
				this.onPaymentFailed();
			}
		});
	}
	
	onBillingNumberChange(event) {
		const { dispatch } = this.props;
		dispatch(new paymentAction.changeBillingNumber(event.target.value, true));
	}		

	onOvoNumberChange(ovoNumber) {
		const { dispatch } = this.props;
		dispatch(new paymentAction.changeOvoNumber(ovoNumber));
	}

	onVt3dsModalBoxClose() {
		const { dispatch, soNumber } = this.props;
		dispatch(new paymentAction.vtModalBoxOpen(false));
		dispatch(
			new paymentAction.failAuthTokenCC(
				this.userCookies,
				soNumber
			)
		);
		this.onPaymentFailed();

	}

	getAffTracking() {
		return {
			af_track_id: this.props.cookies.get('afftrackid'),
			af_trx_id: this.props.cookies.get('afftrxid'),
			af_trx_click: Date.now()
		};
	}

	setInstallmentList(list) {
		const installmentList = [];
		list.listCicilan.map((item, idx) => (
			installmentList.push({
				label: item.label,
				value: item.value.term
			})
		));
		this.setState({ installmentList });
	}

	showTooltip(content) {
		let tooltip = '';
		if (content.length) {
			tooltip = content.join('<br />');
		}
		this.setState({ tooltip });
	}

	paymentMethodChange(stateSelectedPayment) {
		const { payments, dispatch } = this.props;
		dispatch(new paymentAction.changePaymentMethod(stateSelectedPayment.value, payments.paymentMethods, this.userCookies));
		this.setState({ 
			showPaymentInfo: null,
			stateSelectedPayment,
			cardValidLuhn: false
		});

	}

	okeoce(param) {
		if (param === 'ok') {
			this.onDoPayment();
		} else {
			location.reload();
		}
	}

	submitPayment(e) {
		e.preventDefault();
		this.setState({
			alreadySubmitPay: true
		});
		const { stepState, carts, billing, dispatch } = this.props;
		// check validation dropshipper
		if (!stepState.stepOne.dropshipper.validDropshipper) {
			const checkoutState = {
				...stepState,
				stepOne: {
					...stepState.stepOne,
					dropshipper: {
						...stepState.stepOne.dropshipper,
						validateDropshipper: true						
					}
				}
			};
			this.props.applyState(checkoutState);
			window.scrollTo(0, 0);
		} else if (stepState.stepOne.dropshipper.checked && stepState.stepOne.activeTab === 0) {
			const tempSelectedAddress = stepState.stepOne.selectedAddress;
			tempSelectedAddress.attributes.is_dropshipper = stepState.stepOne.dropshipper.checked;
			tempSelectedAddress.attributes.dropship_name = stepState.stepOne.dropshipper.name;
			tempSelectedAddress.attributes.dropship_phone = stepState.stepOne.dropshipper.phone;

			const gosendChecked = [];
			carts.forEach((value, index) => {
				if (value.store.shipping.gosend.gosendActivated) {
					gosendChecked.push(parseInt(value.store.id, 10));
				}
			});

			const billingPlaceOrder = billing.length > 0 ? billing[0] : false;
			dispatch(new cartActions.getPlaceOrderCart(this.userCookies, tempSelectedAddress, billingPlaceOrder))
			.then(() => {
				if (this.state.appliedBin) {
					const selectedPaymentOption = this.state.appliedBin.selectedPaymentOption;
					dispatch(new paymentAction.applyBin(this.userCookies, selectedPaymentOption.value, this.state.appliedBin.cardNumber, this.state.appliedBin.bankName)).then(() => {
						if (gosendChecked.length > 0) {
							carts.forEach((value, index) => {
								const indexStore = gosendChecked.indexOf(parseInt(value.store.id, 10));
								if (indexStore !== -1) {
									dispatch(new cartActions.updateGosend(this.userCookies, parseInt(value.store.id, 10), 19, this.props))
									.then(storeId => {
										gosendChecked.splice(indexStore, 1);
										if (gosendChecked.length === 0) {
											this.onDoPayment();
										}
									});
								}
							});
						} else {
							this.onDoPayment();
						}
					}).catch((error) => {
						// error apply bin 
					});
				} else {
					this.onDoPayment();
				}
			});
		} else {
			this.onDoPayment();
		}
	
	}
	
	checkOvoStatus(tick) {
		const { dispatch, soNumber, payments, stepState } = this.props;
		const params = payments.selectedPaymentOption.settings.checkParams.join('&');
		const checkStatusUrl = payments.selectedPaymentOption.settings.checkUrl;
		const selected = stepState.stepOne.tabIndex > 0 ? stepState.stepOne.selectedAddressO2O : stepState.stepOne.selectedAddress;
		
		if (this.props.payments.paymentOvoFailed) {
			this.setState({
				showModalOvo: false
			});
			// Event 0 = shipping, 1 = O2O
			if (selected.id) {
				this.onPaymentFailed();
			}
		} 
		if (tick % this.state.ovo.ovoInterval === 0) {
			dispatch(new paymentAction.checkStatusOvoPayment(`${checkStatusUrl}${params}`, this.userCookies, soNumber, this.state.ovo.ovoPhonePayment, tick < 1))
			.then(() => {
				if (tick === 0 && selected) {
					// Event 0 = shipping, 1 = O2O
					if (selected.id) {
						this.onPaymentFailed();
					}
				}
			});
		}
		if (tick === 0) {
			this.setState({
				showModalOvo: false
			});
		} 
	}

	checkCCField() {
		const { payments } = this.props;
		return (
			typeof payments.selectedCardDetail !== 'undefined' && 
			typeof payments.selectedCard !== 'undefined' && 
			payments.selectedCardDetail.cvv !== 0 &&
			payments.selectedCardDetail.cvv !== '' &&
			(payments.selectedCard.selected ||
			(payments.selectedCardDetail.month !== 0 &&
			payments.selectedCardDetail.year !== 0 &&
			this.state.cardValidLuhn)) &&
			payments.selectedCard.value !== ''
		);
	}
	
	checkShowingOvoPhone() {
		const { payments } = this.props;
		const ovoValidation = (payments.ovoInfo && payments.ovoInfo.ovoFlag === '1') ? true : !this.state.ovo.autoLinkage;
		return (!this.isOvoPayment || (ovoValidation && this.isOvoPayment));
	}

	createClassCard() {
		return [
			styles.card,
			this.props.loading ? styles.loading : '',
			this.props.disabled ? styles.disabled : ''
		].join(' ').trim();
	}

	enableButtonPayNow(e) {
		const validBilling = this.props.payments.billingPhoneNumber && this.props.payments.billingPhoneNumber !== '';
		this.props.applyState({
			...this.props.stepState,
			stepFour: {
				...this.props.stepState.stepFour,
				payNowButton: e && validBilling
			}
		});
	}

	payNowButtonState() {
		if (!this.props.stepState.stepFour.payNowButton) {
			return componentState.button.disabled;
		}

		if (this.state.alreadySubmitPay) {
			return componentState.button.loading;
		}

		return componentState.button.active;
	}

	renderSwitchPaymentElement() {
		const { payments } = this.props;
		// PAYMENT MENTHOD LIST
		switch (payments.selectedPayment.value) {
		case paymentGroupName.BANK_TRANSFER:
		case paymentGroupName.E_MONEY:
		case paymentGroupName.INTERNET_BANKING:
		case paymentGroupName.CONVENIENCE_STORE: {
			return (
				<PaymentSelection
					payments={payments}
					enableButtonPayNow={(e) => this.enableButtonPayNow(e)}
					styles={styles}
				/>
			);
		}
		case paymentGroupName.CREDIT_CARD:
			return (
				<PaymentCreditCard
					payments={payments}
					enableButtonPayNow={(e) => this.enableButtonPayNow(e)}
				/>
			);
		case paymentGroupName.INSTALLMENT: {
			return (
				<PaymentInstallment
					payments={payments}
					appliedBin={this.state.appliedBin}
					installmentList={this.state.installmentList}
					enableButtonPayNow={(e) => this.enableButtonPayNow(e)}
				/>
			);
		}
		case paymentGroupName.OVO:
			return (
				<PaymentOvo
					payments={payments}
					appliedBin={this.state.appliedBin}
					enableButtonPayNow={(e) => this.enableButtonPayNow(e)}
					autoLinkage={(e) => this.setState({ ovo: { ...this.state.ovo, autoLinkage: !this.state.ovo.autoLinkage } })}
				/>
			);
		default:
			return null;
		}
	};
	
	render() {
		const {
			payments
		} = this.props;


		const ovoReadOnly = (payments.ovoInfo && parseInt(payments.ovoInfo.ovoFlag, 10) === 1);
		return (
			<div className={this.createClassCard()}>
				<p><strong>{T.checkout.STEP_FOUR_LABEL}</strong></p>
				<div>
					<Select 
						block 
						selectStyle='panel'
						label={T.checkout.PAYMENT_METHOD}
						options={payments.paymentMethods.methods} 
						onChange={(e) => this.paymentMethodChange(e)}
						defaultValue={payments.selectedPayment ? payments.selectedPayment.id : null}
					/>
					{payments.selectedPaymentOption && payments.selectedPaymentOption.paymentMethod === 'commerce_cod' && 
						<Level>
							<Level.Left>&nbsp;</Level.Left>
							<Level.Right>
								{payments.selectedPaymentOption && payments.selectedPaymentOption.settings.info && <span className={styles.tooltipButton} role='button' tabIndex='-1' onClick={() => this.showTooltip(payments.selectedPaymentOption.settings.info)}>
									{<Icon name='exclamation-circle' />}
								</span>}
							</Level.Right>
						</Level>
					}
					
					
					{payments.selectedPayment && this.renderSwitchPaymentElement()}
					<label htmlFor='ovo-phone'>{T.checkout.PHONE_NUMBER_O2O_CONFIRMATION}</label>
					<Input
						dataProps={{
							value: payments.billingPhoneNumber || ''
						}}
						color={!payments.billingPhoneNumber ? 'red' : null}
						min={0}
						type='tel'
						placeholder={payments.billingPhoneNumber || T.checkout.BILLING_PHONE_NUMBER}
						onChange={(event) => this.onBillingNumberChange(event)} 
					/>
					{
						this.checkShowingOvoPhone() && payments.ovoPhoneNumber !== null &&
						<div>
							<label htmlFor='ovo-phone'>{T.checkout.OVO_PHONE_LABEL}</label>
							<Input 
								id='ovo-phone'
								state={ovoReadOnly ? 'disabled' : ''} 
								color={ovoReadOnly ? 'purple' : null} 
								icon={ovoReadOnly ? 'check' : null} 
								dataProps={{
									value: payments.ovoPhoneNumber
								}}
								placeholder={T.checkout.SAVED_OVO_PHONE} 
								type='tel'
								min={0}
								onChange={(event) => this.onOvoNumberChange(event.target.value)}
							/>
						</div>
					}
					<div className={styles.checkOutAction}>
						<Checkbox defaultChecked={this.state.termCondition} onClick={() => this.setState({ termCondition: !this.state.termCondition })}>{T.checkout.TERMS_PAYMENT}</Checkbox>
						<Button block size='large' color='red' state={this.payNowButtonState()} onClick={(e) => this.submitPayment(e)}>{T.checkout.BUY_NOW}</Button>
					</div>
				</div>
				{
					this.state.showModalOvo && (
						<ModalOVOCountdown
							show
							secondsRemaining={parseInt(this.state.ovo.ovoTimer, 10)}
							tick={(e) => this.checkOvoStatus(e)}
						/>
					)
				}
				{
					payments.paymentError && (
						<ModalErrorPayment
							show={payments.paymentError}
							onClose={() => this.onCloseErrorBox()}
							isConfirm={payments.isConfirm}
							okeoce={() => this.okeoce()}
							paymentErrorMessage={payments.error}
						/>
					)
				}
				{
					!!this.state.tooltip && (
						<Tooltip 
							show 
							content={this.state.tooltip} 
							onClose={() => this.setState({ tooltip: '' })}
						/>
					)
				}
				{
					this.props.payments.show3ds && <Vt3dsModalBox
						show
						src={this.props.payments.vtRedirectUrl}
						onClose={() => this.onVt3dsModalBoxClose()}
					/>
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const shippingAddress = (state.addresses.addresses && state.addresses.addresses[0]) || false;
	const billingPhoneNumber = (shippingAddress) ? shippingAddress.attributes.phone : null;
	if (state.payments.billingPhoneNumber === null) {
		state.payments.billingPhoneNumber = billingPhoneNumber;
	}
	state.payments.ovoInfo = state.cart.ovoInfo || false;
	if (state.payments.ovoPhoneNumber === null || state.payments.ovoPhoneNumber === '') {
		state.payments.ovoPhoneNumber = state.payments.ovoInfo ? state.payments.ovoInfo.ovoId : null;
	}

	if (state.payments.selectedPayment.value === paymentGroupName.CREDIT_CARD 
		&& state.payments.selectedPayment.cards < 1) {
		state.payments.twoClickEnabled = false;
	}

	return {
		payments: state.payments,
		soNumber: state.cart.soNumber,
		billing: state.addresses.billing,
		carts: state.cart.data,
		blockContent: state.global.blockContent,
	};
};

export default withCookies(connect(mapStateToProps)(StepFour));

