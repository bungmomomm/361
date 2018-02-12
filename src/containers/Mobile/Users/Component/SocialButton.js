import React, { Component } from 'react';
import Button from '@/components/mobile/Button';

class SocialButton extends Component {

	constructor(props) {
		super(props);
		this.props = props;
	}

	handleClick(e) {
		this.props.onClick(e);
		const { onConnected, onFailure } = this.props;
		if (this.props.provider === 'facebook') {
			// console.log('asdasd');
			window.FB.getLoginStatus((response) => {
				if (response.status === 'connected') {
					onConnected(response);
				} else {
					window.FB.login((loginResponse) => {
						if (loginResponse.status === 'connected') {
							onConnected(loginResponse);
						} else {
							onFailure(loginResponse);
						}
					});
				}
			});	
		} else if (this.props.provider === 'google') {
			// 
		}
	}

	render() {
		
		const { children, ...props } = this.props;
		// console.log(onConnected, onFailure, provider);
		return (
			<Button {...props} onClick={(e) => { console.log('eeee'); this.handleClick(e); }} >
				{children}
			</Button>
		);
	}
}

export default {
	SocialButton
};