import React, { Component } from 'react';
import util from 'util';
import _ from 'lodash';
import validator from 'validator';

import { Page, Input, Button, Level, Svg, Notification, Spinner } from '@/components/mobile';

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
			},
			isLoading: props.loading,
			showNotif: false,
			validForm: false,
			inputHint: ''
		};

		this.EMAIL_FIELD = CONST.USER_PROFILE_FIELD.email;
		this.loadingView = <Spinner />;
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

	inputHandler(e) {
		const value = util.format('%s', e.target.value);

		let validForm = false;
		if (validator.isEmail(value)) {
			validForm = true;
		}

		const inputHint = value.length > 0 && validForm === false ? 'Format email tidak sesuai.' : '';

		this.setState({
			data: value,
			validForm,
			inputHint
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
		const { validForm } = this.state;

		return (
			<div className='margin--medium-v'>
				<Button
					color='primary'
					size='large'
					onClick={(e) => this.saveData(e)}
					disabled={!validForm}
				>
					SIMPAN
				</Button>
			</div>
		);
	}

	renderEmailForm() {
		const { isLoading, validForm, inputHint, data } = this.state;

		return (
			<form style={{ padding: '15px' }}>
				<div className='margin--medium-v'>
					<label className={styles.label} htmlFor='editEmail'>Alamat Email</label>
					<Input id='editEmail' disabled flat defaultValue={data} />
				</div>
				<div className='margin--medium-v'>
					<label className={styles.label} htmlFor='editEmailNew'>Alamat Email Baru</label>
					<Input
						id='editEmailNew'
						flat
						onChange={(e) => this.inputHandler(e)}
						error={!validForm}
						hint={inputHint}
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
				{this.renderEmailForm()}
			</Page>
		);
	}
}

export default EditEmail;