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
		const HeaderPage = ({
			left: (
				<Link to={'/'}>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Pusat Bantuan',
			right: null
		});

		return (
			<div style={this.props.style}>
				
				<Page color='grey'>
					<List className='margin--medium-t'>
						<List.Content>Tentang Kami</List.Content>
						<List.Content>FAQ</List.Content>
						<List.Content>Affiliate</List.Content>
						<List.Content>Berjualan di MatahariMall</List.Content>
						<List.Content>Partnership Lainnya</List.Content>
						<List.Content>Kebijakan Privasi</List.Content>
						<List.Content>Syarat & Ketentuan</List.Content>
						<List.Content>Hubungi Kami</List.Content>
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

