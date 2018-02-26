import React, { PureComponent } from 'react';
import FacebookLogin from './services/facebook';
import GoogleLogin from './services/google';

class Button extends PureComponent {
	constructor(props) {
		super(props);
		this.props = this.props;
	}
	render() {
		const { children, provider, ...props } = this.props;
		if (provider === 'facebook') {
			return (
				<FacebookLogin {...props} color={provider}>{children}</FacebookLogin>
			);
		}
		return (
			<GoogleLogin {...props} color={provider}>{children}</GoogleLogin>
		);
	}
}

Button.GoogleLogin = GoogleLogin;
Button.FacebookLogin = FacebookLogin;

export default Button;