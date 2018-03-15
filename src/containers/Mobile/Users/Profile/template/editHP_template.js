import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { Page, Level, Input, Svg, Button } from '@/components/mobile';
import styles from './profile.scss';

class UserProfileEditHP extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}
	render() {
		console.log('render');
		return (
			<Page style={{ paddingTop: 0 }}>
				<Level style={{ height: '55px' }}>
					<Level.Left style={{ width: '80px' }}>
						<Link to='/profile-edit'><Svg src='ico_arrow-back-left.svg' /></Link>
					</Level.Left>
					<Level.Item style={{ alignItems: 'center' }}>
						Ubah No. Handphone
					</Level.Item>
					<Level.Right style={{ width: '80px' }}>&nbsp;</Level.Right>
				</Level>
				<form style={{ padding: '15px' }}>
					<div className='margin--medium-v'>
						<label className={styles.label} htmlFor='cellPhone'>No. Handphone</label>
						<Input id='cellPhone' flat />
					</div>
					<div className='margin--medium-v'>
						<label className={styles.label} htmlFor='editCellPhoneNew'>No Handphone Baru</label>
						<Input id='editCellPhoneNew' flat />
					</div>
					<div className='margin--medium-v'>
						<Button color='primary' size='large'>SIMPAN</Button>
					</div>
				</form>
			</Page>
		);
	}
}

export default withCookies(UserProfileEditHP);
