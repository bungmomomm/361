import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import _ from 'lodash';

import { actions } from '@/state/Payment';
import { paymentGroupName } from '@/state/Payment/constants';
import { 
	// Tooltip,
	// Card,
	// Group,
	// Select,
	CreditCardInput,
	CreditCardRadio,
	// Checkbox,
	// Button,
	// Level,
	// Input,
	Sprites
} from '@/components';

import { 
	// Tooltip,
	// Group,
	Radio,
	Select,
	Checkbox,
	Button,
	Level,
	Input
} from 'mm-ui';

import styles from '../../../Mobile/mobile.scss';

import { 
	PaymentOptions, 
	Bulan 
} from '@/data';

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
				const listPayment = [];
				enabledPaymentItems.map((option, index) => {
					const RadioLabel = (
						<Level>
							<Level.Left>{option.label}</Level.Left>
							<Level.Right>{option.settings.image && <img src={option.settings.image} alt={option.label} height='15px' />}</Level.Right>
						</Level>
					);
					return listPayment.push({
						label: RadioLabel, 
						inputProps: { 
							name: 'payment-CONVENIENCE_STORE', 
							onChange: () => console.log(index)
						}
					});
				});
				return <Radio inputStyle='blocklist' data={listPayment} />;
			}
			case paymentGroupName.CREDIT_CARD:
				return payments.selectedPayment.paymentItems.map((option, index) => (
					option.cards.length < 3 ? (
						option.cards.map((card, cardIndex) => (
							card.value && (
								<CreditCardRadio 
									key={cardIndex}
									name='cc'
									variant='list'
									value={card.value}
									content={card.label}
									defaultChecked={card.selected}
									sprites={card.sprites}
								/>
							)
						))
					) : (
						<Select key={index} options={option.cards} />
					)
				));
			case paymentGroupName.INSTALLMENT:
				return (
					<div>
						{
							payments.selectedPayment.paymentItems.map((installment, index) => {
								return (
									<div key={index}>
										<Select options={installment.banks} />
										<Select options={installment.banks[index].listCicilan} />
									</div>
								);
							})
						}
						<CreditCardInput 
							placeholder='Masukkan Nomor Kartu'
							sprites='payment-option'
							onChange={this.onInstallmentCCNumberChange}
						/>
						<Level>
							<Level.Item>
								<Select options={Bulan} />
							</Level.Item>
							<Level.Item>
								<Select options={this.props.tahun} />
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
			<div className={styles.card}>
				<p><strong>4. Informasi Pembayaran</strong></p>
				<div>
					<Select 
						label='Metode Pembayaran'
						options={payments.paymentMethods.methods} 
						onChange={(e) => this.paymentMethodChange(e)}
					/>
					{ payments.selectedPayment && switchPaymentElement()}
					{
						false && (
							<div>
								<Select label='Pilih Bank' options={PaymentOptions} />
								<Select label='Pilih Lama Cicilan' options={PaymentOptions} />
								<Radio 
									inputStyle='blocklist' 
									data={[
										{
											label: 'BCA Virtual Account', 
											inputProps: { 
												name: 'cc', 
												onChange: () => console.log('index')
											}
										}, {
											label: 'Bank Lainnya Virtual Account', 
											inputProps: { 
												name: 'cc', 
												onChange: () => console.log('index')
											}
										}, {
											label: 'Manual Transfer', 
											inputProps: { 
												name: 'cc', 
												onChange: () => console.log('index')
											}
										}
									]} 
								/>
							</div>
						)
					}
					<Input label='SMS konfirmasi pembayaran & pengambilan barang (khusus O2O) akan dikirimkan ke : ' min={0} type='number' placeholder={'No Telp Penagihan'} />
					<Input label='No Hp yang terdaftar di OVO / OVO-ID / MCC-ID / HiCard-ID' placeholder={'Masukkan nomor Hp yang terdaftar di OVO'} type='number' min={0} />
					<div className={styles.checkOutAction}>
						<Checkbox>Saya setuju dengan syarat dan ketentuan MatahariMall.com</Checkbox>
						<Button block size='large' color='red'>Bayar Sekarang</Button>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		payments: state.payments
	};
};

export default withCookies(connect(mapStateToProps)(StepFour));

