import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import _ from 'lodash';

import Shared from '@/containers/Mobile/Shared';

import { Header, Page, Navigation, Svg, List, Level, Image, Panel, Spinner } from '@/components/mobile';

import CONST from '@/constants';
import { splitString } from '@/utils';

import styles from './profile.scss';

class UserProfile extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			hasPP: false,
			isBuyer: true // buyer or seller
		};
		this.userToken = this.props.cookies.get(CONST.COOKIE_USER_TOKEN);
		this.isLogin = this.props.cookies.get('isLogin') === 'true' && true;
		this.loadingView = <div><Spinner /></div>;
	}

	componentWillMount() {
		if (!this.isLogin) {
			const { history } = this.props;
			history.push('/login');
		}
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
		const { users } = this.props;
		const { isBuyer } = this.state;
		const userProfile = users.userProfile;

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

	render() {
		return (
			<div>
				<Page>
					{this.renderProfile()}
					<Panel>Account</Panel>
					<Link to='/profile-my-order' className='bg--white'>
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
					<Link to='/' className='bg--white'>
						<Level style={{ padding: '0 0 0 15px' }}>
							<Level.Left style={{ alignSelf: 'center' }}>
								<Svg src='ico_rating.svg' />
							</Level.Left>
							<Level.Item>
								<List>
									<List.Content style={{ minHeight: '50px' }}>Ulasan</List.Content>
								</List>
							</Level.Item>
						</Level>
					</Link>
					<Link to='/profile-credit-card'>
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
					<Link to='/' className='bg--white'>
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
					<Panel>More</Panel>
					<Link to='/' className='bg--white'>
						<Level style={{ padding: '0 0 0 15px' }}>
							<Level.Left style={{ alignSelf: 'center' }}>
								<Svg src='ico_help.svg' />
							</Level.Left>
							<Level.Item>
								<List>
									<List.Content style={{ minHeight: '50px' }}>Bantuan</List.Content>
								</List>
							</Level.Item>
						</Level>
					</Link>
					<Link to='/' className='bg--white'>
						<Level style={{ padding: '0 0 0 15px' }}>
							<Level.Left style={{ alignSelf: 'center' }}>
								<Svg src='ico_contact.svg' />
							</Level.Left>
							<Level.Item>
								<List>
									<List.Content style={{ minHeight: '50px' }}>Hubungi Kami</List.Content>
								</List>
							</Level.Item>
						</Level>
					</Link>
					<Panel>&nbsp;</Panel>
					<Link to='/' className='bg--white margin--medium-b'>
						<Level style={{ padding: '0 0 0 15px', minHeight: '50px' }}>
							<Level.Left style={{ alignSelf: 'center' }}>
								<Svg src='ico_logout.svg' />
							</Level.Left>
							<Level.Item style={{ color: '#FF3939', justifyContent: 'center', padding: '0 0 0 10px' }}>Logout</Level.Item>
						</Level>
					</Link>
				</Page>
				{this.renderHeader()}
				<Navigation active='Profile' />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		...state,
		isLoading: state.users.isLoading
	};
};

export default withCookies(connect(mapStateToProps)(Shared(UserProfile)));