import React, { Component } from 'react';
import styles from '../Checkout.scss';
import { Validator } from 'ree-validate';
import { paymentGroupName } from '@/state/Payment/constants';
import { pushDataLayer } from '@/utils/gtm';

// component load
import {
	Col,
	CreditCardInput,
	CreditCardRadio,
	Row,
	Tooltip,
	Level,
	Input,
	InputGroup,
	Select,
	Card,
	Button,
	Segment,
	Checkbox,
	// Radio,
	Sprites
} from '@/components';

// Dummy Data
import {
// 	UangElektronik,
// 	GeraiTunai,
// 	InternetBanking,
// 	Bank,
	Bulan
} from '@/data';

// import utils
import { currency, renderIf } from '@/utils';

export default class CardPembayaran extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.handleSubmit = this.handleSubmit.bind(this);
		this.validator = new Validator({
			name: 'required',
			penerima: 'required',
			no_hp: 'required',
			provinsi: 'required',
			kecamatan: 'required',
			kodepos: 'required',
			address: 'required'
		});
		this.state = {
			formData: {
				name: '',
				penerima: '',
				no_hp: '',
				provinsi: '',
				kecamatan: '',
				kodepos: '',
				address: ''
			},
			selectedPaymentMethod: null,
			creditCard: [],
			errors: this.validator.errorBag,
			voucherCode: null,
			validVoucher: false,
			reset: null,
			validInstallmentBin: true,
			isValidCreaditCard: false,
			isValidCreaditCardInstallment: false,
			ovo: {
				useDefault: true,
				ovoPhonePayment: null,
				ovoPhonePaymentValid: this.props.payments.ovoPhoneNumber,
				autoLinkage: (this.props.payments.ovoInfo.ovoFlag === '0'),
			}
		};
		this.submitPayment = this.submitPayment.bind(this);
		this.handleCekVoucher = this.handleCekVoucher.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onAddCoupon = this.onAddCoupon.bind(this);
		this.onPaymentMethodChange = this.onPaymentMethodChange.bind(this);
		this.onPaymentOptionChange = this.onPaymentOptionChange.bind(this);
		this.onNewCreditCard = this.onNewCreditCard.bind(this);
		this.onSelectCard = this.onSelectCard.bind(this);

		this.onCardNumberChange = this.onCardNumberChange.bind(this);
		this.onCardMonthChange = this.onCardMonthChange.bind(this);
		this.onCardYearChange = this.onCardYearChange.bind(this);
		this.onCardCvvChange = this.onCardCvvChange.bind(this);
		this.onInstallmentBankChange = this.onInstallmentBankChange.bind(this);
		this.onBankChange = this.onBankChange.bind(this);
		this.onOvoNumberChange = this.onOvoNumberChange.bind(this);
		this.onTermChange = this.onTermChange.bind(this);
		this.onInstallmentCCNumberChange = this.onInstallmentCCNumberChange.bind(this);
		this.onInstallmentCCMonthChange = this.onInstallmentCCMonthChange.bind(this);
		this.onInstallmentCCYearChange = this.onInstallmentCCYearChange.bind(this);
		this.onInstallmentCCCvvChange = this.onInstallmentCCCvvChange.bind(this);
		this.onResetCoupon = this.onResetCoupon.bind(this);
		this.setDefaultOvo = this.setDefaultOvo.bind(this);
		this.onOvoPaymentNumberChange = this.onOvoPaymentNumberChange.bind(this);
		this.setAutoLinkage = this.setAutoLinkage.bind(this);
		this.onResetOvoPayment = this.onResetOvoPayment.bind(this);
		this.payNowButton = '';
	}

	componentDidMount() {
		this.payNowButton = document.getElementById('pay-now');
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.payments !== this.props.payments) {
			this.isValidCCForm();
		}
	}

	onChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	onAddCoupon(event) {
		this.props.onAddCoupon(this.state.voucherCode);
	}

	onResetCoupon(event) {
		this.setState({
			voucherCode: null
		});
		this.props.onResetCoupon();
		pushDataLayer('checkout', 'checkout', { step: 5, option: 'Non Voucher' });
	}

	onResetOvoPayment() {
		this.setState({
			ovo: {
				useDefault: true,
				ovoPhonePayment: null,
				ovoPhonePaymentValid: this.props.payments.ovoInfo.ovoFlag === '1',
				autoLinkage: this.props.payments.ovoInfo.ovoFlag === '0',
			}
		});
	}

	onPaymentMethodChange(event) {
		this.setState({
			paymentMethodChanged: true
		});
		this.props.onPaymentMethodChange(event);
		if (event.value) {
			this.setState({
				validInstallmentBin: event.value !== 'installment'
			});
			pushDataLayer('checkout', 'checkout', { step: 6, option: event.label });
		}
		this.onResetOvoPayment();

		// clear CC information
		this.props.onCardMonthChange({ value: 0 });
		this.props.onCardYearChange({ value: 0 });
		this.props.onCardCvvChange({ target: { value: 0 } });
		
		// clear installment CC information
		this.props.onInstallmentCCMonthChange({ value: 0 });
		this.props.onInstallmentCCYearChange({ value: 0 });
		this.props.onInstallmentCCCvvChange({ target: { value: 0 } });
		setTimeout(() => {
			this.payNowButton.disabled = true;
		}, 50);
	}

	onPaymentOptionChange(event) {
		this.props.onPaymentOptionChange(event, this.props.payments.selectedPayment);
		if (event.value) {
			this.payNowButton.disabled = false;
			pushDataLayer('checkout', 'checkout', { step: 7, option: event.label });
		} else {
			this.payNowButton.disabled = true;
		}
	}

	onNewCreditCard(event) {
		console.log(event, this);
		this.props.onNewCreditCard(event);
	}

	onSelectCard(event) {
		if (typeof event.value !== 'undefined') {
			if (event.value !== null) {
				this.selectedCC = event.value;
			} else {
				this.selectedCC = false;
				this.props.onCardCvvChange({ target: { value: 0 } });
			}
		} else {
			this.selectedCC = event;
		}
		this.props.onSelectCard(this.selectedCC);
	}
	onCardNumberChange(event) {
		this.setState({
			isValidCreaditCard: event.valid
		});
		this.props.onCardNumberChange(event);
	}
	onCardMonthChange(data) {
		this.props.onCardMonthChange(data);
	}
	onCardYearChange(data) {
		this.props.onCardYearChange(data);
	}
	onCardCvvChange(data) {
		this.props.onCardCvvChange(data);
	}
	onInstallmentBankChange(data) {
		this.setState({
			paymentMethodChanged: true
		});
		const bank = data;
		this.props.onBankChange(bank);
		// this.props.onPaymentMethodChange();
	}

	onBankChange(event) {
		const bank = event.target;
		this.props.onBankChange(bank);
	}

	onInstallmentCCNumberChange(event) {
		this.setState({ isValidCreaditCardInstallment: event.valid });
		const { selectedPayment, selectedCardDetail } = this.props.payments;
		if (selectedPayment.value === paymentGroupName.INSTALLMENT) {
			const isValidCVV = selectedCardDetail.cvv !== 0 && selectedCardDetail.cvv !== '' && selectedCardDetail.cvv.length > 2;
			const isValidMonth = selectedCardDetail.month !== 0 && selectedCardDetail.month !== null;
			const isValidYear = selectedCardDetail.year !== 0 && selectedCardDetail.year !== null;
			setTimeout(() => {
				if (!!event.valid && isValidCVV && isValidMonth && isValidYear) {
					this.payNowButton.disabled = false;
				} else {
					this.payNowButton.disabled = true;
				}
			}, 100);
		}
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
					this.props.onInstallmentCCNumberChange(event);
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
	onInstallmentCCMonthChange(data) {
		this.props.onInstallmentCCMonthChange(data);
	}
	onInstallmentCCYearChange(data) {
		this.props.onInstallmentCCYearChange(data);
	}
	onInstallmentCCCvvChange(data) {
		this.props.onInstallmentCCCvvChange(data);
	}

	onOvoNumberChange(event) {
		this.payNowButton.disabled = false;
		this.props.onOvoNumberChange(event.target.value);
	}

	onTermChange(event) {
		this.props.onTermChange(event.value);
	}

	onOvoPaymentNumberChange(event) {
		this.payNowButton.disabled = false;
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
		this.props.onOvoPaymentNumberChange(ovoPhonePayment);
		if (this.state.ovo.autoLinkage) {
			this.props.onOvoNumberChange(ovoPhonePayment);
		}
	}

	setDefaultOvo() {
		const ovo = this.state.ovo;
		const useDefault = !this.state.ovo.useDefault;
		this.setState({
			ovo: {
				...ovo,
				useDefault,
				ovoPhonePaymentValid: useDefault
			}
		});
		if (useDefault) {
			this.props.onOvoPaymentNumberChange(this.props.payments.ovoPhoneNumber);
		} else {
			this.props.onOvoPaymentNumberChange();
		}
	}

	setAutoLinkage() {
		const ovo = this.state.ovo;
		const autoLinkage = !this.state.ovo.autoLinkage;
		this.setState({
			ovo: {
				...ovo,
				autoLinkage
			}
		});
		if (autoLinkage) {
			this.props.onOvoNumberChange(this.props.payments.ovoPaymentNumber);
		} else {
			this.props.onOvoNumberChange('');
		}
	}

	isValidCCForm() {
		const { selectedPayment, selectedCardDetail } = this.props.payments;
		const isValidCVV = selectedCardDetail.cvv !== 0 && selectedCardDetail.cvv !== '' && selectedCardDetail.cvv.length > 2;
		const isValidMonth = selectedCardDetail.month !== 0 && selectedCardDetail.month !== null;
		const isValidYear = selectedCardDetail.year !== 0 && selectedCardDetail.year !== null;
		if (selectedPayment.value === paymentGroupName.OVO) {
			if (typeof this.props.payments.ovoPaymentNumber === 'undefined') {
				this.payNowButton.disabled = true;
			} else {
				this.payNowButton.disabled = false;
			}
		}
		if (selectedPayment.value === paymentGroupName.CREDIT_CARD) {
			this.payNowButton.disabled = true;
			let numberOfCard = 0;
			const minNumberOfCard = 0;
			numberOfCard = selectedPayment.cards || 0;
			if (this.props.payments.twoClickEnabled && numberOfCard > minNumberOfCard && isValidCVV && this.selectedCC) {
				// if have card more than 1
				this.payNowButton.disabled = false;
			} else if (this.state.isValidCreaditCard && isValidCVV && isValidMonth && isValidYear) {
				// if have card lesss than 1
				this.payNowButton.disabled = false;
			}
		}
		
		if (selectedPayment.value === paymentGroupName.INSTALLMENT) {
			if (this.state.isValidCreaditCardInstallment && isValidCVV && isValidMonth && isValidYear) {
				this.payNowButton.disabled = false;
			} else {
				this.payNowButton.disabled = true;
			}
		}
	}

	handleCekVoucher(event) {
		event.preventDefault();
		this.setState({
			loadingButtonVoucher: true
		});
	}

	handleSubmit(event) {
		event.preventDefault(this);
	}

	submitPayment() {
		if (!this.props.isValidDropshipper) {
			this.props.checkDropship();
		} else {
			this.props.onDoPayment();
		}
	}

	render() {
		const {
			subTotal,
			discount,
			total,
			deliveryCostDiscount,
			deliveryCost,
			paymentMethods,
			loading,
			selectedPayment,
			selectedPaymentOption,
			twoClickEnabled,
			resetPaymentOption,
			selectedCard,
			selectedBank
		} = this.props.payments;
		let couponId = false;
		if (this.props.validCoupon && this.props.coupon !== '') {
			couponId = this.props.coupon;
		} else if (this.props.payments.couponId) {
			couponId = this.props.payments.couponId;
		}
		let voucherBox = '';
		if (this.props.validCoupon === null && !couponId) {
			voucherBox = (
				<Level>
					<Level.Left className={styles.voucherLabel}>Kode Voucher</Level.Left>
					<Level.Right>
						<InputGroup addons>
							<Input size='small' name='voucherCode' onChange={this.onChange} onKeyPress={this.onChange} color='green' value={this.props.coupon} />
							<Button type='submit' size='small' onClick={this.onAddCoupon} loading={this.props.loadingButtonCoupon} color='green' content='CEK' />
						</InputGroup>
					</Level.Right>
				</Level>
			);
		} else if (this.props.validCoupon !== null && !this.props.validCoupon && this.props.coupon !== '') {
			voucherBox = (
				<div>
					<Level>
						<Level.Left className={styles.voucherLabel}>Kode Voucher</Level.Left>
						<Level.Right>
							<InputGroup addons addonsAttached>
								<Input size='small' className='voucherCode' name='voucherCode' color='red' onChange={this.onChange} onKeyPress={this.onChange} value={this.props.coupon} />
								<Button type='button' className='font-red' size='small' icon='times' iconPosition='right' onClick={this.onResetCoupon} />
							</InputGroup>
						</Level.Right>
					</Level>
					<Level>
						<Level.Left>&nbsp;</Level.Left>
						<Level.Right>
							<div className='font-red'>{this.props.messageCoupon}</div>
						</Level.Right>
					</Level>
				</div>
			);
		}

		const CvvElement = (
			<Row>
				<Col grid={4}>
					<Input type='password' placeholder='cvv' minLength={0} maxLength={4} onChange={this.onCardCvvChange} />
				</Col>
				<Col grid={4}>
					<Sprites name='cvv' />
				</Col>
			</Row>
		);

		let paymentOptions = false;
		let installmentPayment = false;
		let info = '';
		let { ovoDefault, ovoPaymentInput } = '';
		if (selectedPaymentOption) {
			if (typeof selectedPaymentOption.settings !== 'undefined') {
				if (typeof selectedPaymentOption.settings.info !== 'undefined' && selectedPaymentOption.settings.info.length > 0) {
					info = selectedPaymentOption.settings.info.map((infoText, indexInfo) => {
						return (
							<div key={indexInfo}><br />{infoText}</div>
						);
					});
				}
			}
		}
		if (selectedPayment) {
			switch (selectedPayment.value) {
			case paymentGroupName.BANK_TRANSFER:
			case paymentGroupName.CONVENIENCE_STORE:
			case paymentGroupName.E_MONEY:
			case paymentGroupName.INTERNET_BANKING:
				paymentOptions = (
					<InputGroup>
						<Select emptyFilter={false} name={`payment-${selectedPayment.value}`} options={selectedPayment.paymentItems} onChange={this.onPaymentOptionChange} reset={resetPaymentOption} />
						{ renderIf(selectedPaymentOption && typeof selectedPaymentOption.settings !== 'undefined' && selectedPaymentOption.settings.info)(
							<Tooltip position='right' content='Info'>
								{info}
							</Tooltip>
						)}
					</InputGroup>
				);
				break;
			case paymentGroupName.CREDIT_CARD:
				paymentOptions = (
					selectedPayment.paymentItems.map((option, index) => (
						option.cards.length <= 3 ? option.cards.map((card, cardIndex) => (
							card.value ? (
								<InputGroup key={cardIndex}>
									<InputGroup>
										<CreditCardRadio name='cc' variant='list' creditCard value={card.value} content={card.label} onClick={this.onSelectCard} defaultChecked={card.selected} sprites={card.sprites} />
									</InputGroup>
									<InputGroup>
										{renderIf(card.selected)(CvvElement)}
									</InputGroup>
								</InputGroup>
							) : null
						)) :
							<InputGroup key={index}>
								<InputGroup>
									<Select emptyFilter={false} name='cc' selectedLabel='-- Tambah Baru' options={option.cards} onChange={this.onSelectCard} />
								</InputGroup>
								<InputGroup>
									{ renderIf((selectedCard && twoClickEnabled))(CvvElement) }
								</InputGroup>
							</InputGroup>
						)
					)
				);
				break;
			case paymentGroupName.INSTALLMENT:
				installmentPayment = (
					<InputGroup>
						{
							selectedPayment.paymentItems.map((installment, index) => {
								const bankIndex = installment.banks.filter(e => e.name.toUpperCase() === selectedBank.label.toUpperCase())[0];
								return (
									<div key={index}>
										<InputGroup>
											<p>Pilih Bank</p>
											<Select key={index} emptyFilter={false} name='bank' selectedLabel='---' options={installment.banks} onChange={this.onInstallmentBankChange} />
										</InputGroup>
										<InputGroup>
											<p>Pilih Lama Cicilan</p>
											<Select key={index} emptyFilter={false} name='bank' selectedLabel='---' options={bankIndex.listCicilan} onChange={this.onTermChange} />
										</InputGroup>
									</div>
								);
							})
						}
					</InputGroup>
				);

				paymentOptions = ([
					<InputGroup>
						<CreditCardInput placeholder='Masukkan Nomor Kartu' sprites='payment-option' message={this.state.isValidCreaditCardInstallment ? null : 'Masukan no kartu kredit yang sesuai'} color={this.state.isValidCreaditCardInstallment ? null : 'red'} onChange={this.onInstallmentCCNumberChange} />
					</InputGroup>,
					<label htmlFor='masa-berlaku'>Masa Berlaku</label>,
					<Level padded>
						<Level.Item>
							<Select top selectedLabel='-- Bulan' options={Bulan} onChange={this.onInstallmentCCMonthChange} />
						</Level.Item>
						<Level.Item>
							<Select top selectedLabel='-- Tahun' options={this.props.tahun} onChange={this.onInstallmentCCYearChange} />
						</Level.Item>
						<Level.Item>
							<Input type='password' minLength={0} maxLength={4} placeholder='cvv' onChange={this.onInstallmentCCCvvChange} />
						</Level.Item>
						<Level.Item>
							<Sprites name='cvv' />
						</Level.Item>
					</Level>
				]);
				break;
			case paymentGroupName.OVO:
				ovoPaymentInput = (
					<InputGroup>
						<Input color={this.state.ovo.ovoPhonePaymentValid ? 'green' : null} name='ovo_phone_payment' icon={this.state.ovo.ovoPhonePaymentValid ? 'check' : null} value={this.props.payments.ovoPaymentNumber} message={this.state.ovo.ovoPhonePaymentValid ? 'Poin OVO akan ditambahkan di no ini' : ''} min={0} max={30} type='number' placeholder={'Masukan No Hp yang terdaftar di OVO'} onChange={this.onOvoPaymentNumberChange} />
					</InputGroup>
				);

				ovoDefault = ([this.state.ovo.useDefault ?
					<InputGroup>
						<Button icon='plus-circle' iconPosition='left' clean content='Gunakan OVO Lain' onClick={this.setDefaultOvo} />
					</InputGroup>
				: ovoPaymentInput]);

				paymentOptions = (
					<InputGroup>
						{
							(this.props.payments.ovoInfo && parseInt(this.props.payments.ovoInfo.ovoFlag, 10) === 1) ?
								<div>
									<InputGroup>
										<CreditCardRadio name='cc' variant='list' value={this.props.payments.ovoPhoneNumber} checked={this.state.ovo.useDefault} content={this.props.payments.ovoPhoneNumber} sprites='ovo' onClick={this.setDefaultOvo} />
									</InputGroup>
									{ovoDefault}
								</div>
							:
								<div>
									{ovoPaymentInput}
									<InputGroup>
										<Checkbox defaultChecked={this.state.ovo.autoLinkage} content='Simpan untuk transaksi berikutnya & otomatis terhubung ke akun OVO' onClick={this.setAutoLinkage} />
									</InputGroup>
									<Segment>
										<p>Info Pembayaran dengan Aplikasi OVO</p>
										<ol>
											<li>Pastikan Anda sudah login ke aplikasi OVO</li>
											<li>Pembayaran dengan OVO akan kadaluarsa dalam 30 detik setelah Anda klik “Bayar Sekarang”</li>
											<li>Buka notifikasi OVO untuk melakukan pembayaran</li>
											<li>Pilih cara pembayaran dengan “OVO Cash” atau “OVO Point” atau kombinasi keduanya, kemudian klik “Bayar”</li>
										</ol>
									</Segment>
								</div>
						}
					</InputGroup>
				);
				break;
			default:
				paymentOptions = false;
				break;
			}
		}

		const discountHtml = (!discount) ? false : discount.map((discountItem, index) => {
			return (
				<Level key={index}>
					<Level.Left className={styles.discountName}>
						<div className='text-elipsis'> - { discountItem.discountName }</div>
					</Level.Left>
					<Level.Right>
						<div className='text-right'>{currency(-discountItem.totalDiscount)}</div>
					</Level.Right>
				</Level>
			);
		});

		let numberOfCard = 0;
		const minNumberOfCard = 0;
		numberOfCard = (selectedPayment.value === paymentGroupName.CREDIT_CARD) ? selectedPayment.cards : 0;
		const isOvoPayemnt = this.props.payments.paymentMethod === 'e_wallet_ovo';
		const validOvo = isOvoPayemnt ? this.state.ovo.ovoPhonePaymentValid : true;
		const ovoReadOnly = (this.props.payments.ovoInfo && parseInt(this.props.payments.ovoInfo.ovoFlag, 10) === 1);
		const disabledPayment = ((this.props.payments.selectedPaymentOption === null || !this.props.payments.selectedPaymentOption) || (this.props.payments.billingPhoneNumber === null || this.props.payments.billingPhoneNumber === '') || !this.props.payments.termsAndConditionChecked || !this.state.validInstallmentBin || !validOvo);
		const billingPhoneNumber = this.props.addressTabActive && this.props.payments.billingPhoneNumber ? this.props.payments.billingPhoneNumber : null;
		const adminFeeIdr = (this.props.payments.adminFee && this.props.payments.adminFee.feeInIdr) ? this.props.payments.adminFee.feeInIdr : null;

		const ovoPhone = (
			<InputGroup>
				<Input
					value={this.props.payments.ovoPhoneNumber ? this.props.payments.ovoPhoneNumber : ''}
					placeholder={this.props.payments.ovoPhoneNumber ? this.props.payments.ovoPhoneNumber : ''}
					label='Masukkan no HP yang terdaftar di OVO / OVO ID / No Matahari Rewards / HiCard ID untuk mendapatkan point rewards.'
					type='number'
					min={0}
					onChange={(event) => this.props.onOvoNumberChange(event.target.value)}
					readOnly={ovoReadOnly}
					disabled={ovoReadOnly}
					color={ovoReadOnly ? 'purple' : null}
					icon={ovoReadOnly ? 'check' : null}
				/>
			</InputGroup>
		);
		return (
			<Card stretch loading={this.props.loading} >
				<div className={styles.overflow}>
					<Level>
						<Level.Left><strong>Subtotal</strong></Level.Left>
						<Level.Right className='text-right'><strong>{currency(subTotal)}</strong></Level.Right>
					</Level>
					{
						renderIf(couponId)(
							<Level>
								<Level.Left>Voucher : <strong>{this.props.loadingButtonCoupon ? 'loading...' : couponId}</strong> &nbsp; <Button icon='times-circle' iconPosition='right' onClick={this.props.onRemoveCoupon} /></Level.Left>
								<Level.Right className='text-right'>&nbsp;</Level.Right>
							</Level>
						)
					}
					{ renderIf(discountHtml)(discountHtml) }
					<Level>
						<Level.Left>Total Biaya Pengiriman</Level.Left>
						<Level.Right className='text-right'>{currency(deliveryCost)}</Level.Right>
					</Level>
					<Level>
						<Level.Left>
							<div className='font-green'>Discount Biaya Pengiriman</div>
						</Level.Left>
						<Level.Right>
							<div className='font-green text-right'>{currency(-deliveryCostDiscount)}</div>
						</Level.Right>
					</Level>
					{voucherBox}
					{ renderIf(adminFeeIdr)(
						<Level>
							<Level.Left><strong>Biaya Administrasi</strong></Level.Left>
							<Level.Right className='text-right'><strong>{currency(adminFeeIdr)}</strong></Level.Right>
						</Level>
					)}
					<div className={styles.CheckoutTitle}>
						<Level noMargin>
							<Level.Left>Total Pembayaran</Level.Left>
							<Level.Right>
								<div className={`${styles.price} text-right`}>{currency(total)}</div>
							</Level.Right>
						</Level>
					</div>
					<div className={styles.hasCheckoutAction}>
						<p>Metode Pembayaran</p>
						{ renderIf((!this.props.loadingUpdateCart) && (!this.state.loadingCardPengiriman) && !this.props.payments.paymentMethodLoading)(
							<InputGroup>
								<Select name='paymentMethods' options={paymentMethods.methods} onChange={this.onPaymentMethodChange} />
								{ renderIf(
									selectedPaymentOption &&
									(selectedPayment.value === 'cod' || selectedPayment.value === 'gratis') &&
									typeof selectedPaymentOption.settings !== 'undefined' &&
									selectedPaymentOption.settings && selectedPaymentOption.settings.info.length > 0)(
										<Tooltip position='right' content='Info'>
											{info}
										</Tooltip>
								)}
								{ renderIf(selectedPayment.value === paymentGroupName.INSTALLMENT)(
									<InputGroup key='installment_info'>
										<Tooltip position='right' content='Info'>
											<p>Syarat dan Ketentuan Cicilan 0% Regular:</p>
											<ul>
												<li>Cicilan tenor 3 bulan dengan minimum transaksi Rp990.000
												(sembilan ratus sembilan puluh ribu rupiah)</li>
												<li>Cicilan tenor 6 bulan dengan minimum transaksi Rp1.500.000
												(satu juta lima ratus ribu rupiah)</li>
												<li>Cicilan tenor 12 bulan dengan minimum transaksi Rp2.000.000
												(dua juta rupiah)</li>
											</ul>
										</Tooltip>
									</InputGroup>
								)}
							</InputGroup>
						) }
						{ renderIf(installmentPayment)(installmentPayment) }
						{ renderIf(paymentOptions && (!this.props.loadingUpdateCart) && (!this.state.loadingCardPengiriman))(paymentOptions) }
						{ renderIf(selectedPayment.value === paymentGroupName.CREDIT_CARD && twoClickEnabled && numberOfCard > minNumberOfCard)(
							<InputGroup>
								<Button clean icon='plus-circle' iconPosition='left' content='Tambah Kartu' onClick={this.onNewCreditCard} />
							</InputGroup>
						)}
						{ renderIf((this.props.payments.openNewCreditCard && selectedPayment.value === paymentGroupName.CREDIT_CARD && !twoClickEnabled) || (selectedPayment.value === paymentGroupName.CREDIT_CARD && numberOfCard < (minNumberOfCard + 1)))([
							<InputGroup key={1}>
								<CreditCardInput message={this.state.isValidCreaditCard ? null : 'Masukan no kartu kredit yang sesuai'} color={this.state.isValidCreaditCard ? null : 'red'} placeholder='Masukkan Nomor Kartu' sprites='payment-option' onChange={this.onCardNumberChange} />
							</InputGroup>,
							<label htmlFor='masa-berlaku' key={2}>Masa Berlaku</label>,
							<Level padded key={3}>
								<Level.Item id='masa-berlaku'>
									<Select top selectedLabel='-- Bulan' options={Bulan} onChange={this.onCardMonthChange} />
								</Level.Item>
								<Level.Item>
									<Select top selectedLabel='-- Tahun' options={this.props.tahun} onChange={this.onCardYearChange} />
								</Level.Item>
								<Level.Item>
									<Input type='password' minLength={0} maxLength={4} placeholder='cvv' onChange={this.onCardCvvChange} />
								</Level.Item>
								<Level.Item>
									<Sprites name='cvv' />
								</Level.Item>
							</Level>,
							<InputGroup key={4}>
								<Checkbox defaultChecked content='Simpan kartu untuk transaksi selanjutnya' onClick={(state, value) => this.props.onSaveCcOption(state, value)} />
							</InputGroup>
						])}
						<InputGroup>
							<Input label='SMS Konfirmasi pembayaran' min={0} type='number' value={billingPhoneNumber || ''} placeholder={billingPhoneNumber || 'No Telp Penagihan'} onChange={(event) => this.props.onBillingNumberChange(event)} />
						</InputGroup>
						{ renderIf(!isOvoPayemnt || (!this.state.ovo.autoLinkage && isOvoPayemnt))(ovoPhone) }
						<div className={styles.checkOutAction}>
							<Checkbox defaultChecked content='Saya setuju dengan syarat dan ketentuan MatahariMall.com' onClick={(state, value) => this.props.onTermsAndConditionChange(state, value)} />
							<Button id='pay-now' onClick={this.submitPayment} block size='large' iconPosition='right' icon='angle-right' color='red' content='Bayar Sekarang' loading={loading} disabled={disabledPayment} />
						</div>
					</div>
				</div>
			</Card>
		);
	}
};
