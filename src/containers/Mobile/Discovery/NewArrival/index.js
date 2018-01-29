import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { 
	Header, Page, Svg, Navigation, Divider } from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import { actions } from '@/state/v4/Discovery';

class NewArrival extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(actions.newArrivalAction(this.userCookies));
	}

	render() {
		const HeaderPage = {
			left: (
				<Link to='/'>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'New Arrival',
			right: null
		};
		console.log(HeaderPage);
		return (
			<div>
				<Page>
					<Divider>Newest products productssssss....</Divider>
					<div>
						<pre>{JSON.stringify(this.props.discovery.newArrivalData.products, null, 4)}</pre>
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Navigation active='Promo' />
			</div>);
	}
}

const mapStateToProps = (state) => {
	return {
		...state
	};
};

export default withCookies(connect(mapStateToProps)(Shared(NewArrival)));