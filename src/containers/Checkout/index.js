import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styles from './Checkout.scss';

// component load
import { CheckoutHeader } from '@/components/Header';
import Icon from '@/components/Icon';
import { Textarea, Modal, Level, Input, InputGroup, Select, Alert, Container, Row, Col, Card, Tabs, Box, Button, Checkbox } from '@/components/Base';
import { StoreBox } from '@/components/Store';
import { CheckoutProduct, CheckoutResult } from '@/components/Product';
import Gosend from '@/components/Gosend';
import Elocker from '@/components/Elocker';

// Dummy Data
import { Provinsi, CheckoutList, Address, PaymentOptions, CreditCard } from '@/data';

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
			<div>
				<Helmet title='Checkout' />
				<CheckoutHeader />
				<div className={styles.checkout}>
					<Container>
						<Row>
							<Col grid={4}>
								<div className={styles.title}>1. Pilih Metode & Alamat Pengiriman</div>
								<Tabs tabActive={0} stretch>
									<Tabs.Panel title='Kirim ke Alamat' sprites='truck-off' spritesActive='truck-on'>
										<div>
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
											<Box>
												<Checkbox text='Kirim sebagai Dropshipper' />
											</Box>
											<Button onClick={() => this.handleModalAddress} text='Masukan Alamat Pengiriman' dark block size='large' iconRight icon='angle-right' />
										</div>
									</Tabs.Panel>
									<Tabs.Panel title='Ambil Di Toko/E-locker (O2O)' sprites='o2o-off' spritesActive='o2o-on'>
										<h2>asdasdasd</h2>
									</Tabs.Panel>
								</Tabs>
							</Col>
							<Col grid={4}>
								<div className={styles.title}>2. Rincian Pesanan & Pengiriman</div>
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
									<div>
										<Level>
											<Level.Left>Subtotal</Level.Left>
											<Level.Right>Rp 22.500.000</Level.Right>
										</Level>
										<Level>
											<Level.Left>Total Biaya Pengiriman</Level.Left>
											<Level.Right>Rp 15.000</Level.Right>
										</Level>
										<Level>
											<Level.Left>Discount Biaya Pengiriman</Level.Left>
											<Level.Right>-Rp 30.000</Level.Right>
										</Level>
										<Level>
											<Level.Left>Kode Voucher</Level.Left>
											<Level.Right>
												<form onSubmit={() => console.log('submit')}>
													<InputGroup addons>
														<Input size='small' />
														<Button size='small' success text='CEK' />
													</InputGroup>
												</form>
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
										<form>
											<p>Pilih Metode Pembayaran</p>
											<InputGroup>
												<Select selectedLabel='-- Pilih Metode Lain' options={PaymentOptions} />
											</InputGroup>
											<InputGroup>
												<Select selectedLabel='-- Tambah Baru' options={CreditCard} />
											</InputGroup>
											<p>SMS konfirmasi pembayaran & pengambilan barang (khusus O2O) akan dikirimkan ke :</p>
											<Input value='082113982173' />
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

				<Modal large shown>
					<Modal.Header>
						Pilih Lokasi E-Locker (O2O)
					</Modal.Header>
					<Modal.Body>
						<Elocker />
					</Modal.Body>
				</Modal>
			</div>
		);
	}
};