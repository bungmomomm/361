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

		this.state = {
			[this.OLD_PWD_FIELD]: '',
			[this.NEW_PWD_FIELD]: '',
			formResult: {
				...props.formResult
			}
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.formResult !== false) {
			this.setState({
				formResult: nextProps.formResult
			});
		}
	}

	inputHandler(e) {
		const name = e.target.name;
		const value = util.format('%s', e.target.value);

		this.setState({
			[name]: base64.encode(value)
		});
	}

	saveData(e) {
		const { onSave } = this.props;
		onSave(e, { [this.OLD_PWD_FIELD]: this.state[this.OLD_PWD_FIELD], [this.NEW_PWD_FIELD]: this.state[this.NEW_PWD_FIELD] });
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
		return (
			<div className='margin--medium-v'>
				<Button color='primary' size='large' onClick={(e) => this.saveData(e)}>SIMPAN</Button>
			</div>
		);
	}

	renderPasswordForm() {
		return (
			<form style={{ padding: '15px' }}>
				<div className='margin--medium-v'>
					<label className={styles.label} htmlFor='editPassword'>Password Saat Ini</label>
					<Input name={this.OLD_PWD_FIELD} id='editPassword' type='password' flat onChange={(e) => this.inputHandler(e)} />
				</div>
				<div className='margin--medium-v'>
					<label className={styles.label} htmlFor='editPasswordNew'>Password Baru</label>
					<Input name={this.NEW_PWD_FIELD} id='editPasswordNew' type='password' flat onChange={(e) => this.inputHandler(e)} />
				</div>
				<div className='margin--medium-v'>
					<label className={styles.label} htmlFor='editPasswordNew'>Ulangi Password Baru</label>
					<Input id='editPasswordNewConfirm' type='password' flat />
				</div>
				{this.renderNotif()}
				{this.renderSubmitButton()}
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