import { connect } from 'react-redux';
import { actions } from '@/state/Adresses';
import { actions as cartActions } from '@/state/Cart';
import { actions as paymentActions } from '@/state/Payment';
import _ from 'lodash';
import { withCookies } from 'react-cookie';
import React, { Component } from 'react';
import {
	Button,
	Level,
	Tabs,
	Icon,
	Group,
	Alert,
	Panel
} from 'mm-ui';


// modal
import ModalAddress from './ModalAddress';
import ModalChooseAddress from './ModalChooseAddress';
import Modalo2o from './Modalo2o';
import Dropshipper from './Dropshipper';
import ViewSelectedAddress from './ViewSelectedAddress';


import styles from '../../mobile.scss';

// import { Address } from '@/data';
import { T } from '@/data/translations';

class stepOne extends Component {

	static fetchDataAddress(token, dispatch) {
		dispatch(new actions.getAddresses(token));
	}

	static fetchDataO2o(token, dispatch, provinceId) {
		dispatch(new actions.getO2OList(token, provinceId));
	}

	static placeOrder(token, dispatch, selectedAddress, billing) {
		dispatch(new cartActions.getPlaceOrderCart(token, selectedAddress, billing));
	}

	static mapSelectedAddress(selectedAddress) {
		if (selectedAddress) {
			return {
				label: selectedAddress.attributes.addressLabel,
				value: selectedAddress.id
			};
		}
		return null;
	}

	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			showModalAddress: false,
			showModalo2o: false,
			showModalChooseAddress: false,
			selectedAddress: {},
			selectedAddressO2O: {},
			selectedProvinceO2O: null,
			shipping: [],
			toggleSelectAddress: true
		};
		this.currentAddresses = [];
		this.cookies = this.props.cookies.get('user.token');
	}

	componentWillMount() {
		const checkoutState = {
			...this.props.stepState,
			stepOne: {
				...this.props.stepState.stepOne,
				funcShowModalAddress: (e) => this.showModalAddress(e)
			}
		};
		this.props.applyState(checkoutState);
	}

	componentDidMount() {
		if (typeof this.props.addresses === 'undefined') {
			this.constructor.fetchDataAddress(this.cookies, this.props.dispatch);
		} else {
			this.setShipping(this.props.addresses);
		}
	}

	componentWillReceiveProps(nextProps) {
		// set default elocker
		if (!nextProps.stepState.stepOne.selectedAddressO2O && nextProps.latesto2o && nextProps.latesto2o.length > 0) {
			const checkoutState = this.setStateDefaultElocker(nextProps.stepState, nextProps.latesto2o);
			this.props.applyState(checkoutState);
		}
		
		if (this.state.shipping.length < 1 || this.props.addresses !== nextProps.addresses) {
			if (!_.isEmpty(nextProps.addresses)) {
				this.setShipping(nextProps.addresses);
			}
		}
		
		if (this.props.stepState.stepOne.dropshipper.checked !== nextProps.stepState.stepOne.dropshipper.checked) {
			this.onPlaceOrder(nextProps.stepState.stepOne.selectedAddress, nextProps.stepState.stepOne.dropshipper);
		}
		
		const changeTab = this.props.stepState.stepOne !== nextProps.stepState.stepOne;
		if (this.props.cart !== nextProps.cart || this.props.error !== nextProps.error || changeTab) {
			this.checkAllowedPayment(nextProps.stepState.stepOne.selectedAddress, nextProps);
		}

		if (this.props.stepState.stepOne.selectedAddress !== nextProps.stepState.stepOne.selectedAddress) {
			// fetch data cart when selectedAddress change
			this.onPlaceOrder(nextProps.stepState.stepOne.selectedAddress, nextProps.stepState.stepOne.dropshipper);
		}
	}

	onPlaceOrder(address, dropshipper = null) {
		// handle dropshipper
		if (!dropshipper) {
			dropshipper = this.props.stepState.stepOne.dropshipper;
		}
		address.attributes.is_dropshipper = dropshipper.checked;
		if (dropshipper.checked) {
			address.attributes.dropship_name = dropshipper.name;
			address.attributes.dropship_phone = dropshipper.phone;
		}
		
		// handle o2o
		if (address.type !== 'shipping') {
			// set type pickup for O2O
			address.type = 'pickup';
			address.attributes.is_dropshipper = false;
		}
		const billing = this.props.billing && this.props.billing.length > 0 ? this.props.billing[0] : false;
		
		this.constructor.placeOrder(this.cookies, this.props.dispatch, address, billing);
		this.setBillingNumber(address);
	}
	
	setBillingNumber(address) {
		const { payments, dispatch } = this.props;
		if (payments && !payments.billingPhoneNumberEdited) {
			const billing = this.props.stepState.stepOne.activeTab < 1 ? address.attributes.phone : '';
			dispatch(new paymentActions.changeBillingNumber(billing));
		}
	}

	setShipping(addresses) {
		this.currentAddresses = addresses;
		const shipping = [];
		addresses.map((value, index) => (
			shipping.push({
				value: value.id,
				label: !value.attributes.addressLabel ? value.attributes.fullname : value.attributes.addressLabel,
				info:	`<p><strong>${value.attributes.fullname}</strong></p>
						<div>${value.attributes.address}</div>
						<div>${value.attributes.district}</div>
						<div>${value.attributes.city}</div>
						<div>${value.attributes.province}</div>
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
		this.toggleChooseAddressModal();
	}

	setSelectedAddressO2O(selectedAddressO2O, selectedProvinceO2O) {
		this.saveSelectedAddress(selectedAddressO2O, 'selectedAddressO2O');
		this.setState({
			selectedAddressO2O,
			selectedProvinceO2O
		});
		this.toggleModalo2o();
		this.onPlaceOrder(selectedAddressO2O);
	}
	
	setStateDefaultElocker(stepState, latesto2o) {
		// set default elocker
		if (!stepState.stepOne.selectedAddressO2O && latesto2o && latesto2o.length > 0) {
			stepState = {
				...stepState,
				stepOne: {
					...stepState.stepOne,
					selectedAddressO2O: latesto2o[0]
				}
			};
			this.setState({
				selectedAddressO2O: latesto2o[0]
			});
		}
		return stepState;
	}

	checkAllowedPayment(selectedAddress, nextProps) {
		const { cart, stepState, isPickupable } = nextProps;
		const activeTab = stepState.stepOne.activeTab;
		
		// for jabodetabek item only 
		const jabotabekRestrictedCart = cart.filter((e) => {
			return e.store.products[0].fgLocation === '1';
		});
		const emptyShipping = activeTab === 0 && !selectedAddress.id;
		const notAlowedShipping = (jabotabekRestrictedCart.length > 0 && selectedAddress.attributes.isJabodetabekArea === '0') || emptyShipping;

		// for o2o item only 
		const o2oRestrictedCart = cart.filter((e) => {
			return isPickupable === '0' && !e.store.shipping.o2oSupported && activeTab === 1;
		});
		const emptyShippingO2o = activeTab === 1 && !nextProps.stepState.stepOne.selectedAddressO2O;
		const restriction = o2oRestrictedCart.length > 0 && activeTab === 1;
		const notAllowedO2o = (isPickupable === '0' && restriction) || emptyShippingO2o;

		// set disabled payment
		const checkoutState = {
			...stepState,
			stepFour: {
				...stepState.stepFour,
				disable: notAlowedShipping || notAllowedO2o
			},
			stepThree: {
				...stepState.stepThree,
				disable: notAlowedShipping || notAllowedO2o
			},
			stepTwo: {
				...stepState.stepTwo,
				disable: emptyShipping || (restriction ? !restriction : emptyShippingO2o)
			},
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

	afterChangeTab(event) {
		const { stepState } = this.props;
		const checkoutState = {
			...stepState,
			stepOne: {
				...stepState.stepOne,
				activeTab: event
			}
		};
		this.props.applyState(checkoutState);
		// Event 0 = shipping, 1 = O2O
		const selected = event > 0 ? this.state.selectedAddressO2O : this.state.selectedAddress;
		if (typeof selected.id !== 'undefined') {
			this.onPlaceOrder(selected);
		}
	}

	saveSelectedAddress(selectedAddress, selectedAddressType = 'selectedAddress') {
		let { stepState } = this.props;
		stepState = this.setStateDefaultElocker(stepState, this.props.latesto2o);
		
		const checkoutState = {
			...stepState,
			stepOne: {
				...stepState.stepOne,
				[selectedAddressType]: selectedAddress
			}
		};
		this.props.applyState(checkoutState);
	}

	toggleModalo2o() {
		this.setState({ showModalo2o: !this.state.showModalo2o });
	}

	toggleChooseAddressModal() {
		this.setState({
			showModalChooseAddress: !this.state.showModalChooseAddress
		});
	}

	render() {
		const {
			selectedAddress,
			selectedAddressO2O,
			selectedProvinceO2O,
			showModalAddress,
			showModalo2o,
			showModalChooseAddress,
			shipping
		} = this.state;

		if (!this.props.addresses) {
			return null;
		}

		return (
			<div className={styles.card}>
				<p><strong>{T.checkout.STEP_ONE_LABEL}</strong></p>
				<Tabs onAfterChange={(e) => this.afterChangeTab(e)}>
					<Tabs.Tab>
						<Tabs.Title>{T.checkout.TAB_ADDRESS_LABEL}</Tabs.Title>
						<Tabs.Content>
							<Alert color='yellow' style={{ marginBottom: '15px' }}>
								{T.checkout.FREE_ONGKIR_REGULATION}
							</Alert>
							{
								shipping.length > 0 ? (
									<div>
										<Panel color='grey'>
											<Group>
												<Button onClick={() => this.toggleChooseAddressModal()} block>
													<Level>
														<Level.Left className={styles.elipsis}>{selectedAddress.attributes.addressLabel}</Level.Left>
														<Level.Right><Icon name='angle-down' /></Level.Right>
													</Level>
												</Button>
											</Group>
											{
												selectedAddress.attributes.latitude
												&& selectedAddress.attributes.longitude && (
													<Level>
														<Level.Item className='text-right'>
															<div>
																<Icon name='map-marker' /> &nbsp; {T.checkout.LOCATION_MARKED}
															</div>
														</Level.Item>
													</Level>
												)
											}
											<ViewSelectedAddress {...selectedAddress.attributes} />
											<Level>
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
										<Dropshipper stepState={this.props.stepState} onPlaceOrder={(e) => this.onPlaceOrder(e)} applyState={(e) => this.props.applyState(e)} />
									</div>
								) : (
									<Button
										block
										color='orange'
										onClick={() => this.showModalAddress('add')}
									>{T.checkout.INPUT_DELIVERY_ADDRESS} </Button>
								)
							}
						</Tabs.Content>
					</Tabs.Tab>
					<Tabs.Tab>
						<Tabs.Title>{T.checkout.TAB_ELOCKER_LABEL}</Tabs.Title>
						<Tabs.Content>
							<Alert color='yellow' style={{ marginBottom: '15px' }} safeHtml={T.checkout.REGULATION} />
							{
								this.props.isPickupable !== '1' && (
									<Alert close icon='ban' color='red' style={{ marginBottom: '15px' }} safeHtml={T.checkout.ONE_OR_MORE_PRODUCT_NOT_SUPPORTED} />
								)
							}
							{
								(selectedAddressO2O.attributes && this.props.isPickupable === '1') && (
								<Panel className='customSelectO2OWrapper'>
									<Group>
										<Button 
											block 
											onClick={() => this.toggleModalo2o()}
										>
											<Level>
												<Level.Left className={styles.elipsis}>{selectedAddressO2O.attributes.address_label}</Level.Left>
												<Level.Right><Icon name='angle-down' /></Level.Right>
											</Level>
										</Button>
									</Group>
									<p><strong>{selectedAddressO2O.attributes.address_label}</strong> </p>
									<p>{selectedAddressO2O.attributes.address}</p>
									<Level>
										<Level.Item className='text-right'>
											<div
												role='button'
												tabIndex={-1}
												className='font-orange'
												onClick={() => this.toggleModalo2o()} 
											>
												<Icon name='plus' /> {T.checkout.ADD_ADDRESS}
											</div>
										</Level.Item>
									</Level>
								</Panel>)
							}
							{
								this.props.latesto2o.length < 1 && this.props.isPickupable === '1' && !selectedAddressO2O.attributes && (
									<Panel className='customSelectO2OWrapper'>
										<Group>
											<Button block onClick={() => this.toggleModalo2o()}>
												<Level>
													<Level.Left className={styles.elipsis}>{T.checkout.CHOOSE_STORE}</Level.Left>
													<Level.Right><Icon name='angle-down' /></Level.Right>
												</Level>
											</Button>
										</Group>
									</Panel>
								)
							}
						</Tabs.Content>
					</Tabs.Tab>
				</Tabs>
				{
					showModalAddress &&
					<ModalAddress
						open
						isEdit={this.flagModalAddress === 'edit'}
						formData={this.flagModalAddress === 'edit' && selectedAddress}
						handleClose={() => this.hideModalAddress()}
					/>
				}
				{
					showModalChooseAddress &&
					<ModalChooseAddress
						open
						address={this.state.shipping}
						selectedAddress={selectedAddress}
						handleClose={() => this.toggleChooseAddressModal()}
						onChange={(e) => this.setSelectedAddress(e)}
					/>
				}
				{
					showModalo2o &&
					<Modalo2o
						open
						o2oProvinces={this.props.o2oProvinces}
						handleClose={() => this.toggleModalo2o()}
						selectedAddressO2O={selectedAddressO2O}
						selectedProvinceO2O={selectedProvinceO2O}
						onChange={(e, p) => this.setSelectedAddressO2O(e, p)}
					/>
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		addresses: state.addresses.addresses,
		billing: state.addresses.billing,
		isPickupable: state.cart.isPickupable,
		listo2o: state.addresses.o2o,
		latesto2o: state.addresses.latesto2o,
		o2oProvinces: state.addresses.o2oProvinces,
		error: state.cart.error,
		cart: state.cart.data,
		payments: state.payments,
	};
};

export default withCookies(connect(mapStateToProps)(stepOne));

