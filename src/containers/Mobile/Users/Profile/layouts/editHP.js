import React, { Component } from 'react';
import util from 'util';
import _ from 'lodash';

import { Page, Input, Button, Level, Svg, Notification } from '@/components/mobile';

import CONST from '@/constants';

import styles from '../profile.scss';

class EditHp extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			data: props.data || '',
			formResult: {
				...props.formResult
			}
		};

		this.PHONE_FIELD = CONST.USER_PROFILE_FIELD.phone;
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
		if (nextProps.formResult !== false) {
			this.setState({
				data: nextProps.data,
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
		onSave(e, { [this.PHONE_FIELD]: data });
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
		return (
			<div className='margin--medium-v'>
				<Button color='primary' size='large' onClick={(e) => this.saveData(e)}>SIMPAN</Button>
			</div>
		);
	}

	renderPhoneForm() {
		return (
			<form style={{ padding: '15px' }}>
				{this.renderOldPhone()}
				<div className='margin--medium-v'>
					<label className={styles.label} htmlFor='editCellPhoneNew'>No Handphone Baru</label>
					<Input id='editCellPhoneNew' flat onChange={(e) => this.inputHandler(e)} />
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
				{this.renderPhoneForm()}
			</Page>
		);
	}
}

export default EditHp;