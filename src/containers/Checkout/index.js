import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styles from './Checkout.scss';

// component load
import { CheckoutHeader } from '@/components/Header';
import Icon from '@/components/Icon';
import Sprites from '@/components/Sprites';
import { Tooltip, Textarea, Modal, Level, Input, InputGroup, Select, Alert, Container, Row, Col, Card, Tabs, Box, Button, Checkbox } from '@/components/Base';
import { StoreBox } from '@/components/Store';
import { CheckoutProduct, CheckoutResult } from '@/components/Product';
import Gosend from '@/components/Gosend';
import Elocker from '@/components/Elocker';

// Dummy Data
import { Bank, Bulan, Tahun, Provinsi, CheckoutList, Address, PaymentOptions, CreditCard, ElockerList } from '@/data';

export default class Checkout extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			modalAddressShow: false
		};
	}

	handleModalAddress() {
		this.setState({
			modalAddressShow: !this.state.modalAddressShow
		});
	}

	render() {
		return (
			<div className='page'>
				<Helmet title='Checkout' />
				<CheckoutHeader />
				<div className={styles.checkout}>
					<Container>
						<Row>
							<Col grid={4}>
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
										<Box accordion>
											<Checkbox text='Kirim sebagai Dropshipper' />
											<Box.Accordion>
												<InputGroup>
													<Input type='text' placeholder='Nama Dropshipper' />
												</InputGroup>
												<InputGroup>
													<Input type='number' placeholder='No Handphone' />
												</InputGroup>
											</Box.Accordion>
										</Box>
										<Button onClick={() => this.handleModalAddress} text='Masukan Alamat Pengiriman' dark block size='large' iconRight icon='angle-right' />
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
							<Col grid={4}>
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
													<CheckoutResult gosend={storeData.store.gosend} />
												</StoreBox>
											))
										}
									</div>
								</Card>
							</Col>
							<Col grid={4}>
								<div className={styles.title}>3. Pembayaran</div>
								<Card>
									<div className={styles.overflow}>
										<Level>
											<Level.Left>Subtotal</Level.Left>
											<Level.Right>Rp 22.500.000</Level.Right>
										</Level>
										<Level>
											<Level.Left>Total Biaya Pengiriman</Level.Left>
											<Level.Right>Rp 15.000</Level.Right>
										</Level>
										<Level>
											<Level.Left>
												<div className='font-green'>Discount Biaya Pengiriman</div>
											</Level.Left>
											<Level.Right>
												<div className='font-green'>-Rp 30.000</div>
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
													<span className={styles.price}>Rp 22.503.000</span>
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
												<Select selectedLabel='-- Pilih Bank' options={Bank} />
												<Tooltip right>
													<p>Info Pembayaran COD</p>
													<ul>
														<li>Lakukan pembayaran disaat barang sampai</li>
														<li>Maksimal total belanja Rp 2.000.000</li>
													</ul>
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
				<Modal>
					<Modal.Header>
						<div>Buat Alamat Baru</div>
					</Modal.Header>
					<Modal.Body>
						<div className={styles.overflow}>
							<form>
								<InputGroup>
									<Input 
										label='Simpan Sebagai' 
										horizontal
										placeholder='Contoh: rumah, kantor, rumah pacar'
										name='name'
										type='text'
									/>
								</InputGroup>
								<InputGroup>
									<Input 
										label='Nama Penerima'
										horizontal
										required
										placeholder='Masukan nama lengkap penerima'
										name='penerima'
										type='text'
									/>
								</InputGroup>
								<InputGroup>
									<Input 
										label='No Handphone'
										horizontal
										required
										placeholder='Contoh : 08123456789'
										name='no-hp'
										type='text'
									/>
								</InputGroup>
								<InputGroup>
									<Select 
										horizontal
										label='Kota, Provinsi'
										filter
										required
										selectedLabel='-- Silahkan Pilih' 
										options={Provinsi} 
									/>
								</InputGroup>
								<InputGroup>
									<Select 
										horizontal
										label='Kecamatan'
										filter
										required
										selectedLabel='-- Silahkan Pilih' 
										options={Provinsi} 
									/>
								</InputGroup>
								<InputGroup>
									<Input 
										label='Kode Pos'
										horizontal
										required
										placeholder='Contoh : 12345'
										name='kodepos'
										type='text'
									/>
								</InputGroup>
								<InputGroup>
									<Textarea 
										horizontal
										label='Alamat'
										required
										placeholder='Masukkan Alamat Lengkap'
										name='address'
									/>
								</InputGroup>
							</form>
							<Alert warning>
								<small>
									<em>
										Harap tidak mengisi alamat pickup point O2O tanpa melalui pilihan menu Ambil di Toko
										(O2O). Kami tidak bertanggung jawab bila terjadi kehirlangan
									</em>
								</small>
							</Alert>
							<Gosend />
							<Box row>
								<Icon name='map-marker' />
								<div>Jalan Bangka II No.20, Pela Mampang, 
								Mampang Prapatan, Kota Jakarta Selatan, 
								DKI jakarta 12720</div>
								<button className='font-small font-orange'>Ganti Lokasi</button>
							</Box>
							<p className='font-small font-orange'>Lokasi peta harus sesuai dengan alamat pengiriman. Lokasi diperlukan jika ingin menggunakan jasa pengiriman GO-SEND.</p>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Level>
							<Level.Left>
								<em>* wajib diisi</em>
							</Level.Left>
							<Level.Right>
								<Button text='Simpan Alamat' dark block />
							</Level.Right>
						</Level>
					</Modal.Footer>
				</Modal>

				<Modal large >
					<Modal.Header>
						Pilih Lokasi E-Locker (O2O)
					</Modal.Header>
					<Modal.Body>
						<Elocker />
					</Modal.Body>
					<Modal.Footer>
						<Level>
							<Level.Right>
								<Button text='Pilih E-Locker (O2O)' dark />
							</Level.Right>
						</Level>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
};