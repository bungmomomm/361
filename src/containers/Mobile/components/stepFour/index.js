import React, { Component } from 'react';
import Recaptcha from 'react-recaptcha';
import { 
	Card,
	InputGroup,
	Select,
	CreditCardRadio,
	Checkbox,
	Button,
	Input,
	Modal
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
					<InputGroup>
						<Select label='Metode Pembayaran' name='paymentMethods' options={PaymentOptions} />
					</InputGroup>
					<InputGroup>
						<Select label='Pilih Bank' name='bank' options={PaymentOptions} />
					</InputGroup>
					<InputGroup>
						<Select label='Pilih Lama Cicilan' name='bank' options={PaymentOptions} />
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
						<Input label='No Hp yang terdaftar di OVO / OVO-ID / MCC-ID / HiCard-ID' placeholder={'Masukkan nomor Hp yang terdaftar di OVO'} type='number' min={0} />
					</InputGroup>
					<div className={styles.checkOutAction}>
						<Checkbox defaultChecked content='Saya setuju dengan syarat dan ketentuan MatahariMall.com' />
						<Button block size='large' color='red' content='Bayar Sekarang' />
					</div>
				</div>
				<Modal size='small' variant='clean' show={false} >
					<Modal.Header>
						<p>Verifikasi No Handphone</p>
						<p className='font-grey'><small>Mohon masukan no Handphone anda untuk verifikasi data</small></p>
					</Modal.Header>
					<Modal.Body>
						<form>
							<InputGroup>
								<Input name='phone' number placeholder='No Handphone anda (contoh: 08219823982189)' />
							</InputGroup>
							<InputGroup>
								{ 
									process.env.GOOGLE_CAPTCHA_SITE_KEY && (
										<Recaptcha
											sitekey={process.env.GOOGLE_CAPTCHA_SITE_KEY}
										/>
									) 
								}
							</InputGroup>
							<InputGroup>
								<Input name='otp' value='1' number placeholder='OTP dari no handphone anda (contoh: 123123)' />
							</InputGroup>
						</form>
					</Modal.Body>
					<Modal.Footer>
						<InputGroup>
							<Button size='large' type='button' className='text-uppercase' block content='Kirim' color='dark' />
						</InputGroup>
						<InputGroup>
							<Button size='large' type='button' className='text-uppercase' block disabled content='verifikasi' color='dark' />
						</InputGroup>
						<InputGroup>
							<Button size='medium' type='button' className='text-uppercase font-dark' block content='ubah no handphone' />
						</InputGroup>
					</Modal.Footer>
				</Modal>
			</Card>
		);
	}
}