import { connect } from 'react-redux';
import { actions } from '@/state/Adresses';
import { actions as cartActions } from '@/state/Cart';
import { actions as paymentActions } from '@/state/Payment';
import _ from 'lodash';
import { withCookies } from 'react-cookie';
import React, { Component } from 'react';
import {
	Tabs,
} from 'mm-ui';


// modal
import ModalAddress from './ModalAddress';
import ModalChooseAddress from './ModalChooseAddress';
import Modalo2o from './Modalo2o';
// import Dropshipper from './Dropshipper';
import TabAddress from './TabAddress';
import TabO2O from './TabO2O';
// import ViewSelectedAddress from './ViewSelectedAddress';


import styles from '../../page.scss';

// import { Address } from '@/data';
import { T } from '@/data/translations';
import { setUserGTM, pushDataLayer } from '@/utils/gtm';
import { getRefreshToken } from '@/state/Auth/actions';
import { getUser } from '@/state/User/actions';

class stepOne extends Component {

	static fetchDataAddress(userToken, userRFToken, dispatch) {
		dispatch(new actions.getAddresses(userToken))
		.catch(error => {
			if (error.response.data.code === 405) {
				dispatch(getRefreshToken({
					userToken,
					userRFToken
				})).then((response) => {
					dispatch(new actions.getAddresses(response.userToken));
				});
			}
		});
	}

	static placeOrder(userToken, userRFToken, dispatch, selectedAddress, billing) {
		dispatch(new cartActions.getPlaceOrderCart(userToken, selectedAddress, billing))
		.catch(error => {
			if (error.response.data.code === 405) {
				dispatch(getRefreshToken({
					userToken,
					userRFToken
				})).then((response) => {
					dispatch(new cartActions.getPlaceOrderCart(response.userToken, selectedAddress, billing));
				});
			}
		});
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
		this.userCookies = this.props.cookies.get('user.token');
		this.userRFCookies = this.props.cookies.get('user.rf.token');
		this.source = this.props.cookies.get('user.source');
		this.tabIndex = 0;
		
	}

	componentWillMount() {
		const { dispatch } = this.props;
		dispatch(getRefreshToken({
			userToken: this.props.cookies.get('user.token'),
			userRFToken: this.props.cookies.get('user.rf.token')
		})).then((response) => {
			const currentDate = new Date();
			currentDate.setDate(currentDate.getDate() + (2 * 365));
			this.props.cookies.set('user.exp', Number(response.expToken), { domain: process.env.SESSION_DOMAIN, expires: currentDate });
			this.props.cookies.set('user.rf.token', response.userRFToken, { domain: process.env.SESSION_DOMAIN, expires: currentDate });
			this.props.cookies.set('user.token', response.userToken, { domain: process.env.SESSION_DOMAIN, expires: currentDate });
		});
		dispatch(getUser(this.props.cookies.get('user.token')));
	}
	
	componentDidMount() {
		if (this.props.addresses === undefined) {
			this.constructor.fetchDataAddress(this.userCookies, this.userRFCookies, this.props.dispatch);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.userGTM !== nextProps.userGTM) {
			setUserGTM(nextProps.userGTM);
		}

		const changeTab = this.props.stepState.stepOne !== nextProps.stepState.stepOne;
		if (this.props.cart !== nextProps.cart || this.props.error !== nextProps.error || changeTab) {
			this.checkAllowedPayment(nextProps.stepState.stepOne.selectedAddress, nextProps);
		}
	}

	onPlaceOrder(address) {
		const billing = this.props.billing && this.props.billing.length > 0 ? this.props.billing[0] : false;
		this.constructor.placeOrder(this.userCookies, this.userRFCookies, this.props.dispatch, address, billing);
		this.setBillingNumber(address);
	}
	
	setBillingNumber(address) {
		const { dispatch } = this.props;
		const billing = this.tabIndex < 1 ? address.attributes.phone : '';
		dispatch(new paymentActions.changeBillingNumber(billing));
	}

	setSelectedAddress(selected) {
		const newSelectedAddress = _.find(this.currentAddresses, { id: selected.value });
		this.saveSelectedAddress(newSelectedAddress);
		this.setState({
			selectedAddress: newSelectedAddress
		});
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
		const notAlowedShipping = (activeTab === 0 && jabotabekRestrictedCart.length > 0 && selectedAddress.attributes.isJabodetabekArea === '0') || emptyShipping;

		// for o2o item only 
		const o2oRestrictedCart = cart.filter((e) => {
			const notSupportedProducts = e.store.products.filter(p => p.o2o_supported === '0');
			return (isPickupable === '0' && !e.store.shipping.o2oSupported && activeTab === 1) || notSupportedProducts.length > 0;
		});
		const emptyShippingO2o = activeTab === 1 && !nextProps.stepState.stepOne.selectedAddressO2O;
		const restriction = o2oRestrictedCart.length > 0 && activeTab === 1;
		const notAllowedO2o = (activeTab === 1 && isPickupable === '0' && restriction) || emptyShippingO2o;

		// set disabled payment
		const checkoutState = {
			...stepState,
			stepFour: {
				...stepState.stepFour,
				disabled: notAlowedShipping || notAllowedO2o,
			},
			stepThree: {
				...stepState.stepThree,
				disabled: notAlowedShipping || notAllowedO2o,
			},
			stepTwo: {
				...stepState.stepTwo,
				disabled: emptyShipping || (restriction ? !restriction : emptyShippingO2o)
			},
		};
		this.props.applyState(checkoutState);
	}

	showModalAddress(type) {
		this.flagModalAddress = type;
		this.setState({ showModalAddress: true });
		if (type === 'add') {
			pushDataLayer('checkout', 'checkout', { step: 1, option: this.source ? this.source.split('+').join(' ') : '' }, this.props.products);
		}
	}

	hideModalAddress() {
		this.flagModalAddress = '';
		this.setState({ showModalAddress: false });
	}

	afterChangeTab(event) {
		// Event 0 = shipping, 1 = O2O
		this.tabIndex = event;		
		const { stepState } = this.props;
		const checkoutState = {
			...stepState,
			stepOne: {
				...stepState.stepOne,
				activeTab: event
			}
		};
		this.props.applyState(checkoutState);
		const selected = event > 0 ? this.state.selectedAddressO2O : this.state.selectedAddress;
		if (typeof selected.id !== 'undefined') {
			this.onPlaceOrder(selected);
		}
		pushDataLayer('checkout', 'checkout', { step: 2, option: event > 0 ? 'Pickup' : 'Delivery' }, this.props.products);
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
			// shipping
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
							<TabAddress
								applyState={this.props.applyState}
								stepState={this.props.stepState}
								onPlaceOrder={(address) => this.onPlaceOrder(address)}
							/>
						</Tabs.Content>
					</Tabs.Tab>
					<Tabs.Tab>
						<Tabs.Title>{T.checkout.TAB_ELOCKER_LABEL}</Tabs.Title>
						<Tabs.Content>
							<TabO2O
								applyState={this.props.applyState}
								stepState={this.props.stepState}
								onPlaceOrder={(address) => this.onPlaceOrder(address)}
							/>
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
		userGTM: state.user.userGTM,
		products: state.cart.products,
	};
};

export default withCookies(connect(mapStateToProps)(stepOne));

