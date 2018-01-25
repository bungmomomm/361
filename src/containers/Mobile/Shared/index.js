import React, { Component } from 'react';
import _ from 'lodash';
import { actions } from '@/state/v4/Shared';
import { actions as users } from '@/state/v4/User';
import { getSessionDomain } from '@/utils';

const sharedAction = (WrappedComponent, doAfterAnonymousCall) => {
	class SharedAction extends Component {
		static initApp(props) {
			props.dispatch(new actions.totalCartAction({
				token: props.userCookies
			}));
	
			props.dispatch(new actions.totalLovelistAction({
				token: props.userCookies
			}));

			if (typeof doAfterAnonymousCall !== 'undefined') {
				doAfterAnonymousCall.apply(this, [props]);
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
				console.log('do');
				this.constructor.initApp(this.props);
			}
		}

		
		setUserCookie(token) {
			const currentDate = new Date();
			currentDate.setDate(currentDate.getDate() + (2 * 365));
			this.props.cookies.set('user.exp', Number(token.expires_in), { domain: getSessionDomain(), expires: currentDate });
			this.props.cookies.set('user.rf.token', token.refresh_token, { domain: getSessionDomain(), expires: currentDate });
			this.props.cookies.set('user.token', token.token, { domain: getSessionDomain(), expires: currentDate });
			console.log('anon do');
			this.constructor.initApp(this.props);
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
