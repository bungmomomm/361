import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './header.scss';
import Svg from '../Svg';
import Input from '../Input';
import Button from '../Button';
import { Link } from 'react-router-dom';

class UserDropDown extends Component {
	
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			view: 'register'
		};
		
	}
	
	// Togggle view between register or login
	toggleView() {
		this.setState((prevState) => {
			let value = 'register';
			if (prevState.view === 'register') {
				value = 'login';
			}
			return {
				view: value,
			};
		});
	}
 
	render() {

		const inlineStyle = {
			display: (this.props.show === false) ? 'none' : 'block'
		};

		const userModalClass = classNames(
			styles.modalOnHeader,
			styles.userModal
		);
		
		return (
			<div className={userModalClass} id='userMenuDropdown' style={inlineStyle}>

				{
					(this.props.isLogin === false && this.state.view === 'register') && (
						<div className='flex-column'>
							<div className='flex-middle font-color--primary-ext-1'>
								<span>Daftar Dengan</span>
							</div>
							<div className='flex-middle flex-row flex-center margin--normal-v'>
								<Button className='margin--small' ><Svg src='ico_facebook_circle.svg' /></Button>
								<Button className='margin--small' ><Svg src='ico_google_circle.svg' /></Button>
							</div>
							<div className={styles.spacer}>
								<span>
									Atau
								</span>
							</div>
							<div>
								<div className='margin--normal-t'>
									<Input placeholder='Nama Lengkap' className='font-size--medium' />
								</div>
								<div className='margin--normal-v'>
									<Input placeholder='Email/Nomor Handphone' className='font-size--medium' />
								</div>
								<div className='margin--small-b'>
									<Input className='font-size--medium' type='password' placeholder='Password' />
								</div>
							</div>
							<div className='margin--small-b'>
								<span>
									Dengan membuka Akun, Anda telah membaca mengerti dan menyetujui
									<span> Syarat & Ketentuan </span> dan <span>Kebijakan</span>
								</span>
							</div>
							<div className='margin--small-v'>
								<Button color='primary' size='large' className='text-uppercase'>
									Daftar
								</Button>
							</div>
							<div className='margin--medium-t text-center'>
								<span
									className='text-underline font-color--primary-ext-1'
									role='button'
									tabIndex={0}
									onClick={
										() => {
											this.toggleView();
										}
									}
								>
									Sudah punya Akun? Login disini
								</span>
							</div>
						</div>
					)
				}
				{
					(this.props.isLogin === false && this.state.view === 'login') && (
						<div className='flex-column'>
							<div className='flex-middle'>
								<span>Login Dengan</span>
							</div>
							<div className='flex-middle flex-row flex-center margin--normal-v'>
								<Button className='margin--small' ><Svg src='ico_facebook_circle.svg' /></Button>
								<Button className='margin--small' ><Svg src='ico_google_circle.svg' /></Button>
							</div>
							<div className={styles.spacer}>
								<span>
									Atau
								</span>
							</div>
							<div>
								<div className='margin--medium-v'>
									<Input
										placeholder='Username'
									/>
									<div className='text-right'>
										<span className='font-color--red'>
											Username tidak valid
										</span>
									</div>
								</div>
								<div className='margin--small-b'>
									<Input
										placeholder='Password'
									/>
									<div className='text-right'>
										<span className='font-color--red'>
											Password tidak valid
										</span>
									</div>
								</div>
								<div className='margin--normal-b text-right'>
									<span>
										Lupa Password
									</span>
								</div>
								<div className='margin--small-v'>
									<Button color='primary' size='large'>
										Login
									</Button>
								</div>
								<div className='margin--medium-t text-center'>
									<span
										className='text-underline font-color--primary-ext-1'
										role='button'
										tabIndex={0}
										onClick={
											() => {
												this.toggleView();
											}
										}
									>
									Belum punya Akun? Daftar disini
									</span>
								</div>
							</div>
						</div>
					)
				}
				{
					(this.props.isLogin === true) && (
						<div>
							<div
								className='padding--xmedium-v padding--medium-l'
								style={{ borderBottom: '1px solid #EEEEEE' }}
							>
								<span className='font-color--primary-ext-1'>
									Selamat datang, <span className='bold-text'>{this.props.username}</span>
								</span>
							</div>
							<ul className={styles.subMenuUser}>
								<li>
									<Link to='/'>
										<span> Profil saya </span>
									</Link>
								</li>
								<li>
									<Link to='/'>
										<span>Pesanan saya</span>
									</Link>
								</li>
								<li>
									<Link to='/'>
										<span>Lovelist</span>
									</Link>
								</li>
								<li>
									<Link to='/'>
										<span>
											Bantuan
										</span>
									</Link>
								</li>
								<li>
									<Link to='/'>
										<span>
											Logout
										</span>
									</Link>
								</li>
							</ul>
						</div>
					)
				}
			</div>
		);
	}
};


export default UserDropDown;