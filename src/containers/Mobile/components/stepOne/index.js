import { connect } from 'react-redux';
import { actions } from '@/state/Adresses';
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
	Message
} from 'mm-ui';


// modal
import ModalAddress from './ModalAddress';
import ModalChooseAddress from './ModalChooseAddress';
import Modalo2o from './Modalo2o';
// import Dropshipper from './Dropshipper';
import ViewSelectedAddress from './ViewSelectedAddress';


import styles from '../../mobile.scss';

// import { Address } from '@/data';
import { T } from '@/data/translations';

class stepOne extends Component {

	static fetchDataAddress(token, dispatch) {
		dispatch(new actions.getAddresses(token));
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
			shipping: [],
			toggleSelectAddress: true
		};
		this.currentAddresses = [];
		this.cookies = this.props.cookies.get('user.token');
	}

	componentDidMount() {
		if (this.props.addresses === undefined) {
			this.constructor.fetchDataAddress(this.cookies, this.props.dispatch);
		} else {
			this.setShipping(this.props.addresses);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.shipping.length < 1 || this.props.addresses !== nextProps.addresses) {
			if (!_.isEmpty(nextProps.addresses)) {
				this.setShipping(nextProps.addresses);
			}
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
		console.log(newSelectedAddress);
		this.saveSelectedAddress(newSelectedAddress);
		this.setState({
			selectedAddress: newSelectedAddress
		});
		this.toggleChooseAddressModal();
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
	}

	saveSelectedAddress(selectedAddress) {
		const { stepState } = this.props;
		const checkoutState = {
			...stepState,
			stepOne: {
				...stepState.stepOne,
				selectedAddress
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
										<Message color='grey'>
											<Group>
												<Button onClick={() => this.toggleChooseAddressModal()} block>
													<Level>
														<Level.Left>{selectedAddress.attributes.addressLabel}</Level.Left>
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
										</Message>
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
							<Alert color='yellow' style={{ marginBottom: '15px' }}>{T.checkout.REGULATION}</Alert>
							<Alert close icon='ban' color='red' style={{ marginBottom: '15px' }}>{T.checkout.ONE_OR_MORE_PRODUCT_NOT_SUPPORTED}</Alert>
							<Message className='customSelectO2OWrapper'>
								<Group>
									<Button 
										block 
										onClick={() => this.toggleModalo2o()}
									>
										<Level>
											<Level.Left>o2o</Level.Left>
											<Level.Right><Icon name='angle-down' /></Level.Right>
										</Level>
									</Button>
								</Group>
								<p><strong>Aufar Syahdan</strong> </p>
								<p>
									Jl. Bangka II No.20 Rt.10/05 <br />
									Mampang Prapatan <br />
									Jakarta Selatan, DKI Jakarta, 12720 <br />
									Telepon: 08568052187
								</p>
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
							</Message>
						</Tabs.Content>
					</Tabs.Tab>
				</Tabs>
				{
					showModalAddress && 
					<ModalAddress 
						open
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
						selectedAddressO2O={selectedAddress}
						onChange={(e) => console.log(e)}
					/>
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		addresses: state.addresses.addresses,
		isPickupable: state.cart.isPickupable,
		listo2o: state.addresses.o2o,
		latesto2o: state.addresses.latesto2o,
		o2oProvinces: state.addresses.o2oProvinces
	};
};

export default withCookies(connect(mapStateToProps)(stepOne));

