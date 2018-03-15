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
			isLoading: false,
			showClearButton: false,
			validForm: false,
			inputValue: '',
			inputHint: ''
		};

		this.HP_EMAIL_FIELD = CONST.USER_PROFILE_FIELD.hpEmail;
		this.loadingView = <Spinner />;
		this.clearButton = <Svg src='ico_clear.svg' />;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.formResult !== this.props.formResult) {
			this.setState({
				data: nextProps.data,
				formResult: nextProps.formResult,
				isLoading: false
			});
		}
	}
	
	inputHandler(e) {
		const value = util.format('%s', e.target.value);

		if (value.length > 0) {
			this.setState({ showClearButton: true });
		} else {
			this.setState({ showClearButton: false });
		}

		let validForm = false;
		if ((value.substring(0, 1) === '0' && _.parseInt(value) > 0 && validator.isMobilePhone(value, 'any')) && validator.isLength(value, { min: 10, max: 15 })) {
			validForm = true;
		}

		const inputHint = value.length > 0 && validForm === false ? 'Format Nomor Handphone tidak sesuai. Silahkan cek kembali' : '';

		this.setState({
			inputValue: value,
			newData: value,
			validForm,
			inputHint
		});
	}

	saveData(e) {
		const { onSave } = this.props;
		const { newData } = this.state;

		this.setState({
			isLoading: true,
			formResult: {
				status: '',
				message: ''
			}
		});

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
				<Button
					color='secondary'
					size='large'
					disabled={!validForm}
					onClick={(e) => this.saveData(e)}
				>
					SIMPAN
				</Button>
			</div>
		);
	}

	renderClearButton() {
		const { showClearButton } = this.state;

		if (showClearButton) {
			return (
				<Button
					onClick={() => {
						this.setState({
							inputValue: '',
							showClearButton: false,
							formResult: {
								status: '',
								message: ''
							},
							validForm: false,
							inputHint: ''
						});
					}}
				>
					{this.clearButton}
				</Button>
			);
		}

		return null;
	}

	renderPhoneForm() {
		const { isLoading, validForm, inputValue, inputHint } = this.state;

		return (
			<form style={{ padding: '15px' }}>
				{this.renderOldPhone()}
				<div className='margin--medium-v'>
					<label className={styles.label} htmlFor='editCellPhoneNew'>No Handphone Baru</label>
					<Input
						value={inputValue}
						id='editCellPhoneNew'
						flat
						onChange={(e) => this.inputHandler(e)}
						error={!validForm && inputValue !== ''}
						hint={inputHint}
						onFocus={() => this.setState({
							formResult: {
								status: '',
								message: ''
							}
						})}
						iconRight={this.renderClearButton()}
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