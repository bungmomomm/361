import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Shared from '@/containers/Mobile/Shared';
import { Page, Button, Svg, Header, Modal, Level } from '@/components/mobile';
import { actions } from '@/state/v4/Address';
import { Promise } from 'es6-promise';
import styles from './style.scss';

class Address extends Component {

	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			AddressModalIndicator: false,
			selectedAddress: false,
			showConfirmDelete: false
		};
		this.showAddressModal = this.showAddressModal.bind(this);
		this.hideAddressModal = this.hideAddressModal.bind(this);
	}

	setDefault = async () => {
		const { dispatch, cookies } = this.props;
		await dispatch(actions.setDefaultAddress(cookies.get('user.token'), this.state.selectedAddress));
		window.location.reload();
	};

	showAddressModal(id) {
		this.setState({
			AddressModalIndicator: true,
			selectedAddress: id
		});
	}

	hideAddressModal() {
		this.setState({
			AddressModalIndicator: false,
			selectedAddress: false
		});
	}

	deleteAddress = async () => {
		const { dispatch, cookies, address } = this.props;
		if (!this.state.selectedAddress) {
			return Promise.reject(new Error('Invalid address id, please contact administrator.'));
		}

		await dispatch(actions.deleteAddress(cookies.get('user.token'), this.state.selectedAddress));
		const mutatedShipping = address.address.shipping.filter((v) => {
			return v.id !== this.state.selectedAddress;
		});

		this.hideAddressModal();
		this.setState({ showConfirmDelete: false });
		return dispatch(actions.mutateState({
			address: {
				...address.address,
				shipping: mutatedShipping
			}
		}));
	};

	renderData = () => {

		const { AddressModalIndicator } = this.state;
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

		const ModalAttribute = {
			show: false
		};

		if (AddressModalIndicator === true) {
			ModalAttribute.show = true;
		}

		return (
			<div style={this.props.style}>
				<Page color='white'>
					<Link to='/address/add' className='bg--white margin--medium-t margin--medium-b'>
						<Level>
							<Level.Left>
								Tambah Alamat Baru
							</Level.Left>
							<Level.Right style={{ justifyContent: 'center' }}>
								<Svg src='ico_add.svg' />
							</Level.Right>
						</Level>
					</Link>
					{address.address.shipping.map((v, k) => {
						const { city, fullname, district, phone, province, zipcode, id } = v;
						const placeHasBeenMarkedContent = (
							<div className='flex-row flex-middle'>
								<div className='margin--small-r'><Svg src='ico_pin-poin-marked.svg' /></div>
								<div>&nbsp;Lokasi sudah ditandai</div>
							</div>
						);
						return (

							<div key={k}>
								<Level className='bg--white border-bottom' key={k}>
									<Level.Left className='d-inline-block'>
										<strong>{v.address_label}</strong>&nbsp;{(v.fg_default === 1) ? '(Alamat Utama)' : null }
									</Level.Left>
									<Level.Right style={{ justifyContent: 'center' }}>
										<Svg
											src='ico_option.svg'
											onClick={() => this.showAddressModal(id)}
										/>
									</Level.Right>
								</Level>
								<Level className='bg--white margin--medium-b flex-column'>
									<div className={styles.fullName}><strong>{fullname}</strong></div>
									<div><p>{v.address}, {province}, {city}, {district}, {zipcode}</p></div>
									<div><p>{phone}</p></div>
									<div className={styles.locationMarked}>{(v.is_supported_pin_point === 1) ? placeHasBeenMarkedContent : null }</div>
								</Level>
							</div>
						);
					})}
				</Page>

				<Header.Modal {...HeaderPage} style={{ zIndex: 1 }} />

				<Modal {...ModalAttribute}>
					<div className='font-medium'>
						<Level style={{ padding: '0px', textAlign: 'center' }}>
							<Level.Left />
							<Level.Item className='flex-center'>
								<Button className='padding--small' onClick={this.setDefault}>Jadikan Alamat Utama</Button>
								<div className='padding--small'>
									<Link to={`/address/edit/${this.state.selectedAddress}`}>
										Ubah Alamat
									</Link>
								</div>
								<Button className='padding--small' onClick={() => { this.setState({ showConfirmDelete: true }); }}>Hapus Alamat</Button>
								<Button className='padding--small' onClick={this.hideAddressModal}>Batal</Button>
							</Level.Item>
						</Level>
					</div>
				</Modal>

				<Modal show={this.state.showConfirmDelete}>
					<div className='font-medium'>
						<h3>Hapus Alamat</h3>
						<Level style={{ padding: '0px' }} className='margin--medium-v'>
							<Level.Left />
							<Level.Item className='padding--medium-h'>
								<div className='font-small'>Kamu yakin menghapus alamat ini?</div>
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
	if (!cookies.get('isLogin') || cookies.get('isLogin') === 'false') {
		history.push('/login');
		return;
	}

	await dispatch(actions.getAddress(cookies.get('user.token')));
};

export default withCookies(connect(mapStateToProps)(Shared(Address, doAfterAnonymous)));
