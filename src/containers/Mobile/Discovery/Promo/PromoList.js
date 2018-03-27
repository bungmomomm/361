import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
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
		this.state = {
			content: ''
		};

	}

	render() {
		const HeaderPage = {
			center: 'Promo',
		};

		const { shared } = this.props;
		const { webViewUrl } = shared; 
		const url = webViewUrl && webViewUrl.bantuan ? webViewUrl.bantuan : 'https://super.mataharimall.com/promo/new/mobileapps.html';

		return (
			<div className='text-center' style={this.props.style}>
				<Page>
					<Iframe
						url={url}
						id='myId'
						width='100%'
						height='100vh'
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

export default withCookies(connect(mapStateToProps)(Shared(PromoList)));