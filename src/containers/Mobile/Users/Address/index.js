import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Shared from '@/containers/Mobile/Shared';
import { Page, Button, Svg, Header, Modal, Level } from '@/components/mobile';
import { actions } from '@/state/v4/Address';
import { Promise } from 'es6-promise';
import { userToken, isLogin } from '@/data/cookiesLabel';

class Address extends Component {

	state = {
		showConfirmDelete: false
	};

	deleteAddress = async () => {
		const { dispatch, cookies, address } = this.props;
		if (!this.state.showConfirmDelete.id) {
			return Promise.reject(new Error('Invalid address id, please contact administrator.'));
		}

		await dispatch(actions.deleteAddress(cookies.get(userToken), this.state.showConfirmDelete.id));
		const mutatedShipping = address.address.shipping.filter((v) => {
			return v.id !== this.state.showConfirmDelete.id;
		});

		this.setState({
			showConfirmDelete: false
		});

		return dispatch(actions.mutateState({
			address: {
				...address.address,
				shipping: mutatedShipping
			}
		}));
	};

	openDeleteModal = (data) => {
		this.setState({
			showConfirmDelete: data
		});
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
				<Page color='white'>
					<div className='margin--small'>
						<p style={{ textAlign: 'center' }}>
							<Link to='/address/add'>Tambah alamat baru +</Link>
						</p>
					</div>
					{address.address.shipping.map((v, k) => {
						return (
							<div className='margin--small' key={k}>
								<p>
									<Link to={`/address/edit/${v.id}`}>Edit</Link>
									<Button onClick={() => this.openDeleteModal(v)}>Delete</Button>
								</p>
								<p>
									{JSON.stringify(v)}
								</p>
							</div>
						);
					})}
				</Page>

				<Header.Modal {...HeaderPage} style={{ zIndex: 1 }} />

				<Modal show={this.state.showConfirmDelete}>
					<div className='font-medium'>
						<h3>Hapus Alamat</h3>
						<Level style={{ padding: '0px' }} className='margin--medium-v'>
							<Level.Left />
							<Level.Item className='padding--medium-h'>
								<div className='font-small'>Kamu yakin mau menghapus alamat ini?</div>
							</Level.Item>
						</Level>
					</div>
					<Modal.Action
						closeButton={(
							<Button onClick={() => { this.setState({ showConfirmDelete: false }); }}>
								<span className='font-color--primary-ext-2'>BATALKAN</span>
							</Button>)}
						confirmButton={(<Button onClick={this.deleteAddress}>YA, HAPUS</Button>)}
					/>
				</Modal>
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

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, history } = props;
	if (!cookies.get(isLogin) || cookies.get(isLogin) === 'false') {
		history.push('/login');
		return;
	}

	await dispatch(actions.getAddress(cookies.get(userToken)));
};

export default withCookies(connect(mapStateToProps)(Shared(Address, doAfterAnonymous)));
