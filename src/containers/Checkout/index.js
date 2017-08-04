import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styles from './Checkout.scss';

// component load
import { CheckoutHeader } from '@/components/Header';
import Icon from '@/components/Icon';
import Sprites from '@/components/Sprites';
import { 
	Tooltip, 
	Level, 
	Input, 
	InputGroup, 
	Select, 
	Alert, 
	Container, 
	Row, 
	Col, 
	Card, 
	Tabs, 
	Box, 
	Button, 
	Checkbox } from '@/components/Base';
import { StoreBox } from '@/components/Store';
import { CheckoutProduct, CheckoutResult } from '@/components/Product';

// Checkout Component
import NewAddressModalbox from './components/Modal/NewAddressModalbox';
import ElockerModalbox from './components/Modal/ElockerModalbox';
import PaymentSuccessModalbox from './components/Modal/PaymentSuccessModalbox';
import PaymentErrorModalbox from './components/Modal/PaymentErrorModalbox';
import Dropshipper from './components/Dropshipper';


// import utils
import { currency } from '@/utils';

// Dummy Data
import { 
	UangElektronik, 
	GeraiTunai, 
	InternetBanking, 
	Bank, 
	Bulan, 
	Tahun, 
	CheckoutList, 
	Address, 
	PaymentOptions, 
	CreditCard, 
	ElockerList } from '@/data';

export default class Checkout extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			enableAlamatPengiriman: true,
			enablePesananPengiriman: false,
			enablePembayaran: false
		};
	}

	render() {
		return (
			<div className='page'>
				<Helmet title='Checkout' />
				<CheckoutHeader />
				<div className={styles.checkout}>
					<Container>
						<Row>
							<Col grid={4} className={this.state.enableAlamatPengiriman ? '' : styles.disabled}>
								<div className={styles.title}>1. Pilih Metode & Alamat Pengiriman</div>
								<Tabs tabActive={0} stretch>
									<Tabs.Panel title='Kirim ke Alamat' sprites='truck-off' spritesActive='truck-on'>
										<Alert alignCenter close warning>
											Gratis ongkos kirim hingga Rp 15,000 untuk minimal pembelian sebesar Rp 100,000
										</Alert>
										<Box>
											<InputGroup>
												<Select filter selectedLabel='-- Pilih Alamat Lainnya' options={Address} />
											</InputGroup>
											<Level>
												<Level.Left><strong>Rumah Bangka</strong></Level.Left>
												<Level.Right><Icon name='map-marker' /> &nbsp; Lokasi Sudah Ditandai</Level.Right>
											</Level>
											<p>
												Aufar Syahdan <br />
												The Residence B10 - 9 <br />
												Jl. Bangka II, Mampang Prapatan, Jakarta Selatan, DKI Jakarta 12720 <br />
												P: 08568052187
											</p> 
											<Button clean type='button' font='orange' icon='pencil' text='Ubah Alamat ini' />
										</Box>
										<Dropshipper />
										<Button text='Masukan Alamat Pengiriman' dark block size='large' iconRight icon='angle-right' />
									</Tabs.Panel>
									<Tabs.Panel title='Ambil Di Toko/E-locker (O2O)' sprites='o2o-off' spritesActive='o2o-on'>
										<Alert alignCenter warning>
											Maksimum 2 kg perorder untuk Ambil di Toko. Pesanan diatas 2 kg akan langsung dikirimkan ke Alamat Anda.
										</Alert>
										<Box>
											<InputGroup>
												<Select filter selectedLabel='-- Pilih Alamat E-Locker' options={ElockerList} />
											</InputGroup>
											<Level>
												<Level.Left><strong>E-Locker Family Mart Kelapa Gading &nbsp; <Icon name='map-marker' /></strong></Level.Left>
											</Level>
											<p>
												Family Mart Kelapa Gading Lt.2 <br />
												Jl. Boulevard Barat Blok XC No.7 <br />
												Kelapa Gading, Jakarta Utara 12420 <br />
												Telp:
											</p>
										</Box>
										<p className='font-red'>Satu atau lebih produk dalam keranjang belanja anda tidak menyediakan layanan Ambil di Toko / Elocker (O2O)</p>
									</Tabs.Panel>
								</Tabs>
							</Col>
							<Col grid={4} className={this.state.enablePesananPengiriman ? '' : styles.disabled}>
								<div className={styles.title}>2. Rincian Pesanan & Pengiriman <span>(5 items)</span></div>
								<Card stretch>
									<div className={styles.overflow}>
										{
											CheckoutList.map((storeData, i) => (
												<StoreBox key={i} name={storeData.store.name} location={storeData.store.location}>
													{
														storeData.store.products.map((product, index) => (
															<CheckoutProduct key={index} data={product} />
														))
													}
													<CheckoutResult key={i} gosend={storeData.store.gosend} />
												</StoreBox>
											))
										}
									</div>
								</Card>
							</Col>
							<Col grid={4} className={this.state.enablePembayaran ? '' : styles.disabled}>
								<div className={styles.title}>3. Pembayaran</div>
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
													<Input size='small' />
													<Button size='small' success text='CEK' />
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
													<span className={styles.price}>{currency(22503000)}</span>
												</Level.Right>
											</Level>
										</div>
										<form className={styles.hasCheckoutAction}>
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
												<Tooltip right>
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
												<Input value='082113982173' />
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
													<Input placeholder='cvv' />
												</Level.Item>
												<Level.Item>
													<Sprites name='cvv' />
												</Level.Item>
											</Level>
											<Checkbox text='Simpan untuk transaksi berikutnya' />
											<p>SMS konfirmasi pembayaran & pengambilan barang (khusus O2O) akan dikirimkan ke :</p>
											<div className={styles.checkOutAction}>
												<Checkbox text='Saya setuju dengan syarat dan ketentuan MatahariMall.com' />
												<Button size='large' iconRight icon='angle-right' block primary text='Bayar Sekarang' />
											</div>
										</form>
									</div>
								</Card>
							</Col>
						</Row>
					</Container>
				</div>
				<NewAddressModalbox />
				<ElockerModalbox />
				<PaymentSuccessModalbox />
				<PaymentErrorModalbox />
			</div>
		);
	}
};