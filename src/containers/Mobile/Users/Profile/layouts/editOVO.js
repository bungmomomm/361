import React, { Component } from 'react';
import util from 'util';
import _ from 'lodash';
import validator from 'validator';

import { Page, Level, Input, Svg, Button, Notification, Spinner } from '@/components/mobile';

import CONST from '@/constants';

import styles from '../profile.scss';

class EditOvo extends Component {
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

		this.OVO_ID_FIELD = CONST.USER_PROFILE_FIELD.ovoId;
		this.loadingView = <Spinner />;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.formResult !== false) {
			if (nextProps.formResult.status === 'success') {
				this.setState({
					data: nextProps.data,
				});
			}
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
		if ((value.substring(0, 1) === '0' && _.parseInt(value) > 0 && validator.isMobilePhone(value, 'any')) && validator.isLength(value, { min: 10, max: 15 })) {
			validForm = true;
		}

		const inputHint = value.length > 0 && validForm === false ? 'Format Nomor Handphone tidak sesuai. Silahkan cek kembali' : '';

		this.setState({
			data: value,
			validForm,
			inputHint
		});
	}

	saveData(e) {
		const { onSave } = this.props;
		const { data } = this.state;
		onSave(e, { [this.OVO_ID_FIELD]: data });
	}

	renderHeader() {
		const { onClickBack } = this.props;
		const headerView = (
			<Level style={{ height: '55px' }}>
				<Level.Left style={{ width: '80px' }}>
					<Button onClick={onClickBack}><Svg src='ico_arrow-back-left.svg' /></Button>
				</Level.Left>
				<Level.Item style={{ alignItems: 'center' }}>OVO</Level.Item>
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
					VERIFIKASI OVO ID
				</Button>
			</div>
		);
	}

	renderOvoForm() {
		const { isLoading, validForm, inputHint, data } = this.state;

		return (
			<form style={{ padding: '15px' }}>
				<div className='margin--medium-v'>
					<label className={styles.label} htmlFor='ovoID'>OVO ID</label>
					<Input
						id='ovoID'
						flat
						placeholder='No. Handphone yang terdaftar di OVO'
						defaultValue={data}
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
				{this.renderOvoForm()}
			</Page>
		);
	}
}

export default EditOvo;
