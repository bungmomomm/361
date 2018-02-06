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

	editProfile(e) {
		e.preventDefault();
		this.setState({ edit: true });
	}

	cancelProfile(e) {
		e.preventDefault();
		this.setState({ edit: false });
	}

	saveProfile(e) {
		e.preventDefault();
		this.setState({ edit: false });
	}

	render() {
		const enableInput = !this.state.edit;
		return (
			<Page>
				<Level style={{ height: '55px' }}>
					<Level.Left style={{ width: '80px' }}>
						{
							this.state.edit ?
								<Link style={{ color: '#A4A4A4' }} onClick={(e) => (this.cancelProfile(e))} to='#save'>BATAL</Link> :
								<div>
									<Link to='/profile'><Svg src='ico_arrow-back-left.svg' /></Link>
									<Link to='/profile-edit-ovo'><Svg src='ico_arrow-back-left.svg' /></Link>
								</div>
						}
					</Level.Left>
					<Level.Item style={{ alignItems: 'center' }}>
						EDIT
					</Level.Item>
					<Level.Right style={{ width: '80px' }}>
						{
							this.state.edit ?
								<Link onClick={(e) => (this.saveProfile(e))} to='#save'>SIMPAN</Link> :
								<Link onClick={(e) => (this.editProfile(e))} to='#edit'>UBAH</Link>
						}
					</Level.Right>
				</Level>
				<div style={{ alignItems: 'center' }}>
					<Image width={80} height={80} local avatar src='temp/thumb-2.jpg' alt='Rocky Syahputra' />
				</div>
				<form style={{ padding: '15px' }}>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='fullName'>Nama Lengkap</label>
						<Input disabled={enableInput} id='fullName' flat value='Yannis Philippakis' />
					</div>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='email'>Email</label>
						<div className={styles.inputChange}>
							<div className={styles.inputChangeInput}>
								<Input disabled={enableInput} readOnly id='email' flat value='ynnsphlppks@icloud.com' />
							</div>
							{ this.state.edit ? <Link className={styles.inputChangeLink} to='#editEmail'>UBAH</Link> : null }
						</div>
					</div>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='cellPhone'>Nomor Handphone</label>
						<div className={styles.inputChange}>
							<div className={styles.inputChangeInput}>
								<Input disabled={enableInput} readOnly id='cellPhone' flat value='085975049209' />
							</div>
							{ this.state.edit ? <Link className={styles.inputChangeLink} to='#editCellPhone'>UBAH</Link> : null }
						</div>
					</div>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='gender'>Jenis Kelamin</label>
						<Input disabled={enableInput} id='gender' flat value='Pria' />
					</div>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='dob'>Tanggal Lahir</label>
						<Input disabled={enableInput} id='dob' flat value='23/02/1990' />
					</div>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='password'>Password</label>
						<div className={styles.inputChange}>
							<div className={styles.inputChangeInput}>
								<Input disabled={enableInput} readOnly id='password' type='password' flat value='password' />
							</div>
							{ this.state.edit ? <Link className={styles.inputChangeLink} to='#editPassword'>UBAH</Link> : null }
						</div>
					</div>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='ovoID'><span style={{ color: '#4E2688' }}>OVO ID</span></label>
						<Input disabled={enableInput} id='ovoID' flat value='085975049209' />
						<span style={{ color: '#4E2688', fontSize: '12px' }}>OVO ID anda telah terhubung</span>
					</div>
				</form>
			</Page>
		);
	}
}

UserProfileView.defaultProps = {};

export default withCookies(UserProfileView);
