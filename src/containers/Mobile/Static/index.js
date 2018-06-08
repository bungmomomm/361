import React, { Component } from 'react';
/* import Iframe from 'react-iframe'; */
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';

import {
	Header, Image
} from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import handler from '@/containers/Mobile/Shared/handler';

import Footer from '@/containers/Mobile/Shared/footer';

@handler
class Static extends Component {

	constructor(props) {
		super(props);
		this.props = props;

		this.state = {
			isFooterShow: true
		};
	}

	componentDidMount() {
		console.log(this);
	}

	render() {
		/* const { shared } = this.props; */
		return (
			<div style={this.props.style}>
				<Header />

				<div>
					<div><Image local src='static-about.png' width='100%' /></div>
					<div className='container'>
						<div className='margin--xlarge-v'>
							<p>Mulai menapaki bisnis pada 2003, 361 Group kini telah menjadi salah satu perusahaan penyedia pakaian dan perlengkapan olahraga terbesar di China. 361 Group mengintegrasikan berbagai bidang dalam industri pakaian dan perlengkapan olahraga yang mencakup branding, R&D, desain, produksi, dan distribusi serta menyediakan beragam pilihan produk pakaian dan perlengkapan dari berbagai cabang olahraga termasuk atletik, basket, renang, sepakbola, hingga berbagai kegiatan outdoor lainnya.
							</p>
							<p>361 Group mengelola jaringan distribusi luas yang meliputi 7.000 gerai ritel yang didukung oleh jaringan distributor terintegrasi dan tersebar di seluruh China, yang menjadikannya terdepan dalam industri produk olahraga.</p>
							<p>Melanjutkan kesuksesannya di China, kini 361 Group meluaskan cakupan bisnisnya secara global. Dengan dukungan bermacam produk dan merk kenamaan yang bernaung di bawahnya kini 361 Group hadir di Amerika Serikat, Eropa, Brazil, Timur Tengah, dan termasuk Indonesia.</p>
						</div>
					</div>
				</div>
				<Footer isShow />
			</div>
		);
	}
}


const mapStateToProps = (state) => {
	return {
		shared: state.shared
	};
};

const doAfterAnonymous = async (props) => {
};


export default withCookies(connect(mapStateToProps)(Shared(Static, doAfterAnonymous)));