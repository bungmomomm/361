import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './header.scss';
import Svg from '../Svg';
import Input from '../Input';
import Button from '../Button';

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
			display: (this.props.show === false) ? 'none' : 'block',
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
							<div className='flex-middle'>
								<span>Daftar Dengan</span>
							</div>
							<div className='flex-middle'>
								<Svg src='ico_facebook.svg' />
								<Svg src='ico_google.svg' />
							</div>
							<div>
								<span>
									Atau
								</span>
							</div>
							<div>
								<div className='margin--medium-v'>
									<Input
										placeholder='Nama Lengkap'
									/>
								</div>
								<div className='margin--medium-v'>
									<Input
										placeholder='Email/Nomor Handphone'
									/>
								</div>
								<div className='margin--small-b'>
									<Input
										type='password'
										placeholder='Password'
									/>
								</div>
							</div>
							<div className='margin--small-b'>
								<span>
									Dengan membuka Akun, Anda telah membaca mengerti dan menyetujui
									<span> Syarat & Ketentuan </span> dan <span>Kebijakan</span>
								</span>
							</div>
							<div className='margin--small-v'>
								<Button color='primary' size='large'>
									Daftar
								</Button>
							</div>
							<div className=' margin--small-v text-center'>
								Sudah punya akun
								<span
									role='button'
									tabIndex={0}
									onClick={
										() => {
											this.toggleView();
										}
									}
								>
									login disini
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
							<div className='flex-middle'>
								<Svg src='ico_facebook.svg' />
								<Svg src='ico_google.svg' />
							</div>
							<div>
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
							
							</div>
							<div className='margin--small-v'>
								<Button color='primary' size='large'>
									Login
								</Button>
							</div>
							<div className=' margin--small-v text-center'>
								Belum punya akun
								<span
									role='button'
									tabIndex={0}
									onClick={
										() => {
											this.toggleView();
										}
									}
								>
									daftar disini
								</span>
							</div>
						</div>

					)
				}
				{
					(this.props.isLogin === true) && (
						<div>
							Login
						</div>
					)
				}
			</div>
		);
	}
};


export default UserDropDown;