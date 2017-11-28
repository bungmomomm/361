import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';

import { actions as couponActions } from '@/state/Coupon';
import { actions as paymentActions } from '@/state/Payment';
import { RESET_PAYMENT_METHOD } from '@/state/Payment/constants';
import { currency, componentState, renderIf, pushDataLayer } from '@/utils';
import { T } from '@/data/translations';
import { 
	Level,
	Icon,
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
			showModalOtp: false,
			applyCouponStep: componentState.button.active, 
			removeCouponStep: componentState.button.active
		};
		this.cookies = this.props.cookies.get('user.token');
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.coupon !== nextProps.coupon) {
			if (
				(!nextProps.coupon.validCoupon && nextProps.coupon.code === 403) || 
				(typeof nextProps.coupon.otp.valid !== 'undefined' && !nextProps.coupon.otp.valid)
			) {
				this.showOTPmodal(true);
			} else {
				this.showOTPmodal(false);	
			}
		}
	}

	onChangeVoucher(e) {
		this.setState({ voucherCode: e.target.value });
	}

	onAddCoupon() {
		const me = this;
		me.setState({ applyCouponStep: componentState.button.loading });
		const { dispatch, soNumber } = me.props;
		dispatch(new couponActions.addCoupon(me.cookies, soNumber, me.state.voucherCode)).then(() => {
			dispatch(new paymentActions.applyBin(me.cookies, RESET_PAYMENT_METHOD));
			me.setState({ applyCouponStep: componentState.button.active });
			pushDataLayer('checkout', 'checkout', { step: 5, option: 'Voucher' });
		}).catch((error) => {
			me.setState({ applyCouponStep: componentState.button.active });
		});
	}

	onRemoveCoupon(event) {
		const { dispatch, soNumber } = this.props;
		this.setState({ removeCouponStep: componentState.button.loading });
		dispatch(new couponActions.removeCoupon(this.props.cookies.get('user.token'), soNumber)).then(() => {
			const paymentMethodId = RESET_PAYMENT_METHOD;
			this.setState({ removeCouponStep: componentState.button.active });
			dispatch(new paymentActions.applyBin(this.props.cookies.get('user.token'), paymentMethodId)).then(() => {
				paymentActions.changePaymentMethod(false);
			});
		}).catch((error) => {
			this.setState({ removeCouponStep: componentState.button.active });
		});
		pushDataLayer('checkout', 'checkout', { step: 5, option: 'Non Voucher' });

	}

	showOTPmodal(bool = null) {
		const status = bool === null ? !this.state.showModalOtp : bool;
		this.setState({ showModalOtp: status });
	}

	resetCoupon() {
		this.setState({ voucherCode: '', applyCouponStep: componentState.button.active });
		const { dispatch } = this.props;
		dispatch(new couponActions.resetCoupon()).then(() => {
			dispatch(new paymentActions.applyBin(this.cookies, RESET_PAYMENT_METHOD));
		});
	}

	createClassCard() {
		return [
			styles.card,
			this.props.loading || this.state.removeCouponStep === 'loading' ? styles.loading : '',
			this.props.disabled ? styles.disabled : ''
		].join(' ').trim();
	}

	render() {
		const {
			showModalOtp
		} = this.state;

		const {
			payments,
			coupon,
		} = this.props;
		
		const inlineStyle = {
			mb5: {
				marginBottom: '5px'
			}
		};

		const adminFeeIdr = (payments.adminFee && payments.adminFee.feeInIdr) ? payments.adminFee.feeInIdr : null;
		const invalidVoucher = (typeof coupon.coupon !== 'undefined' && coupon.coupon !== '' && typeof coupon.code !== 'undefined' && coupon.code !== 200);
		let couponId = false;
		if (coupon.validCoupon && coupon.coupon !== '') {
			couponId = coupon.coupon;
		} else if (payments.couponId) {
			couponId = payments.couponId;
		}

		const htmlDisc = (!payments.discount) ? false : payments.discount.map((discountItem, index) => {
			return (
				<Level style={inlineStyle.mb5} key={index}>
					<Level.Left className={styles.discountName}>
						<div className='text-elipsis'> - {discountItem.discountName}</div>
					</Level.Left>
					<Level.Right>
						<div className='text-right'>{currency(-discountItem.totalDiscount)}</div>
					</Level.Right>
				</Level>
			);
		});
		

		return (
			<div className={this.createClassCard()}>
				<p><strong>{T.checkout.STEP_THREE_LABEL}</strong></p>
				<Level style={inlineStyle.mb5}>
					<Level.Left><strong>{T.checkout.SUB_TOTAL}</strong></Level.Left>
					<Level.Right className='text-right'><strong>{currency(payments.subTotal)}</strong></Level.Right>
				</Level>
				{
					renderIf(couponId)(
						<Level style={inlineStyle.mb5}>
							<Level.Left>
								{T.checkout.VOUCHER} : <strong>{couponId}</strong> &nbsp;
								<span role='button' tabIndex='-1' onClick={(e) => this.onRemoveCoupon(e)} >
									<Icon name='times-circle' />
								</span>
							</Level.Left>
							<Level.Right className='text-right'>&nbsp;</Level.Right>
						</Level>
					)
				}
				{
					renderIf(htmlDisc)(htmlDisc)
				}
				<Level style={inlineStyle.mb5}>
					<Level.Left>{T.checkout.TOTAL_SHIPPING_COST}</Level.Left>
					<Level.Right className='text-right'>{currency(payments.deliveryCost)}</Level.Right>
				</Level>
				<Level style={inlineStyle.mb5}>
					<Level.Left>
						<div className='font-green'>{T.checkout.DISCOUNT_SHIPPING_COST}</div>
					</Level.Left>
					<Level.Right>
						<div className='font-green text-right'>{currency(-payments.deliveryCostDiscount)}</div>
					</Level.Right>
				</Level>
				{
					renderIf(!couponId)(
						<Level style={inlineStyle.mb5}>
							<Level.Left className={styles.voucherLabel}>{T.checkout.VOUCHER_CODE}</Level.Left>
							<Level.Right>
								<Group attached grouped>
									<Input 
										size='small'
										name='voucherCode'
										color={invalidVoucher ? 'red' : 'green'}
										dataProps={{
											value: this.state.voucherCode
										}}
										onChange={(e) => this.onChangeVoucher(e)}
									/>
									<Button 
										type={invalidVoucher ? 'button' : 'submit'}
										icon={invalidVoucher ? 'times' : ''}
										size='small'
										color={invalidVoucher ? 'red' : 'green'}
										onClick={() => (invalidVoucher ? this.resetCoupon() : this.onAddCoupon())}
										state={this.state.applyCouponStep}
									>{invalidVoucher ? '' : T.checkout.CHECK}</Button>
								</Group>
							</Level.Right>
						</Level>
					)
				}
				{ 
					renderIf(adminFeeIdr)(
						<Level>
							<Level.Left><strong>Biaya Administrasi</strong></Level.Left>
							<Level.Right className='text-right'><strong>{currency(adminFeeIdr)}</strong></Level.Right>
						</Level>
					)}
				{
					renderIf(typeof coupon.code !== 'undefined' && coupon.code !== 200)(
						<Level style={inlineStyle.mb5}>
							<Level.Left>&nbsp;</Level.Left>
							<Level.Right>
								<div className='font-red'>{coupon.message}</div>
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
		payments: state.payments,
		carts: state.cart.data
	};
};

export default withCookies(connect(mapStateToProps)(StepThree));

