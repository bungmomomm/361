import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import _ from 'lodash';

import { actions } from '@/state/Payment';
import { paymentGroupName } from '@/state/Payment/constants';
import { 
	Tooltip,
	Card,
	InputGroup,
	Select,
	CreditCardRadio,
	CreditCardInput,
	Checkbox,
	Button,
	Level,
	Input,
	Sprites
} from '@/components';

import styles from '../../../Mobile/mobile.scss';

import { PaymentOptions, Bulan } from '@/data';

class StepFour extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			selectedPaymentMethod: null
		};
		this.cookies = this.props.cookies.get('user.token');
	}
	
	onSelectedPaymentItem(selectedPaymentItem) {
		const { payments } = this.props;
		this.selectedData = _.find(payments.selectedPayment.paymentItems, ['value', selectedPaymentItem.value]);
		if (this.selectedData) {
			this.setState({
				selectedPaymentItem,
				showPaymentInfo: {
					id: selectedPaymentItem.value,
					notes: this.selectedData.settings.info.join(' ')
				}
			});
		} else {
			this.setState({ 
				selectedPaymentItem 
			});
		}
	}

	paymentMethodChange(e) {
		const { payments, dispatch } = this.props;
		dispatch(new actions.changePaymentMethod(e.value, payments.paymentMethods, this.cookies));
		this.setState({ showPaymentInfo: null });
	}
	
	render() {
		const {
			payments
		} = this.props;

		const {
			showPaymentInfo,
			selectedPaymentItem
		} = this.state;

		const switchPaymentElement = () => {
			// PAYMENT MENTHOD LIST
			switch (payments.selectedPayment.value) {
			case paymentGroupName.BANK_TRANSFER:
			case paymentGroupName.CONVENIENCE_STORE:
			case paymentGroupName.E_MONEY:
			case paymentGroupName.INTERNET_BANKING:
				return (
					<InputGroup>
						<Select 
							name={`payment-${payments.selectedPayment.value}`} 
							options={payments.selectedPayment.paymentItems}
							onChange={(e) => this.onSelectedPaymentItem(e)}
						/>
						{
							showPaymentInfo && (showPaymentInfo.id === selectedPaymentItem.value) && (
								<Tooltip position='right' content='Info'>
									{showPaymentInfo.notes}
								</Tooltip>
							)
						}
					</InputGroup>
				);
			case paymentGroupName.CREDIT_CARD:
				return payments.selectedPayment.paymentItems.map((option, index) => (
					option.cards.length < 3 ? (
						option.cards.map((card, cardIndex) => (
							card.value && (
								<InputGroup key={cardIndex}>
									<CreditCardRadio 
										name='cc'
										variant='list'
										value={card.value}
										content={card.label}
										defaultChecked={card.selected}
										sprites={card.sprites}
									/>
								</InputGroup>
							)
						))
					) : (
						<InputGroup key={index}>
							<Select name='cc' options={option.cards} />
						</InputGroup>
					)
				));
			case paymentGroupName.INSTALLMENT:
				return (
					<div>
						<InputGroup>
							{
								payments.selectedPayment.paymentItems.map((installment, index) => {
									return (
										<div key={index}>
											<InputGroup>
												<Select name='bank' options={installment.banks} />
											</InputGroup>
											<InputGroup>
												<Select name='bank' options={installment.banks[index].listCicilan} />
											</InputGroup>
										</div>
									);
								})
							}
						</InputGroup>	
						<InputGroup>
							<CreditCardInput 
								placeholder='Masukkan Nomor Kartu'
								sprites='payment-option'
								onChange={this.onInstallmentCCNumberChange}
							/>
						</InputGroup>,
						<label htmlFor='masa-berlaku'>Masa Berlaku</label>,
						<Level padded>
							<Level.Item>
								<Select top options={Bulan} />
							</Level.Item>
							<Level.Item>
								<Select top options={this.props.tahun} />
							</Level.Item>
							<Level.Item>
								<Input type='password' placeholder='cvv' />
							</Level.Item>
							<Level.Item>
								<Sprites name='cvv' />
							</Level.Item>
						</Level>
					</div>
				);
			default:
				return null;
			}
			
		};

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
					{ payments.selectedPayment && switchPaymentElement()}
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

