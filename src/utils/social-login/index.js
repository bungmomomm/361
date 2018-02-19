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
		const TagName = provider === 'facebook' ? 'FacebookLogin' : 'GoogleLogin';
		return (
			<TagName {...props}>{children}</TagName>
		);
	}
}

Button.GoogleLogin = GoogleLogin;
Button.FacebookLogin = FacebookLogin;

export default Button;