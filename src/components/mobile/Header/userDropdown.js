import React from 'react';
import classNames from 'classnames';
import styles from './header.scss';
import Svg from '../Svg';
import Input from '../Input';
import Button from '../Button';

const UserDropDown = props => {
	
	const inlineStyle = {
		display: (props.show === false) ? 'none' : 'block',
	};
	
	const shoppingBagClass = classNames(
		styles.modalOnHeader,
		styles.shoppingBagModal
	);
	
	return (
		<div className={shoppingBagClass} id='userMenuDropdown' style={inlineStyle}>
			{
				(props.isLogin === false) && (
					<div className='flex-column'>
						<div className='flex-middle'>
							<span>Login Dengan</span>
						</div>
						<div className='flex-middle'>
							<Svg src='ico_facebook.svg' />
							<Svg src='ico_google.svg' />
						</div>
						{/* 'margin--medium-v flex-middle' */}
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
							Belum punya akun daftar sini
						</div>
					</div>
				)
			}
			{
				(props.isLogin === true) && (
					<div>
						Login
					</div>
				)
			}
		</div>
	);
};


export default UserDropDown;