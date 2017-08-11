import React, { Component } from 'react';
import styles from '../Checkout.scss';
import Sprites from '@/components/Sprites';
import { Validator } from 'ree-validate';

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
	UangElektronik, 
	GeraiTunai, 
	InternetBanking, 
	Bank, 
	Bulan, 
	Tahun,
	PaymentOptions, 
	CreditCard
} from '@/data';

// import utils
import { currency } from '@/utils';

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
			errors: this.validator.errorBag,
			voucherCode: null,
			validVoucher: false,
			reset: null
		};
		console.log(this.props.payments);
		this.submitPayment = this.submitPayment.bind(this);
		this.handleCekVoucher = this.handleCekVoucher.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onAddCoupon = this.onAddCoupon.bind(this);
	}
	onChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	onAddCoupon(event) {
		this.props.onAddCoupon(this.state.voucherCode);
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
		const { coupon, subTotal, total, deliveryCostDiscount, deliveryCost } = this.props.payments;
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
							<Select selectedLabel='-- Pilih Metode Lain' options={PaymentOptions} />
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
						<InputGroup>
							<Select selectedLabel='-- Tambah Baru' options={CreditCard} />
						</InputGroup>
						<InputGroup>
							<Select selectedLabel='-- Pilih Bank Lainnya' options={InternetBanking} />
						</InputGroup>
						<InputGroup>
							<Select selectedLabel='-- Pilih Opsi Lainnya' options={GeraiTunai} />
						</InputGroup>
						<InputGroup>
							<Select selectedLabel='-- Pilih Opsi Lainnya' options={UangElektronik} />
						</InputGroup>
						<InputGroup>
							<Radio name='cc' variant='list' creditCard value='1' content='4111 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4444' />
							<Radio name='cc' variant='list' creditCard value='2' content='2222 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4444' />
						</InputGroup>
						<InputGroup>
							<Button clean icon='plus-circle' iconPosition='left' content='Tambah Kartu' />
						</InputGroup>
						<InputGroup>
							<Select selectedLabel='-- Pilih Bank' options={Bank} />
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
						<p>SMS konfirmasi pembayaran & pengambilan barang (khusus O2O) akan dikirimkan ke :</p>
						<InputGroup>
							<Input type='text' value='082113982173' />
						</InputGroup>
						<InputGroup>
							<Input placeholder='Masukkan Nomor Kartu' sprites='payment-option' creditCard />
						</InputGroup>
						<InputGroup>
							<Input label='Masukkan OVO ID' type='number' placeholder='OVO ID' />
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