import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { actions as paymentAction } from '@/state/Payment';
import styles from '@/containers/Page/page.scss';
// import Tooltip from '../Tooltip';

import { Radio, Level, Icon, Tooltip } from 'mm-ui';
import _ from 'lodash';
import { pushDataLayer } from '@/utils/gtm';
import handler from '@/containers/Mobile/Shared/handler';

@handler
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
		if (this.props.payments.selectedPaymentOption !== nextProps.payments.selectedPaymentOption) {
			this.setState({
				selectedPaymentOption: nextProps.payments.selectedPaymentOption
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
				<Level key={index} isMobile>
					<Level.Left>
						{option.label}
						{option.disabled && <div style={{ fontSize: '10px' }} className='font-red'>{option.disableMessage}</div>}
					</Level.Left>
					<Level.Right >
						{option.settings.image && <img src={option.settings.image} alt={option.label} height='15px' />}
						{
							option.settings.info &&
							<Tooltip
								id={option.uniqueConstant}
								position='left'
								label={
									<span className={styles.tooltipButton}>
										<Icon name='exclamation-circle' />
									</span>
								}
							>
								{option.settings.info.join('<br />')}
							</Tooltip>
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
