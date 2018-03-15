import React, { Component } from 'react';
import util from 'util';
import _ from 'lodash';
import base64 from 'base-64';

import { Page, Input, Button, Level, Svg, Notification } from '@/components/mobile';

import CONST from '@/constants';

import styles from '../profile.scss';

class EditPassword extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.OLD_PWD_FIELD = CONST.USER_PROFILE_FIELD.oldPwd;
		this.NEW_PWD_FIELD = CONST.USER_PROFILE_FIELD.newPwd;
		this.CONF_PWD_FIELD = CONST.USER_PROFILE_FIELD.confPwd;

		this.state = {
			visibleOldPassword: false,
			visibleNewPassword: false,
			visibleConfPassword: false,
			[this.OLD_PWD_FIELD]: '',
			[this.NEW_PWD_FIELD]: '',
			[this.CONF_PWD_FIELD]: '',
			formResult: {
				...props.formResult
			},
			isLoading: false,
			validOldPass: false,
			validNewPass: false,
			validConfPass: false,
			oldPassHint: '',
			newPassHint: '',
			confPassHint: ''
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.formResult !== this.props.formResult) {
			this.setState({
				formResult: nextProps.formResult,
				isLoading: false
			});
		}
	}

	setVisiblePassword(type) {
		this.setState({
			[type]: !this.state[type]
		});
	}

	inputHandler(e) {
		const name = e.target.name;
		const value = util.format('%s', e.target.value);

		this.inputValidation(name, value);

		this.setState({
			[name]: base64.encode(value)
		});
	}

	inputValidation(type, value) {
		if (type === this.OLD_PWD_FIELD) {
			let validOldPass = false;
			if (value !== '' && value.length > 6) {
				validOldPass = true;
			}

			const oldPassHint = value.length > 0 && value.length <= 6 ? 'Password harus lebih dari 6 karakter' : '';

			this.setState({ validOldPass, oldPassHint });
		} else if (type === this.NEW_PWD_FIELD) {
			let validNewPass = false;
			if (value !== '' && value.length > 6) {
				validNewPass = true;
			}

			const newPassHint = value.length > 0 && value.length <= 6 ? 'Password harus lebih dari 6 karakter' : '';

			this.setState({ validNewPass, newPassHint });
		} else if (type === this.CONF_PWD_FIELD) {
			let validConfPass = false;
			if (value !== '' && value.length > 6 && base64.encode(value) === this.state[this.NEW_PWD_FIELD]) {
				validConfPass = true;
			}

			let confPassHint = '';
			if (value.length > 0 && value.length <= 6) {
				confPassHint = 'Konfirmasi password harus lebih dari 6 karakter';
			} else if (base64.encode(value) !== this.state[this.NEW_PWD_FIELD]) {
				confPassHint = 'Konfirmasi password tidak sesuai dengan password baru';
			}

			this.setState({ validConfPass, confPassHint });
		}
	}

	saveData(e) {
		const { onSave } = this.props;

		this.setState({
			isLoading: true,
			formResult: {
				status: '',
				message: ''
			}
		});

		onSave(e, { [this.OLD_PWD_FIELD]: this.state[this.OLD_PWD_FIELD], [this.NEW_PWD_FIELD]: this.state[this.NEW_PWD_FIELD] });
	}

	showPasswordButton(type) {
		let button;
		if (this.state[type] === true) {
			button = <Svg src='ico_password_show.svg' />;
		} else {
			button = <Svg src='ico_password_hide.svg' />;
		}
		return button;
	}

	renderHeader() {
		const { onClickBack } = this.props;

		const headerView = (
			<Level style={{ height: '55px' }}>
				<Level.Left style={{ width: '80px' }}>
					<Button onClick={onClickBack}><Svg src='ico_arrow-back-left.svg' /></Button>
				</Level.Left>
				<Level.Item style={{ alignItems: 'center' }}>Ubah Password</Level.Item>
				<Level.Right style={{ width: '80px' }}>&nbsp;</Level.Right>
			</Level>
		);

		return headerView;
	}

	renderNotif() {
		const { formResult } = this.state;
		
		if (!_.isEmpty(formResult.status) && !_.isEmpty(formResult.message)) {
			const notifColor = formResult.status === 'success' ? 'green' : 'pink';
			return (
				<Notification
					color={notifColor}
					disableClose
					show
				>
					<span>{formResult.message}</span>
				</Notification>
			);
		}
		
		return null;
	}

	renderSubmitButton() {
		const { validOldPass, validNewPass, validConfPass } = this.state;
		const setDisabled = !(validOldPass && validNewPass && validConfPass);

		return (
			<div className='margin--medium-v'>
				<Button
					color='secondary'
					size='large'
					onClick={(e) => this.saveData(e)}
					disabled={setDisabled}
				>
					SIMPAN
				</Button>
			</div>
		);
	}

	renderPasswordForm() {
		const {
			isLoading,
			visibleOldPassword, visibleNewPassword, visibleConfPassword,
			validOldPass, validNewPass, validConfPass,
			oldPassHint, newPassHint, confPassHint
		} = this.state;

		return (
			<form style={{ padding: '15px' }}>
				<div className='margin--medium-v'>
					<label className={styles.label} htmlFor='editPassword'>Password Saat Ini</label>
					<Input
						name={this.OLD_PWD_FIELD}
						id='editPassword'
						flat
						onChange={(e) => this.inputHandler(e)}
						iconRight={<Button onClick={() => this.setVisiblePassword('visibleOldPassword')}>{this.showPasswordButton('visibleOldPassword')}</Button>}
						type={visibleOldPassword ? 'text' : 'password'}
						error={!validOldPass && this.state[this.OLD_PWD_FIELD] !== ''}
						hint={oldPassHint}
						onFocus={() => this.setState({
							formResult: {
								status: '',
								message: ''
							}
						})}
					/>
				</div>
				<div className='margin--medium-v'>
					<label className={styles.label} htmlFor='editPasswordNew'>Password Baru</label>
					<Input
						name={this.NEW_PWD_FIELD}
						id='editPasswordNew'
						flat
						onChange={(e) => this.inputHandler(e)}
						iconRight={<Button onClick={() => this.setVisiblePassword('visibleNewPassword')}>{this.showPasswordButton('visibleNewPassword')}</Button>}
						type={visibleNewPassword ? 'text' : 'password'}
						error={!validNewPass && this.state[this.NEW_PWD_FIELD] !== ''}
						hint={newPassHint}
						onFocus={() => this.setState({
							formResult: {
								status: '',
								message: ''
							}
						})}
					/>
				</div>
				<div className='margin--medium-v'>
					<label className={styles.label} htmlFor='editPasswordNew'>Ulangi Password Baru</label>
					<Input
						name={this.CONF_PWD_FIELD}
						id='editPasswordNewConfirm'
						flat
						onChange={(e) => this.inputHandler(e)}
						iconRight={<Button onClick={() => this.setVisiblePassword('visibleConfPassword')}>{this.showPasswordButton('visibleConfPassword')}</Button>}
						type={visibleConfPassword ? 'text' : 'password'}
						error={!validConfPass && this.state[this.CONF_PWD_FIELD] !== ''}
						hint={confPassHint}
						onFocus={() => this.setState({
							formResult: {
								status: '',
								message: ''
							}
						})}
					/>
				</div>
				{this.renderNotif()}
				{isLoading ? this.loadingView : this.renderSubmitButton()}
			</form>
		);
	}

	render() {
		return (
			<Page style={{ paddingTop: 0 }} color='white'>
				{this.renderHeader()}
				{this.renderPasswordForm()}
			</Page>
		);
	}
}

export default EditPassword;