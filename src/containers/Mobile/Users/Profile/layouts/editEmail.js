import React, { Component } from 'react';
import util from 'util';
import _ from 'lodash';

import { Page, Input, Button, Level, Svg, Notification } from '@/components/mobile';

import CONST from '@/constants';

import styles from '../profile.scss';

class EditEmail extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			data: props.data || '',
			formResult: {
				...props.formResult
			}
		};

		this.EMAIL_FIELD = CONST.USER_PROFILE_FIELD.email;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.formResult !== false) {
			this.setState({
				formResult: nextProps.formResult
			});
		}
	}

	inputHandler(e) {
		const value = util.format('%s', e.target.value);

		this.setState({
			data: value
		});
	}

	saveData(e) {
		const { onSave } = this.props;
		const { data } = this.state;
		onSave(e, { [this.EMAIL_FIELD]: data });
	}

	renderHeader() {
		const { onClickBack } = this.props;
		const headerView = (
			<Level style={{ height: '55px' }}>
				<Level.Left style={{ width: '80px' }}>
					<Button onClick={onClickBack}><Svg src='ico_arrow-back-left.svg' /></Button>
				</Level.Left>
				<Level.Item style={{ alignItems: 'center' }}>Ubah Email</Level.Item>
				<Level.Right style={{ width: '80px' }}>&nbsp;</Level.Right>
			</Level>
		);

		return headerView;
	}

	renderEmailField() {
		const { data } = this.state;

		return (
			<form style={{ padding: '15px' }}>
				<div className='margin--medium'>
					<label className={styles.label} htmlFor='editEmail'>Alamat Email</label>
					<Input id='editEmail' disabled flat defaultValue={data} />
				</div>
				<div className='margin--medium'>
					<label className={styles.label} htmlFor='editEmailNew'>Alamat Email Baru</label>
					<Input id='editEmailNew' flat onChange={(e) => this.inputHandler(e)} />
				</div>
				{this.renderSubmitButton()}
				{this.renderNotif()}
			</form>
		);
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
			<div className='margin--medium'>
				<Button color='primary' size='large' onClick={(e) => this.saveData(e)}>SIMPAN</Button>
			</div>
		);
	}

	render() {
		return (
			<Page>
				{this.renderHeader()}
				{this.renderEmailField()}
			</Page>
		);
	}
}

export default EditEmail;