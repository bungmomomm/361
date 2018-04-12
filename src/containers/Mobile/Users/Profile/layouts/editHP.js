import React, { Component } from 'react';
import util from 'util';
import _ from 'lodash';
import validator from 'validator';

import { Page, Input, Button, Svg, Notification, Spinner, Header, Panel } from '@/components/mobile';

import CONST from '@/constants';

import styles from '../profile.scss';
import handler from '@/containers/Mobile/Shared/handler';

@handler
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
		this.loadingView = (
			<div style={{ margin: '20px auto 20px auto' }}>
				<Spinner />
			</div>
		);
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

		let inputHint = '';
		if (value.length > 0 && value.length < 10 && !validForm) {
			inputHint = 'Nomor Handphone minimal 10 digit';
		} else if (value.length > 0 && value.length >= 10 && !validForm) {
			inputHint = 'Format Nomor Handphone tidak sesuai';
		}

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

		const HeaderPage = {
			left: (
				<button onClick={onClickBack}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</button>
			),
			center: 'Ubah No. Handphone',
		};

		return <Header.Modal {...HeaderPage} />;
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
			<form style={{ padding: '15px' }} className='bg--white'>
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
			<div>
				<div className={styles.profileBackground} />
				<Page style={{ paddingTop: 0 }}>
					<Panel style={{ padding: 0 }}>&nbsp;</Panel>
					{this.renderPhoneForm()}
				</Page>
				{this.renderHeader()}
			</div>
		);
	}
}

export default EditHp;
