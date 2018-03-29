import React, { Component } from 'react';
import Iframe from 'react-iframe';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';

import {
	Page
} from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import handler from '@/containers/Mobile/Shared/handler';

@handler
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
		const url = webViewUrl && webViewUrl.bantuan ? `${webViewUrl.bantuan}/cf` : 'https://super.mataharimall.com/static/cf';

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

