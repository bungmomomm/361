import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import _ from 'lodash';
import { T } from '@/data/translations';

import { actions as cartActions } from '@/state/Cart';
import { actions as paymentAction } from '@/state/Payment';
import { actions as globalAction } from '@/state/Global';

import { paymentGroupName, paymentMethodName } from '@/state/Payment/constants';
import {
	CreditCardInput,
	CreditCardRadio,
	Sprites
} from '@/components';

import { 
	Group,
	Radio,
	Select,
	Checkbox,
	Button,
	Level,
	Input,
	Icon,
	Row,
	Col
} from 'mm-ui';

import { pushDataLayer } from '@/utils/gtm';
import { Bulan } from '@/data';

import { renderIf } from '@/utils';

import ModalOVOCountdown from './components/ModalOVOCountdown';
import ModalErrorPayment from './components/ModalErrorPayment';
import Tooltip from './components/Tooltip';
import Vt3dsModalBox from './components/Vt3dsModalBox';

import styles from '../../../Mobile/mobile.scss';

class StepFour extends Component {
	static placeOrder(token, dispatch, selectedAddress, billing) {
		if (selectedAddress.type !== 'shipping') {
			// set type pickup for O2O
			selectedAddress.type = 'pickup';
		}
		billing = billing.length > 0 ? billing[0] : false;
		dispatch(new cartActions.getPlaceOrderCart(token, selectedAddress, billing));
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
			tooltips: null
		};
		this.isOvoPayment = this.props.payments.paymentMethod === 'e_wallet_ovo';
		this.cookies = this.props.cookies.get('user.token');
		this.onNewCreditCard = this.onNewCreditCard.bind(this);
		this.onCardNumberChange = this.onCardNumberChange.bind(this);
		this.onCardMonthChange = this.onCardMonthChange.bind(this);
		this.onCardYearChange = this.onCardYearChange.bind(this);
		this.onCardCvvChange = this.onCardCvvChange.bind(this);
		this.onSelectCard = this.onSelectCard.bind(this);
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
					autoLinkage: (this.props.payments.ovoInfo.ovoFlag === '0'),
				}
			});
		}
		if (typeof this.props.blockContent === 'undefined') {
			const { dispatch } = this.props;
			dispatch(new globalAction.getBlockContents(this.props.cookies.get('user.token'), ['660']));
		}
	}

	onOvoPaymentNumberChange(event) {
		const ovo = this.state.ovo;
		const ovoPhonePayment = event.target.value;
		const regexPhone = /^[0-9]{5,30}/;
		let ovoPhonePaymentValid;
		if (regexPhone.test(ovoPhonePayment)) {
			ovoPhonePaymentValid = true;
		} else {
			ovoPhonePaymentValid = false;
		}
		this.setState({
			ovo: {
				...ovo,
				ovoPhonePayment,
				ovoPhonePaymentValid,
			}
		});
	}
	
	onSelectedPaymentItem(selectedPaymentItem) {
		const { payments, dispatch } = this.props;
		dispatch(new paymentAction.changePaymentOption(selectedPaymentItem, this.cookies));
		this.selectedData = _.find(payments.selectedPayment.paymentItems, ['value', selectedPaymentItem.value]);
		if (this.selectedData) {
			this.setState({
				selectedPaymentOption: selectedPaymentItem,
				installmentList: [],
				showPaymentInfo: {
					id: selectedPaymentItem.value,
					notes: this.selectedData.settings.info.join(' ')
				}
			});
		} else {
			this.setState({ 
				selectedPaymentItem 
			});
		}
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
				);
			} else {
				dispatch(new paymentAction.vtModalBoxOpen(false));
				dispatch(new paymentAction.paymentError('Silahkan periksa data kartu kredit Anda.'));
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
				);
			} else {
				dispatch(new paymentAction.vtModalBoxOpen(false));
				dispatch(new paymentAction.paymentError('Silahkan periksa data kartu kredit Anda.'));
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
		);
	}

	onDoPayment() {
		const { dispatch } = this.props;
		let validator = false;
		let mode = 'complete';
		pushDataLayer('checkout', 'checkout', { step: 8 });
		if (typeof this.props.payments.paymentMethod !== 'undefined') {
			switch (this.props.payments.paymentMethod) {
			case paymentMethodName.COMMERCE_VERITRANS_INSTALLMENT:
				if (this.props.payments.selectedPaymentOption !== false) {
					this.setState({
						selectedPayment: this.props.payments.selectedPaymentOption
					});
				}
				
				if (this.props.payments.twoClickEnabled) {
					validator = typeof this.elCvvInstallment.validation !== 'undefined' && this.elCvvInstallment.validation.checkValid();
				} else {
					validator = typeof this.elMonthInstallment.validation !== 'undefined' && this.elMonthInstallment.validation.checkValid() &&
								typeof this.elYearInstallment.validation !== 'undefined' && this.elYearInstallment.validation.checkValid() &&
								typeof this.elCvvInstallment.validation !== 'undefined' && this.elCvvInstallment.validation.checkValid();
				}
			
				if (validator) {
					this.onRequestVtToken((this.props.payments.paymentMethod === paymentMethodName.COMMERCE_VERITRANS_INSTALLMENT));
				} else {
					dispatch(new paymentAction.paymentError('Silahkan periksa data kartu kredit Anda.'));
				}
				break;
			case paymentMethodName.COMMERCE_VERITRANS:
				if (this.props.payments.selectedPaymentOption !== false) {
					this.setState({
						selectedPayment: this.props.payments.selectedPaymentOption
					});
				}
				
				if (this.props.payments.twoClickEnabled) {
					validator = this.elCCCvv.validation.checkValid();
				} else {
					validator = this.elCCMonth.validation.checkValid() && this.elCCYear.validation.checkValid() && this.elCCCvv.validation.checkValid();
				}
			
				if (validator) {
					this.onRequestVtToken((this.props.payments.paymentMethod === paymentMethodName.COMMERCE_VERITRANS_INSTALLMENT));
				} else {
					dispatch(new paymentAction.paymentError('Silahkan periksa data kartu kredit Anda.'));
				}
				break;
			case paymentMethodName.COMMERCE_SPRINT_ASIA:
				mode = 'sprint';
				this.onRequestSprintInstallment(mode);
				break;
			case paymentMethodName.OVO:
				if (this.state.ovo.ovoPhonePayment) {
					dispatch(
						new paymentAction.pay(
							this.cookies,
							this.props.soNumber,
							this.props.payments.selectedPaymentOption === false ? this.state.selectedPayment : this.props.payments.selectedPaymentOption,
							{
								e_wallet: {
									id: this.state.ovo.ovoPhonePayment
								},
								ovoPhoneNumber: this.props.payments.ovoPhoneNumber,
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
					.catch(() => {
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
						this.cookies,
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
				);
				break;
			}
		}
	}

	onNewCreditCard(event) {
		const { dispatch } = this.props;
		dispatch(new paymentAction.openNewCreditCard());
	}

	onCardNumberChange(event) {
		const selectedPaymentOption = new paymentAction.getAvailabelPaymentSelection(this.props.payments.selectedPayment);
		if (event.valid) {
			this.props.dispatch(new paymentAction.changeCreditCardNumber(event.ccNumber));
			this.props.dispatch(new paymentAction.applyBin(this.cookies, selectedPaymentOption.value, event.ccNumber, ''));
			this.setState({
				appliedBin: {
					selectedPaymentOption,
					cardNumber: event.ccNumber,
					bankName: ''
				}
			});
		} else {
			this.props.dispatch(new paymentAction.applyBin(this.cookies, -1, event.ccNumber, ''));
			this.setState({
				appliedBin: {
					selectedPaymentOption,
					cardNumber: '',
					bankName: ''
				}
			});
		}
	}

	onCardMonthChange(monthData) {
		this.props.dispatch(new paymentAction.changeCreditCardMonth(monthData.value));
	}

	onCardYearChange(yearData) {
		this.props.dispatch(new paymentAction.changeCreditCardYear(yearData.value));
	}
	onCardCvvChange(event) {
		this.props.dispatch(new paymentAction.changeCreditCardCvv(event.target.value));
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

	onBankChange(bank) {
		if (bank.value !== null) {
			// this.checkValidInstallment();
			const { dispatch } = this.props;
			const selectedPaymentOption = new paymentAction.getAvailabelPaymentSelection(this.props.payments.selectedPayment);
			dispatch(new paymentAction.bankNameChange(this.cookies, bank, selectedPaymentOption));
		}
	}

	onTermChange(term) {
		const { dispatch } = this.props;
		const selectedPaymentOption = new paymentAction.getAvailabelPaymentSelection(this.props.payments.selectedPayment);
		this.props.payments.selectedPaymentOption = selectedPaymentOption;
		const bank = (!this.props.payments.selectedBank) ? '' : this.props.payments.selectedBank.value.value;
		const cardNumber = this.state.appliedBin ? this.state.appliedBin.cardNumber : '';
		dispatch(new paymentAction.applyBin(this.cookies, selectedPaymentOption.value, cardNumber, bank, term.term));
		dispatch(new paymentAction.termChange(term));
	}

	onInstallmentCCMonthChange(monthData) {
		const { dispatch } = this.props;
		dispatch(new paymentAction.changeInstallmentCCMonth(monthData.value));
	}
	onInstallmentCCYearChange(yearData) {
		const { dispatch } = this.props;
		dispatch(new paymentAction.changeInstallmentCCYear(yearData.value));
	}
	onInstallmentCCCvvChange(event) {
		const { dispatch } = this.props;
		dispatch(new paymentAction.changeInstallmentCCCvv(event.target.value));
	}

	onInstallmentCCNumberChange(event) {
		this.props.dispatch(new paymentAction.changeInstallmentCCNumber(event.ccNumber, event.ccType));
		const selectedPaymentOption = new paymentAction.getAvailabelPaymentSelection(this.props.payments.selectedPayment);
		const bank = (!this.props.payments.selectedBank) ? '' : this.props.payments.selectedBank.value.value;
		const term = (this.props.payments.term && this.props.payments.term.term) ? this.props.payments.term.term : '';
		if (event.valid) {
			this.props.dispatch(new paymentAction.applyBin(this.cookies, selectedPaymentOption.value, event.ccNumber, bank, term))
			.then(success => {
				this.props.dispatch(new paymentAction.refreshInstallmentTerm(this.props.payments.selectedPayment, success));
			});
			this.setState({
				appliedBin: {
					selectedPaymentOption,
					cardNumber: event.ccNumber,
					bankName: bank,
					installment_term: term
				}
			});
		} else {
			this.props.dispatch(new paymentAction.applyBin(this.cookies, -1, event.ccNumber, bank, term));
			this.setState({
				appliedBin: {
					selectedPaymentOption,
					cardNumber: '',
					bankName: bank,
					installment_term: term
				}
			});
		}
	}

	onRequestSprintInstallment(mode) {
		const { dispatch } = this.props;
		dispatch(
			new paymentAction.pay(
				this.cookies,
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
		);
	}
	
	onBillingNumberChange(event) {
		const { dispatch } = this.props;
		dispatch(new paymentAction.changeBillingNumber(event.target.value, true));
	}		

	getAffTracking() {
		return {
			af_track_id: this.props.cookies.get('afftrackid'),
			af_trx_id: this.props.cookies.get('afftrxid'),
			af_trx_click: Date.now()
		};
	}

	setDefaultOvo() {
		const ovo = this.state.ovo;
		const useDefault = !this.state.ovo.useDefault;
		const ovoPhonePayment = useDefault ? this.props.payments.ovoPaymentNumber : '';
		this.setState({
			ovo: {
				...ovo,
				useDefault,
				ovoPhonePayment,
				ovoPhonePaymentValid: useDefault
			}
		});
	}

	setInstallmentList(list) {
		const installmentList = [];
		list.listCicilan.map((item, idx) => (
			installmentList.push({
				label: item.label,
				value: item.label
			})
		));
		this.setState({ installmentList });
	}

	checkValidInstallment(event) {
		if (event.ccNumber.length < 1) {
			this.setState({
				validInstallmentBin: true
			});
		} else {
			const bank = (!this.props.payments.selectedBank) ? 'mandiri' : this.props.payments.selectedBank.value.value;
			const installmentBin = this.props.blockContent.filter(e => parseInt(e.id, 10) === 660)[0] || null;

			if (installmentBin) {
				const installmentBinBank = JSON.parse(installmentBin.attributes.block)[`${bank.replace(' ', '_').toUpperCase()}`];
				const checkingBin = installmentBinBank.filter(e => event.ccNumber.startsWith(e));

				if (checkingBin.length > 0) {
					this.onInstallmentCCNumberChange(event);
					this.setState({
						validInstallmentBin: true
					});
				} else {
					this.setState({
						validInstallmentBin: false
					});
				}
			}
		}
	}

	paymentMethodChange(stateSelectedPayment) {
		const { payments, dispatch } = this.props;
		dispatch(new paymentAction.changePaymentMethod(stateSelectedPayment.value, payments.paymentMethods, this.cookies));
		this.setState({ 
			showPaymentInfo: null,
			stateSelectedPayment
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
			dispatch(new cartActions.getPlaceOrderCart(this.cookies, tempSelectedAddress, billingPlaceOrder))
			.then(() => {
				if (this.state.appliedBin) {
					const selectedPaymentOption = this.state.appliedBin.selectedPaymentOption;
					dispatch(new paymentAction.applyBin(this.cookies, selectedPaymentOption.value, this.state.appliedBin.cardNumber, this.state.appliedBin.bankName)).then(() => {
						if (gosendChecked.length > 0) {
							carts.forEach((value, index) => {
								const indexStore = gosendChecked.indexOf(parseInt(value.store.id, 10));
								if (indexStore !== -1) {
									dispatch(new cartActions.updateGosend(this.cookies, parseInt(value.store.id, 10), 19, this.props))
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
		const { dispatch, soNumber, payments, stepState, billing } = this.props;
		const params = payments.selectedPaymentOption.settings.checkParams.join('&');
		const checkStatusUrl = payments.selectedPaymentOption.settings.checkUrl;
		const selected = stepState.stepOne.tabIndex > 0 ? stepState.stepOne.selectedAddressO2O : stepState.stepOne.selectedAddress;
		
		if (this.props.payments.paymentOvoFailed) {
			this.setState({
				showModalOvo: false
			});
			// Event 0 = shipping, 1 = O2O
			if (selected.id) {
				this.constructor.placeOrder(this.cookies, dispatch, selected, billing);
			}
		} 
		if (tick % this.state.ovo.ovoInterval === 0) {
			dispatch(new paymentAction.checkStatusOvoPayment(`${checkStatusUrl}${params}`, this.cookies, soNumber, this.state.ovo.ovoPhonePayment, tick < 1))
			.then(() => {
				if (tick === 0 && this.state.selectedAddress) {
					// Event 0 = shipping, 1 = O2O
					if (selected.id) {
						this.constructor.placeOrder(this.cookies, dispatch, selected, billing);
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
	
	checkActiveBtnSubmit() {
		const validOvo = this.isOvoPayment ? this.state.ovo.ovoPhonePaymentValid : true;
		const validBilling = this.props.payments.billingPhoneNumber && this.props.payments.billingPhoneNumber !== '';
		if (validBilling && validOvo && this.state.termCondition && this.props.payments.selectedPayment && this.props.payments.selectedPaymentOption) {
			return '';
		}
		return 'disabled';
	}
	
	checkShowingOvoPhone() {
		return (!this.isOvoPayment || (!this.state.ovo.autoLinkage && this.isOvoPayment));
	}

	showTooltip(content) {
		let tooltip = '';
		if (content.length) {
			tooltip = content.join(' ');
		}
		this.setState({ tooltip });
	}
	
	render() {
		const {
			payments
		} = this.props;

		let numberOfCard = 0;
		const minNumberOfCard = 0;
		numberOfCard = (payments.selectedPayment.value === paymentGroupName.CREDIT_CARD) ? payments.selectedPayment.cards : 0;

		const CvvElement = (
			<Row>
				<Col grid={4}>
					<Input
						type='password'
						placeholder='cvv'
						onBlur={this.onCardCvvChange}
						validation={{
							rules: 'required|min_value:1',
							name: 'cvv'
						}}
						ref={(c) => { this.elCCCvv = c; }}
					/>
				</Col>
				<Col grid={4}>
					<Sprites name='cvv' />
				</Col>
			</Row>
		);


		const switchPaymentElement = () => {
			let { ovoDefault, ovoPaymentInput } = '';
			// PAYMENT MENTHOD LIST
			switch (payments.selectedPayment.value) {
			case paymentGroupName.BANK_TRANSFER:
			case paymentGroupName.E_MONEY:
			case paymentGroupName.INTERNET_BANKING:
			case paymentGroupName.CONVENIENCE_STORE: {
				const enabledPaymentItems = _.filter(payments.selectedPayment.paymentItems, (e) => { return e.value !== null; });
				const listPayment = [];
				enabledPaymentItems.map((option, index) => {
					const RadioLabel = (
						<Level key={index}>
							<Level.Left>{option.label}</Level.Left>
							<Level.Right >
								{option.disabled && <div className='font-red'>{option.disableMessage}</div>}
								{option.settings.image && <img src={option.settings.image} alt={option.label} height='15px' />}
								{option.settings.info && <span role='button' tabIndex='-1' onClick={() => this.showTooltip(option.settings.info)}>
									<Icon name='exclamation-circle' className={styles.tooltipButton} />
								</span>}
							</Level.Right>
						</Level>
					);
					return listPayment.push({
						label: RadioLabel, 
						dataProps: { 
							name: `payment-${payments.selectedPayment.value}`, 
							onChange: () => this.onSelectedPaymentItem(option),
							disabled: option.disabled,
							checked: this.state.selectedPaymentOption === option || false
						}
					});
				});
				return [
					<Radio inputStyle='blocklist' data={listPayment} />
				];
			}
			case paymentGroupName.CREDIT_CARD:
				return payments.selectedPayment.paymentItems.map((option, index) => (
					option.cards.length <= 3 ? (
						option.cards.map((card, cardIndex) => (
							card.value && (
								<div key={cardIndex} >
									<CreditCardRadio
										name='cc'
										variant='list'
										value={card.value}
										content={card.label}
										defaultChecked={card.selected}
										sprites={card.sprites}
										onClick={this.onSelectCard}
									/>
									{ card.selected && CvvElement }
								</div>
							)
						))
					) : (
						<Select block key={index} options={option.cards} />
					)
				));
			case paymentGroupName.INSTALLMENT: {
				return (
					<Group>
						<Select block options={payments.selectedPayment.paymentItems[0].banks} onChange={(e) => this.onBankChange(e)} defaultValue={payments.selectedBank.value} value={payments.selectedBank.value} />
						{this.state.installmentList.length > 0 && <Select block options={this.state.installmentList} onChange={(e) => this.onTermChange(e.value)} />}
						<CreditCardInput
							placeholder='Masukkan Nomor Kartu'
							sprites='payment-option'
							onChange={(e) => this.checkValidInstallment(e)}
							message={this.state.validInstallmentBin ? null : 'Masukan no kartu kredit yang sesuai'}
							color={this.state.validInstallmentBin ? null : 'red'}
						/>
						<Group grouped>
							<Select
								block
								options={Bulan}
								onChange={(e) => this.onInstallmentCCMonthChange(e)}
								validation={{
									rules: 'required|min_value:1',
									name: 'month installment'
								}}
								ref={(c) => { this.elMonthInstallment = c; }}
							/>
							<Select
								block
								options={this.state.tahun}
								onChange={(e) => this.onInstallmentCCYearChange(e)}
								validation={{
									rules: 'required|min_value:10|min:1',
									name: 'year installment'
								}}
								ref={(c) => { this.elYearInstallment = c; }}
							/>
							<Input
								dataProps={{ minLength: 0, maxLength: 4 }}
								type='password'
								placeholder='cvv'
								onChange={(e) => this.onInstallmentCCCvvChange(e)}
								validation={{
									rules: 'required|min_value:1',
									name: 'cvv installment'
								}}
								ref={(c) => { this.elCvvInstallment = c; }}
							/>
							<div style={{ paddingRight: '30px' }} ><Sprites name='cvv' /></div>
						</Group>
					</Group>
				);
			}
			case paymentGroupName.OVO:
				ovoPaymentInput = (
					<Input
						dataProps={{ minLength: 0, maxLength: 30 }}
						defaultValue={this.state.ovo.ovoPhonePayment}
						type='number'
						placeholder={'Masukan No Hp yang terdaftar di OVO'}
						onChange={(e) => this.onOvoPaymentNumberChange(e)}
					/>
				);

				ovoDefault = ([this.state.ovo.useDefault ?
					<div 
						role='button'
						tabIndex={-1}
						className='font-grey'
						onClick={() => this.setDefaultOvo()} 
					>
						<Icon name='plus-circle' /> Gunakan OVO Lain
					</div>
				: ovoPaymentInput]);

				return (
					<div>
						{
							(payments.ovoInfo && parseInt(payments.ovoInfo.ovoFlag, 10) === 1) ?
								<div>
									<Radio 
										inputStyle='blocklist' 
										data={[{
											label: (
												<Level>
													<Level.Left>
														{payments.ovoPhoneNumber}
													</Level.Left>
													<Level.Right>
														<Icon name='ovo' sprites='ovo' />
													</Level.Right>
												</Level>
											),
											dataProps: {
												name: 'ovo-phone-payment',
												onChange: () => this.setDefaultOvo(),
												checked: this.state.ovo.useDefault
											}
										}]} 
									/>
									{ovoDefault}
								</div>
							:
								<div>
									{ovoPaymentInput}
									<Checkbox defaultChecked={this.state.ovo.autoLinkage} onClick={() => this.setState({ ovo: { ...this.state.ovo, autoLinkage: !this.state.ovo.autoLinkage } })}>Simpan untuk transaksi berikutnya & otomatis terhubung ke akun OVO</Checkbox>
								</div>
						}
					</div>
				);
			default:
				return null;
			}
			
		};

		const ovoReadOnly = (payments.ovoInfo && parseInt(payments.ovoInfo.ovoFlag, 10) === 1);
		return (
			<div className={styles.card}>
				<p><strong>{T.checkout.STEP_FOUR_LABEL}</strong></p>
				<div>
					<Select 
						block 
						label={T.checkout.PAYMENT_METHOD}
						options={payments.paymentMethods.methods} 
						onChange={(e) => this.paymentMethodChange(e)}
						defaultValue={payments.selectedPayment ? payments.selectedPayment.id : null}
					/>
					{ payments.selectedPayment && switchPaymentElement()}
					{ renderIf(payments.selectedPayment.value === paymentGroupName.CREDIT_CARD && payments.twoClickEnabled && numberOfCard > minNumberOfCard)(
							
						<Button clean color='grey' icon='plus-circle' iconPosition='left' onClick={this.onNewCreditCard}>{T.checkout.ADD_NEW_CARD}</Button>
							
					)}
					{ renderIf((payments.openNewCreditCard && payments.selectedPayment.value === paymentGroupName.CREDIT_CARD 
					&& !payments.twoClickEnabled) || (payments.selectedPayment.value === paymentGroupName.CREDIT_CARD && numberOfCard < (minNumberOfCard + 1)))(
						<div>
							<Group><CreditCardInput placeholder={T.checkout.INPUT_CART_NUMBER} sprites='payment-option' onChange={this.onCardNumberChange} /></Group>
							<label htmlFor='masa-berlaku'key={2}>Masa Berlaku</label>
							<Group grouped id='masa-berlaku'>
								<Select
									block
									options={Bulan}
									onChange={this.onCardMonthChange}
									validation={{
										rules: 'required|min_value:1',
										name: 'month'
									}}
									ref={(c) => { this.elCCMonth = c; }}
								/>
								<Select
									block
									options={this.state.tahun}
									onChange={this.onCardYearChange}
									validation={{
										rules: 'required|min_value:10|min:1',
										name: 'year'
									}}
									ref={(c) => { this.elCCYear = c; }}
								/>
								<Input
									dataProps={{ minLength: 0, maxLength: 4 }}
									type='password'
									placeholder='cvv'
									onBlur={this.onCardCvvChange}
									validation={{
										rules: 'required|min_value:1',
										name: 'cvv'
									}}
									ref={(c) => { this.elCCCvv = c; }}
								/>
								<div style={{ paddingRight: '30px' }} ><Sprites name='cvv' /></div>
							</Group>
							<Checkbox defaultChecked onClick={(state, value) => this.props.onSaveCcOption(state, value)}>{T.checkout.SAVE_CARD_FOR_NEXT_TRANSACTION}</Checkbox>
						</div>
					)}
					<Input
						value={payments.billingPhoneNumber || ''}
						label={T.checkout.PHONE_NUMBER_O2O_CONFIRMATION}
						min={0}
						type='number'
						placeholder={payments.billingPhoneNumber || T.checkout.BILLING_PHONE_NUMBER}
						onChange={(event) => this.onBillingNumberChange(event)} 
					/>
					{
						this.checkShowingOvoPhone() && payments.ovoPhoneNumber &&
						<Input state={ovoReadOnly ? 'disabled' : ''} color={ovoReadOnly ? 'green' : null} icon={ovoReadOnly ? 'check' : null} defaultValue={payments.ovoPhoneNumber} label={T.checkout.OVO_PHONE_LABEL} placeholder={T.checkout.SAVED_OVO_PHONE} type='number' min={0} />
					}
					<div className={styles.checkOutAction}>
						<Checkbox defaultChecked={this.state.termCondition} onClick={() => this.setState({ termCondition: !this.state.termCondition })}>{T.checkout.TERMS_PAYMENT}</Checkbox>
						<Button block size='large' color='red' state={this.checkActiveBtnSubmit()} onClick={(e) => this.submitPayment(e)}>{T.checkout.BUY_NOW}</Button>
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
	if (state.payments.ovoPhoneNumber === null) {
		state.payments.ovoPhoneNumber = state.payments.ovoInfo ? state.payments.ovoInfo.ovoId : null;
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

