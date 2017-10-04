import { connect } from 'react-redux';
import { actions } from '@/state/Adresses';
import _ from 'lodash';
import { withCookies } from 'react-cookie';
import React, { Component } from 'react';
import { 
	Segment,
	Alert, 
	Select, 
	InputGroup, 
	Level, 
	Tabs,
	Card,
	Icon, 
	Button 
} from '@/components';

// modal
import ModalAddress from './ModalAddress';
import Modalo2o from './Modalo2o';
import Dropshipper from './Dropshipper';
import ViewSelectedAddress from './ViewSelectedAddress';


import { Address } from '@/data';
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
			selectedAddress: {},
			shipping: [],
			toggleSelectAddress: true
		};
		this.currentAddresses = [];
		this.showModalAddress = this.showModalAddress.bind(this);
		this.cookies = this.props.cookies.get('user.token');
	}

	componentDidMount() {
		if (this.props.addresses === undefined) {
			this.constructor.fetchDataAddress(this.cookies, this.props.dispatch);
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
				info: `<strong>${value.attributes.fullname}</strong> <br />${
						value.attributes.address 
						}${value.attributes.district  
						}${value.attributes.city 
						}${value.attributes.province}`
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


	showModalo2o() {
		this.setState({ showModalo2o: !this.state.showModalo2o });
	}
	
	render() {
		const { 
			selectedAddress,
			showModalAddress,
			showModalo2o,
			shipping
		} = this.state;

		if (!this.props.addresses) {
			return null;
		}

		return (
			<Card>
				<p><strong>{T.checkout.STEP_ONE_LABEL}</strong></p>
				<Tabs tabActive={0} stretch onAfterChange={(e) => this.afterChangeTab(e)}>
					<Tabs.Panel title={T.checkout.TAB_ADDRESS_LABEL}>
						<Alert align='center' color='yellow' show >
							{T.checkout.FREE_ONGKIR_REGULATION}
						</Alert>
						{
							shipping.length > 0 ? (
								<div>
									<Segment>
										<InputGroup>
											<Select 
												filter 
												options={shipping}
												onChange={(id) => this.setSelectedAddress(id)}
												selected={this.constructor.mapSelectedAddress(this.state.selectedAddress)}
											/>
										</InputGroup>
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
										{
											<ViewSelectedAddress {...selectedAddress.attributes} />
										}
										<Level>
											<Level.Item>
												<Button 
													type='button' 
													icon='pencil' 
													iconPosition='left' 
													className='font-orange' 
													content={T.checkout.CHANGE_ADDRESS} 
													onClick={() => this.showModalAddress('edit')} 
												/>
											</Level.Item>
											<Level.Item className='text-right'>
												<Button 
													type='button' 
													icon='plus' 
													iconPosition='left' 
													className='font-orange' 
													content={T.checkout.ADD_ADDRESS}
													onClick={() => this.showModalAddress('add')} 
												/>
											</Level.Item>
										</Level>
									</Segment>
									<Dropshipper />
								</div>		
							) : (
								<Button 
									block 
									outline 
									type='button' 
									color='orange' 
									content={T.checkout.INPUT_DELIVERY_ADDRESS} 
									onClick={() => this.showModalAddress('add')} 
								/>
							)
						}
					</Tabs.Panel>
					<Tabs.Panel title={T.checkout.TAB_ELOCKER_LABEL}>
						<Alert align='center' color='yellow' show >
							{T.checkout.REGULATION}
						</Alert>
						{
							this.props.latesto2o.length > 0 && (
								<div>
									<Alert close icon='ban' align='left' color='red' show >
										{T.checkout.ONE_OR_MORE_PRODUCT_NOT_SUPPORTED}
									</Alert>
									<Segment className='customSelectO2OWrapper'>
										<InputGroup>
											<Select options={Address} />
										</InputGroup>
										<p><strong>Aufar Syahdan</strong> </p>
										<p>
											Jl. Bangka II No.20 Rt.10/05 <br />
											Mampang Prapatan <br />
											Jakarta Selatan, DKI Jakarta, 12720 <br />
											Telepon: 08568052187
										</p>
										<Level>
											<Level.Item className='text-right'>
												<Button 
													type='button' 
													icon='plus' 
													iconPosition='left' 
													className='font-orange' 
													content={T.checkout.ADD_ADDRESS} 
													onClick={() => this.showModalo2o()} 
												/>
											</Level.Item>
										</Level>
									</Segment>
								</div>
							)
						}
						{
							this.props.latesto2o.length < 1 && this.props.isPickupable === '1' && (
								<InputGroup>
									<Button 
										block 
										outline 
										type='button' 
										color='orange' 
										content={T.checkout.CHOOSE_STORE} 
										onClick={() => this.showModalo2o()} 
									/>
								</InputGroup>
							)
						}
						{
							this.props.isPickupable === '0' && (
								<p className='font-red'>{T.checkout.ONE_OR_MORE_PRODUCT_NOT_SUPPORTED}</p>
							)
						}
					</Tabs.Panel>
				</Tabs>
				{
					showModalAddress && (
						<ModalAddress 
							formData={this.flagModalAddress === 'edit' ? selectedAddress : null}
							handleClose={() => this.hideModalAddress()} 
						/>
					)
				}
				{
					showModalo2o && (
						<Modalo2o handleClose={() => this.showModalo2o()} />
					)
				}
			</Card>
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

