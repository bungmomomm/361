import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import Iframe from 'react-iframe';

import Shared from '@/containers/Mobile/Shared';
import { Header, Page, Navigation } from '@/components/mobile';
import handler from '@/containers/Mobile/Shared/handler';
import { isLogin } from '@/data/cookiesLabel';
import styles from './promo.scss';

@handler
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
		this.isLogin = this.props.cookies.get(isLogin) === 'true';
	}

	render() {
		const HeaderPage = {
			center: 'Promo',
		};

		const { shared } = this.props;
		const { webViewUrl } = shared;
		const url = webViewUrl && webViewUrl.promo_tab ? webViewUrl.promo_tab : 'https://super.mataharimall.com/promo/new/mobileapps.html';

		return (
			<div className='text-center' style={this.props.style}>
				<Page>
					<div className={styles.iframeWrapper}>
						<Iframe
							url={url}
							id='myId'
							width='100%'
							height='100vh'
							allowFullScreen
							style={{ position: relative }}
						/>
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Navigation active='Promo' totalCartItems={shared.totalCart} scroll={this.props.scroll} botNav={this.props.botNav} isLogin={this.isLogin} />
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
