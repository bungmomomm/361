import React, { Component } from 'react';
import styles from '../Checkout.scss';
import { Validator } from 'ree-validate';
import { paymentGroupName } from '@/state/Payment/constants';

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
			reset: null
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
	}
	onChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	onAddCoupon(event) {
		this.props.onAddCoupon(this.state.voucherCode);
	}

	onPaymentMethodChange(event) {
		this.setState({
			paymentMethodChanged: true
		});
		this.props.onPaymentMethodChange(event);
	}

	onPaymentOptionChange(event) {
		this.props.onPaymentOptionChange(event, this.props.payments.selectedPayment);
	}

	onNewCreditCard(event) {
		console.log(event, this);
		this.props.onNewCreditCard(event);
	}

	onSelectCard(event) {
		if (typeof event.value !== 'undefined') {
			if (event.value !== null) {
				this.props.onSelectCard(event.value);
			} else {
				this.props.onSelectCard(false);
			}
		} else {
			this.props.onSelectCard(event);
		}
	}
	onCardNumberChange(event) {
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
		console.log(data);
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
		this.props.onInstallmentCCNumberChange(event);
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
		this.props.onOvoNumberChange(event);
	}

	onTermChange(event) {
		this.props.onTermChange(event.value);
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
			coupon, 
			subTotal, 
			total, 
			deliveryCostDiscount, 
			deliveryCost, 
			paymentMethods, 
			loading,
			selectedPayment,
			selectedPaymentOption,
			twoClickEnabled,
			selectedCard 
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
								<Input size='small' name='voucherCode' color='red' onChange={this.onChange} onKeyPress={this.onChange} value={this.props.coupon} />
								<Button type='button' className='font-red' size='small' icon='times' iconPosition='right' onClick={this.props.onResetCoupon} />
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
					<Input type='password' placeholder='cvv' onBlur={this.onCardCvvChange} />
				</Col>
				<Col grid={4}>
					<Sprites name='cvv' />
				</Col>
			</Row>
		);

		let paymentOptions = false; 
		let installmentPayment = false;
		let info = '';
		if (selectedPaymentOption) {
			if (typeof selectedPaymentOption.settings !== 'undefined') {
				if (typeof selectedPaymentOption.settings.info !== 'undefined') {
					info = selectedPaymentOption.settings.info.join(' ');	
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
						<Select emptyFilter={false} name={`payment-${selectedPayment.value}`} selectedLabel='-- Tambah Baru' options={selectedPayment.paymentItems} onChange={this.onPaymentOptionChange} />
						{ renderIf(selectedPaymentOption && typeof selectedPaymentOption.settings !== 'undefined' && selectedPaymentOption.settings.info.length > 0)(
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
						option.cards.length < 3 ? option.cards.map((card, cardIndex) => (
							card.value ? (
								<InputGroup key={cardIndex}>
									<CreditCardRadio name='cc' variant='list' creditCard value={card.value} content={card.label} onClick={this.onSelectCard} checked={card.selected} sprites={card.sprites} />
									{ renderIf(card.selected)(CvvElement) }
								</InputGroup>
							) : null
						)) : 
							<InputGroup key={index}>
								<Select emptyFilter={false} name='cc' selectedLabel='-- Tambah Baru' options={option.cards} onChange={this.onSelectCard} />
								{ renderIf((selectedCard && twoClickEnabled))(CvvElement) }
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
								return (
									<div key={index}>
										<InputGroup>
											<p>Pilih Bank</p>
											<Select emptyFilter={false} name='bank' selectedLabel='---' options={installment.banks} onChange={this.onInstallmentBankChange} />
										</InputGroup>
										<InputGroup>
											<p>Pilih Lama Cicilan</p>
											<Select emptyFilter={false} name='bank' selectedLabel='---' options={installment.banks[index].listCicilan} onChange={this.onTermChange} />
										</InputGroup>
									</div>
								);
							})
						}
					</InputGroup>
				);

				paymentOptions = ([
					<InputGroup>
						<CreditCardInput placeholder='Masukkan Nomor Kartu' sprites='payment-option' onChange={this.onInstallmentCCNumberChange} />
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
							<Input type='password' placeholder='cvv' onBlur={this.onInstallmentCCCvvChange} />
						</Level.Item>
						<Level.Item>
							<Sprites name='cvv' />
						</Level.Item>
					</Level>
				]);
				break;
			default:
				paymentOptions = false;
				break;	
			} 
		}

		const ovoReadOnly = (this.props.payments.ovoInfo && this.props.payments.ovoInfo.ovoFlag !== 1) && true;
		const disabledPayment = ((this.props.payments.selectedPaymentOption === null || !this.props.payments.selectedPaymentOption) || (this.props.payments.billingPhoneNumber === null || this.props.payments.billingPhoneNumber === ''));
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
								<Level.Left>Voucher : <strong>{this.props.loadingButtonCoupon ? 'loading...' : couponId }</strong> <Button icon='times-circle' iconPosition='right' onClick={this.props.onRemoveCoupon} /></Level.Left>
								<Level.Right className='text-right'>{currency(-coupon)}</Level.Right>
							</Level>
						)
					}
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
					<div className={styles.CheckoutTitle}>
						<Level noMargin>
							<Level.Left>Total Pembayaran</Level.Left>
							<Level.Right>
								<div className={`${styles.price} text-right`}>{currency(total)}</div>
							</Level.Right>
						</Level>
					</div>
					<div className={styles.hasCheckoutAction}>
						<p>Pilih Metode Pembayaran</p>
						<InputGroup>
							<Select name='paymentMethods' options={paymentMethods.methods} onChange={this.onPaymentMethodChange} />
							{ renderIf(
								selectedPaymentOption &&
								(selectedPayment.value === 'cod' || selectedPayment.value === 'gratis') &&
								typeof selectedPaymentOption.settings !== 'undefined' && 
								selectedPaymentOption.settings.info.length > 0)(
									<Tooltip position='right' content='Info'>
										{info}
									</Tooltip>
							)}
							{ renderIf(selectedPayment.value === paymentGroupName.INSTALLMENT)(
								<InputGroup>
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
						{ renderIf(installmentPayment)(installmentPayment) }
						{ renderIf(paymentOptions)(paymentOptions) }
						{ renderIf(selectedPayment.value === paymentGroupName.CREDIT_CARD && twoClickEnabled)(
							<InputGroup>
								<Button clean icon='plus-circle' iconPosition='left' content='Tambah Kartu' onClick={this.onNewCreditCard} />
							</InputGroup>
						)}
						{ renderIf(this.props.payments.openNewCreditCard && selectedPayment.value === paymentGroupName.CREDIT_CARD)([
							<InputGroup>
								<CreditCardInput placeholder='Masukkan Nomor Kartu' sprites='payment-option' onChange={this.onCardNumberChange} />
							</InputGroup>,
							<label htmlFor='masa-berlaku'>Masa Berlaku</label>,
							<Level padded>
								<Level.Item>
									<Select top selectedLabel='-- Bulan' options={Bulan} onChange={this.onCardMonthChange} />
								</Level.Item>
								<Level.Item>
									<Select top selectedLabel='-- Tahun' options={this.props.tahun} onChange={this.onCardYearChange} />
								</Level.Item>
								<Level.Item>
									<Input type='password' placeholder='cvv' onBlur={this.onCardCvvChange} />
								</Level.Item>
								<Level.Item>
									<Sprites name='cvv' />
								</Level.Item>
							</Level>,
							<InputGroup>
								<Checkbox checked content='Simpan kartu untuk transaksi selanjutnya' onChange={(event) => this.props.onSaveCcOption} />
							</InputGroup>
						])}
						<InputGroup>
							<Input label='SMS Konfirmasi pembayaran' type='number' value={this.props.payments.billingPhoneNumber ? this.props.payments.billingPhoneNumber : ''} placeholder='No Telp Penagihan' onChange={(event) => this.props.onBillingNumberChange(event)} />
						</InputGroup>
						<InputGroup>
							<Input value={this.props.payments.ovoPhoneNumber ? this.props.payments.ovoPhoneNumber : ''} label='No Hp yang terdaftar di OVO / OVO-ID / MCC-ID / HiCard-ID' type='number' placeholder='Masukkan nomor Hp yang terdaftar di OVO' onChange={(event) => this.props.onOvoNumberChange(event)} readonly={ovoReadOnly} />
						</InputGroup>
						<div className={styles.checkOutAction}>
							<Checkbox checked content='Saya setuju dengan syarat dan ketentuan MatahariMall.com' />
							<Button onClick={this.submitPayment} block size='large' iconPosition='right' icon='angle-right' color='red' content='Bayar Sekarang' loading={loading} disabled={disabledPayment} />
						</div>
					</div>
				</div>
			</Card>
		);
	}
};