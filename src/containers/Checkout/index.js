import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styles from './Checkout.scss';
import { CheckoutHeader } from '@/components/Header';
import Icon from '@/components/Icon';
import { Select, Alert, Container, Row, Col, Card, Tabs, Box, Button, Checkbox } from '@/components/Base';
import { StoreBox } from '@/components/Store';
import { CheckoutProduct, CheckoutResult } from '@/components/Product';

export default class Checkout extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		return (
			<div>
				<Helmet title='Checkout' />
				<CheckoutHeader />
				<Container>
					<Row>
						<Col grid={4}>
							<div className={styles.title}>1. Pilih Metode & Alamat Pengiriman</div>
							<Tabs tabActive={0} stretch>
								<Tabs.Panel title='Kirim ke Alamat' icon='warning'>
									<div>
										<Alert alignCenter close warning>
											Gratis ongkos kirim hingga Rp 15,000 untuk minimal pembelian sebesar Rp 100,000
										</Alert>
										<Box>
											<Select options={[
												{
													value: 1,
													label: '25.000'
												}, {
													value: 2,
													label: '40.000'
												}, {
													value: 3,
													label: '50.000'
												}, {
													value: 4,
													label: '100.000'
												}, {
													value: 5,
													label: '150.000'
												}, {
													value: 6,
													label: '200.000'
												}, {
													value: 7,
													label: '300.000'
												}, {
													value: 8,
													label: 'Paket Data Telkomsel 100.000'
												}, {
													value: 9,
													label: 'Paket Data Telkomsel 150.000'
												}, {
													value: 10,
													label: 'Paket Data Telkomsel 200.000'
												}, {
													value: 11,
													label: 'Paket Data Telkomsel 25.000'
												}, {
													value: 12,
													label: 'Paket Data Telkomsel 300.000'
												}, {
													value: 13,
													label: 'Paket Data Telkomsel 50.000'
												}
											]}
											/>
											<Row gapless>
												<Col grid={4}><strong>Rumah Bangka</strong></Col>
												<Col row text='right'><Icon name='map-marker' /> &nbsp; Lokasi Sudah Ditandai</Col>
											</Row>
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
									</div>
								</Tabs.Panel>
								<Tabs.Panel title='Ambil Di Toko/E-locker (O2O)' icon='chevron-right'>
									<h2>Content #2</h2>
								</Tabs.Panel>
							</Tabs>
						</Col>
						<Col grid={4}>
							<div className={styles.title}>2. Rincian Pesanan & Pengiriman</div>
							<Card stretch>
								<div className={styles.overflow}>
									<StoreBox name='Wakawaka Sport banget dahh' location='DKI Jakarta'>
										<CheckoutProduct />
										<CheckoutResult />
									</StoreBox>

									<StoreBox name='Wakawaka Sport banget dahh' location='DKI Jakarta'>
										<CheckoutProduct />
										<CheckoutProduct />
										<CheckoutResult />
									</StoreBox>
								</div>
							</Card>
						</Col>
						<Col grid={4}>
							<div className={styles.title}>3. Pembayaran</div>
							<Card>
								<div>Checkout</div>
							</Card>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
};