import React, { Component } from 'react';
import util from 'util';
import _ from 'lodash';
import validator from 'validator';

import { Page, Input, Button, Svg, Notification, Spinner, Header, Panel } from '@/components/mobile';

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
			isLoading: false,
			showClearButton: false,
			validForm: false,
			inputValue: '',
			inputHint: ''
		};

		this.EMAIL_FIELD = CONST.USER_PROFILE_FIELD.email;
		this.loadingView = <Spinner />;
		this.clearButton = <Svg src='ico_clear.svg' />;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.formResult !== this.props.formResult) {
			this.setState({
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
		if (validator.isEmail(value)) {
			validForm = true;
		}

		const inputHint = value.length > 0 && validForm === false ? 'Format email tidak sesuai.' : '';

		this.setState({
			inputValue: value,
			validForm,
			inputHint
		});
	}

	saveData(e) {
		const { onSave } = this.props;
		const { inputValue } = this.state;

		this.setState({
			isLoading: true,
			formResult: {
				status: '',
				message: ''
			}
		});

		onSave(e, { [this.EMAIL_FIELD]: inputValue });
	}

	renderHeader() {
		const { onClickBack } = this.props;

		const HeaderPage = {
			left: (
				<button onClick={onClickBack}> 
					<Svg src={'ico_arrow-back-left.svg'} />
				</button>
			),
			center: 'Ubah Email',
		};

		return <Header.Modal {...HeaderPage} />;
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
		const { validForm, formResult } = this.state;

		if (formResult.status !== 'success') {
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

		return null;
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

	renderEmailForm() {
		const { isLoading, validForm, inputValue, inputHint, data } = this.state;

		return (
			<form style={{ padding: '15px' }} className='bg--white'>
				<div className='margin--medium-v'>
					<label className={styles.label} htmlFor='editEmail'>Alamat Email</label>
					<Input id='editEmail' disabled flat defaultValue={data} />
				</div>
				<div className='margin--medium-v'>
					<label className={styles.label} htmlFor='editEmailNew'>Alamat Email Baru</label>
					<Input
						value={inputValue}
						id='editEmailNew'
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
					{this.renderEmailForm()}
				</Page>
				{this.renderHeader()}
			</div>
		);
	}
}

export default EditEmail;