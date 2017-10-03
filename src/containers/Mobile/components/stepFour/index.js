import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '@/state/Payment';
import { withCookies } from 'react-cookie';
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

class StepFour extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			selectedPaymentMethod: null
		};
		this.cookies = this.props.cookies.get('user.token');
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.payments !== nextProps.payments)	{
			console.log(nextProps.payments);
		}
	}

	paymentMethodChange(e) {
		const { payments, dispatch } = this.props;
		dispatch(new actions.changePaymentMethod(e.value, payments.paymentMethods, this.cookies));
	}
	
	render() {
		const {
			payments
		} = this.props;

		return (
			<Card>
				<p><strong>4. Informasi Pembayaran</strong></p>
				<div>
					<InputGroup>
						<Select 
							label='Metode Pembayaran' 
							name='paymentMethods' 
							options={payments.paymentMethods.methods} 
							onChange={(e) => this.paymentMethodChange(e)}
						/>
					</InputGroup>
					{
						payments.selectedPayment && (
							<InputGroup>
								<Select
									name={`payment-${payments.selectedPayment.value}`}
									options={payments.selectedPayment.paymentItems}
								/>
							</InputGroup>
						)
					}
					{
						false && (
							<div>
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
							</div>
						)
					}
					<div className={styles.checkOutAction}>
						<Checkbox defaultChecked content='Saya setuju dengan syarat dan ketentuan MatahariMall.com' />
						<Button block size='large' color='red' content='Bayar Sekarang' />
					</div>
				</div>
			</Card>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		payments: state.payments
	};
};

export default withCookies(connect(mapStateToProps)(StepFour));

