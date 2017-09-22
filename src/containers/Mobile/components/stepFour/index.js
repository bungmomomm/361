import React, { Component } from 'react';
import { 
	Card,
	InputGroup,
	Select,
	CreditCardRadio,
	Checkbox,
	Button,
	Input
} from '@/components';

import styles from '../../../Mobile/mobile.scss';

import { PaymentOptions } from '@/data';

export default class StepFour extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}
	
	render() {
		return (
			<Card>
				<p><strong>4. Informasi Pembayaran</strong></p>
				<div>
					<p>Metode Pembayaran</p>
					<InputGroup>
						<Select name='paymentMethods' options={PaymentOptions} />
					</InputGroup>
					<InputGroup>
						<p>Pilih Bank</p>
						<Select name='bank' options={PaymentOptions} />
					</InputGroup>
					<InputGroup>
						<p>Pilih Lama Cicilan</p>
						<Select name='bank' options={PaymentOptions} />
					</InputGroup>
					<InputGroup>
						<CreditCardRadio name='cc' content={'BCA Virtual Account'} sprites='visa' />
					</InputGroup>
					<InputGroup>
						<CreditCardRadio name='cc' content={'Bank Lainnya Virtual Account'} sprites='mastercard' />
					</InputGroup>
					<InputGroup>
						<CreditCardRadio name='cc' content={'Manual Transfer'} />
					</InputGroup>
					<InputGroup>
						<Input label='SMS konfirmasi pembayaran & pengambilan barang (khusus O2O) akan dikirimkan ke : ' min={0} type='number' placeholder={'No Telp Penagihan'} />
					</InputGroup>
					<InputGroup>
						<Input placeholder={'Masukkan nomor Hp yang terdaftar di OVO'} label='No Hp yang terdaftar di OVO / OVO-ID / MCC-ID / HiCard-ID' type='number' min={0} />
					</InputGroup>
					<div className={styles.checkOutAction}>
						<Checkbox defaultChecked content='Saya setuju dengan syarat dan ketentuan MatahariMall.com' />
						<Button block size='large' iconPosition='right' icon='angle-right' color='red' content='Bayar Sekarang' />
					</div>
				</div>
			</Card>
		);
	}
}