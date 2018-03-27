import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import Shared from '@/containers/Mobile/Shared';
import { Header, Svg, Tabs } from '@/components/mobile';
import { Link } from 'react-router-dom';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Filters extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			shown: true
		};
	}

	handlePick(what) {
		console.log(what);
		this.setState({
			shown: what === 'filter'
		});
	}

	render() {

		const HeaderPage = {
			left: (
				<Link to='/'>
					<Svg src={'ico_arrow-back-left.svg'} />
				</Link>
			),
			center: 'Sample Page',
			right: null
		};

		return (
			<div>
				<div style={this.props.style}>
					<Header.Modal {...HeaderPage} />
					<Tabs
						type='segment'
						variants={[
							{
								id: 'urutkan',
								title: 'Urutkan'
							},
							{
								id: 'filter',
								title: 'filter'
							},
							{
								id: 'view',
								title: <Svg src='ico_grid.svg' />
							}
						]}
						onPick={e => this.handlePick(e)}
					/>
				</div>
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
