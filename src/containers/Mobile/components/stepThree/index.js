import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';

import { actions as couponActions } from '@/state/Coupon';
import { actions as paymentActions } from '@/state/Payment';
import { RESET_PAYMENT_METHOD } from '@/state/Payment/constants';
import { currency } from '@/utils';
import { T } from '@/data/translations';
import { 
	Level,
	Group,
	Button,
	Input
} from 'mm-ui';

import styles from '../../../Mobile/mobile.scss';
import ModalVerifyPhoneNumber from './ModalVerifyPhoneNumber';


class StepThree extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			voucherCode: null,
			showModalOtp: false
		};
		this.cookies = this.props.cookies.get('user.token');
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.coupon !== nextProps.coupon) {
			if (!nextProps.coupon.validCoupon && nextProps.coupon.code === 403) {
				this.showOTPmodal(true);
			}
		}
	}

	onChangeVoucher(e) {
		this.setState({ voucherCode: e.target.value });
	}

	onAddCoupon() {
		const { dispatch, soNumber } = this.props;
		dispatch(new couponActions.addCoupon(this.cookies, soNumber, this.state.voucherCode)).then(() => {
			dispatch(new paymentActions.applyBin(this.cookies, RESET_PAYMENT_METHOD));
		});
	}

	showOTPmodal(bool = null) {
		const status = bool === null ? !this.state.showModalOtp : bool;
		this.setState({ showModalOtp: status });
	}

	resetCoupon() {
		this.setState({ voucherCode: null });
		const { dispatch } = this.props;
		dispatch(new couponActions.resetCoupon()).then(() => {
			dispatch(new paymentActions.applyBin(this.cookies, RESET_PAYMENT_METHOD));
		});
	}

	render() {
		const {
			showModalOtp
		} = this.state;

		const {
			payments,
			coupon
		} = this.props;

		const inlineStyle = {
			mb5: {
				marginBottom: '5px'
			}
		};

		return (
			<div className={styles.card}>
				<p><strong>{T.checkout.STEP_THREE_LABEL}</strong></p>
				<Level style={inlineStyle.mb5}>
					<Level.Left><strong>{T.checkout.SUB_TOTAL}</strong></Level.Left>
					<Level.Right className='text-right'><strong>{currency(payments.subTotal)}</strong></Level.Right>
				</Level>
				{
					coupon.validCoupon && (
						<Level style={inlineStyle.mb5}>
							<Level.Left>{T.checkout.VOUCHER} : <strong>MM20HM</strong> &nbsp; <Button icon='times-circle' iconRight /></Level.Left>
							<Level.Right className='text-right'>&nbsp;</Level.Right>
						</Level>
					)
				}
				<Level style={inlineStyle.mb5}>
					<Level.Left>{T.checkout.TOTAL_SHIPPING_COST}</Level.Left>
					<Level.Right className='text-right'>{currency(payments.deliveryCost)}</Level.Right>
				</Level>
				<Level style={inlineStyle.mb5}>
					<Level.Left>
						<div className='font-green'>{T.checkout.DISCOUNT_SHPPING_COST}</div>
					</Level.Left>
					<Level.Right>
						<div className='font-green text-right'>{currency(-payments.deliveryCostDiscount)}</div>
					</Level.Right>
				</Level>
				{
					(coupon.code === 403 && coupon.message) ? (
						<div>
							<Level style={inlineStyle.mb5}>
								<Level.Left className={styles.voucherLabel}>{T.checkout.VOUCHER_CODE}</Level.Left>
								<Level.Right>
									<Group addons addonsAttached>
										<Input 
											size='small'
											name='voucherCode'
											color='red'
											value={coupon.coupon}
											onChange={(e) => this.onChangeVoucher(e)}
										/>
										<Button 
											type='button'
											className='font-red'
											size='small'
											icon='times'
											iconRight
											onClick={() => this.resetCoupon()}
										/>
									</Group>
								</Level.Right>
							</Level>
							<Level style={inlineStyle.mb5}>
								<Level.Left>&nbsp;</Level.Left>
								<Level.Right>
									<div className='font-red'>{coupon.message}</div>
								</Level.Right>
							</Level>
						</div>
					) : (
						<Level style={inlineStyle.mb5}>
							<Level.Left className={styles.voucherLabel}>{T.checkout.VOUCHER_CODE}</Level.Left>
							<Level.Right>
								<Group attached grouped>
									<Input 
										size='small'
										name='voucherCode'
										color='green'
										onChange={(e) => this.onChangeVoucher(e)}
									/>
									<Button 
										type='submit'
										size='small'
										color='green'
										onClick={() => this.onAddCoupon()}
									>{T.checkout.CHECK}</Button>
								</Group>
							</Level.Right>
						</Level>
					)
				}
				<div className={styles.CheckoutTitle}>
					<Level>
						<Level.Left>{T.checkout.TOTAL_PAYMENT}</Level.Left>
						<Level.Right>
							<div className={`${styles.price} text-right`}>{currency(payments.total)}</div>
						</Level.Right>
					</Level>
				</div>
				{
					showModalOtp && (
						<ModalVerifyPhoneNumber 
							show={showModalOtp}
							handleClose={() => this.showOTPmodal(false)}
						/>
					)
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		coupon: state.coupon,
		soNumber: state.cart.soNumber,
		payments: state.payments
	};
};

export default withCookies(connect(mapStateToProps)(StepThree));

