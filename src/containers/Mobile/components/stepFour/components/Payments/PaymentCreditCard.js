import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
// import { actions } from '@/state/Payment';

// component load
import { CreditCardRadio, Sprites } from '@/components';
import { 
	Group,
	Input,
	Row,
	Col
} from 'mm-ui';
// import { Bulan } from '@/data';
// import { T } from '@/data/translations';

class PaymentCreditCard extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.cookies = this.props.cookies.get('user.token');
	}

	render() {
		return (
			<Group>
				{
					this.props.payments.selectedPayment.paymentItems.map((option, index) => (
						option.cards.length <= 3 && (
							option.cards.map((card, cardIndex) => (
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
							))
						)
					))
				}
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