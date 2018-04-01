import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { users } from '@/state/v4/User';
import { Link } from 'react-router-dom';
import { Header, Page, Button, Svg } from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import styles from '../user.scss';
import { userSource } from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Registered extends Component {
	constructor(props) {
		super(props);
		this.source = this.props.cookies.get(userSource);
		this.props = props;
		this.state = {
			visibalePasswod: false
		};
	}

	onUserChange(e) {
		this.props.dispatch(new users.userNameChange(e));
	}

	handlePick(current) {
		this.setState({ current });
	}

	render() {
		const HeaderPage = {
			left: (
				<Link to='/'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Akun Sudah Terdaftar',
			right: null,
			shadow: false
		};

		return (
			<div className='full-height' style={this.props.style}>
				<Page>
					<div className={styles.container}>
						<div className='margin--medium-v'>Akun ini sudah terdaftar. Silahkan lakukan log in untuk mengakses akun.</div>
						<div className='margin--medium-v text-center'>
							<p>
								MASUK DENGAN <strong>085975049209</strong>
							</p>
						</div>
						<div className='margin--small-v'>
							<Button
								color='primary'
								size='large'
								onClick={e => this.onLogin(e)}
							>
								Login
							</Button>
						</div>
						<div className='margin--medium-v text-center'>
							<Link to='/'>Lupa Password</Link>
						</div>
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
			</div>
		);
	}
}

Registered.defaultProps = {
	Home: 'hallo',
	Data: 'akjsdaskdjasldjsaldjalskdj'
};

const mapStateToProps = state => {
	return {
		...state,
		isLoginLoading: state.users.isLoading
	};
};
const doAfterAnonymous = props => {
	console.log('code here if you need anon token or token');
};

export default withCookies(
	connect(mapStateToProps)(Shared(Registered, doAfterAnonymous))
);
