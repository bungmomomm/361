import React, { Component } from 'react';
import styles from '../Checkout.scss';
import Sprites from '@/components/Sprites';
import { Validator } from 'ree-validate';
import { paymentType } from '@/state/Payment/constants';

// component load
import { 
	Tooltip, 
	Level, 
	Input, 
	InputGroup, 
	Select, 
	Card, 
	Button, 
	Checkbox,
	Radio 
} from '@/components/Base';

// Dummy Data
import { 
// 	UangElektronik, 
// 	GeraiTunai, 
// 	InternetBanking, 
// 	Bank, 
	Bulan, 
	Tahun
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
		this.props.onNewCreditCard(event);
	}

	onSelectCard(event) {
		this.props.onSelectCard(event.value);
	}

	handleCekVoucher(event) {
		event.preventDefault();
		this.setState({
			loadingButtonVoucher: true
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		console.log(this.state);
	}

	submitPayment() {
		console.log(this.state);
	}

	render() {
		const { coupon, subTotal, total, deliveryCostDiscount, deliveryCost, paymentMethods, selectedPayment } = this.props.payments;
		let voucherBox = '';
		if (this.props.coupon === '' || this.props.validCoupon === null) { 
			voucherBox = (
				<Level>
					<Level.Left>Kode Voucher</Level.Left>
					<Level.Right>
						<InputGroup addons>
							<Input size='small' name='voucherCode' onChange={this.onChange} onKeyPress={this.onChange} color='green' value={this.props.coupon} />
							<Button type='submit' size='small' onClick={this.onAddCoupon} loading={this.props.loadingButtonCoupon} color='green' content='CEK' />
						</InputGroup>
					</Level.Right>
				</Level>
			);
		} else if (!this.props.validCoupon && this.props.coupon !== '') {
			voucherBox = (
				<Level>
					<Level.Left>Kode Voucher</Level.Left>
					<Level.Right>
						<InputGroup addons addonsAttached>
							<Input size='small' name='voucherCode' color='yellow' message='kode voucher salah' onChange={this.onChange} onKeyPress={this.onChange} value={this.props.coupon} />
							<Button type='button' className='font-red' size='small' icon='times' iconPosition='right' onClick={this.props.onResetCoupon} />
						</InputGroup>
					</Level.Right>
				</Level>
			);			
		}
		let paymentOptions = false;
		if (selectedPayment) {
			switch (selectedPayment.value) {
			case paymentType.BANK_TRANSFER:
			case paymentType.CONVENIENCE_STORE:
			case paymentType.E_MONEY:
			case paymentType.INTERNET_BANKING:
				paymentOptions = false;
				paymentOptions = (
					<InputGroup>
						<Select name={`payment-${selectedPayment.value}`} selectedLabel='-- Tambah Baru' options={selectedPayment.paymentItems} onChange={this.onPaymentOptionChange} />
					</InputGroup>
				);
				break;
			case paymentType.CREDIT_CARD:
				paymentOptions = (
					<InputGroup>
						{ 
							selectedPayment.paymentItems.map((option, index) =>
								option.cards.map((card, cardIndex) => 
									<Radio key={cardIndex} name='cc' variant='list' creditCard value={card.value} content={card.label} onChange={this.onSelectCard} checked={option.selectedCard === card.value} />
								)
							)
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
						<Level.Left>Subtotal</Level.Left>
						<Level.Right className='text-right'>{currency(subTotal)}</Level.Right>
					</Level>
					{
						!this.props.validCoupon ? null : (
							<Level>
								<Level.Left>Voucher : <strong>{this.props.loadingButtonCoupon ? 'loading...' : this.props.coupon }</strong> <Button icon='times-circle' iconPosition='right' onClick={this.props.onRemoveCoupon} /></Level.Left>
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
							<Tooltip align='right' content='Info' color='white'>
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
						{ paymentOptions }
						{ renderIf(selectedPayment.value === paymentType.CREDIT_CARD)(
							<InputGroup>
								<Button clean icon='plus-circle' iconPosition='left' content='Tambah Kartu' onClick={this.onNewCreditCard} />
							</InputGroup>
						)}
						{ renderIf(this.props.payments.openNewCreditCard)(
							<div>
								<InputGroup>
									<Input placeholder='Masukkan Nomor Kartu' sprites='payment-option' creditCard />
								</InputGroup>
								<label htmlFor='masa-berlaku'>Masa Berlaku</label>
								<Level padded>
									<Level.Item>
										<Select top selectedLabel='-- Bulan' options={Bulan} />
									</Level.Item>
									<Level.Item>
										<Select top selectedLabel='-- Tahun' options={Tahun} />
									</Level.Item>
									<Level.Item>
										<Input type='number' placeholder='cvv' />
									</Level.Item>
									<Level.Item>
										<Sprites name='cvv' />
									</Level.Item>
								</Level>
							</div>
						)}
						<div className={styles.checkOutAction}>
							<Checkbox text='Saya setuju dengan syarat dan ketentuan MatahariMall.com' />
							<Button onClick={this.submitPayment} block size='large' iconPosition='right' icon='angle-right' color='red' content='Bayar Sekarang' />
						</div>
					</div>
				</div>
			</Card>
		);
	}
};