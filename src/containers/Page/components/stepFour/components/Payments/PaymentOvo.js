import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { actions } from '@/state/Payment';

import { Icon, Radio, Checkbox, Level, Input, Button, Group, Alert } from 'mm-ui';
// import { T } from '@/data/translations';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class PaymentOvo extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			ovoTimer: 30,
			useDefault: true,
			ovoPhonePayment: this.props.payments.ovoPhonePayment || this.props.payments.ovoPhoneNumber,
			ovoPhonePaymentValid: this.props.payments.ovoPhoneNumber,
			autoLinkage: true,
		};
		this.props.autoLinkage(true);
		this.input = '';
		this.cookies = this.props.cookies.get('user.token');

		this.ovoBlockContent = () => {
			return (
				<Alert show color='yellow' style={{ marginBottom: '10px' }} >
					<p>Info Pembayaran dengan Aplikasi OVO</p>
					<ol>
						<li>Pastikan Anda sudah login ke aplikasi OVO</li>
						<li>Pembayaran dengan OVO akan kadaluarsa dalam 30 detik setelah Anda klik “Bayar Sekarang”</li>
						<li>Buka notifikasi OVO untuk melakukan pembayaran</li>
						<li>Pilih cara pembayaran dengan “OVO Cash” atau “OVO Point” atau kombinasi keduanya, kemudian klik “Bayar”</li>
					</ol>
				</Alert>
			);
		};
	}

	componentWillMount() {
		this.isOvoPayment = true;
		if (this.state.useDefault && this.props.payments.ovoPhoneNumber) {
			this.props.dispatch(new actions.changeOvoPaymentNumber(this.props.payments.ovoPhoneNumber));
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.payments !== nextProps.payments) {
			this.validateOvoForm();
		}

		if (this.state.useDefault && nextProps.payments.ovoPhoneNumber && !nextProps.payments.ovoPaymentNumber) {
			this.props.dispatch(new actions.changeOvoPaymentNumber(nextProps.payments.ovoPhoneNumber));
		}
	}

	componentWillUnmount() {
		this.props.enableButtonPayNow(false);
	}

	onOvoPaymentNumberChange(event) {
		this.setState({
			...this.state,
			ovoPhonePayment: event.target.value,
			ovoPhonePaymentValid: this.input.validation.checkValid(event.target.value)
		});
		this.props.dispatch(new actions.changeOvoPaymentNumber(event.target.value));
		this.validateOvoForm();
	}

	setDefaultOvo(flag) {
		const useDefault = flag;
		const ovoPhonePayment = useDefault ? this.props.payments.ovoPhoneNumber : '';
		this.setState({
			...this.state,
			useDefault,
			ovoPhonePayment,
			ovoPhonePaymentValid: useDefault
		}, () => {
			this.props.dispatch(new actions.changeOvoPaymentNumber(ovoPhonePayment));
			this.validateOvoForm();
		});
	}

	validateOvoForm() {
		if (this.isOvoPayment ? this.state.ovoPhonePaymentValid : true) {
			this.props.enableButtonPayNow(true);
		} else {
			this.props.enableButtonPayNow(false);
		}
	}

	autoLinkage(event) {
		this.setState({ ...this.state, autoLinkage: !this.state.autoLinkage });
		this.props.autoLinkage(!this.state.autoLinkage);
	}

	renderPaymentInput() {
		return (
			<div>
				<Input
					dataProps={{ minLength: 0, maxLength: 30 }}
					defaultValue={this.state.ovoPhonePayment || ''}
					type='number'
					ref={(e) => { this.input = e; }}
					placeholder={'Masukan No Hp yang terdaftar di OVO'}
					onChange={(e) => this.onOvoPaymentNumberChange(e)}
					validation={{ rules: 'required|min:5|max:30|numeric', name: 'Phone_Number' }}
					color={this.state.ovoPhonePaymentValid ? 'green' : null}
					icon={this.state.ovoPhonePaymentValid ? 'check' : null}
					message={this.state.ovoPhonePaymentValid ? 'Poin OVO akan ditambahkan di no ini' : ''}
				/>
				{
					this.ovoBlockContent()
				}
			</div>
		);
	}

	renderAddMore() {
		return (
			<div>
				<Button
					className='font-grey'
					onClick={() => this.setDefaultOvo(false)}
				>
					<Icon name='plus-circle' /> Gunakan OVO Lain
				</Button>
				{
					this.ovoBlockContent()
				}
			</div>
		);
	}

	render() {
		const { payments } = this.props;
		return (
			<Group>
				{
					(payments.ovoInfo && parseInt(payments.ovoInfo.ovoFlag, 10) === 1) ?
						<div>
							<Radio
								inputStyle='blocklist'
								block
								data={[{
									label: (
										<Level isMobile>
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
										onChange: () => this.setDefaultOvo(true),
										checked: this.state.useDefault
									}
								}]}
							/>
							{this.state.useDefault ? this.renderAddMore() : this.renderPaymentInput()}
						</div>
					:
						<div>
							{this.renderPaymentInput()}
							<Checkbox defaultChecked={this.state.autoLinkage} onClick={(e) => this.autoLinkage(e)}>
								Simpan untuk transaksi berikutnya & otomatis terhubung ke akun OVO
							</Checkbox>
						</div>
				}
			</Group>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		payments: state.payments
	};
};

export default withCookies(connect(mapStateToProps)(PaymentOvo));
