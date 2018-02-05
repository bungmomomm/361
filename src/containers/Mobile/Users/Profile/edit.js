import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { Page, Svg, Level, Image, Input } from '@/components/mobile';
import styles from './profile.scss';

class UserProfileView extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			edit: false
		};
	}

	enableEdit(e) {
		this.setState({ edit: true });
	}

	render() {
		return (
			<Page>
				<Level>
					<Level.Left>
						<Link to='/profile'><Svg src='ico_arrow-back-left.svg' /></Link>
					</Level.Left>
					<Level.Item style={{ alignItems: 'center' }}>
						Informasi Akun
					</Level.Item>
					<Level.Right>
						<Link onCLick={(e) => (this.enableEdit(e))} to='#edit'>UBAH</Link>
					</Level.Right>
				</Level>
				<div style={{ alignItems: 'center' }}>
					<Image width={80} height={80} local avatar src='temp/thumb-2.jpg' alt='Rocky Syahputra' />
				</div>
				<form style={{ padding: '15px' }}>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='fullName'>Nama Lengkap</label>
						<Input id='fullName' flat value='Yannis Philippakis' />
					</div>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='email'>Email</label>
						<div className={styles.inputChange}>
							<div className={styles.inputChangeInput}>
								<Input disabled id='email' flat value='ynnsphlppks@icloud.com' />
							</div>
							<Link className={styles.inputChangeLink} to='#editEmail'>UBAH</Link>
						</div>
					</div>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='cellPhone'>Nomor Handphone</label>
						<div className={styles.inputChange}>
							<div className={styles.inputChangeInput}>
								<Input disabled id='cellPhone' flat value='085975049209' />
							</div>
							<Link className={styles.inputChangeLink} to='#editCellPhone'>UBAH</Link>
						</div>
					</div>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='gender'>Jenis Kelamin</label>
						<Input id='gender' flat value='Pria' />
					</div>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='dob'>Tanggal Lahir</label>
						<Input id='dob' flat value='23/02/1990' />
					</div>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='password'>Password</label>
						<div className={styles.inputChange}>
							<div className={styles.inputChangeInput}>
								<Input disabled id='password' type='password' flat value='password' />
							</div>
							<Link className={styles.inputChangeLink} to='#editPassword'>UBAH</Link>
						</div>
					</div>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='ovoID'><span style={{ color: '#4E2688' }}>OVO ID</span></label>
						<Input disabled id='ovoID' flat value='085975049209' />
						<span style={{ color: '#4E2688', fontSize: '12px' }}>OVO ID anda telah terhubung</span>
					</div>
				</form>
			</Page>
		);
	}
}

UserProfileView.defaultProps = {};

export default withCookies(UserProfileView);
