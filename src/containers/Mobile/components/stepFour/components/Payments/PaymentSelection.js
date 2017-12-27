import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { actions as paymentAction } from '@/state/Payment';
import styles from '@/containers/Mobile/mobile.scss';
import Tooltip from '../Tooltip';

import { Radio, Level, Icon } from 'mm-ui';
import _ from 'lodash';
import { pushDataLayer } from '@/utils/gtm';

class PaymentSelection extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			selectedPaymentOption: null
		};
		this.cookies = this.props.cookies.get('user.token');
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

	componentWillUnmount() {
		this.props.enableButtonPayNow(false);
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
			pushDataLayer('checkout', 'checkout', { step: 7, option: selectedPaymentItem.label });
		} else {
			this.setState({ 
				selectedPaymentItem 
			});
		}
	}

	showTooltip(content) {
		let tooltip = '';
		if (content.length) {
			tooltip = content.join('<br />');
		}
		this.setState({ tooltip });
	}

	validateSelection() {
		if (
			this.state.selectedPaymentOption
		) {
			this.props.enableButtonPayNow(true);
		} else {
			this.props.enableButtonPayNow(false);
		}
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
						{option.settings.info && <span className={styles.tooltipButton} role='button' tabIndex='-1' onClick={() => this.showTooltip(option.settings.info)}>
							{<Icon name='exclamation-circle' />}
						</span>}
						{
							this.state.tooltip && this.state.selectedPaymentOption === option && (
								<Tooltip
									id={option.uniqueConstant} 
									show 
									content={this.state.tooltip} 
									onClose={() => this.setState({ tooltip: '' })}
								/>
							)
						}
					</Level.Right>
				</Level>
			);
			return listPayment.push({
				label: RadioLabel, 
				dataProps: { 
					name: `payment-${option.uniqueConstant}`, 
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