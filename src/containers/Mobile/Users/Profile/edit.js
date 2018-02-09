import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Page, Svg, Level, Image, Input, Button } from '@/components/mobile';
import styles from './profile.scss';

class UserProfileEdit extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			edit: false,
			ovoVerified: false,
			hasPP: true,
			isBuyer: false // buyer or seller
		};
		this.verifyOVO = this.verifyOVO.bind(this);
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
	verifyOVO(e) {
		e.preventDefault();
		this.props.history.push('/profile-edit-ovo');
	}
	renderOVO(enableInput) {
		return (
			this.state.ovoVerified ?
				<div className='margin--medium'>
					<label className={styles.label} htmlFor='ovoID'><span style={{ color: '#4E2688' }}>OVO ID</span></label>
					<Input disabled={enableInput} id='ovoID' flat value='085975049209' />
					<span style={{ color: '#4E2688', fontSize: '12px' }}>OVO ID anda telah terhubung</span>
				</div> :
				<div className='margin--medium'>
					<Button color='primary' size='large' onClick={this.verifyOVO}>VERIFIKASI OVO ID</Button>
				</div>
		);
	}

	render() {
		const enableInput = !this.state.edit;

		const ppClassName = classNames(
			styles.tempPP,
			this.state.isBuyer ? styles.buyer : styles.seller
		);

		const ppCtrClassName = classNames(
			styles.tempPPContainer,
			styles.big
		);

		return (
			<Page>
				<Level style={{ height: '55px' }}>
					<Level.Left style={{ width: '80px' }}>
						{
							this.state.edit ?
								<Link style={{ color: '#A4A4A4' }} onClick={(e) => (this.cancelProfile(e))} to='#save'>BATAL</Link> :
								<Link to='/profile'><Svg src='ico_arrow-back-left.svg' /></Link>
						}
					</Level.Left>
					<Level.Item style={{ alignItems: 'center' }}>
						{ this.state.edit ? 'Ubah Profil' : 'Informasi Akun' }
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
					<div className={ppCtrClassName}>
						{
							this.state.hasPP ?
								<Image width={80} height={80} local avatar src='temp/thumb-2.jpg' alt='Rocky Syahputra' /> :
								<div className={ppClassName}>RS</div>
						}
						{ this.state.edit ? <Link className={styles.editPP} to='#editPhoto'>UBAH</Link> : null }
					</div>
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
							{ this.state.edit ? <Link className={styles.inputChangeLink} to='/profile-edit-email'>UBAH</Link> : null }
						</div>
					</div>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='cellPhone'>Nomor Handphone</label>
						<div className={styles.inputChange}>
							<div className={styles.inputChangeInput}>
								<Input disabled={enableInput} readOnly id='cellPhone' flat value='085975049209' />
							</div>
							{ this.state.edit ? <Link className={styles.inputChangeLink} to='/profile-edit-hp'>UBAH</Link> : null }
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
					{ this.renderOVO(enableInput) }
				</form>
			</Page>
		);
	}
}

UserProfileEdit.defaultProps = {};

export default withCookies(UserProfileEdit);
