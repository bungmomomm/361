import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import {
	Header,
	Svg,
	List,
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
					<List className='margin--medium-t'>
						<Link to='/bantuan/aboutus'>
							<List.Content>Tentang Kami</List.Content>
						</Link>
						<a href='/bantuan/faq'>
							<List.Content>FAQ</List.Content>
						</a>
						<a href='https://super.mataharimall.com/affiliateaja/' rel='noopener noreferrer' target='_blank'>
							<List.Content>Affiliate</List.Content>
						</a>
						<a href='/bantuan'>
							<List.Content>Berjualan di MatahariMall</List.Content>	
						</a>
						<a href='/bantuan'>
							<List.Content>Partnership Lainnya</List.Content>
						</a>
						<a href='/bantuan/privasi'>
							<List.Content>Kebijakan Privasi</List.Content>
						</a>
						<a href='/bantuan'>
							<List.Content>Syarat & Ketentuan</List.Content>
						</a>
						<a href='/bantuan'>
							<List.Content>Hubungi Kami</List.Content>
						</a>
					</List>
				</Page>
				<Header.Modal {...HeaderPage} />
				
			</div>
		);
	}

}


const mapStateToProps = (state) => {
	return {
		home: state.home,
		search: state.search,
		shared: state.shared
	};
};

const doAfterAnonymous = async (props) => {
};


export default withCookies(connect(mapStateToProps)(Shared(Static, doAfterAnonymous)));

