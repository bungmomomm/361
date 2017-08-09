import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styles from './Checkout.scss';

// component load
import { CheckoutHeader } from '@/components/Header';
import Loading from '@/components/Loading';
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

import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
// import jwtDecode from 'jwt-decode';
// import request from 'request';
// import generateRequestHeaders from 'kong-hmac';
import axios from 'axios';

class Checkout extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			enableAlamatPengiriman: true,
			enablePesananPengiriman: false,
			enablePembayaran: true,
			cookie: {
				name: this.props.cookies.get('name') || 'Ben'
			},
			loading: false
			token: this.props.cookies.get('user.token'),
			refreshToken: this.props.cookies.get('user.rf.token')
		};
	}

	componentWillMount() {

		window.dataLayer.push({
			event: 'checkout',
			userID: '10c53c28efe87fe0c27262ba36f11d5d',
			emailaddress: '8b5fb124f94a8f1185af1794a9524703',
			ecommerce: {  
				checkout: {  
					actionField: {  
						step: 1,
						option: 'Login Email'
					},
					products: [
						{  
							id: '839783',
							name: 'Samsung B109E Keystone 3 - Hitam',
							price: '270000',
							brand: 'Samsung',
							category: 'Handphone & Tablet Handphone Handphone Basic',
							variant: '',
							quantity: '1'
						}, {
							id: '4630647',
							name: 'Hydrowhey 3.5Lbs - Hero - Khusus O2O',
							price: '2300000',
							brand: 'Optimum Nutrition',
							category: 'Kesehatan & Kecantikan Kesehatan Suplemen Kesehatan dan Pelangsing Nutrisi Olahraga',
							variant: '',
							quantity: '1'
						}
					]
				}
			}
		});
		// const decoded = jwtDecode(this.state.token);
		/* const userName = 'mmall';
		const secret = '123';
		// const url = 'http://10.200.44.177:28318/auth/login?email=diana.hanly@mataharimall.com&pass=1234567&client_id=Android_v2&client_secret=fd1ce5392d2c631b7891de37c3d2c52d&client_version=2.1.0';
		const url = 'http://api.mataharimall.co/v2/auth/login?email=diana.hanly@mataharimall.com&pass=1234567&client_id=Android_v2&client_secret=fd1ce5392d2c631b7891de37c3d2c52d&client_version=2.1.0';
		const method = 'GET';
		const httpVersion = 'HTTP/1.0'; // default "HTTP/1.1"
		const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJtYXRhaGFyaW1hbGwuY29tIiwidWlkIjoiMjAxNTAyNSIsIm1haWwiOiJkaWFuYS5oYW5seUBtYXRhaGFyaW1hbGwuY29tIiwicGhvbmUiOiIwODA4IiwibmFtZSI6IkRpYW5hIiwiZ2VuZGVyIjoiZmVtYWxlIiwiYmlydGhkYXkiOiIxOTkzLTAyLTEwIiwiZXhwaXJlZF90aW1lIjoiMjAxNy0wOS0wNyAxMzo0MDo0NiIsInJlZnJlc2hfdG9rZW4iOiI5Y2E3NjBjYjM1YjBlODE3OGQ3ZWE1MDZlYmRmNWEyMiIsImNsaWVudF9pZCI6IkFuZHJvaWRfdjIiLCJjbGllbnRfc2VjcmV0IjoiZmQxY2U1MzkyZDJjNjMxYjc4OTFkZTM3YzNkMmM1MmQiLCJ1c2VyX2xvZ2luX2RldmljZV9pZCI6IjQzMjQzMjQzMjQzMjQyNCIsImludGVybmFsX3Rva2VuX3ZlcnNpb24iOiIwLjEiLCJjbGllbnRfdmVyc2lvbiI6IjIuMS4wIn0.snwnynjy5lfw9LSdDPBv8GFaHFLCgI63nuV7LQkI0Rs';
		const host = 'api.mataharimall.co';
    */
		/* const params = {
			host,
			token,
			userName,
			secret,
			url,
			method, 
			httpVersion
		}; */
		// const headers = generateRequestHeaders(params);
		// console.log(headers);
		const url = 'http://api.mataharimall.co/v2/auth/login?email=diana.hanly@mataharimall.com&pass=1234567&client_id=Android_v2&client_secret=fd1ce5392d2c631b7891de37c3d2c52d&client_version=2.1.0';

		axios.post(url).then((response) => {
			console.log(response);
		}).catch((error) => {
			console.log(error);
		});		
	} 

	render() {
		const {
			enableAlamatPengiriman,
			enablePesananPengiriman,
			enablePembayaran
		} = this.state;
		
		return (
			this.state.loading ? <Loading /> : (
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
					<NewAddressModalbox shown />
					<ElockerModalbox />
					<PaymentSuccessModalbox />
					<PaymentErrorModalbox />
				</div>
			)
		);
	}
};

Checkout.propTypes = {
	cookies: instanceOf(Cookies).isRequired
};

export default withCookies(Checkout);