import React, { Component } from 'react';
import _ from 'lodash';
import to from 'await-to-js';
import { actions } from '@/state/v4/Shared';
import { actions as users } from '@/state/v4/User';
import { actions as initAction } from '@/state/v4/Home';
import { setUserCookie } from '@/utils';

const sharedAction = (WrappedComponent, doAfterAnonymousCall) => {
	WrappedComponent.contextTypes = {
		router: React.PropTypes.object,
		location: React.PropTypes.object
	};
	class SharedAction extends Component {
		
		constructor(props) {
			super(props);
			this.props = props;
			this.state = { data: null };
	
			this.userCookies = this.props.cookies.get('user.token');
			this.userRFCookies = this.props.cookies.get('user.rf.token');
		}

		componentDidMount() {
			if (this.shouldLoginAnonymous()) {
				return this.loginAnonymous();
			} 

			const loading = window.document.getElementById('loading');
			if (typeof loading !== 'undefined') {
				loading.parentElement.removeChild(loading);
			}
			return this.initProcess(this.userRFCookies);
		}

		shouldLoginAnonymous() {
			return (_.isEmpty(this.userCookies) || _.isEmpty(this.userRFCookies));
		}

		initApp() {
			const { shared, dispatch } = this.props;
			
			const loveListService = _.chain(shared).get('serviceUrl.lovelist').value() || false;
			const orderService = _.chain(shared).get('serviceUrl.order').value() || false;

			dispatch(new actions.totalCartAction(this.userCookies, orderService));
			dispatch(new actions.totalLovelistAction(this.userCookies, loveListService));

			if (typeof doAfterAnonymousCall !== 'undefined') {
				doAfterAnonymousCall.apply(this, [this.props]);
			}
		}

		async loginAnonymous() {
			const [err, response] = await to(this.props.dispatch(new users.userAnonymous()));
			if (err) return ('oops something went wrong');

			
			setUserCookie(this.props.cookies, response.token);
			return this.initProcess(response.token);
		}

		async initProcess(token) {
			const [err, response] = await to(this.props.dispatch(new initAction.initAction(token)));
			if (err) return ('oops something went wrong');

			this.initApp();

			return response;
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
