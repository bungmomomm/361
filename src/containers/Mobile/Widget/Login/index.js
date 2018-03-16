import React, { Component } from 'react';
import { 
	SocialLogin, 
	Svg 
} from '@/components/mobile';

class Login extends Component {

	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			loading: false
		};
	}

	async onSocialLogin(provider, token, profile) {
		this.props.onSuccess(provider, token, profile);
		this.setState({
			loading: false
		});
	}

	onFailure(provider, e) {
		if (this.props.onFailure) {
			this.props.onFailure(provider, e);
		} else {
			this.props.callback(provider, e);
		}
		this.setState({
			loading: false
		});
	}

	onLoading(e) {
		this.setState({
			loading: true
		});
	}

	render() {
		const { provider } = this.props;
		const { loading } = this.state;
		return (
			<div className='flex-row flex-middle flex-spaceBetween'>
				<div style={{ width: '45%' }}>
					<SocialLogin
						provider={'facebook'}
						wide
						size='medium'
						loading={loading}
						appId={provider.facebook.appId}
						onClick={(e) => this.onLoading(e)}
						onSuccess={(e, profile) => this.onSocialLogin('facebook', e, profile)}
						callback={(e) => this.onFailure('facebook', e)}

					>
						Facebook
					</SocialLogin>
				</div>
				<div style={{ width: '45%' }}>
					<SocialLogin
						provider={'google'}
						wide
						size='medium'
						loading={loading}
						clientId={provider.google.clientId}
						appId={provider.google.appId}
						onClick={(e) => this.onLoading(e)}
						onSuccess={(e, profile) => this.onSocialLogin('google', e, profile)}
						callback={(e) => this.onFailure('google', e)}
					>
						<Svg src='ico_google.svg' style={{ marginRight: '10px' }} />Google
					</SocialLogin>
				</div>
			</div>
		);
	}
}

Login.defaultProps = {
	provider: {
		google: {
			appId: '',
			clientId: ''
		},
		facebook: {
			appId: ''
		}
	}
};

export default Login;