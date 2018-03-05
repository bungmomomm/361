import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
// import to from 'await-to-js';
import Iframe from 'react-iframe';
import Shared from '@/containers/Mobile/Shared';
import { Header, Page, Navigation } from '@/components/mobile';

class PromoList extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			notification: {
				show: true
			}
		};
		this.isLogin = this.props.cookies.get('isLogin');
		this.state = {
			content: ''
		};

	}

	render() {
		const HeaderPage = {
			center: 'Promo',
		};

		return (
			<div className='text-center' style={this.props.style}>
				<Page>
					<Iframe
						url='https://super.mataharimall.com/promo/new/mobileapps.html'
						id='myId'
						width='355'
						height='530'
						allowFullScreen
					/>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Navigation active='Promo' scroll={this.props.scroll} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		home: state.home,
		shared: state.shared
	};
};

const doAfterAnonymous = (props) => {
	// const { dispatch } = props;
	// dispatch(actions.promoPageAction());
};

export default withCookies(
	connect(mapStateToProps)(
		Shared(
			PromoList,
			doAfterAnonymous
		)
	)
);

