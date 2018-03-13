import React, { Component } from 'react';
import util from 'util';
import _ from 'lodash';
import base64 from 'base-64';
import validator from 'validator';

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
			isLoading: props.loading,
			showNotif: false,
			validOldPass: false,
			validNewPass: false,
			validConfPass: false,
			oldPassHint: '',
			newPassHint: '',
			confPassHint: ''
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.formResult !== false) {
			this.setState({
				showNotif: true,
				formResult: nextProps.formResult,
				isLoading: nextProps.loading
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
			let oldPassHint = '';

			if (value.length > 0 && value.length <= 6) {
				oldPassHint = 'Password harus lebih dari 6 karakter';
			} else if (validator.isEmpty(value)) {
				oldPassHint = 'Password wajib diisi';
			} else {
				validOldPass = true;
			}

			this.setState({ validOldPass, oldPassHint });
		} else if (type === this.NEW_PWD_FIELD) {
			let validNewPass = false;
			let newPassHint = '';

			if (value.length > 0 && value.length <= 6) {
				newPassHint = 'Password harus lebih dari 6 karakter';
			} else if (validator.isEmpty(value)) {
				newPassHint = 'Password wajib diisi';
			} else {
				validNewPass = true;
			}

			this.setState({ validNewPass, newPassHint });
		} else if (type === this.CONF_PWD_FIELD) {
			let validConfPass = false;
			let confPassHint = '';

			if (value.length > 0 && value.length <= 6) {
				confPassHint = 'Konfirmasi password harus lebih dari 6 karakter';
			} else if (validator.isEmpty(value)) {
				confPassHint = 'Konfirmasi password wajib diisi';
			} else if (value !== this.state[this.NEW_PWD_FIELD]) {
				confPassHint = 'Konfirmasi password tidak sesuai dengan password baru';
			} else {
				validConfPass = true;
			}

			this.setState({ validConfPass, confPassHint });
		}
	}

	saveData(e) {
		const { onSave } = this.props;
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
		const { showNotif, formResult } = this.state;
		
		if (showNotif) {
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
		}
		
		return null;
	}

	renderSubmitButton() {
		const { validOldPass, validNewPass, validConfPass } = this.state;

		return (
			<div className='margin--medium-v'>
				<Button
					color='primary'
					size='large'
					onClick={(e) => this.saveData(e)}
					disabled={!validOldPass && !validNewPass && validConfPass}
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
						error={!validOldPass && !_.isEmpty(this.state[this.OLD_PWD_FIELD])}
						hint={oldPassHint}
						onFocus={() => this.setState({ showNotif: false })}
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
						error={!validNewPass && !_.isEmpty(this.state[this.NEW_PWD_FIELD])}
						hint={newPassHint}
						onFocus={() => this.setState({ showNotif: false })}
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
						error={!validConfPass && !_.isEmpty(this.state[this.CONF_PWD_FIELD])}
						hint={confPassHint}
						onFocus={() => this.setState({ showNotif: false })}
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