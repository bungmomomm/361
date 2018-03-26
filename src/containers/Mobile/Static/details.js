import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Iframe from 'react-iframe';
import Shared from '@/containers/Mobile/Shared';
import { Header, Page, Svg } from '@/components/mobile';
import cookiesLabel from '@/data/cookiesLabel';

class Details extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			notification: {
				show: true
			}
		};
		this.isLogin = this.props.cookies.get(cookiesLabel.isLogin);
		this.state = {
			listPage: {
				hubungi: {
					title: 'Hubungi Kami',
					link: 'https://super.mataharimall.com/static/contact-us.html'
				},
				faq: {
					title: 'FAQ', 
					link: ''
				},
				aboutus: {
					title: 'Tentang Kami', 
					link: 'https://super.mataharimall.com/static/about-us.html'
				},
				// affiliate: ''
				privasi: {
					title: 'Kebijakan Privasi', 
					link: 'https://super.mataharimall.com/static/privacy-policy.html'
				},
				joa: { 
					title: 'Jualan Aja', 
					link: ''
				}

			}
		};

	}

	componentWillMount() {
		const { match, history } = this.props;

		const title = this.state.listPage[match.params.detail];

		if (!title) {
			history.push('/notfound');
		}

		
		console.log(match.params.detail);
		
	}

	render() {
		const HeaderPage = {
			left: (
				<Link to={'/bantuan'}>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Promo',
		};

		return (
			<div className='text-center' style={this.props.style}>
				<Page>
					<Iframe
						url='https://super.mataharimall.com/promo/new/mobileapps.html'
						id='myId'
						width='100%'
						height='100vh'
						allowFullScreen
					/>
				</Page>
				<Header.Modal {...HeaderPage} />
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

export default withCookies(
	connect(mapStateToProps)(
		Shared(
			Details,
			null
		)
	)
);

