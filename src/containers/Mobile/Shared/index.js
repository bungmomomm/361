import React, { Component } from 'react';
import _ from 'lodash';
import { actions } from '@/state/v4/Shared';
import { actions as users } from '@/state/v4/User';
import { setUserCookie } from '@/utils';

const sharedAction = (WrappedComponent, doAfterAnonymousCall) => {
	WrappedComponent.contextTypes = {
		router: React.PropTypes.object,
		location: React.PropTypes.object
	};
	class SharedAction extends Component {
		static initApp(props) {
			props.dispatch(new actions.totalCartAction({
				token: props.userCookies
			}));
	
			props.dispatch(new actions.totalLovelistAction({
				token: props.userCookies
			}));

			if (typeof doAfterAnonymousCall !== 'undefined') {
				doAfterAnonymousCall.apply(this, [props, history]);
			}
		}

		constructor(props) {
			super(props);
			this.props = props;
			this.state = { data: null };
	
			this.userCookies = this.props.cookies.get('user.token');
			this.userRFCookies = this.props.cookies.get('user.rf.token');
		}


		componentDidMount() {
			if (this.shouldLoginAnonymous()) {
				this.loginAnonymous();
			} else {
				this.getProfile();
				this.constructor.initApp(this.props);
			}

			const loadings = window.document.getElementsByClassName('appLoading');
			if (typeof loadings[0] !== 'undefined') {
				loadings[0].parentElement.removeChild(loadings[0]);
			}
		}

		
		setUserCookie(token) {
			setUserCookie(this.props.cookies, token);
			this.constructor.initApp(this.props);
		}

		async getProfile() {
			try {
				await this.props.dispatch(new users.userGetProfile());
			} catch (error) {
				// @TODO add 
				console.log('errr', error);
			}
		}

		shouldLoginAnonymous() {
			return (_.isEmpty(this.userCookies) || _.isEmpty(this.userRFCookies));
		}

		async loginAnonymous() {
			try {
				const response = await this.props.dispatch(new users.userAnonymous());
				this.setUserCookie(response.token);
			} catch (error) {
				// @TODO add 
				console.log('errr', error);
			}
		}

		render() {
			return (
				<WrappedComponent {...this.props} />
			);
		}
	}
	return SharedAction;
};

export default sharedAction;
