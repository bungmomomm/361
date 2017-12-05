import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { actions as paymentAction } from '@/state/Payment';

import { Radio, Level } from 'mm-ui';
import _ from 'lodash';

class PaymentSelection extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			selectedPaymentOption: null
		};
		this.cookies = this.props.cookies.get('user.token');
		console.log(this.props);
	}

	componentWillMount() {
		this.setState({
			selectedPaymentOption: null
		});
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.payments !== nextProps.payments) {
			this.validateSelection();
		}
		if (this.props.payments.selectedPayment !== nextProps.payments.selectedPayment) {
			this.setState({
				selectedPaymentOption: null
			});
		}
	}

	onSelectedPaymentItem(selectedPaymentItem) {
		const { payments, dispatch } = this.props;
		dispatch(new paymentAction.changePaymentOption(selectedPaymentItem, this.cookies));
		this.selectedData = _.find(payments.selectedPayment.paymentItems, ['value', selectedPaymentItem.value]);
		if (this.selectedData) {
			this.setState({
				selectedPaymentOption: selectedPaymentItem,
				installmentList: [],
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

	showTooltip(content) {
		let tooltip = '';
		if (content.length) {
			tooltip = content.join(' ');
		}
		this.setState({ tooltip });
	}

	validateSelection() {
		setTimeout(() => {
			if (
				this.state.selectedPaymentOption
			) {
				this.props.enableButtonPayNow(true);
			} else {
				this.props.enableButtonPayNow(false);
			}
		}, 100);
	}

	render() {
		const { payments } = this.props;
		const enabledPaymentItems = _.filter(payments.selectedPayment.paymentItems, (e) => { return e.value !== null; });
		const listPayment = [];
		enabledPaymentItems.map((option, index) => {
			const RadioLabel = (
				<Level key={index}>
					<Level.Left>
						{option.label}
						{option.disabled && <div style={{ fontSize: '10px' }} className='font-red'>{option.disableMessage}</div>}
					</Level.Left>
					<Level.Right >	
						{option.settings.image && <img src={option.settings.image} alt={option.label} height='15px' />}
						{option.settings.info && <span role='button' tabIndex='-1' onClick={() => this.showTooltip(option.settings.info)}>
							{/* <Icon name='exclamation-circle' className={styles.tooltipButton} /> */}
						</span>}
					</Level.Right>
				</Level>
			);
			return listPayment.push({
				label: RadioLabel, 
				dataProps: { 
					name: `payment-${payments.selectedPayment.value}`, 
					onChange: () => this.onSelectedPaymentItem(option),
					disabled: option.disabled,
					checked: this.state.selectedPaymentOption === option || false
				}
			});
		});
		return (
			<Radio block inputStyle='blocklist' size='large' data={listPayment} />
		);
	}
};

const mapStateToProps = (state) => {
	return {
		payments: state.payments
	};
};

export default withCookies(connect(mapStateToProps)(PaymentSelection));