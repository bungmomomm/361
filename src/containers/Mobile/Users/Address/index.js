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
			selectedAddress: false
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
					<div><p>{options.address}, {options.province}, {options.city}, {options.district}, {options.zipcode}</p></div>
					<div><p>{options.phone}</p></div>
					<div className={styles.locationMarked}>{(options.is_supported_pin_point === 1) ? options.placeHasBeenMarkedContent : null }</div>
				</Level>
			</div>
		);
	}
	
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
		
		const placeHasBeenMarkedContent = (
			<div className='flex-row flex-middle'>
				<div className='margin--small-r'><Svg src='ico_pin-poin-marked.svg' /></div>
				<div>&nbsp;Lokasi sudah ditandai</div>
			</div>
		);
  
		const ModalAttribute = {
			show: false
		};

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

		console.log('this.props');
		console.log(this.props);

		return (
			<div style={this.props.style}>
				<Page color='grey'>
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
					{ this.props.address.shipping === null ? renderEmptyAddress : null }
					{
						defaultAddress.map((v, k) => {
							return this.listAddressMaker({
								key: k,
								address_label: v.address_label,
								id: v.id,
								fullname: v.fullname,
								address: v.address,
								province: v.province,
								city: v.city,
								district: v.district,
								zipcode: v.zipcode,
								default: v.fg_default,
								is_supported_pin_point: v.is_supported_pin_point,
								placeHasBeenMarkedContent
							});
						})
					}
					{
						notDefaultAddress.map((v, k) => {
							if (v.fg_default === 0) {
								return this.listAddressMaker({
									key: k,
									address_label: v.address_label,
									id: v.id,
									fullname: v.fullname,
									address: v.address,
									province: v.province,
									city: v.city,
									district: v.district,
									zipcode: v.zipcode,
									default: v.fg_default,
									is_supported_pin_point: v.is_supported_pin_point,
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
								<Button className='padding--small' onClick={this.setDefault}>Jadikan Alamat Utama</Button>
								<div className='padding--small'>
									<Link to={`/address/edit/${this.state.selectedAddress}`} style={{ color: '#191919' }}>
										Ubah Alamat
									</Link>
								</div>
								<Button className='padding--small' style={{ color: '#ED1C24' }} onClick={this.deleteAddress}>Hapus Alamat</Button>
								<Button className='padding--small' onClick={this.hideAddressModal}>Batal</Button>
							</Level.Item>
						</Level>
					</div>
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
