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

class CreditCard extends Component {

	constructor(props) {
		
		super(props);
		this.props = props;
		this.setDefaultCreditCard = this.setDefaultCreditCard.bind(this);
		this.deleteSingleCreditCardFromList = this.deleteSingleCreditCardFromList.bind(this);
		this.makeCreditCardRadioChecked = this.makeCreditCardRadioChecked.bind(this);
		this.deleteCreditCardPopUpConfirmation = this.deleteCreditCardPopUpConfirmation.bind(this);
		this.renderCreditCardList = this.renderCreditCardList.bind(this);
		
		this.state = {
			successMessage: '',
			checkedCreditCardValueForSetDefault: null,
			checkedCreditCardValueForDelete: null,
			showDeleteCreditCardPopUpConfirmation: false
		};
		
	}
	
	async setDefaultCreditCard() {

		const { dispatch, cookies } = this.props;
		const { checkedCreditCardValueForSetDefault } = this.state;
		const parameterDefault = {
			card_id: checkedCreditCardValueForSetDefault
		};
		
		const [err, response] = await to(dispatch(new actions.setCreditCard(cookies.get('user.token'), parameterDefault)));
		
		if (err) {
			return false;
		}

		const { data } = response;

		if (data.code === 200) {
			this.setState({ successMessage: data.data.msg });
		}

		return response;

	}
    
	async deleteSingleCreditCardFromList() {
		
		const { dispatch, cookies } = this.props;
		const { checkedCreditCardValueForDelete } = this.state;
		const parameterDelete = {
			card_id: checkedCreditCardValueForDelete
		};
		
		const [err, response] = await to(dispatch(new actions.deleteCreditCard(cookies.get('user.token'), parameterDelete)));
		
		if (err) {
			return false;
		}
		
		const { data } = response;
		
		if (data.code === 200) {
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
	
	deleteCreditCardPopUpConfirmation() {
		
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
	
	renderCreditCardList() {
		
		
		const { checkedCreditCardValueForSetDefault } = this.state;
		
		const { users } = this.props;
		
		let view = (<div>Loading...</div>);
		
		if (_.isEmpty(users.creditCard === false)) {
			
			view = _.map(users.creditCard, (cc, id) => {
				
				const fgDefault = cc.fg_default;
				const creditCardWithSeparator = cc.credit_card_with_separator;
				const creditCardName = cc.credit_card_type;
				
				const isCheckedByDefault = (fgDefault === 1 && !checkedCreditCardValueForSetDefault);
				const isCheckedByUser = (checkedCreditCardValueForSetDefault && (checkedCreditCardValueForSetDefault === cc.id));
				
				const isChecked = isCheckedByDefault || isCheckedByUser ? id : null;
				
				const creditCardLogo = 'logo_mastercard.svg';
                
                
				return (
					<div className='margin--medium-t' key={id}>
						<Level className='bg--white' key={id}>
							<Level.Left>
								<Radio
									checked={isChecked}
									name={id}
									variant='check'
									data={[{ value: cc.id }]}
									onChange={this.makeCreditCardRadioChecked}
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
												showDeleteCreditCardPopUpConfirmation: true
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

	render() {

		const { successMessage } = this.state;

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
				<Page>
					{ successMessage !== '' && (
						<Notification {...notificationSuccessSetDefaultAttribute}>
							{successMessage}
						</Notification>
					) }
					
					{ this.renderCreditCardList() }
					{ this.deleteCreditCardPopUpConfirmation() }
					
				</Page>
				<Header.Modal {...HeaderPage} />
				<Navigation active='Profile' />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		...state
	};
};

const doAfterAnonymous = (props) => {
	
	const { dispatch, cookies } = props;
	dispatch(new actions.getCreditCard(cookies.get('user.token')));
 
};

export default withCookies(connect(mapStateToProps)(Shared(CreditCard, doAfterAnonymous)));
