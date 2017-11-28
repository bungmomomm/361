import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
// import { actions } from '@/state/Payment';

import { Icon, Radio, Checkbox, Level, Input } from 'mm-ui';
// import { T } from '@/data/translations';

class PaymentOvo extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			ovo: {
				ovoTimer: 30, 
				useDefault: true,
				ovoPhonePayment: this.props.payments.ovoPhonePayment || this.props.payments.ovoPhoneNumber,
				ovoPhonePaymentValid: this.props.payments.ovoPhoneNumber,
				autoLinkage: true,
			},
		};
		this.cookies = this.props.cookies.get('user.token');
	}

	componentWillMount() {
		this.isOvoPayment = true;
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.payments !== nextProps.payments) {
			this.validateOvoForm();
		}
	}

	onOvoPaymentNumberChange(event) {
		const ovo = this.state.ovo;
		const ovoPhonePayment = event.target.value;
		const regexPhone = /^[0-9]{5,30}/;
		let ovoPhonePaymentValid;
		if (regexPhone.test(ovoPhonePayment)) {
			ovoPhonePaymentValid = true;
		} else {
			ovoPhonePaymentValid = false;
		}
		this.setState({
			ovo: {
				...ovo,
				ovoPhonePayment,
				ovoPhonePaymentValid,
			}
		});
		this.validateOvoForm();
	}

	validateOvoForm() {
		setTimeout(() => {
			const validOvo = this.isOvoPayment ? this.state.ovo.ovoPhonePaymentValid : true;
			if (
				validOvo
			) {
				this.props.enableButtonPayNow(true);
			} else {
				this.props.enableButtonPayNow(false);
			}
		}, 100);
	}

	autoLinkage(event) {
		this.setState({ ovo: { ...this.state.ovo, autoLinkage: !this.state.ovo.autoLinkage } });
		this.props.autoLinkage(!this.state.ovo.autoLinkage);
	}

	render() {
		const { payments } = this.props;
		const ovoPaymentInput = (
			<Input
				dataProps={{ minLength: 0, maxLength: 30 }}
				defaultValue={this.state.ovo.ovoPhonePayment}
				type='number'
				placeholder={'Masukan No Hp yang terdaftar di OVO'}
				onChange={(e) => this.onOvoPaymentNumberChange(e)}
			/>
		);

		const ovoDefault = ([this.state.ovo.useDefault ?
			<div 
				role='button'
				tabIndex={-1}
				className='font-grey'
				onClick={() => this.setDefaultOvo()} 
			>
				<Icon name='plus-circle' /> Gunakan OVO Lain
			</div>
		: ovoPaymentInput]);

		return (
			<div>
				{
					(payments.ovoInfo && parseInt(payments.ovoInfo.ovoFlag, 10) === 1) ?
						<div>
							<Radio 
								inputStyle='blocklist' 
								data={[{
									label: (
										<Level>
											<Level.Left>
												{payments.ovoPhoneNumber}
											</Level.Left>
											<Level.Right>
												<Icon name='ovo' sprites='ovo' />
											</Level.Right>
										</Level>
									),
									dataProps: {
										name: 'ovo-phone-payment',
										onChange: () => this.setDefaultOvo(),
										checked: this.state.ovo.useDefault
									}
								}]} 
							/>
							{ovoDefault}
						</div>
					:
						<div>
							{ovoPaymentInput}
							<Checkbox defaultChecked={this.state.ovo.autoLinkage} onClick={(e) => this.autoLinkage(e)}>Simpan untuk transaksi berikutnya & otomatis terhubung ke akun OVO</Checkbox>
						</div>
				}
			</div>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		payments: state.payments
	};
};

export default withCookies(connect(mapStateToProps)(PaymentOvo));