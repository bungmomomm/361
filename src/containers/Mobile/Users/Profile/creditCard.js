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
	List
} from '@/components/mobile';


class CreditCard extends Component {
	
	constructor(props) {
		super(props);
		this.props = props;
		this.setDefault = this.setDefault.bind(this);
		this.state = {
			successMessage: ''
		};
		
		this.data = [
			{
				id: 123,
				name: 'VISA',
				creditCardNumber: '418-444-123-456'
			},
			{
				id: 456,
				name: 'CREDIT CARD',
				creditCardNumber: '418-444-123-756'
			}
		];
	
	}

	componentDidMount() {
		
		const { dispatch, cookies } = this.props;
		dispatch(new actions.getCreditCard(cookies.get('user.token')));
		
	}
	
	
	async setDefault(param) {
		
		const { dispatch, cookies } = this.props;
		
		const [err, response] = await to(dispatch(new actions.setCreditCard(cookies.get('user.token'), { card_id: param })));
		
		if (err) {
			return false;
		}
		
		const { data } = response;
		
		if (data.code === 200) {
			this.setState({ successMessage: data.data.msg });
		}
		
		return response;
		
	}
	
	renderCreditCardList() {
		const { users } = this.props;
		const { creditCard } = users;
		const creditCardValue = _.chain(creditCard).value();
		
		console.log(creditCardValue);
		
		return this.data.map(({ id, name, creditCardNumber }, e) => (
			<div>
				<List key={e}>
					<List.Image>
						<button
							onClick={() => this.setDefault({ id })}
						>Click Here</button>
					</List.Image>
					<List.Content>
						<span>{name}</span>
						<span>{creditCardNumber}</span>
					</List.Content>
				</List>
			</div>
			
		));
	}
	
	render() {
		
		const { successMessage } = this.state;
        
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
					{ successMessage !== '' && (<div>{successMessage}</div>) }
					{ this.renderCreditCardList() }
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

export default withCookies(connect(mapStateToProps)(Shared(CreditCard)));
