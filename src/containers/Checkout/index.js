import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { CheckoutHeader } from '@/components/Header';
import styles from './Checkout.scss';
import { Select, Alert, Container, Row, Col, Card, Tabs, Box } from '@/components/Base';

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
						<Col>
							<div className={styles.title}>1. Pilih Metode & Alamat Pengiriman</div>
							<Tabs tabActive={0}>
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
										</Box>
									</div>
								</Tabs.Panel>
								<Tabs.Panel title='Ambil Di Toko/E-locker (O2O)' icon='chevron-right'>
									<h2>Content #2</h2>
								</Tabs.Panel>
							</Tabs>
						</Col>
						<Col>
							<div className={styles.title}>2. Rincian Pesanan & Pengiriman</div>
							<Card>
								<div>Checkout</div>
							</Card>
						</Col>
						<Col>
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