import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styles from './Checkout.scss';

// component load
import { CheckoutHeader } from '@/components/Header';
import { Container, Row, Col } from '@/components/Base';
	
// Checkout Component
import NewAddressModalbox from './components/Modal/NewAddressModalbox';
import ElockerModalbox from './components/Modal/ElockerModalbox';
import PaymentSuccessModalbox from './components/Modal/PaymentSuccessModalbox';
import PaymentErrorModalbox from './components/Modal/PaymentErrorModalbox';

// Section Component
import CardPesananPengiriman from './components/CardPesananPengiriman';
import CardPembayaran from './components/CardPembayaran';
import CardPengiriman from './components/CardPengiriman';


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
		const {
			enableAlamatPengiriman,
			enablePesananPengiriman,
			enablePembayaran
		} = this.state;

		return (
			<div className='page'>
				<Helmet title='Checkout' />
				<CheckoutHeader />
				<div className={styles.checkout}>
					<Container>
						<Row>
							<Col grid={4} className={enableAlamatPengiriman ? '' : styles.disabled}>
								<div className={styles.title}>1. Pilih Metode & Alamat Pengiriman</div>
								<CardPengiriman />
							</Col>
							<Col grid={4} className={enablePesananPengiriman ? '' : styles.disabled}>
								<div className={styles.title}>2. Rincian Pesanan & Pengiriman <span>(5 items)</span></div>
								<CardPesananPengiriman />
							</Col>
							<Col grid={4} className={enablePembayaran ? '' : styles.disabled}>
								<div className={styles.title}>3. Pembayaran</div>
								<CardPembayaran />
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