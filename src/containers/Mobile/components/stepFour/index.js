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
	CreditCardInput,
	CreditCardRadio,
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

	paymentMethodChange(stateSelectedPayment) {
		const { payments, dispatch } = this.props;
		dispatch(new actions.changePaymentMethod(stateSelectedPayment.value, payments.paymentMethods, this.cookies));
		this.setState({ 
			showPaymentInfo: null,
			stateSelectedPayment
		});
	}
	
	render() {
		const {
			payments
		} = this.props;

		const switchPaymentElement = () => {
			// PAYMENT MENTHOD LIST
			switch (payments.selectedPayment.value) {
			case paymentGroupName.BANK_TRANSFER:
			case paymentGroupName.E_MONEY:
			case paymentGroupName.INTERNET_BANKING:
			case paymentGroupName.CONVENIENCE_STORE: {
				const enabledPaymentItems = _.filter(payments.selectedPayment.paymentItems, ['disabled', false]);
				const listPayment = enabledPaymentItems.map((option, index) => (
					<InputGroup key={index}>
						<CreditCardRadio 
							name={`payment-${payments.selectedPayment.value}`}
							value={option.value}
							size='large'
							content={option.label}
							image={option.settings.image}
						/>
						{
							option.settings.info && (
								<div className={styles.btInfo}>
									<Tooltip position='right'>
										{option.settings.info.join(' ')}
									</Tooltip>
								</div>
							)
						}
					</InputGroup>
				));	

				return (
					<InputGroup>
						<InputGroup>
							<hr />
						</InputGroup>
						<label htmlFor='masa-berlaku'>Pilih Opsi Pembayaran</label>
						{listPayment}
					</InputGroup>
				);
			}
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
							moreDetail
							options={payments.paymentMethods.methods} 
							onChange={(e) => this.paymentMethodChange(e)}
							selected={this.state.stateSelectedPayment}
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
							</div>
						)
					}
					<InputGroup>
						<Input label='SMS konfirmasi pembayaran & pengambilan barang (khusus O2O) akan dikirimkan ke : ' min={0} type='number' placeholder={'No Telp Penagihan'} />
					</InputGroup>
					<InputGroup>
						<Input label='No Hp yang terdaftar di OVO / OVO-ID / MCC-ID / HiCard-ID' placeholder={'Masukkan nomor Hp yang terdaftar di OVO'} type='number' min={0} />
					</InputGroup>
					<div className={styles.checkOutAction}>
						<Checkbox defaultChecked content='Saya setuju dengan syarat dan ketentuan MatahariMall.com' />
						<Button disabled block size='large' color='red' content='Bayar Sekarang' />
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

