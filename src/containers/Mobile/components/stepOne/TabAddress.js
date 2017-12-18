import { connect } from 'react-redux';
import _ from 'lodash';
import { actions } from '@/state/Cart';
import { getRefreshToken } from '@/state/Auth/actions';
import { withCookies } from 'react-cookie';
import React, { Component } from 'react';
import {
	Alert,
	Panel,
	Group,
	Level,
	Icon,
	Button,
	Select
} from 'mm-ui';
import { T } from '@/data/translations';

import Dropshipper from './Dropshipper';
import ModalAddress from './ModalAddress';

class TabAddress extends Component {

	static placeOrder(userToken, userRFToken, dispatch, selectedAddress, billing) {
		dispatch(new actions.getPlaceOrderCart(userToken, selectedAddress, billing))
		.catch(error => {
			if (error.response.data.code === 405) {
				dispatch(getRefreshToken({
					userToken,
					userRFToken
				})).then((response) => {
					dispatch(new actions.getPlaceOrderCart(response.userToken, selectedAddress, billing));
				});
			}
		});
	}

	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			selectedAddress: null,
			showModalAddress: false,
			shipping: []
		};
	}

	componentDidMount() {
		if (this.props.addresses.length > 0) {
			this.setShipping(this.props.addresses);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.addresses !== nextProps.addresses) {
			this.setShipping(this.props.addresses);
		}
	}

	setShipping(addresses) {
		this.currentAddresses = addresses;
		const shipping = [];
		addresses.map((value) => (
			shipping.push({
				value: value.id,
				label: !value.attributes.addressLabel ? value.attributes.fullname : value.attributes.addressLabel,
				info: `<p><strong>${value.attributes.fullname}</strong></p>
						<div>${value.attributes.address}</div>
						<div>${value.attributes.district}</div>
						<div>${value.attributes.city}, ${value.attributes.province} ${value.attributes.zipcode}</div>
						<div>P: ${value.attributes.phone}</div>
						`
			})
		));
		this.saveSelectedAddress(this.currentAddresses[0]);
		this.setState({
			shipping,
			showModalAddress: false,
			selectedAddress: this.currentAddresses[0]
		});
	}

	setSelectedAddress(selected) {
		const newSelectedAddress = _.find(this.currentAddresses, { id: selected.value });
		this.saveSelectedAddress(newSelectedAddress);
		this.setState({
			selectedAddress: newSelectedAddress
		});
		// this.toggleChooseAddressModal();
	}

	saveSelectedAddress(selectedAddress, selectedAddressType = 'selectedAddress') {
		const { stepState } = this.props;
		// stepState = this.setStateDefaultElocker(stepState, this.props.latesto2o);
		const checkoutState = {
			...stepState,
			stepOne: {
				...stepState.stepOne,
				[selectedAddressType]: selectedAddress,
				funcShowModalAddress: (e) => this.showModalAddress(e)
			}
		};
		this.props.applyState(checkoutState);
	}

	showModalAddress(type) {
		this.flagModalAddress = type;
		this.setState({ showModalAddress: true });
	}

	hideModalAddress() {
		this.flagModalAddress = '';
		this.setState({ showModalAddress: false });
	}

	renderSelectedAddress() {
		const { attributes } = this.props.stepState.stepOne.selectedAddress;
		return (
			<p>
				<strong>{attributes.addressLabel}</strong> <br />
				{attributes.fullname} <br />
				{attributes.address} <br />
				{attributes.district},
				{attributes.city},
				{attributes.province},
				{attributes.zipcode} <br />
				Telepon: {attributes.phone}
			</p>
		);
	}

	renderMarkedLocationLabel() {
		const { attributes } = this.props.stepState.stepOne.selectedAddress;
		if (attributes.latitude && attributes.longitude) {
			return (
				<Level>
					<Level.Item className='text-right'>
						<div>
							<Icon name='map-marker' /> &nbsp; {T.checkout.LOCATION_MARKED}
						</div>
					</Level.Item>
				</Level>
			);
		}
		return null;
	}

	renderAddressContent() {
		const { selectedAddress } = this.props.stepState.stepOne;

		if (this.state.shipping.length < 1) {
			return (
				<Button block color='orange' onClick={() => this.showModalAddress('add')} >
					{T.checkout.INPUT_DELIVERY_ADDRESS} 
				</Button>
			);
		}

		return (
			<div>
				<Panel color='grey'>
					<Group>
						<Select
							block
							selectStyle='panel'
							options={this.state.shipping}
							onChange={(e) => this.setSelectedAddress(e)}
							value={selectedAddress.id}
						/>
					</Group>
					{this.renderMarkedLocationLabel()}
					{this.renderSelectedAddress()}
					<Level isMobile>
						<Level.Item>
							<div
								role='button'
								tabIndex={-1}
								className='font-orange'
								onClick={() => this.showModalAddress('edit')}
							>
								<Icon name='pencil' /> {T.checkout.CHANGE_ADDRESS}
							</div>
						</Level.Item>
						<Level.Item className='text-right'>
							<div
								role='button'
								tabIndex={-1}
								className='font-orange'
								onClick={() => this.showModalAddress('add')}
							>
								<Icon name='plus' /> {T.checkout.ADD_ADDRESS}
							</div>
						</Level.Item>
					</Level>
				</Panel>
				<Dropshipper 
					stepState={this.props.stepState} 
					onPlaceOrder={(e) => this.onPlaceOrder(e)} 
					applyState={(e) => this.props.applyState(e)} 
				/>
			</div>
		);
	}

	render() {
		return (
			<div>
				<Alert color='yellow' style={{ marginBottom: '15px', textAlign: 'center' }}>
					{T.checkout.FREE_ONGKIR_REGULATION}
				</Alert>
				{this.renderAddressContent()}
				{
					this.state.showModalAddress && 
					<ModalAddress
						open
						isEdit={this.flagModalAddress === 'edit'}
						formData={this.flagModalAddress === 'edit' && this.props.stepState.stepOne.selectedAddress}
						handleClose={() => this.hideModalAddress()}
					/>
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		addresses: state.addresses.addresses
	};
};

export default withCookies(connect(mapStateToProps)(TabAddress));
