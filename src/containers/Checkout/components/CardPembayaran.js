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
		this.props.onSelectCard(event.value);
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

	onOvoNumberChange(event) {
		this.props.onOvoNumberChange(event);
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
				<Level>
					<Level.Left className={styles.voucherLabel}>Kode Voucher</Level.Left>
					<Level.Right>
						<InputGroup addons addonsAttached>
							<Input size='small' name='voucherCode' color='red' message='kode voucher salah' onChange={this.onChange} onKeyPress={this.onChange} value={this.props.coupon} />
							<Button type='button' className='font-red' size='small' icon='times' iconPosition='right' onClick={this.props.onResetCoupon} />
						</InputGroup>
					</Level.Right>
				</Level>
			);			
		}
		let paymentOptions = false; 
		let installmentPayment = false;
		if (selectedPayment) {
			console.log(selectedPayment.paymentItems);
			switch (selectedPayment.value) {
			case paymentGroupName.BANK_TRANSFER:
			case paymentGroupName.CONVENIENCE_STORE:
			case paymentGroupName.E_MONEY:
			case paymentGroupName.INTERNET_BANKING:
				paymentOptions = (
					<InputGroup>
						<Select emptyFilter={false} name={`payment-${selectedPayment.value}`} selectedLabel='-- Tambah Baru' options={selectedPayment.paymentItems} onChange={this.onPaymentOptionChange} />
					</InputGroup>
				);
				break;
			case paymentGroupName.CREDIT_CARD:
				paymentOptions = (
					<InputGroup>
						{ 
							selectedPayment.paymentItems.map((option, index) => {
								if (option.cards.length < 1) {
									option.cards.map((card, cardIndex) => {
										return (
											<div>
												<InputGroup>
													<CreditCardRadio key={cardIndex} name='cc' variant='list' creditCard value={card.value} content={card.label} onChange={this.onSelectCard} checked={card.selected} />
												</InputGroup>
												{ renderIf(card.selected)(
													<Row>
														<Col grid={4}>
															<Input type='number' placeholder='cvv' onBlur={this.onCardCvvChange} />
														</Col>
														<Col grid={4}>
															<Sprites name='cvv' />
														</Col>
													</Row>
												) }
											</div>
										);
									});
								} else {
									return (
										<div key={index}>
											<InputGroup>
												<Select emptyFilter={false} name='cc' selectedLabel='-- Tambah Baru' options={option.cards} onChange={this.onSelectCard} />
											</InputGroup>
											{ renderIf((selectedCard && twoClickEnabled))(
												<Row>
													<Col grid={4}>
														<Input type='number' placeholder='cvv' onBlur={this.onCardCvvChange} />
													</Col>
													<Col grid={3}>
														<Sprites name='cvv' />
													</Col>
												</Row>
											) }
										</div>
									);
								}
								return (
									<div key={index} />
								);
							})
						}
					</InputGroup>
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
											<Select emptyFilter={false} name='bank' selectedLabel='---' options={installment.banks[index].listCicilan} />
										</InputGroup>
									</div>
								);
							})
						}
					</InputGroup>
				);

				paymentOptions = (
					<InputGroup>
						{ 
							selectedPayment.paymentItems.map((option, index) => {
								if (option.cards.length < 1) {
									option.cards.map((card, cardIndex) => {
										return (
											<div>
												<InputGroup>
													<CreditCardRadio key={cardIndex} name='cc' variant='list' creditCard value={card.value} content={card.label} onChange={this.onSelectCard} checked={card.selected} />
												</InputGroup>
												{ renderIf(card.selected)(
													<Row gapless>
														<Col grid={4}>
															<Input type='number' placeholder='cvv' onBlur={this.onCardCvvChange} />
														</Col>
														<Col grid={4}>
															<Sprites name='cvv' />
														</Col>
													</Row>
												) }
											</div>
										);
									});
								} else {
									return (
										<div key={index}>
											<InputGroup>
												<p>Jenis Kartu</p>
												<Select emptyFilter={false} name='cc' selectedLabel='Pilih Jenis Kartu' options={option.cards} onChange={this.onSelectCard} />
											</InputGroup>
											<InputGroup>
												{ renderIf(selectedCard)(
													<Row>
														<Col grid={4}>
															<Input type='number' placeholder='cvv' onBlur={this.onCardCvvChange} />
														</Col>
														<Col grid={4}>
															<Sprites name='cvv' />
														</Col>
													</Row>
												) }
											</InputGroup>
										</div>
									);
								}
								return option;
							})
						}
					</InputGroup>
				);
				break;
			default:
				paymentOptions = false;
				break;	
			} 
		}
		return (
			<Card>
				<div className={styles.overflow}>
					<Level>
						<Level.Left><strong>Subtotal</strong></Level.Left>
						<Level.Right className='text-right'><strong>{currency(subTotal)}</strong></Level.Right>
					</Level>
					{
						!couponId ? null : (
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
							<Select selectedLabel='-- Pilih Metode Lain' name='paymentMethods' options={paymentMethods.methods} onChange={this.onPaymentMethodChange} />
							<Tooltip position='right' content='Info' color='white'>
								<p><Sprites name='uob' /></p>
								<p>Gunakan Kartu Kredit UOB Indonesia dan dapatkan Diskon Tambahan Rp100.000* dengan minimum transaksi Rp2.500.000</p>
								<p>*kuota terbatas</p>
								<hr />
								<p>Syarat dan Ketentuan Cicilan 0% Regular:</p>
								<ol>
									<li>Cicilan tenor 3 bulan dengan minimum transaksi Rp 990.000 </li>
									<li>Cicilan tenor 6 bulan dengan minimum transaksi Rp1.500.000 </li>
									<li>Cicilan tenor 12 bulan dengan minimum transaksi Rp2.000.000</li>
								</ol>
							</Tooltip>
						</InputGroup>
						{ renderIf(installmentPayment)(installmentPayment) }
						{ renderIf(paymentOptions)(paymentOptions) }
						{ renderIf(selectedPayment.value === paymentGroupName.CREDIT_CARD)(
							<InputGroup>
								<Button clean icon='plus-circle' iconPosition='left' content='Tambah Kartu' onClick={this.onNewCreditCard} />
							</InputGroup>
						)}
						{ renderIf(this.props.payments.openNewCreditCard && selectedPayment.value === paymentGroupName.CREDIT_CARD)(
							<div>
								<InputGroup>
									<CreditCardInput placeholder='Masukkan Nomor Kartu' sprites='payment-option' onChange={this.onCardNumberChange} />
								</InputGroup>
								<label htmlFor='masa-berlaku'>Masa Berlaku</label>
								<Level padded>
									<Level.Item>
										<Select top selectedLabel='-- Bulan' options={Bulan} onChange={this.onCardMonthChange} />
									</Level.Item>
									<Level.Item>
										<Select top selectedLabel='-- Tahun' options={this.props.tahun} onChange={this.onCardYearChange} />
									</Level.Item>
									<Level.Item>
										<Input type='number' placeholder='cvv' onBlur={this.onCardCvvChange} />
									</Level.Item>
									<Level.Item>
										<Sprites name='cvv' />
									</Level.Item>
								</Level>
							</div>
						)}
						{ renderIf(selectedPayment.value === paymentGroupName.INTERNET_BANKING)(
							<InputGroup>
								<Tooltip align='right' content='Info'>
									<p>Info pembayaran BCA KlikPay</p>
									<ol>
										<li>Setelah klik tombol &quot;Bayar Sekarang&quot; di bawah, Anda akan diarahkan ke halaman BCA KlikPay.</li>
										<li>Masukkan alamat email dan password BCA KlikPay Anda, lalu cek informasi transaksi (nama merchant, waktu transaksi, dan jumlah uang yang harus dibayarkan)</li>
										<li>Tekan tombol &quot;Kirim OTP&quot; untuk menerima kode OTP (One Time Password) via SMS, jadi pastikan handphone Anda aktif.</li>
										<li>Masukkan kode OTP ke kolom yang tersedia, kemudian klik tombol &quot;Bayar&quot;.</li>
										<li>Setelah pembayaran berhasil dilakukan, klik tombol &quot;Kembali ke situs merchant&quot; untuk melihat status pembayaran dan pembelian anda.</li>
									</ol>
								</Tooltip>
							</InputGroup>
						)}
						<InputGroup>
							<Input label='Masukkan OVO ID' type='number' placeholder='OVO ID' onChange={this.onOvoNumberChange} />
						</InputGroup>
						
						<div className={styles.checkOutAction}>
							<Checkbox checked content='Saya setuju dengan syarat dan ketentuan MatahariMall.com' />
							<Button onClick={this.submitPayment} block size='large' iconPosition='right' icon='angle-right' color='red' content='Bayar Sekarang' loading={loading} />
						</div>
					</div>
				</div>
			</Card>
		);
	}
};