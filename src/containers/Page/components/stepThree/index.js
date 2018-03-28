import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';

import { actions as couponActions } from '@/state/Coupon';
import { actions as paymentActions } from '@/state/Payment';
import { RESET_PAYMENT_METHOD } from '@/state/Payment/constants';
import { currency, componentState, renderIf } from '@/utils';
import { pushDataLayer } from '@/utils/gtm';
import { T } from '@/data/translations';
import {
	Level,
	Icon,
	Group,
	Button,
	Input
} from 'mm-ui';

import styles from '../../../Page/page.scss';
import ModalVerifyPhoneNumber from './ModalVerifyPhoneNumber';
import { getRefreshToken } from '@/state/Auth/actions';
import handler from '@/containers/Mobile/Shared/handler';

@handler
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
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
	}

	componentWillReceiveProps(nextProps) {
		if (
			this.props.coupon.otp !== nextProps.coupon.otp &&
			nextProps.coupon.otp.valid &&
			this.state.showModalOtp
		) {
			this.showOTPmodal(false);
			window.scrollTo(0, document.body.scrollHeight);
		}
		if (
			this.props.coupon !== nextProps.coupon &&
			!nextProps.coupon.validCoupon &&
			nextProps.coupon.code === 403 &&
			!nextProps.coupon.otp.valid
		) {
			this.showOTPmodal(true);
		}
	}

	onChangeVoucher(e) {
		this.setState({ voucherCode: e.target.value });
	}

	onAddCoupon() {
		const me = this;
		me.setState({ applyCouponStep: componentState.button.loading });
		const { dispatch, soNumber } = me.props;
		dispatch(new couponActions.addCoupon(me.userCookies, soNumber, me.state.voucherCode)).then(() => {
			dispatch(new paymentActions.applyBin(me.userCookies, RESET_PAYMENT_METHOD));
			me.setState({ applyCouponStep: componentState.button.active });
			pushDataLayer('checkout', 'checkout', { step: 5, option: 'Voucher' }, this.props.products);
		}).catch((error) => {
			me.setState({ applyCouponStep: componentState.button.active });

			if (error.response.data.code === 405) {
				dispatch(getRefreshToken({
					userToken: this.userCookies,
					userRFToken: this.userRFCookies
				})).then((newToken) => {
					const currentDate = new Date();
					currentDate.setDate(currentDate.getDate() + (2 * 365));
					this.props.cookies.set('user.exp', Number(newToken.expToken), { domain: process.env.SESSION_DOMAIN, expires: currentDate });
					this.props.cookies.set('user.rf.token', newToken.userRFToken, { domain: process.env.SESSION_DOMAIN, expires: currentDate });
					this.props.cookies.set('user.token', newToken.userToken, { domain: process.env.SESSION_DOMAIN, expires: currentDate });
					this.userCookies = newToken.userToken;
					this.userRFCookies = newToken.userRFToken;

					this.onAddCoupon();
				});
			}
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
			if (error.response.data.code === 405) {
				dispatch(getRefreshToken({
					userToken: this.userCookies,
					userRFToken: this.userRFCookies
				})).then((newToken) => {
					const currentDate = new Date();
					currentDate.setDate(currentDate.getDate() + (2 * 365));
					this.props.cookies.set('user.exp', Number(newToken.expToken), { domain: process.env.SESSION_DOMAIN, expires: currentDate });
					this.props.cookies.set('user.rf.token', newToken.userRFToken, { domain: process.env.SESSION_DOMAIN, expires: currentDate });
					this.props.cookies.set('user.token', newToken.userToken, { domain: process.env.SESSION_DOMAIN, expires: currentDate });
					this.userCookies = newToken.userToken;
					this.userRFCookies = newToken.userRFToken;
					this.onRemoveCoupon(event);
				});
			}
		});
		pushDataLayer('checkout', 'checkout', { step: 5, option: 'Non Voucher' }, this.props.products);

	}

	showOTPmodal(bool = null) {
		const status = bool === null ? !this.state.showModalOtp : bool;
		this.setState({ showModalOtp: status });
	}

	resetCoupon() {
		this.setState({ voucherCode: '', applyCouponStep: componentState.button.active });
		const { dispatch } = this.props;
		dispatch(new couponActions.resetCoupon()).then(() => {
			dispatch(new paymentActions.applyBin(this.userCookies, RESET_PAYMENT_METHOD))
			.catch((error) => {
				if (error.response.data.code === 405) {
					dispatch(getRefreshToken({
						userToken: this.userCookies,
						userRFToken: this.userRFCookies
					})).then((newToken) => {
						const currentDate = new Date();
						currentDate.setDate(currentDate.getDate() + (2 * 365));
						this.props.cookies.set('user.exp', Number(newToken.expToken), { domain: process.env.SESSION_DOMAIN, expires: currentDate });
						this.props.cookies.set('user.rf.token', newToken.userRFToken, { domain: process.env.SESSION_DOMAIN, expires: currentDate });
						this.props.cookies.set('user.token', newToken.userToken, { domain: process.env.SESSION_DOMAIN, expires: currentDate });
						this.userCookies = newToken.userToken;
						this.userRFCookies = newToken.userRFToken;
					});
				}
			});
		});
	}

	createClassCard() {
		return [
			styles.card,
			styles.cardStepThree,
			this.props.loading || this.state.removeCouponStep === 'loading' ? styles.loading : '',
			this.props.disabled ? styles.disabled : ''
		].join(' ').trim();
	}

	render() {
		const { showModalOtp } = this.state;

		const { payments, coupon } = this.props;

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
				<Level isMobile style={inlineStyle.mb5}>
					<Level.Left><strong>{T.checkout.SUB_TOTAL}</strong></Level.Left>
					<Level.Right className='text-right'><strong>{currency(payments.subTotal)}</strong></Level.Right>
				</Level>
				{
					couponId && <Level isMobile style={inlineStyle.mb5}>
						<Level.Left>
							{T.checkout.VOUCHER} : <strong>{couponId}</strong> &nbsp;
							<span role='button' tabIndex='-1' onClick={(e) => this.onRemoveCoupon(e)} >
								<Icon name='times-circle' />
							</span>
						</Level.Left>
						<Level.Right className='text-right'>&nbsp;</Level.Right>
					</Level>
				}
				{
					renderIf(htmlDisc)(htmlDisc)
				}
				<Level isMobile style={inlineStyle.mb5}>
					<Level.Left>{T.checkout.TOTAL_SHIPPING_COST}</Level.Left>
					<Level.Right className='text-right'>{currency(payments.deliveryCost)}</Level.Right>
				</Level>
				<Level isMobile style={inlineStyle.mb5}>
					<Level.Left>
						<div className='font-green'>{T.checkout.DISCOUNT_SHIPPING_COST}</div>
					</Level.Left>
					<Level.Right>
						<div className='font-green text-right'>{currency(-payments.deliveryCostDiscount)}</div>
					</Level.Right>
				</Level>
				{
					renderIf(!couponId)(
						<Level isMobile style={inlineStyle.mb5}>
							<Level.Left className={styles.voucherLabel}>{T.checkout.VOUCHER_CODE}</Level.Left>
							<Level.Right>
								<Group attached grouped>
									<Input
										size='small'
										name='voucherCode'
										color={invalidVoucher ? 'red' : 'green'}
										dataProps={{
											value: this.state.voucherCode || ''
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
						<Level isMobile>
							<Level.Left><strong>Biaya Administrasi</strong></Level.Left>
							<Level.Right className='text-right'><strong>{currency(adminFeeIdr)}</strong></Level.Right>
						</Level>
					)}
				{
					renderIf(typeof coupon.code !== 'undefined' && coupon.code !== 200)(
						<Level isMobile style={inlineStyle.mb5}>
							<Level.Left>&nbsp;</Level.Left>
							<Level.Right>
								<div className='font-red'>{coupon.message}</div>
							</Level.Right>
						</Level>
					)
				}

				<div className={styles.CheckoutTitle}>
					<Level isMobile>
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
		carts: state.cart.data,
		products: state.cart.products,
	};
};

export default withCookies(connect(mapStateToProps)(StepThree));

