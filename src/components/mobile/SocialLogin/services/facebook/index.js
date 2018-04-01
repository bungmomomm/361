import React, { PureComponent } from 'react';
import { omit } from 'lodash';
import Button from '@/components/mobile/Button';
import PropTypes from 'prop-types';

class FacebookLogin extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			sdkLoaded: window.FB !== undefined || false,
			loading: false
		};
	}
	componentDidMount() {
		
		((d, s, id) => {
			const element = d.getElementsByTagName(s)[0];
			const fjs = element;
			if (d.getElementById(id)) {
				return;
			}
			const js = d.createElement(s); js.id = id;
			js.src = '//connect.facebook.net/en_US/sdk.js';
			js.async = true;
			js.defer = true;
			fjs.parentNode.insertBefore(js, fjs);
		})(document, 'script', 'facebook-jssdk');

		window.fbAsyncInit = () => {
			this.setState({
				sdkLoaded: true
			});
			window.FB.init({
				appId: this.props.appId,
				xfbml: true,
				cookie: true,
				version: 'v2.12'
			});

			if (this.props.autoload && this.state.sdkLoaded && !this.loading) {
				window.FB.getLoginStatus((response) => {
					this.checkLoginStatus(response);
				});
			}
		};
		
	}

	getProfile(token, response) {
		window.FB.api('/me', {}, (me) => {
			this.setState({
				loading: false
			});
			this.props.onSuccess(token, me);
		});
	}

	checkLoginStatus(response) {
		if (response.status === 'connected') {
			this.proccessLogin(response);
		}
	}

	login() {
		if (this.state.sdkLoaded) {
			this.setState({
				loading: true
			});
			window.FB.login((response) => {
				this.setState({
					loading: false
				});
				this.proccessLogin(response);
			}, {
				scope: this.props.scope
			});
		}
	}

	proccessLogin(response) {
		if (response.authResponse) {
			this.setState({
				loading: true
			});
			this.getProfile(response.authResponse, response);
		} else {
			this.props.callback(response);
		}
	}

	render() {
		const { children, className, wide } = this.props;
		const props = omit(this.props, ['chidren', 'className', 'clientId', 'appId', 'onSuccess', 'onFailure', 'callback']);
		return (
			<Button wide={wide} {...props} onClick={(e) => this.login()} className={className}>
				{children}
			</Button>
		);
	}
}

FacebookLogin.propTypes = {
	appId: PropTypes.string,
	clientId: PropTypes.string,
	onSuccess: PropTypes.func,
	callback: PropTypes.func,
	wide: PropTypes.bool
};

FacebookLogin.defaultProps = {
	scope: 'email',
};

export default FacebookLogin;