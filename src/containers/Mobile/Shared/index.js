import React, { Component } from 'react';
import { actions } from '@/state/v4/Shared';

const sharedAction = WrappedComponent => {
	class SharedAction extends Component {
		static initApp(token, dispatch) {
			dispatch(new actions.totalCartAction({
				token: this.userCookies
			}));
	
			dispatch(new actions.totalLovelistAction({
				token: this.userCookies
			}));
		}

		constructor(props) {
			super(props);
			this.props = props;
			this.state = { data: null };
	
			this.userCookies = this.props.cookies.get('user.token');
			this.userRFCookies = this.props.cookies.get('user.rf.token');
		}

		componentDidMount() {
			this.constructor.initApp(this.userCookies, this.props.dispatch);
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
