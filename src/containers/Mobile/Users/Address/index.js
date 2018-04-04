import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Shared from '@/containers/Mobile/Shared';
import { Page, Button, Svg, Header, Modal, Level } from '@/components/mobile';
import { actions } from '@/state/v4/Address';
import { Promise } from 'es6-promise';
import { userToken, isLogin } from '@/data/cookiesLabel';
import styles from './style.scss';
import handler from '@/containers/Mobile/Shared/handler';
import _ from 'lodash';

@handler
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
		this.listAddressMaker = this.listAddressMaker.bind(this);
	}

	setDefault = async () => {
		const { dispatch, cookies } = this.props;
		const { selectedAddress } = this.state;
		await dispatch(actions.setDefaultAddress(cookies.get(userToken), selectedAddress));
		await dispatch(actions.getAddress(cookies.get(userToken)));
		this.hideAddressModal();
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
		const { selectedAddress } = this.state;
		if (!selectedAddress) {
			return Promise.reject(new Error('Invalid address id, please contact administrator.'));
		}

		await dispatch(actions.deleteAddress(cookies.get(userToken), selectedAddress));
		const mutatedShipping = address.address.shipping.filter((v) => {
			return v.id !== selectedAddress;
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

	listAddressMaker(options) {
		return (
			<div key={options.key}>
				<Level className='bg--white border-bottom' key={options.key}>
					<Level.Left className='d-inline-block'>
						<strong>{options.address_label}</strong>&nbsp;{(options.default === 1) ? '(Alamat Utama)' : null }
					</Level.Left>
					<Level.Right style={{ justifyContent: 'center' }}>
						<Svg
							src='ico_option.svg'
							onClick={() => this.showAddressModal(options.id)}
						/>
					</Level.Right>
				</Level>
				<Level className='bg--white margin--medium-b flex-column'>
					<div className={styles.fullName}><strong>{options.fullname}</strong></div>
					<div><p style={{ color: '#888888' }}>{options.address}</p></div>
					<div><p style={{ color: '#888888' }}>{options.province}, {options.city}, {options.district}, {options.zipcode}</p></div>
					<div><p style={{ color: '#888888' }}>{options.zipcode} Indonesia</p></div>
					<div><p style={{ color: '#888888' }}>{options.phone}</p></div>
					<div className={styles.locationMarked}>{(parseFloat(options.latitude) && parseFloat(options.longitude)) ? options.placeHasBeenMarkedContent : null }</div>
				</Level>
			</div>
		);
	}

	renderData = () => {

		const { AddressModalIndicator } = this.state;
		const { address } = this.props;
		const HeaderPage = {
			left: (
				<Link to={'/profile'}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</Link>
			),
			center: 'Buku Alamat',
			right: null
		};

		const placeHasBeenMarkedContent = (
			<div className='flex-row flex-middle'>
				<div className='margin--small-r'><Svg src='ico_pin-poin-marked.svg' /></div>
				<div>&nbsp;Lokasi sudah ditandai</div>
			</div>
		);

		const ModalAttribute = {
			show: false
		};

		const pageAttribute = {
			color: 'grey'
		};

		if (_.isEmpty(address.address) || _.isEmpty(address.address.shipping)) {
			pageAttribute.color = 'white';
		}

		if (AddressModalIndicator === true) {
			ModalAttribute.show = true;
		}

		const defaultAddress = _.filter(address.address.shipping, ['fg_default', 1]);
		const notDefaultAddress = _.orderBy(address.address.shipping, ['id'], ['desc']);
		const renderEmptyAddress = (
			<div style={{ margin: 'auto' }}>
				<div className='margin--medium-v flex-center flex-middle'><Svg src='mm_ico_no-order-shoppingbag.svg' /></div>
				<div className='margin--small-v flex-center flex-middle'>
					Anda belum memiliki daftar alamat.
				</div>
			</div>
		);

		return (
			<div style={this.props.style}>
				<Page {...pageAttribute}>
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
					{ _.isEmpty(address.address) || _.isEmpty(address.address.shipping) ? renderEmptyAddress : null }
					{
						defaultAddress.map((v, k) => {
							return this.listAddressMaker({
								key: k,
								...v,
								default: v.fg_default,
								placeHasBeenMarkedContent
							});
						})
					}
					{
						notDefaultAddress.map((v, k) => {
							if (v.fg_default === 0) {
								return this.listAddressMaker({
									key: k,
									...v,
									default: v.fg_default,
									placeHasBeenMarkedContent
								});
							}
							return null;
						})
					}
				</Page>

				<Header.Modal {...HeaderPage} style={{ zIndex: 1 }} />

				<Modal {...ModalAttribute}>
					<div className='font-medium'>
						<Level style={{ padding: '0px', textAlign: 'center' }}>
							<Level.Left />
							<Level.Item className='flex-center'>
								<div className='padding--small'>
									<Link to={`/address/edit/${this.state.selectedAddress}`} style={{ color: '#191919' }}>
										Ubah Alamat
									</Link>
								</div>
								<Button className='padding--small' style={{ color: '#ED1C24' }} onClick={() => { this.setState({ showConfirmDelete: true }); }}>Hapus Alamat</Button>
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
	if (!cookies.get(isLogin) || cookies.get(isLogin) === 'false') {
		history.push('/login');
		return;
	}

	await dispatch(actions.getAddress(cookies.get(userToken)));
};

export default withCookies(connect(mapStateToProps)(Shared(Address, doAfterAnonymous, false)));
