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
			voucherCode: null
		};

		this.submitPayment = this.submitPayment.bind(this);
		this.handleCekVoucher = this.handleCekVoucher.bind(this);
		this.onChange = this.onChange.bind(this);
	}
	onChange(event) {
		this.setState({
			[event.name]: event.target.value
		});
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
		return (
			<Card>
				<div className={styles.overflow}>
					<Level>
						<Level.Left>Subtotal</Level.Left>
						<Level.Right>{currency(22500000)}</Level.Right>
					</Level>
					<Level>
						<Level.Left>Total Biaya Pengiriman</Level.Left>
						<Level.Right>{currency(15000)}</Level.Right>
					</Level>
					<Level>
						<Level.Left>
							<div className='font-green'>Discount Biaya Pengiriman</div>
						</Level.Left>
						<Level.Right>
							<div className='font-green'>{currency(-300000)}</div>
						</Level.Right>
					</Level>
					<Level>
						<Level.Left>Kode Voucher</Level.Left>
						<Level.Right>
							<form onSubmit={this.handleCekVoucher}>
								<InputGroup addons>
									<Input size='small' name='voucherCode' onChange={this.onChange} color='green' />
									<Button type='submit' size='small' loading={this.state.loadingButtonVoucher} color='green' content='CEK' />
								</InputGroup>
							</form>
						</Level.Right>
					</Level>
					<Level>
						<Level.Left>Kode Voucher</Level.Left>
						<Level.Right>
							<InputGroup addons addonsAttached>
								<Input size='small' color='red' message='kode voucher salah' />
								<Button type='button' className='font-red' size='small' icon='times' iconPosition='right' />
							</InputGroup>
						</Level.Right>
					</Level>
					<div className={styles.CheckoutTitle}>
						<Level noMargin>
							<Level.Left>Total Pembayaran</Level.Left>
							<Level.Right>
								<div className={`${styles.price} text-right`}>{currency(22503000)}</div>
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
						<Checkbox text='Simpan untuk transaksi berikutnya' />
						<p>SMS konfirmasi pembayaran & pengambilan barang (khusus O2O) akan dikirimkan ke :</p>
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