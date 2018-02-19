import React, { PureComponent } from 'react';
import { omit } from 'lodash';
import Button from '@/components/mobile/Button';

class GoogleLogin extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
	}
	componentDidMount() {
		const { clientId, appId, discoveryDocs, scope } = this.props;
		((d, s, id, cb) => {
			const element = d.getElementsByTagName(s)[0];
			const fjs = element;
			if (d.getElementById(id)) {
				return;
			}
			const js = d.createElement(s); 
			js.id = id;
			js.src = '//apis.google.com/js/client:platform.js';
			fjs.parentNode.insertBefore(js, fjs);
			fjs.onload = cb;
		})(document, 'script', 'google-sdk', () => {
			const params = {
				appId,
				client_id: clientId,
				discoveryDocs,
				scope
			};
			this.setState({
				sdkLoaded: true
			});
			window.gapi.load('auth2', async () => {
				if (!window.gapi.auth2.getAuthInstance()) {
					window.gapi.auth2.init(params).then(
						res => {
							if (this.props.autoload && this.state.sdkLoaded && !this.loading && res.isSignedIn.get()) {
								this.proccessLogin(res.currentUser.get());
							}
						},
						err => console.log(err)
					);
				}
			});
		});
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

export default GoogleLogin;