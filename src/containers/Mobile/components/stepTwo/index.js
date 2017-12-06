import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '@/state/Cart';
import { withCookies } from 'react-cookie';
import { T } from '@/data/translations';
import Tooltip from '@/containers/Mobile/components/shared/Tooltip';
import {
	Panel,
	Level,
	Icon
} from 'mm-ui';
import StoreBoxBody from './StoreBoxBody';
import StoreBoxFooter from './StoreBoxFooter';

import styles from '../../mobile.scss';

class StepTwo extends Component {
	
	static fetchDataCart(token, dispatch) {
		dispatch(new actions.getCart(token));
	}

	constructor(props) {
		super(props);
		this.props = props;
		this.cookies = this.props.cookies.get('user.token');
		this.loadCart = false;
		this.state = {
			showGosendTooltip: false
		};
	}

	componentWillMount() {
		if (typeof this.props.cart === 'undefined') {
			// get initial cart data
			this.constructor.fetchDataCart(this.cookies, this.props.dispatch);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (
			!this.loadCart
		) {
			this.constructor.fetchDataCart(this.cookies, nextProps.dispatch);
			this.loadCart = true;
		}
	}

	onCloseGosendTooltip() {
		this.setState({
			showGosendTooltip: false
		});
	}

	onShowGosendTooltip() {
		this.setState({
			showGosendTooltip: true
		});
	}

	checkRestrictO2o(o2oSupported) {
		const { isPickupable, stepState } = this.props;
		return isPickupable === '0' && o2oSupported && stepState.stepOne.activeTab === 1;
	}

	checkJabotabekItem(fgLocation) {
		const { stepOne } = this.props.stepState;
		const { selectedAddress } = stepOne;
		const isCurrentAddressJabotabek = selectedAddress && (typeof selectedAddress.attributes !== 'undefined' && selectedAddress.attributes.isJabodetabekArea === '1');
		return fgLocation === '1' && stepOne.activeTab === 0 && !isCurrentAddressJabotabek;
	}

	updateShippingMethodGosend(checked, store) {
		const methodId = checked ? '19' : '';
		this.props.dispatch(new actions.updateGosend(this.cookies, store.id, methodId, { soNumber: this.props.soNumber }));
	}

	updateQty(qty, productId) {
		if (qty !== '') { 
			const { soNumber, dispatch } = this.props;
			if (soNumber) {
				dispatch(new actions.updateQtyCart(this.cookies, qty, productId, { soNumber }));
			} else {
				dispatch(new actions.updateCartWithoutSO(this.cookies, qty, productId));
			}
		}
	}

	saveDisabledPayment(disabled) {
		const { stepState } = this.props;
		const checkoutState = {
			...stepState,
			stepFour: {
				...stepState.stepFour,
				disabled
			}
		};
		this.props.applyState(checkoutState);
	}

	saveLoading(loading) {
		const { stepState } = this.props;
		const checkoutState = {
			...stepState,
			stepTwo: {
				...stepState.stepTwo,
				loading
			}
		};
		this.props.applyState(checkoutState);
	}

	createClassCard() {
		return [
			styles.card, 
			this.props.loading ? styles.loading : '',
			this.props.disabled ? styles.disabled : ''
		].join(' ').trim();
	}

	render() {
		const { stepOne } = this.props.stepState;
		return (
			<div className={this.createClassCard()}>
				<p><strong>{T.checkout.STEP_TWO_LABEL}</strong><span> ({this.props.totalItems} items)</span></p>
				{
					this.props.cart.map((storeData, indexStoreBox) => {
						const isRestrictO2O = this.checkRestrictO2o(!storeData.store.shipping.o2oSupported);
						const isJabotabekItem = this.checkJabotabekItem(storeData.store.products[0].fgLocation);
						return (
							<Panel
								key={indexStoreBox}
								color={isRestrictO2O || isJabotabekItem ? 'red' : 'grey'}
								header={
									<Level>
										<Level.Left>{storeData.store.name}</Level.Left>
										<Level.Right>{storeData.store.location && <div><Icon name='map-marker' /> {storeData.store.location}</div>}</Level.Right>
									</Level>
								}
							>
								{
									isJabotabekItem && (<div className='font-red' style={{ marginBottom: '15px' }}>
										{T.checkout.JABODETABEK_LABEL}
									</div>)
								}
								<StoreBoxBody 
									products={storeData.store.products}
									stepOneActiveTab={stepOne.activeTab}
									onUpdateQty={(e, productId) => this.updateQty(e, productId)}
									showBtnDelete={!(this.props.cart.length < 2 && storeData.store.products.length < 2)}
								/>
								<StoreBoxFooter 
									stepOneActiveTab={stepOne.activeTab}
									selectedAddress={stepOne.selectedAddress}
									showEditAddressModal={typeof stepOne.funcShowModalAddress === 'function' && stepOne.funcShowModalAddress}
									checkGosendMethod={(checked, store) => this.updateShippingMethodGosend(checked, store)}
									isRestrictO2O={isRestrictO2O}
									isJabotabekItem={isJabotabekItem}
									data={storeData} 
									shippingDefault={!this.props.stepState.stepFour.disabled}
									gosendInfo={this.props.gosendInfo}
									onShowGosendTooltip={(e) => this.onShowGosendTooltip()}
								/>
								{
									this.state.showGosendTooltip && typeof this.props.gosendInfo !== 'undefined' && this.props.gosendInfo.length > 0 && (
										<Tooltip 
											show 
											content={this.props.gosendInfo.length > 1 ? this.props.gosendInfo[1] : this.props.gosendInfo[0]} 
											onClose={(e) => this.onCloseGosendTooltip()}
										/>
									)
								}
							</Panel>
						);
					})
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		addresses: state.addresses.addresses,
		billing: state.addresses.billing,
		cart: state.cart.data,
		soNumber: state.cart.soNumber,
		isPickupable: state.cart.isPickupable,
		loading: state.cart.loading,
		totalItems: state.cart.totalItems,
		gosendInfo: state.cart.gosendInfo,
	};
};

export default withCookies(connect(mapStateToProps)(StepTwo));
