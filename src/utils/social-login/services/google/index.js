import React, { PureComponent } from 'react';
import { omit } from 'lodash';
import Button from '@/components/mobile/Button';
import PropTypes from 'prop-types';

class GoogleLogin extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			sdkLoaded: false
		};
	}
	componentDidMount() {
		const { clientId, scope } = this.props;
		const firstJS = document.getElementsByTagName('script')[0];
		const js = document.createElement('script');
		js.src = '//apis.google.com/js/platform.js';
		js.id = 'gapi-client';
		js.async = true;
		js.defer = true;
		js.onload = () => {
			this.setState({
				sdkLoaded: true
			});
			window.gapi.load('auth2', () => {
				if (!window.gapi.auth2.getAuthInstance()) {
					window.gapi.auth2.init({
						client_id: clientId,
						fetchBasicProfile: true,
						scope: scope ? ((Array.isArray(scope) && scope.join(' ')) || scope) : null
					}).then(
						res => {
							// if (this.props.autoload && this.state.sdkLoaded && !this.loading && res.isSignedIn.get()) {
								// this.proccessLogin(res.currentUser.get());
							// }
						},
						err => console.log(err)
					);
				}
			});
		};

		if (!firstJS) {
			document.appendChild(js);
		} else {
			firstJS.parentNode.appendChild(js);
		}
	}

	login() {
		const { prompt, onFailure } = this.props;
		if (this.state.sdkLoaded && !this.state.loading) {
			const auth2 = window.gapi.auth2.getAuthInstance();
			const options = {
				prompt
			};
			auth2.signIn(options).then(res => {
				this.proccessLogin(res);
			}, err => onFailure(err));
		}
	}

	proccessLogin(response) {
		const basicProfile = response.getBasicProfile();
		const authResponse = response.getAuthResponse();
		const profile = {
			googleId: basicProfile.getId(),
			authToken: authResponse.id_token,
			expiresIn: authResponse.expires_at,
			authResponse,
			imageUrl: basicProfile.getImageUrl(),
			email: basicProfile.getEmail(),
			name: basicProfile.getName(),
			givenName: basicProfile.getGivenName(),
			familyName: basicProfile.getFamilyName()
		};
		this.props.onSuccess(profile);
	}

	render() {
		const { children, className } = this.props;
		const props = omit(this.props, ['chidren', 'className', 'clientId', 'appId', 'onSuccess', 'onFailure', 'callback']);
		return (
			<Button {...props} onClick={(e) => this.login()} className={className}>
				{children}
			</Button>
		);
	}
}

GoogleLogin.propTypes = {
	appId: PropTypes.string,
	clientId: PropTypes.string,
	onSuccess: PropTypes.func,
	callback: PropTypes.func,
	onFailure: PropTypes.func,
	wide: PropTypes.bool
};

export default GoogleLogin;