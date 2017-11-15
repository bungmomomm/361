import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import _ from 'lodash';

import { actions } from '@/state/Payment';
import { paymentGroupName, paymentMethodName } from '@/state/Payment/constants';
import { 
	// Tooltip,
	// Card,
	// Group,
	// Select,
	CreditCardInput,
	CreditCardRadio,
	// Checkbox,
	// Button,
	// Level,
	// Input,
	Sprites,
	Icon
} from '@/components';

import { 
	// Tooltip,
	// Group,
	Radio,
	Select,
	Checkbox,
	Button,
	Level,
	Input
} from 'mm-ui';

import { pushDataLayer } from '@/utils/gtm';

import styles from '../../../Mobile/mobile.scss';

import { 
	PaymentOptions, 
	Bulan 
} from '@/data';

class StepFour extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			selectedPaymentMethod: null,
			selectedPaymentOption: null,
			termCondition: true,
			ovo: {
				useDefault: true,
				ovoPhonePayment: this.props.payments.ovoPhonePayment || this.props.payments.ovoPhoneNumber,
				ovoPhonePaymentValid: this.props.payments.ovoPhoneNumber,
				autoLinkage: true,
			},
		};
		this.isOvoPayment = this.props.payments.paymentMethod === 'e_wallet_ovo';
		this.cookies = this.props.cookies.get('user.token');
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.payments !== nextProps.payments) {
			this.isOvoPayment = this.props.payments.paymentMethod === 'e_wallet_ovo';
			this.setState({
				ovo: {
					...this.state.ovo,
					ovoPhonePaymentValid: this.props.payments.ovoPhoneNumber,
					autoLinkage: (this.props.payments.ovoInfo.ovoFlag === '0'),
				}
			});
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
		dispatch(new actions.changePaymentOption(selectedPaymentItem, this.cookies));
		this.selectedData = _.find(payments.selectedPayment.paymentItems, ['value', selectedPaymentItem.value]);
		if (this.selectedData) {
			this.setState({
				selectedPaymentOption: selectedPaymentItem,
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

	getAffTracking() {
		return {
			af_track_id: this.props.cookies.get('afftrackid'),
			af_trx_id: this.props.cookies.get('afftrxid'),
			af_trx_click: Date.now()
		};
	}

	paymentMethodChange(stateSelectedPayment) {
		const { payments, dispatch } = this.props;
		dispatch(new actions.changePaymentMethod(stateSelectedPayment.value, payments.paymentMethods, this.cookies));
		this.setState({ 
			showPaymentInfo: null,
			stateSelectedPayment
		});
	}

	submitPayment() {
		const { dispatch } = this.props;
		let validator = false;
		let mode = 'complete';
		pushDataLayer('checkout', 'checkout', { step: 8 });
		if (typeof this.props.payments.paymentMethod !== 'undefined') {
			switch (this.props.payments.paymentMethod) {
			case paymentMethodName.COMMERCE_VERITRANS_INSTALLMENT:
			case paymentMethodName.COMMERCE_VERITRANS:
				if (this.props.payments.selectedPaymentOption !== false) {
					this.setState({
						selectedPayment: this.props.payments.selectedPaymentOption
					});
				}
				
				if (this.props.payments.twoClickEnabled) {
					validator = this.cvvValidator.validateAll({
						cvv: this.props.payments.selectedCardDetail.cvv
					});
				} else {
					validator = this.cardValidator.validateAll({
						year: this.props.payments.selectedCardDetail.year,
						month: this.props.payments.selectedCardDetail.month,
						cvv: this.props.payments.selectedCardDetail.cvv
					});
				}
				validator.then(success => {
					if (success) {
						this.onRequestVtToken((this.props.payments.paymentMethod === paymentMethodName.COMMERCE_VERITRANS_INSTALLMENT));
					} else {
						dispatch(new actions.paymentError('Silahkan periksa data kartu kredit Anda.'));
					}
				});
				break;
			case paymentMethodName.COMMERCE_SPRINT_ASIA:
				mode = 'sprint';
				this.onRequestSprintInstallment(mode);
				break;
			case paymentMethodName.OVO:
				if (this.state.ovo.ovoPhonePayment) {
					dispatch(
						new actions.pay(
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
					new actions.pay(
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
	
	checkActiveBtnSubmit() {
		const validOvo = this.isOvoPayment ? this.state.ovo.ovoPhonePaymentValid : true;
		if (validOvo && this.state.termCondition && this.props.payments.selectedPayment && this.props.payments.selectedPaymentOption) {
			return 'active';
		}
		return 'disabled';
	}
	
	checkShowingOvoPhone() {
		return (!this.isOvoPayment || (!this.state.ovo.autoLinkage && this.isOvoPayment));
	}
	
	render() {
		const {
			payments
		} = this.props;

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
						<Level>
							<Level.Left>{option.label}</Level.Left>
							<Level.Right className='font-red'>
								{ option.disabled && option.disableMessage }
								{option.settings.image && <img src={option.settings.image} alt={option.label} height='15px' />}
							</Level.Right>
						</Level>
					);
					return listPayment.push({
						label: RadioLabel, 
						dataProps: { 
							name: `payment-${payments.selectedPayment.value}`, 
							onChange: () => this.onSelectedPaymentItem(option),
							disabled: option.disabled
						}
					});
				});
				return <Radio inputStyle='blocklist' data={listPayment} />;
			}
			case paymentGroupName.CREDIT_CARD:
				return payments.selectedPayment.paymentItems.map((option, index) => (
					option.cards.length < 3 ? (
						option.cards.map((card, cardIndex) => (
							card.value && (
								<CreditCardRadio 
									key={cardIndex}
									name='cc'
									variant='list'
									value={card.value}
									content={card.label}
									defaultChecked={card.selected}
									sprites={card.sprites}
								/>
							)
						))
					) : (
						<Select block key={index} options={option.cards} />
					)
				));
			case paymentGroupName.INSTALLMENT:
				return (
					<div>
						{
							payments.selectedPayment.paymentItems.map((installment, index) => {
								return (
									<div key={index}>
										<Select block options={installment.banks} />
										<Select block options={installment.banks[index].listCicilan} />
									</div>
								);
							})
						}
						<CreditCardInput 
							placeholder='Masukkan Nomor Kartu'
							sprites='payment-option'
							onChange={this.onInstallmentCCNumberChange}
						/>
						<Level>
							<Level.Item>
								<Select block options={Bulan} />
							</Level.Item>
							<Level.Item>
								<Select block options={this.props.tahun} />
							</Level.Item>
							<Level.Item>
								<Input type='password' placeholder='cvv' />
							</Level.Item>
							<Level.Item>
								<Sprites name='cvv' />
							</Level.Item>
						</Level>
					</div>
				);
			case paymentGroupName.OVO: 
				ovoPaymentInput = (
					<div>
						<Input min={0} max={30} defaultValue={this.state.ovo.ovoPhonePayment} type='number' placeholder={'Masukan No Hp yang terdaftar di OVO'} onChange={(e) => this.onOvoPaymentNumberChange(e)} />
					</div>
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
										data={[
											{
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
											}
										]} 
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

		const ovoReadOnly = (payments.ovoInfo && parseInt(payments.ovoInfo.ovoFlag, 10) === 1) ? 'disabled' : 'active';

		return (
			<div className={styles.card}>
				<p><strong>4. Informasi Pembayaran</strong></p>
				<div>
					<Select 
						block 
						label='Metode Pembayaran'
						options={payments.paymentMethods.methods} 
						onChange={(e) => this.paymentMethodChange(e)}
						defaultValue={payments.selectedPayment ? payments.selectedPayment.id : null}
					/>
					{ payments.selectedPayment && switchPaymentElement()}
					{
						false && (
							<div>
								<Select block label='Pilih Bank' options={PaymentOptions} />
								<Select block label='Pilih Lama Cicilan' options={PaymentOptions} />
								<Radio 
									inputStyle='blocklist' 
									data={[
										{
											label: 'BCA Virtual Account', 
											inputProps: { 
												name: 'cc', 
												onChange: () => console.log('index')
											}
										}, {
											label: 'Bank Lainnya Virtual Account', 
											inputProps: { 
												name: 'cc', 
												onChange: () => console.log('index')
											}
										}, {
											label: 'Manual Transfer', 
											inputProps: { 
												name: 'cc', 
												onChange: () => console.log('index')
											}
										}
									]} 
								/>
							</div>
						)
					}
					<Input 
						value={payments.billingPhoneNumber || ''} 
						label='SMS konfirmasi pembayaran & pengambilan barang (khusus O2O) akan dikirimkan ke : ' 
						min={0} 
						type='number' 
						placeholder={payments.billingPhoneNumber || 'No Telp Penagihan'} 
						onChange={(event) => this.props.onBillingNumberChange(event)} 
					/>
					{
						this.checkShowingOvoPhone() && payments.ovoPhoneNumber && 
						<Input state={ovoReadOnly} color={ovoReadOnly ? 'green' : null} icon={ovoReadOnly ? 'check' : null} defaultValue={payments.ovoPhoneNumber} label='No Hp yang terdaftar di OVO / OVO-ID / MCC-ID / HiCard-ID' placeholder={'Masukkan nomor Hp yang terdaftar di OVO'} type='number' min={0} />
					}
					<div className={styles.checkOutAction}>
						<Checkbox defaultChecked={this.state.termCondition} onClick={() => this.setState({ termCondition: !this.state.termCondition })}>Saya setuju dengan syarat dan ketentuan MatahariMall.com</Checkbox>
						<Button block size='large' color='red' state={this.checkActiveBtnSubmit()} onClick={(e) => this.submitPayment(e)}>Bayar Sekarang</Button>
					</div>
				</div>
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
	};
};

export default withCookies(connect(mapStateToProps)(StepFour));

