import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import Shared from '@/containers/Mobile/Shared';
import { actions } from '@/state/v4/User/Profile';
import _ from 'lodash';
import { to } from 'await-to-js';
import { Link } from 'react-router-dom';
import {
	Header,
	Svg,
	Page,
	Navigation,
	Level,
	Radio,
	Notification,
	Modal,
	Button
} from '@/components/mobile';
import { userToken, isLogin } from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';


@handler
class CreditCard extends Component {

	constructor(props) {

		super(props);
		this.props = props;
		this.isLogin = this.props.cookies.get(isLogin) === 'true';
		this.setDefaultCreditCard = this.setDefaultCreditCard.bind(this);
		this.deleteSingleCreditCardFromList = this.deleteSingleCreditCardFromList.bind(this);
		this.makeCreditCardRadioChecked = this.makeCreditCardRadioChecked.bind(this);
		this.renderDeleteCreditCardPopUpConfirmation = this.renderDeleteCreditCardPopUpConfirmation.bind(this);
		this.renderSetDefaultCreditCardPopUpConfirmation = this.renderSetDefaultCreditCardPopUpConfirmation.bind(this);
		this.renderCreditCardList = this.renderCreditCardList.bind(this);
		this.renderEmpty = this.renderEmpty.bind(this);
		this.state = {
			successMessage: '',
			temporaryCheckedCreditCardValueForSetDefault: null,
			checkedCreditCardValueForSetDefault: null,
			checkedCreditCardValueForDelete: null,
			showDeleteCreditCardPopUpConfirmation: false,
			showSetDefaultCreditCardPopUpConfirmation: false,
			isCreditCardAllowedForDelete: false
		};

	}

	async setDefaultCreditCard() {

		const { dispatch, cookies } = this.props;
		const { checkedCreditCardValueForSetDefault } = this.state;
		const parameterDefault = {
			card_id: checkedCreditCardValueForSetDefault
		};

		const [err, response] = await to(dispatch(new actions.setCreditCard(cookies.get(userToken), parameterDefault)));

		if (err) {
			return false;
		}

		const { data } = response;

		if (data.code === 200) {
			this.setState(
				{
					successMessage: data.data.msg,
					showSetDefaultCreditCardPopUpConfirmation: false,
					temporaryCheckedCreditCardValueForSetDefault: null
				}
			);
		}

		return response;

	}

	async deleteSingleCreditCardFromList() {

		const { dispatch, cookies } = this.props;
		const { checkedCreditCardValueForDelete, isCreditCardAllowedForDelete } = this.state;
		const parameterDelete = {
			card_id: checkedCreditCardValueForDelete
		};

		// Prevent the default credit card to be deleted.
		if (isCreditCardAllowedForDelete === false) {
			const message = 'Kartu kredit tidak bisa di hapus. Silahkan terapkan default pada kartu kredit lainnya';
			this.setState({
				showDeleteCreditCardPopUpConfirmation: false,
				successMessage: message
			});
			return false;
		}

		const [err, response] = await to(dispatch(new actions.deleteCreditCard(cookies.get(userToken), parameterDelete)));

		if (err) {
			return false;
		}

		const { data } = response;

		if (data.code === 200) {

			await to(dispatch(new actions.getCreditCard(cookies.get(userToken))));

			this.setState({
				successMessage: data.data.msg,
				showDeleteCreditCardPopUpConfirmation: false
			});
		}

		return response;

	}

	makeCreditCardRadioChecked(id) {

		this.setState({ checkedCreditCardValueForSetDefault: id }, () => { this.setDefaultCreditCard(); });
	}

	renderDeleteCreditCardPopUpConfirmation() {

		const { showDeleteCreditCardPopUpConfirmation } = this.state;

		const modalAttribute = {
			show: false
		};

		if (showDeleteCreditCardPopUpConfirmation === true) {
			modalAttribute.show = true;
		}

		return (
			<Modal {...modalAttribute}>
				<div className='font-medium'>
					<h3>Hapus No Kartu Kredit / Debit</h3>
					<Level style={{ padding: '0px' }} className='margin--medium-v'>
						<Level.Left />
						<Level.Item className='padding--medium-h'>
							<div className='font-small'>
								Apakah anda yakin ingin menghapus no ini ?
							</div>
						</Level.Item>
					</Level>
				</div>
				<Modal.Action
					closeButton={(
						<Button onClick={() => this.setState({ showDeleteCreditCardPopUpConfirmation: false })}>
							<span className='font-color--primary-ext-2'>BATALKAN</span>
						</Button>)}
					confirmButton={(<Button onClick={this.deleteSingleCreditCardFromList}>YA, HAPUS</Button>)}
				/>
			</Modal>
		);
	}

	renderEmpty() {
		const { users } = this.props;
		if (_.isEmpty(users.creditCard) === true) {
			return (
				<div style={{ margin: 'auto' }}>
					<div className='margin--medium-v flex-center flex-middle'><Svg src='mm_ico-nocc.svg' /></div>
					<div className='margin--small-v flex-center flex-middle'>
						Anda belum memiliki daftar kartu kredit.
					</div>
				</div>
			);
		}
		return null;
	}

	renderCreditCardList() {


		const { checkedCreditCardValueForSetDefault } = this.state;

		const { users } = this.props;

		let view = null;

		if (_.isEmpty(users.creditCard === false)) {

			view = _.map(users.creditCard, (cc, id) => {

				const fgDefault = cc.fg_default;
				const creditCardWithSeparator = cc.credit_card_with_separator;
				const creditCardName = cc.credit_card_type;

				const isCheckedByDefault = (fgDefault === 1 && !checkedCreditCardValueForSetDefault);
				const isCheckedByUser = (checkedCreditCardValueForSetDefault && (checkedCreditCardValueForSetDefault === cc.id));

				const isChecked = isCheckedByDefault || isCheckedByUser ? cc.id : null;

				const creditCardLogo = `logo_${cc.credit_card_type}.svg`;

				// Make condition if credit card allowed for delete or not.
				let allowDeleteValue = true;

				if (checkedCreditCardValueForSetDefault === cc.id || cc.fg_default !== 0) {
					allowDeleteValue = false;
				}

				return (
					<div className='margin--medium-t' key={id}>
						<Level className='bg--white' key={id}>
							<Level.Left>
								<Radio
									checked={isChecked}
									name={id}
									variant='check'
									data={[{ value: cc.id }]}
									onChange={() => {
										this.setState(() => {
											return {
												showSetDefaultCreditCardPopUpConfirmation: true,
												temporaryCheckedCreditCardValueForSetDefault: cc.id
											};
										});
									}}
								/>
							</Level.Left>
							<Level.Item className='padding--medium-l'>
								<span>{creditCardName}</span>
								<span>{creditCardWithSeparator}</span>
							</Level.Item>
							<Level.Right className='flex-row flex-center' style={{ alignItems: 'center' }}>
								<Svg src={creditCardLogo} />
								<Svg
									className='padding--medium-l'
									src='ico_trash.svg'
									onClick={() => {
										this.setState(() => {
											return {
												checkedCreditCardValueForDelete: cc.id,
												showDeleteCreditCardPopUpConfirmation: true,
												isCreditCardAllowedForDelete: allowDeleteValue
											};

										});
									}}
								/>
							</Level.Right>
						</Level>
					</div>
				);
			});
		}
		return view;

	}

	renderSetDefaultCreditCardPopUpConfirmation() {

		const { showSetDefaultCreditCardPopUpConfirmation, temporaryCheckedCreditCardValueForSetDefault } = this.state;

		const modalAttribute = {
			show: false
		};

		if (showSetDefaultCreditCardPopUpConfirmation === true) {
			modalAttribute.show = true;
		}

		return (
			<Modal {...modalAttribute}>
				<div className='font-medium'>
					<h3>Jadikan Kartu Utama</h3>
					<Level style={{ padding: '0px' }} className='margin--medium-v'>
						<Level.Left />
						<Level.Item className='padding--medium-h'>
							<div className='font-small'>
								Apakah anda yakin ingin menjadikan kartu ini sebagai kartu utama ?
							</div>
						</Level.Item>
					</Level>
				</div>
				<Modal.Action
					closeButton={(
						<Button onClick={() => this.setState({ showSetDefaultCreditCardPopUpConfirmation: false })}>
							<span className='font-color--primary-ext-2'>BATALKAN</span>
						</Button>)}
					confirmButton={(<Button onClick={() => { this.makeCreditCardRadioChecked(temporaryCheckedCreditCardValueForSetDefault); }}>YA</Button>)}
				/>
			</Modal>
		);
	}

	render() {

		const { successMessage } = this.state;
		const { users, shared } = this.props;
		const pageAttribute = {
			color: 'grey'
		};

		if (_.isEmpty(users.creditCard) === true) {
			pageAttribute.color = 'white';
		}

		const notificationSuccessSetDefaultAttribute = {
			color: 'yellow',
			show: true,
			disableClose: true
		};

		const HeaderPage = ({
			left: (
				<Link to={'/profile'}>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Daftar Kartu Kredit',
			right: null
		});


		return (
			<div style={this.props.style}>
				<Page {...pageAttribute}>
					{ successMessage !== '' && (
						<Notification {...notificationSuccessSetDefaultAttribute}>
							{successMessage}
						</Notification>
					) }
					{ (_.isEmpty(users.creditCard)) ? this.renderEmpty() : null }
					{ this.renderCreditCardList() }
					{ this.renderDeleteCreditCardPopUpConfirmation() }
					{ this.renderSetDefaultCreditCardPopUpConfirmation() }
				</Page>
				<Header.Modal {...HeaderPage} />
				<Navigation totalCartItems={shared.totalCart} active='Profile' botNav={this.props.botNav} isLogin={this.isLogin} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		shared: state.shared,
		users: state.users
	};
};

const doAfterAnonymous = (props) => {

	const { dispatch, cookies } = props;
	dispatch(new actions.getCreditCard(cookies.get(userToken)));

};

export default withCookies(connect(mapStateToProps)(Shared(CreditCard, doAfterAnonymous)));
