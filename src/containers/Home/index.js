import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '@/state/Api';

class Home extends Component {
	static getDog(match, dispatch) {
		return dispatch(new actions.apiGet('https://api.ipify.org/?format=json'));
	}

	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			ip: {}
		};
	}

	componentWillMount() {
		this.constructor.getDog(null, this.props.dispatch);
	}

	render() {
		return (
			<div>
				test
			</div>
		);

	}
};

const mapStateToProps = (state) => {
	return {
		api: state.api.data
	};
};

export default connect(mapStateToProps)(Home);