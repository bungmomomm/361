import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import Filter from '@/containers/Mobile/Discovery/Category/Catalog/filter';
import Shared from '@/containers/Mobile/Shared';
import { actions } from '@/state/v4/SortFilter';

class Filters extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	onApply(e) {
		try {
			this.props.dispatch(new actions.applyFilter(this.props.cookies.get('user.token'), 'category', this.props.filters));
		} catch (error) {
			console.log(error);
		}
	}

	onUpdateFilter(e, type, value) {
		console.log(e, type, value);
		try {
			this.props.dispatch(new actions.updateFilter(type, value));
		} catch (error) {
			console.log(error);
		}
	}

	render() {
		const { filters } = this.props;
		return (
			<div>
				<Filter filters={filters} onUpdateFilter={(e, type, value) => this.onUpdateFilter(e, type, value)} onApply={(e) => this.onApply(e)} />
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
	// console.log('a', props, filters);
	props.dispatch(new actions.doTest('aaa'));
	
};

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Shared(Filters, doAfterAnonymous)));