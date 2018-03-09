import React, { Component } from 'react';
import util from 'util';
import _ from 'lodash';
import validator from 'validator';

import { Page, Input, Button, Level, Svg, Notification, Spinner } from '@/components/mobile';

import CONST from '@/constants';

import styles from '../profile.scss';

class EditHp extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			newData: '',
			formResult: {
				...props.formResult
			},
			isLoading: props.loading,
			validForm: false,
			inputHint: ''
		};

		this.HP_EMAIL_FIELD = CONST.USER_PROFILE_FIELD.hpEmail;
		this.loadingView = <div><Spinner /></div>;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.formResult !== false) {
			this.setState({
				data: nextProps.data,
				formResult: nextProps.formResult,
				isLoading: nextProps.loading
			});
		}
	}
	
	inputHandler(e) {
		const value = util.format('%s', e.target.value);

		let validForm = false;
		if ((value.substring(0, 1) === '0' && _.parseInt(value) > 0 && validator.isMobilePhone(value, 'any')) && validator.isLength(value, { min: 10, max: 15 })) {
			validForm = true;
		}

		const inputHint = value.length > 0 && validForm === false ? 'Format Nomor Handphone tidak sesuai. Silahkan cek kembali' : '';

		this.setState({
			newData: value,
			validForm,
			inputHint
		});
	}

	saveData(e) {
		const { onSave } = this.props;
		const { newData } = this.state;
		onSave(e, { [this.HP_EMAIL_FIELD]: newData });
	}

	renderHeader() {
		const { onClickBack } = this.props;
		const headerView = (
			<Level style={{ height: '55px' }}>
				<Level.Left style={{ width: '80px' }}>
					<Button onClick={onClickBack}><Svg src='ico_arrow-back-left.svg' /></Button>
				</Level.Left>
				<Level.Item style={{ alignItems: 'center' }}>Ubah No. Handphone</Level.Item>
				<Level.Right style={{ width: '80px' }}>&nbsp;</Level.Right>
			</Level>
		);

		return headerView;
	}

	renderOldPhone() {
		const { data } = this.props;
		if (!_.isEmpty(data)) {
			return (
				<div className='margin--medium-v'>
					<label className={styles.label} htmlFor='cellPhone'>No. Handphone</label>
					<Input id='cellPhone' disabled flat defaultValue={data} />
				</div>
			);
		}

		return null;
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
		const { validForm } = this.state;

		return (
			<div className='margin--medium-v'>
				<Button color='primary' size='large' disabled={!validForm} onClick={(e) => this.saveData(e)}>SIMPAN</Button>
			</div>
		);
	}

	renderPhoneForm() {
		const { isLoading, validForm, inputHint } = this.state;

		return (
			<form style={{ padding: '15px' }}>
				{this.renderOldPhone()}
				<div className='margin--medium-v'>
					<label className={styles.label} htmlFor='editCellPhoneNew'>No Handphone Baru</label>
					<Input
						id='editCellPhoneNew'
						flat
						onChange={(e) => this.inputHandler(e)}
						error={!validForm}
						hint={inputHint}
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
				{this.renderPhoneForm()}
			</Page>
		);
	}
}

export default EditHp;