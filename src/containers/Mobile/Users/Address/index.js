import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Shared from '@/containers/Mobile/Shared';
import { Page, Button, Svg, Header } from '@/components/mobile';
import { actions } from '@/state/v4/Address';

class Address extends Component {

	deleteAddress = (data) => {

	};

	renderData = () => {
		const { history, address } = this.props;
		const HeaderPage = {
			left: (
				<Button onClick={history.goBack}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</Button>
			),
			center: 'Buku Alamat',
			right: null
		};

		return (
			<div style={this.props.style}>
				<Page>
					<div className='margin--small'>
						<p style={{ textAlign: 'center' }}>
							<Link to='/address/add'>Tambah alamat baru +</Link>
						</p>
					</div>
					{address.address.shipping.map((v, k) => {
						return (
							<div className='margin--small' key={k}>
								<p>
									<Link to={`/account/address/${v.id}`}>Edit</Link>
									<Button onClick={() => this.deleteAddress(v)}>Delete</Button>
								</p>
								<p>
									{JSON.stringify(v)}
								</p>
							</div>
						);
					})}
				</Page>

				<Header.Modal {...HeaderPage} style={{ zIndex: 1 }} />
			</div>
		);
	};

	render() {
		return this.renderData();
	};
};

const mapStateToProps = (state) => {
	return {
		...state
	};
};

const doAfterAnonymous = (props) => {
	const { dispatch, cookies, history } = props;
	if (!cookies.get('isLogin')) {
		history.push('/login');
	}

	dispatch(actions.getAddress(cookies.get('user.token')));
};

export default withCookies(connect(mapStateToProps)(Shared(Address, doAfterAnonymous)));
