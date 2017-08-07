import React, { Component } from 'react';
import styles from '../Checkout.scss';
import Sprites from '@/components/Sprites';

// component load
import { 
	Tooltip, 
	Level, 
	Input, 
	InputGroup, 
	Select, 
	Card, 
	Button, 
	Checkbox 
} from '@/components/Base';

// Dummy Data
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
	}

	handleSubmit(event) {
		event.preventDefault();
		console.log(this.props);
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
							<InputGroup addons>
								<Input size='small' color='green' />
								<Button size='small' color='green' content='CEK' />
							</InputGroup>
						</Level.Right>
					</Level>
					<Level>
						<Level.Left>Kode Voucher</Level.Left>
						<Level.Right>
							<InputGroup>
								<Input size='small' error message='kode voucher salah' />
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
							<Select selectedLabel='-- Pilih Bank' options={Bank} />
							<Tooltip position='left' align='right'>
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
							<Input placeholder='Masukkan Nomor Kartu' creditCard />
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
							<Button block size='large' iconPosition='right' icon='angle-right' color='red' content='Bayar Sekarang' />
						</div>
					</div>
				</div>
			</Card>
		);
	}
};