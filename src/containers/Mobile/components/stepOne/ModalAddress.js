import { connect } from 'react-redux';
import _ from 'lodash';
import { actions } from '@/state/Adresses';
import { withCookies } from 'react-cookie';
import React, { Component } from 'react';
import { Validator } from 'ree-validate';
import Gosend from '@/components/Views/Gosend/Gosend.Mobile.js';
import { 
	Modal, 
	Textarea, 
	Segment,
	Input, 
	Alert, 
	Select, 
	InputGroup, 
	Level, 
	Icon, 
	Button 
} from '@/components';
import { T } from '@/data/translations';
import { Polygon } from '@/data/polygons';

class ModalAddress extends Component {

	static fetchGetCityProvince(token, dispatch) {
		dispatch(new actions.getCityProvince(token));
	}
	
	static fetchGetDistric(token, province, dispatch) {
		dispatch(new actions.getDistrict(token, province));
	}

	constructor(props) {
		super(props);
		this.props = props;
		this.validator = new Validator({
			address_label: 'required',
			fullname: 'required',
			phone: 'required|min:6|max:14|regex:^([0-9]+)$',
			province: 'required',
			kecamatan: 'required',
			zipcode: 'required|min:5',
			address: 'required',
			id: 'min:1',
			isEdit: 'min:1',
			longitude: 'min:1',
			latitude: 'min:1'
		});

		this.state = {
			isJakarta: false,
			selected: {
				province: {},
				district: {}
			},
			formData: {},
			show: false,
			errors: this.validator.errorBag,
			overflow: false,
			formattedAddress: null
		};
		this.onChangeProvince = this.onChangeProvince.bind(this);
		this.onChangeInput = this.onChangeInput.bind(this);
		this.translateProvince = this.translateProvince.bind(this);
		this.setFormData = this.setFormData.bind(this);
		this.cookies = this.props.cookies.get('user.token');
		this.isEdit = !!this.props.formData;
	}

	componentWillMount() {
		if (this.props.address.cityProv === undefined) {
			this.constructor.fetchGetCityProvince(this.cookies, this.props.dispatch);
		}
		setTimeout(() => { this.toggleShow(); }, 20);
	}

	componentDidMount() {
		if (this.isEdit) {
			this.translateProvince(this.props.formData.attributes);
			this.setFormData(this.props.formData);
		}
	}
	
	componentWillReceiveProps(nextProps) {
		if (this.props.formData !== nextProps.formData) {
			this.translateProvince(nextProps.formData.attributes);
			if (this.isEdit) {
				this.setFormData(nextProps.formData);
			}
		}
	}

	onChangeProvince(e) {
		if (e.name === 'province') {
			this.constructor.fetchGetDistric(this.cookies, e.value, this.props.dispatch);
			const isJakarta = e.value.toLowerCase().includes('jakarta');
			this.setState({ isJakarta });
			this.setStateFormData(e.name, e.value);
			this.setStateFormData('kecamatan', null);
		} else {
			this.setStateFormData(e.name, e.value);
		}
	}

	onChangeInput(e) {
		this.setStateFormData(e.target.name, e.target.value);
	}

	setStateFormData(name, value) {
		const formData = {
			...this.state.formData,
			[name]: value
		};
		this.setState({ formData });
	}
	
	setFormData(data) {
		const formData = {
			id: data.id,
			address_label: data.attributes.addressLabel,
			fullname: data.attributes.fullname,
			address: data.attributes.address,
			province: `${data.attributes.city}, ${data.attributes.province}`,
			kecamatan: data.attributes.district,
			zipcode: data.attributes.zipcode,
			phone: data.attributes.phone,
			latitude: data.attributes.latitude || null,
			longitude: data.attributes.longitude || null,
			isEdit: this.isEdit
		};
		this.setState({ formData });
	}
	
	setErrors(name, value) {
		const { formData } = this.state;
		formData[name] = value;
		this.validator.validate(name, value).then(() => {
			const { errorBag } = this.validator;
			this.setState({ 
				errors: errorBag, formData 
			});
		});
	}

	translateProvince(formDataAttributes) {
		const { city, district, province } = formDataAttributes;
		if (city && district) {
			const stateProvince = {
				province: {
					label: `${city}, ${province}`,
					value: `${city}, ${province}`
				},
				district: {
					label: `${district}`,
					value: `${district}`
				}
			};
			this.setState({ selected: stateProvince });
			this.constructor.fetchGetDistric(this.cookies, stateProvince.province.value, this.props.dispatch);
		}
	}

	hideModalAddress() {
		this.setState({ 
			show: false 
		});
		this.props.handleClose(false);
	}

	validateAndSubmit(e) {
		e.preventDefault();
		const { formData } = this.state;
		this.validator.validateAll(formData).then(success => {
			if (success) {
				const mappingData = {
					id: formData.id,
					name: formData.address_label,
					penerima: formData.fullname,
					address: formData.address,
					provinsi: formData.province,
					kecamatan: formData.kecamatan,
					kodepos: formData.zipcode,
					no_hp: formData.phone,
					longitude: formData.longitude,
					latitude: formData.latitude,
					isEdit: this.isEdit
				};
				this.props.dispatch(new actions.saveAddress(this.cookies, mappingData, this.props.formData));
			} else {
				Object.keys(formData).forEach((key) => {
					this.setErrors(key, this.state.formData[key]);
				});
			}
		});
	}

	selectedPinPoint(data) {
		this.setState({
			formattedAddress: data.formattedAddress,
			showMap: false
		});
	}

	toggleOverflowModal(e) {
		document.querySelectorAll('.modalAddress')[0].scrollTop = 0;
		setTimeout(() => { this.setState({ overflow: e }); }, 50);
	}
	
	toggleShow() {
		this.setState({ show: !this.state.show });
	}

	toggleMap() {
		this.setState({ showMap: !this.state.showMap });
	}
	
	render() {
		const { 
			formData,
			address,
			show
		} = this.props;

		const {
			errors,
			selected,
			overflow
		} = this.state;

		const defaultSelected = (selectedData, defaultOption) => {
			return 	_.isEmpty(selectedData) ? defaultOption : selectedData;
		};

		return (
			<Modal 
				close
				size='medium'
				show={show}
				className='modalAddress'
				loading
				disableOverflow={overflow} 
				ref={(e) => { this.el = e; }} 
				handleClose={() => this.hideModalAddress()} 
			>
				<Modal.Header>
					<div>{T.checkout.CREATE_NEW_ADDRESS}</div>
				</Modal.Header>
				<Modal.Body>
					<InputGroup>
						<Input 
							label='Simpan Sebagai *' 
							placeholder='Contoh: rumah, kantor, rumah pacar'
							name='address_label'
							type='text'
							onChange={this.onChangeInput}
							color={errors.has('address_label') ? 'red' : ''}
							message={errors.has('address_label') ? 'Name is required.' : ''}
							value={formData ? formData.attributes.addressLabel : ''}
						/>
					</InputGroup>
					<InputGroup>
						<Input 
							label='Nama Penerima *'
							placeholder='Masukan nama lengkap penerima'
							name='fullname'
							type='text'
							onChange={this.onChangeInput}
							color={errors.has('fullname') ? 'red' : ''}
							message={errors.has('fullname') ? 'Penerima is required.' : ''}
							value={formData ? formData.attributes.fullname : ''}
						/>
					</InputGroup>
					<InputGroup>
						<Input 
							label='No Handphone *'
							placeholder='Contoh : 08123456789'
							name='phone'
							min={0}
							type='number'
							onChange={this.onChangeInput}
							color={errors.has('phone') ? 'red' : ''}
							message={errors.first('phone')}
							value={formData ? formData.attributes.phone : ''}
						/>
					</InputGroup>
					{
						address.cityProv && (
							<InputGroup>
								<Select 
									label='Kota, Provinsi *'
									filter
									name='province'
									options={address.cityProv}
									onClick={(e) => this.toggleOverflowModal(e)}
									onChange={(e) => this.onChangeProvince(e)}
									color={errors.has('province') ? 'red' : ''}
									message={errors.has('province') ? 'Provinsi is required.' : ''}
									selected={defaultSelected(selected.province, address.cityProv[0])}
								/>
							</InputGroup>
						)
					}
					{
						(address.cityProv && address.district) && (
							<InputGroup>
								<Select 
									label='Kecamatan *'
									name='kecamatan' 
									options={address.district}
									onClick={(e) => this.toggleOverflowModal(e)}
									onChange={(e) => this.onChangeProvince(e)}
									color={errors.has('kecamatan') ? 'red' : ''}
									message={errors.has('kecamatan') ? 'Kecamatan is required.' : ''}
									selected={defaultSelected(selected.district, address.district[0])}
								/>
							</InputGroup>
						)
					}
					<InputGroup>
						<Input 
							label='Kode Pos *'
							placeholder='Contoh : 12345'
							name='zipcode'
							type='number'
							min={0}
							onChange={this.onChangeInput}
							color={errors.has('zipcode') ? 'red' : ''}
							message={errors.has('zipcode') ? 'Kode Pos is required.' : ''}
							value={formData ? formData.attributes.zipcode : ''}
						/>
					</InputGroup>
					<InputGroup>
						<Textarea 
							label='Alamat *'
							placeholder='Masukkan Alamat Lengkap'
							name='address'
							onChange={this.onChangeInput}
							color={errors.has('address') ? 'red' : ''}
							message={errors.has('address') ? 'Alamat is required.' : ''}
							value={formData ? formData.attributes.address : ''}
						/>
					</InputGroup>
					{
						(this.state.isJakarta && this.state.formData.kecamatan) && (
							<div>
								{
									(!this.state.formattedAddress || this.state.showMap) && (
										<div>
											<InputGroup>
												<Alert color='yellow' show>
													<small><em>{T.checkout.O2O_ADDRESS_RULE}</em></small>
												</Alert>
											</InputGroup>
											<InputGroup>
												<Button 
													content={!this.state.showMap ? T.checkout.SHOW_IN_MAP : T.checkout.CANCEL}
													color='grey' 
													block
													icon={!this.state.showMap ? 'map-marker' : 'times'} 
													iconPosition='left'
													onClick={() => this.toggleMap()}
												/>
											</InputGroup>
											<InputGroup><em>(Optional)</em></InputGroup>
										</div>	
									)
								}
								{
									(this.state.formattedAddress && !this.state.showMap) && (
										<div>
											<Segment row>
												<Level padded>
													<Level.Item>
														<Icon name='map-marker' />
													</Level.Item>
													<Level.Item>
														{this.state.formattedAddress}
													</Level.Item>
													<Level.Item>
														<button 
															className='font-small font-orange' 
															onClick={() => this.toggleMap()}
														>
															{T.checkout.CHANGE_LOCATION}
														</button>
													</Level.Item>
												</Level>
											</Segment>
											<InputGroup>
												<p className='font-small font-orange'>{T.checkout.GOSEND_ADDRESS_RULE}</p>
											</InputGroup>
										</div>
									)
								}
								{
									this.state.showMap && (
										<Gosend
											zoom={15} 
											center={Polygon[0].cakung.center} 
											kecamatan={this.state.formData.kecamatan}
											polygonArea={Polygon[0].cakung.location_coords}
											onSelectedPinPoint={(data) => this.selectedPinPoint(data)}
										/>
									)
								}
								<InputGroup><em>* {T.checkout.MUST_FILLED}</em></InputGroup>
							</div>
						)
					}
					<InputGroup>
						<Button 
							block
							size='large'
							type='button'
							content='Simpan Alamat'
							color='dark'
							onClick={(e) => this.validateAndSubmit(e)}
						/>
					</InputGroup>
				</Modal.Body>
			</Modal>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		address: state.addresses
	};
};

export default withCookies(connect(mapStateToProps)(ModalAddress));

