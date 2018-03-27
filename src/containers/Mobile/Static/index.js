import React, { Component } from 'react';
import Iframe from 'react-iframe';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

import {
	Header,
	Svg,
	Page
} from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';

class Static extends Component {

	constructor(props) {
		super(props);
		this.props = props;
	}

	componentDidMount() {
		console.log(this);
	}

	render() {
		const { shared } = this.props;
		const { webViewUrl } = shared; 
		const url = webViewUrl && webViewUrl.bantuan ? webViewUrl.bantuan : 'https://super.mataharimall.com/static/';
		const HeaderPage = {
			left: (
				<Link to={'/'}>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Pusat Bantuan',
			right: null
		};

		return (
			<div style={this.props.style}>
				
				<Page color='grey'>
					<Iframe
						url={url}
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
		shared: state.shared
	};
};

const doAfterAnonymous = async (props) => {
};


export default withCookies(connect(mapStateToProps)(Shared(Static, doAfterAnonymous)));

