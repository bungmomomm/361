import React, { Component } from 'react';
import util from 'util';
import _ from 'lodash';

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
			isLoading: props.loading
		};

		this.OVO_ID_FIELD = CONST.USER_PROFILE_FIELD.ovoId;
		this.loadingView = <div><Spinner /></div>;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.formResult !== false) {
			if (nextProps.formResult.status === 'success') {
				this.setState({
					data: nextProps.data,
					isLoading: nextProps.loading
				});
			}
			this.setState({
				formResult: nextProps.formResult,
				isLoading: nextProps.loading
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
				<Button color='primary' size='large' onClick={(e) => this.saveData(e)}>VERIFIKASI OVO ID</Button>
			</div>
		);
	}

	renderOvoForm() {
		const { isLoading, data } = this.state;

		return (
			<form style={{ padding: '15px' }}>
				<div className='margin--medium-v'>
					<label className={styles.label} htmlFor='ovoID'>OVO ID</label>
					<Input id='ovoID' flat placeholder='No. Handphone yang terdaftar di OVO' defaultValue={data} onChange={(e) => this.inputHandler(e)} />
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
