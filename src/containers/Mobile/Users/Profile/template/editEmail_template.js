import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { Page, Level, Input, Svg, Button } from '@/components/mobile';
import styles from './profile.scss';

class UserProfileEditEmail extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}
	render() {
		return (
			<Page style={{ paddingTop: 0 }}>
				<Level style={{ height: '55px' }}>
					<Level.Left style={{ width: '80px' }}>
						<Link to='/profile-edit'><Svg src='ico_arrow-back-left.svg' /></Link>
					</Level.Left>
					<Level.Item style={{ alignItems: 'center' }}>Ubah Email</Level.Item>
					<Level.Right style={{ width: '80px' }}>&nbsp;</Level.Right>
				</Level>
				<form style={{ padding: '15px' }}>
					<div className='margin--medium-v'>
						<label className={styles.label} htmlFor='editEmail'>Email</label>
						<Input id='editEmail' flat />
					</div>
					<div className='margin--medium-v'>
						<label className={styles.label} htmlFor='editEmailNew'>Email Baru</label>
						<Input id='editEmailNew' flat />
					</div>
					<div className='margin--medium-v'>
						<Button color='primary' size='large'>SIMPAN</Button>
					</div>
				</form>
			</Page>
		);
	}
}

UserProfileEditEmail.defaultProps = {};

export default withCookies(UserProfileEditEmail);
