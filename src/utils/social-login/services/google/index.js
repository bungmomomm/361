import React, { PureComponent } from 'react';

class GoogleLogin extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
	}
	componentDidMount() {
		((d, s, id) => {
			const element = d.getElementsByTagName(s)[0];
			const fjs = element;
			let js = element;
			if (d.getElementById(id)) {
				return;
			}
			js = d.createElement(s); js.id = id;
			js.src = '//connect.facebook.net/en_US/sdk.js';
			fjs.parentNode.insertBefore(js, fjs);
		})(document, 'script', 'facebook-jssdk');

		window.fbAsyncInit = () => {
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

	getProfile(response) {
		window.FB.api('/me', { fields: this.props.fields }, (me) => {
			this.props.onSuccess(me);
		});
	}

	checkLoginStatus(response) {
		if (response.status === 'connected') {
			this.proccessLogin(response);
		}
	}

	login() {
		if (this.state.sdkLoaded && !this.state.loading) {
			window.FB.login((response) => {
				this.checkLoginStatus(response);
			}, {
				scope: this.props.scope
			});
		}
	}

	proccessLogin(response) {
		if (response.authResponse) {
			this.getProfile(response);
		} else if (this.props.onFailure) {
			this.props.onFailure(response);
		} else {
			this.props.callback(response);
		}
	}

	render() {
		const { children, className } = this.props;
		return (
			<button onClick={(e) => this.login()} className={className}>
				{children}
			</button>
		);
	}
}

export default GoogleLogin;