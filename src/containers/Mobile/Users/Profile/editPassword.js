import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { Page, Level, Input, Svg, Button } from '@/components/mobile';
import styles from './profile.scss';

class UserProfileEditPassword extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}
	render() {
		return (
			<Page>
				<Level style={{ height: '55px' }}>
					<Level.Left style={{ width: '80px' }}>
						<Link to='/profile-edit'><Svg src='ico_arrow-back-left.svg' /></Link>
					</Level.Left>
					<Level.Item style={{ alignItems: 'center' }}>
						Ubah Password
					</Level.Item>
					<Level.Right style={{ width: '80px' }}>&nbsp;</Level.Right>
				</Level>
				<form style={{ padding: '15px' }}>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='editPassword'>Password</label>
						<Input id='editPassword' type='password' flat />
					</div>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='editPasswordNew'>Password Baru</label>
						<Input id='editPasswordNew' type='password' flat />
					</div>
					<div className='margin--medium'>
						<Button color='primary' size='large'>SIMPAN</Button>
					</div>
				</form>
			</Page>
		);
	}
}

UserProfileEditPassword.defaultProps = {};

export default withCookies(UserProfileEditPassword);
