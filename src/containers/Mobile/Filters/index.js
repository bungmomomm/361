import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import Filter from '@/containers/Mobile/Shared/Filter';
import Shared from '@/containers/Mobile/Shared';
import { actions } from '@/state/v4/SortFilter';
import { to } from 'await-to-js';

class Filters extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	async onApply(e) {
		const { dispatch, cookies, filters } = this.props;
		const [err, response] = await to(dispatch(new actions.applyFilter(cookies.get('user.token'), 'category', filters)));
		if (err) {
			return err;
		}
		return response;
	}

	onUpdateFilter(e, type, value) {
		try {
			this.props.dispatch(new actions.updateFilter(type, value));
		} catch (error) {
			console.log(error);
		}
	}
	
	onReset(e) {
		this.props.dispatch(new actions.resetFilter());
	}

	render() {
		const { filters } = this.props;
		return (
			<div>
				<Filter filters={filters} onUpdateFilter={(e, type, value) => this.onUpdateFilter(e, type, value)} onApply={(e) => this.onApply(e)} onReset={(e) => this.onReset(e)} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		...state
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch
	};
};

const doAfterAnonymous = (props) => {
	console.log('code here if you need anon token or token s');
};

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Shared(Filters, doAfterAnonymous)));