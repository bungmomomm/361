import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { actions } from '@/state/Payment';

// component load
import { CreditCardRadio, CreditCardInput, Sprites } from '@/components';
import { 
	Group,
	Input,
	Row,
	Col,
	Checkbox,
	Select,
	Button
} from 'mm-ui';
import { Bulan } from '@/data';
import { T } from '@/data/translations';

class PaymentCreditCard extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.tahun = [{ value: null, label: 'tahun' }];
		this.numberOfCard = 0;
		this.minNumberOfCard = 0;
		this.cookies = this.props.cookies.get('user.token');
		this.state = {
			appliedBin: this.props.appliedBin,
			cardValid: null
		};
	}

	componentWillMount() {
		const { payments } = this.props;
		this.numberOfCard = payments.selectedPayment.cards || 0;

		const date = new Date();
		const thisYear = date.getFullYear();
		for (let year = thisYear; year < (thisYear + 10); year++) {
			this.tahun.push({ value: year, label: year });
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.payments !== nextProps.payments) {
			this.validateInstallmentForm();
		}
	}

	onCardNumberChange(event) {
		const { payments, dispatch } = this.props;
		const selectedPaymentOption = new actions.getAvailabelPaymentSelection(payments.selectedPayment);
		console.log(event);
		if (event.valid) {
			dispatch(new actions.changeCreditCardNumber(event.ccNumber));
			dispatch(new actions.applyBin(this.cookies, selectedPaymentOption.value, event.ccNumber, ''));
			this.setState({
				appliedBin: {
					selectedPaymentOption,
					cardNumber: event.ccNumber,
					bankName: ''
				},
				cardValid: true
			});
		} else {
			dispatch(new actions.applyBin(this.cookies, -1, event.ccNumber, ''));
			this.setState({
				appliedBin: {
					selectedPaymentOption,
					cardNumber: '',
					bankName: ''
				},
				cardValid: false
			});
		}
		this.validateInstallmentForm();
	}

	onChangeCVV(e) {
		this.ccvValue = e.target.value;
		this.props.dispatch(new actions.changeCreditCardCvv(e.target.value));
	}

	validateInstallmentForm() {
		setTimeout(() => {
			if (
				this.elCreditCard.state.ccValid === 'green' &&
				this.elMonth.state.selected !== null &&
				this.elYear.state.selected !== null &&
				this.ccvValue !== ''
			) {
				this.props.enableButtonPayNow(true);
			} else {
				this.props.enableButtonPayNow(false);
			}
		}, 100);
	}

	renderCreditCardRadio(option) {
		return option.cards.map((card, cardIndex) => (
			card.value && (
				<div key={cardIndex} >
					<CreditCardRadio
						name='cc'
						variant='list'
						value={card.value}
						content={card.label}
						defaultChecked={card.selected}
						sprites={card.sprites}
					/>
					<Row>
						<Col grid={4}>
							<Input
								type='password'
								placeholder='cvv'
								onChange={this.onCardCvvChange}
								validation={{
									rules: 'required|min_value:1',
									name: 'cvv'
								}}
								ref={(c) => { this.elCCCvv = c; }}
							/>
						</Col>
						<Col grid={4}>
							<Sprites name='cvv' />
						</Col>
					</Row>
				</div>
			)
		));
	}

	renderAddNewCard() {
		const { dispatch } = this.props;
		if (this.props.payments.twoClickEnabled && this.numberOfCard > this.minNumberOfCard) {
			return (
				<Button clean color='grey' icon='plus-circle' iconPosition='left' onClick={() => dispatch(new actions.openNewCreditCard())}>
					{T.checkout.ADD_NEW_CARD}
				</Button>
			);
		}
		return null;
	}

	renderNewCardForm() {
		const { payments, dispatch } = this.props;
		const { cardValid } = this.state;
		if ((payments.openNewCreditCard && !payments.twoClickEnabled) || this.numberOfCard === 0) {
			return (
				<div>
					<Group>
						<CreditCardInput 
							placeholder={T.checkout.INPUT_CART_NUMBER} 
							color={!cardValid && cardValid !== null ? 'red' : ''}
							sprites='payment-option' 
							ref={(c) => { this.elCreditCard = c; }}
							onChange={(e) => this.onCardNumberChange(e)} 
							message={!cardValid && cardValid !== null ? T.checkout.INPUT_MATCHED_CART_NUMBER : ''}
						/>
					</Group>
					<label htmlFor='masa-berlaku' key={2}>Masa Berlaku</label>
					<Group grouped id='masa-berlaku'>
						<Select
							block
							options={Bulan}
							onChange={(e) => dispatch(new actions.changeCreditCardMonth(e.value))}
							validation={{ rules: 'required|min_value:1', name: 'month' }}
							ref={(c) => { this.elMonth = c; }}
						/>
						<Select
							block
							options={this.tahun}
							onChange={(e) => dispatch(new actions.changeCreditCardYear(e.value))}
							validation={{ rules: 'required|min_value:10|min:1', name: 'year' }}
							ref={(c) => { this.elYear = c; }}
						/>
						<Input
							dataProps={{ minLength: 0, maxLength: 4 }}
							type='password'
							placeholder='cvv'
							onChange={(e) => this.onChangeCVV(e)}
							validation={{ rules: 'required|min_value:1', name: 'cvv' }}
							ref={(c) => { this.elCvv = c; }}
						/>
						<div style={{ paddingRight: '30px' }} ><Sprites name='cvv' /></div>
					</Group>
					<Checkbox 
						defaultChecked 
						onClick={(state, value) => dispatch(new actions.saveCC(state, value))} 
					>
						{T.checkout.SAVE_CARD_FOR_NEXT_TRANSACTION}
					</Checkbox>
				</div>
			);
		}
		return null;
	}

	render() {
		return (
			<Group>
				{
					this.props.payments.selectedPayment.paymentItems.map((option, index) => (
						option.cards.length <= 3 ? this.renderCreditCardRadio(option) : <Select key={index} block options={option.cards} />
					))
				}
				{this.renderAddNewCard()}
				{this.renderNewCardForm()}
			</Group>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		payments: state.payments,
		blockContent: state.global.blockContent
	};
};

export default withCookies(connect(mapStateToProps)(PaymentCreditCard));