import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import _ from 'lodash';
import to from 'await-to-js';

import Shared from '@/containers/Mobile/Shared';

import { Header, Page, Navigation, Svg, List, Level, Image, Panel, Spinner, Modal, Button } from '@/components/mobile';

import { actions as userActions } from '@/state/v4/User';

import CONST from '@/constants';
import { splitString, setUserCookie } from '@/utils';

import styles from './profile.scss';

class UserProfile extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			hasPP: false,
			isBuyer: true, // buyer or seller
			isLoading: false,
			showLogout: false,
			logoutMessage: ''
		};
		this.userToken = this.props.cookies.get(CONST.COOKIE_USER_TOKEN);
		this.isLogin = this.props.cookies.get('isLogin') === 'true' && true;
		this.loadingView = <Spinner />;

		if (!this.isLogin) {
			const { history } = this.props;
			history.push('/login?redirect_uri=profile');
		}
	}

	onLogout = async () => {
		const { dispatch, history, cookies } = this.props;
		const [err, response] = await to(dispatch(userActions.userLogout(this.userToken)));
		if (err) {
			return err;
		}
		setUserCookie(cookies, response.token, true);
		history.push('/');
		return response;
	}

	renderHeader() {
		const { history } = this.props;
		const HeaderPage = {
			left: (
				<button onClick={() => (history.length < 2 ? history.push('/') : history.go(-2))}> 
					<Svg src={'ico_arrow-back-left.svg'} />
				</button>
			),
			center: 'Profile',
		};

		return <Header.Modal {...HeaderPage} />;
	}

	renderProfile() {
		const { userProfile } = this.props;
		const { isBuyer } = this.state;

		if (!userProfile) {
			return (
				<form style={{ padding: '15px' }}>
					{this.loadingView}
				</form>
			);
		}

		const ppClassName = classNames(
			styles.tempPP,
			isBuyer ? styles.buyer : styles.seller
		);
		const ppCtrClassName = classNames(
			styles.tempPPContainer
		);

		const fullName = _.chain(userProfile.name).lowerCase().startCase().value() || '';
		const avatar = userProfile && userProfile.avatar ? (
			<Image width={60} height={60} avatar src={userProfile.avatar} alt={fullName} />
		) : (
			<div className={ppClassName}>{splitString(userProfile.name || '')}</div>
		);

		return (
			<Link to='/profile-edit' className='bg--white'>
				<Level>
					<Level.Left>
						<div className={ppCtrClassName}>
							{avatar}
						</div>
					</Level.Left>
					<Level.Item style={{ justifyContent: 'center', padding: '10px', color: '#191919' }}>
						<div style={{ fontWeight: 'bold', fontSize: '15px' }}>{userProfile.name || ''}</div>
						<div style={{ fontSize: '11px', color: '#A4A4A4' }}>Lihat informasi akun</div>
					</Level.Item>
					<Level.Right style={{ justifyContent: 'center' }}>
						<Svg src='ico_chevron-right.svg' />
					</Level.Right>
				</Level>
			</Link>
		);
	}

	renderLogoutModal() {
		const { showLogout } = this.state;

		return (
			<Modal show={showLogout}>
				<div className='font-medium'>
					<h3>Logout</h3>
					<Level style={{ padding: '0px' }} className='margin--medium-v'>
						<Level.Left />
						<Level.Item className='padding--medium-h'>
							<div className='font-small'>Apakah Anda yakin ingin keluar?</div>
						</Level.Item>
					</Level>
				</div>
				<Modal.Action
					closeButton={(
						<Button onClick={() => { this.setState({ showLogout: false }); }}>
							<span className='font-color--primary-ext-2'>TIDAK</span>
						</Button>
					)}
					confirmButton={(
						<Button onClick={() => this.onLogout()}>LOGOUT</Button>
					)}
				/>
			</Modal>
		);
	}

	render() {
		return this.isLogin ? (
			<div>
				<Page style={{ paddingTop: 0 }}>
					{this.renderProfile()}
					<Panel>Account</Panel>
					<Link to='/profile/my-order' className='bg--white'>
						<Level style={{ padding: '0 0 0 15px' }}>
							<Level.Left style={{ alignSelf: 'center' }}>
								<Svg src='ico_order.svg' />
							</Level.Left>
							<Level.Item>
								<List>
									<List.Content style={{ minHeight: '50px' }}>Pesanan</List.Content>
								</List>
							</Level.Item>
						</Level>
					</Link>
					<Link to='/profile-credit-card' className='bg--white'>
						<Level style={{ padding: '0 0 0 15px' }}>
							<Level.Left style={{ alignSelf: 'center' }}>
								<Svg src='ico_cc.svg' />
							</Level.Left>
							<Level.Item>
								<List>
									<List.Content style={{ minHeight: '50px' }}>Daftar Kartu Kredit/Debit</List.Content>
								</List>
							</Level.Item>
						</Level>
					</Link>
					<Link to='/address' className='bg--white'>
						<Level style={{ padding: '0 0 0 15px' }}>
							<Level.Left style={{ alignSelf: 'center' }}>
								<Svg src='ico_address.svg' />
							</Level.Left>
							<Level.Item>
								<List>
									<List.Content style={{ minHeight: '50px' }}>Buku Alamat</List.Content>
								</List>
							</Level.Item>
						</Level>
					</Link>
					<Link to='/lovelist' className='bg--white'>
						<Level style={{ padding: '0 0 0 15px' }}>
							<Level.Left style={{ alignSelf: 'center' }}>
								<Svg src='ico_lovelist-profile.svg' />
							</Level.Left>
							<Level.Item>
								<List>
									<List.Content style={{ minHeight: '50px' }}>My Lovelist</List.Content>
								</List>
							</Level.Item>
						</Level>
					</Link>
					<Link to='#return-refund' className='bg--white'>
						<Level style={{ padding: '0 0 0 15px' }}>
							<Level.Left style={{ alignSelf: 'center' }}>
								<Svg src='ico_return.svg' />
							</Level.Left>
							<Level.Item>
								<List>
									<List.Content style={{ minHeight: '50px' }}>Return & Refund</List.Content>
								</List>
							</Level.Item>
						</Level>
					</Link>
					<Panel>More</Panel>
					<Link to='#bantuan' className='bg--white'>
						<Level style={{ padding: '0 0 0 15px' }}>
							<Level.Left style={{ alignSelf: 'center' }}>
								<Svg src='ico_help.svg' />
							</Level.Left>
							<Level.Item>
								<List>
									<List.Content style={{ minHeight: '50px' }}>Pusat Bantuan</List.Content>
								</List>
							</Level.Item>
						</Level>
					</Link>
					<Panel>&nbsp;</Panel>
					<Link to='#' className='bg--white margin--medium-b' onClick={() => { this.setState({ showLogout: true }); }}>
						<Level style={{ padding: '0 0 0 15px', minHeight: '50px' }}>
							<Level.Left style={{ alignSelf: 'center' }}>
								<Svg src='ico_logout.svg' />
							</Level.Left>
							<Level.Item style={{ color: '#FF3939', justifyContent: 'center', padding: '0 0 0 10px' }}>Logout</Level.Item>
						</Level>
					</Link>
				</Page>
				{this.renderHeader()}
				{this.renderLogoutModal()}
				<Navigation active='Profile' />
			</div>
		) : this.loadingView;
	}
}

const mapStateToProps = (state) => {
	return {
		...state,
		isLoading: state.users.isLoading,
		userProfile: state.users.userProfile
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, shared } = props;

	const serviceUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;
	if (serviceUrl) {
		dispatch(userActions.userGetProfile(cookies.get('user.token')));
	}
};

export default withCookies(connect(mapStateToProps)(Shared(UserProfile, doAfterAnonymous)));