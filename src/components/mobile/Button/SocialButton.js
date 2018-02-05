import React from 'react';
import SocialLogin from 'react-social-login';
// import Button from './index';
const AuthButton = ({ children, triggerLogin, onClick, ...props }) => (
	<button {...props} onClick={(e) => { onClick(e); triggerLogin(e); }}>
		{children}
	</button>
);

export default SocialLogin(AuthButton);