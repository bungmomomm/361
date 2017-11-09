import { connect } from 'react-redux';
// import _ from 'lodash';
import { actions } from '@/state/Adresses';
import { withCookies } from 'react-cookie';
import React, { Component } from 'react';
// import Gosend from '@/components/Views/Gosend/Gosend.Mobile.js';
import { GoogleApiWrapper } from 'google-maps-react';
import {
	Button,
	Level,
	Icon,
	Select,
	Group,
	// Alert,
	Input,
	Textarea,
	Modal,
	Message
} from 'mm-ui';
import GoogleMap from './GoogleMap';
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
		this.state = {
			isJakarta: false,
			selected: {
				province: {},
				district: {}
			},
			renderDistrict: false,
			formData: {},
			formattedAddress: null
		};
		this.onChangeInput = this.onChangeInput.bind(this);
		this.translateProvince = this.translateProvince.bind(this);
		this.cookies = this.props.cookies.get('user.token');
		this.isEdit = false;
		this.mapIcon = 'gosend-marker.png';
	}

	componentWillMount() {
		if (this.props.address.cityProv === undefined) {
			this.constructor.fetchGetCityProvince(this.cookies, this.props.dispatch);
		} else if (this.props.formData) {
			this.isEdit = true;
			this.translateProvince(this.props.formData.attributes);
		} else {
			this.isEdit = false;
		}
	}

	componentDidMount() {
		const { formData } = this.props;
		if (formData.attributes.latitude && formData.attributes.longitude) {
			this.getPinPointAddress();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.address.district !== nextProps.address.district) {
			setTimeout(() => {
				this.setState({ renderDistrict: true });
			}, 20);
		}
	}
	
	onChangeProvince(e) {
		const isJakarta = e.value.toLowerCase().includes('jakarta');
		this.setState({
			isJakarta,
			selected: {
				province: {
					label: e.value,
					value: e.value,
				},
				district: {
					label: '-- Pilih Kecamatan',
					value: ''
				}
			},
			formattedAddress: null,
			renderDistrict: false
		});
		this.constructor.fetchGetDistric(this.cookies, e.value, this.props.dispatch);
	}

	onChangeDistrict(e) {
		this.setState({
			selected: {
				...this.state.selected,
				district: {
					label: e.value,
					value: e.value
				}
			},
		});
	}

	onChangeInput(e) {
		this.setStateFormData(e.target.name, e.target.value);
	}

	get markerIcon() {
		return require(`@/assets/images/${this.mapIcon}`);
	}


	getPinPointAddress() {
		const { google, formData } = this.props;
		if (google) {
			const geo = new google.maps.Geocoder();
			const latLng = new google.maps.LatLng(formData.attributes.latitude, formData.attributes.longitude);
			geo.geocode({ latLng }, (results, status) => (
				status === google.maps.GeocoderStatus.OK && this.setAddress(results[0].formatted_address)
			));
		}
	}

	setAddress(formattedAddress) {
		this.setState({ formattedAddress });
	}

	setStateFormData(name, value) {
		const formData = {
			...this.state.formData,
			[name]: value
		};
		if (name === 'province') {
			formData.kecamatan = null;
		}
		this.setState({ formData });
	}

	translateProvince(formDataAttributes) {
		const { city, district, province } = formDataAttributes;
		if (city && district) {
			const isJakarta = province.toLowerCase().includes('jakarta');
			const constProv = `${city}, ${province}`;
			this.constructor.fetchGetDistric(this.cookies, constProv, this.props.dispatch);
			const stateProvince = {
				province: {
					label: constProv,
					value: constProv
				},
				district: {
					label: `${district}`,
					value: `${district}`
				}
			};
			this.setState({ 
				selected: stateProvince, 
				isJakarta
			});
		}
	}

	// setFormData(data) {
	// 	const formData = {
	// 		id: data.id,
	// 		address_label: data.attributes.addressLabel,
	// 		fullname: data.attributes.fullname,
	// 		address: data.attributes.address,
	// 		province: `${data.attributes.city}, ${data.attributes.province}`,
	// 		kecamatan: data.attributes.district,
	// 		zipcode: data.attributes.zipcode,
	// 		phone: data.attributes.phone,
	// 		latitude: data.attributes.latitude || null,
	// 		longitude: data.attributes.longitude || null,
	// 		isEdit: this.isEdit
	// 	};
	// 	this.setState({ formData });
	// }

	validateAndSubmit(e) {
		e.preventDefault();
		if (
			(this.elAddressLabel.checkValid().count() +
				this.elFullname.checkValid().count() +
				this.elPhone.checkValid().count() +
				this.elAddress.checkValid().count() +
				this.elZipcode.checkValid().count()) < 1
		) {
			console.log('valid');
		} else {
			console.log('error');
		}
	}

	toggleGoogleMap() {
		this.setState({ showMap: !this.state.showMap });
	}

	mapMoved(e) {
		const google = {
			...this.state.google,
			marker: {
				center: e.mapCenter
			}
		};
		this.setState({ google });
	}

	renderButtonMap() {
		return this.state.isJakarta && this.state.selected.district.value && (
			<div>
				<Button
					block
					color='grey'
					onClick={() => this.toggleGoogleMap()}
					icon={this.state.showMap ? 'times' : 'map-marker'}
				>
					{this.state.showMap ? T.checkout.CANCEL : T.checkout.SHOW_IN_MAP}
				</Button>
				<p className='font-small font-orange'>{T.checkout.GOSEND_ADDRESS_RULE}</p>
			</div>
		);
	}

	renderFormattedAddress() {
		return (
			<div>
				<Message>
					<Level>
						<Level.Left><Icon name='map-marker' /></Level.Left>
						<Level.Item style={{ paddingLeft: '15px' }}>{this.state.formattedAddress}</Level.Item>
						<Level.Right>
							<div role='button' tabIndex='-1' onClick={() => this.toggleGoogleMap()} className='font-orange'>Ubah</div>
						</Level.Right>
					</Level>
				</Message>
				<p className='font-small font-orange'>{T.checkout.GOSEND_ADDRESS_RULE}</p>
			</div>
		);
	}

	renderGoogleMap() {
		const { google } = this.state;
		return (
			<div style={{ marginBottom: '15px' }}>
				<GoogleMap
					apiKey='YOUR_API_KEY'
					zoom={15}
					hasAutocomplete
					onChangeAutoComplete={(e) => console.log(this.state)}
					style={{
						width: '100%',
						height: '250px'
					}}
					defaultCenter={Polygon[0].cakung.center}
					onDragend={(e) => this.mapMoved(e)}
					marker={{
						icon: this.markerIcon,
						onClick: (e) => console.log('from marker:', e),
						defaultCenter: google ? google.marker.center : Polygon[0].cakung.center
					}}
					polygon={{
						area: Polygon[0].cakung.location_coords,
						stroke: {
							color: '#0000FF',
							opacity: 0.8,
							weight: 2
						},
						fill: {
							color: '#0000FF',
							opacity: 0.35
						},
						onClick: (data) => console.log(data)
					}}
				/>
				<Message><Icon name='map-marker' /> Jalan Bangka II No.20</Message>
			</div>
		);
	}

	render() {
		const {
			address,
			open,
			formData,
		} = this.props;

		if (!address) return null;

		return (
			<Modal
				size='medium'
				show={open}
				showOverlayCloseButton
				onCloseRequest={this.props.handleClose}
			>
				<Modal.Header>{T.checkout.CREATE_NEW_ADDRESS}</Modal.Header>
				<Modal.Body>
					<Group>
						<Input
							label='Simpan Sebagai *'
							placeholder='Contoh: rumah, kantor, rumah pacar'
							name='address_label'
							type='text'
							defaultValue={formData.attributes.addressLabel}
							ref={(c) => { this.elAddressLabel = c; }}
							validation={{
								rules: 'required',
								name: 'address label'
							}}
						/>
					</Group>
					<Group>
						<Input
							label='Nama Penerima *'
							placeholder='Masukan nama lengkap penerima'
							name='fullname'
							type='text'
							ref={(c) => { this.elFullname = c; }}
							defaultValue={formData.attributes.fullname}
							validation={{
								rules: 'required',
								name: 'fullname'
							}}
						/>
					</Group>
					<Group>
						<Input
							label='No Handphone *'
							placeholder='Contoh : 08123456789'
							name='phone'
							min={0}
							type='number'
							defaultValue={formData.attributes.phone}
							ref={(c) => { this.elPhone = c; }}
							validation={{
								rules: 'required',
								name: 'phone'
							}}
						/>
					</Group>
					{
						address.cityProv && (
							<Group>
								<Select
									label='Kota, Provinsi *'
									hasFilter
									name='province'
									defaultValue={this.state.selected.province.value}
									options={address.cityProv}
									onChange={(e) => this.onChangeProvince(e)}
								/>
							</Group>
						)
					}
					{
						
						(address.district && address.district.length > 0 && this.state.renderDistrict) && (
							<Group>
								<Select
									label='Kecamatan *'
									hasFilter
									name='kecamatan'
									defaultValue={this.state.selected.district.value}
									options={address.district}
									onChange={(e) => this.onChangeDistrict(e)}
								/>
							</Group>
						)
					}
					<Group>
						<Input
							label='Kode Pos *'
							placeholder='Contoh : 12345'
							name='zipcode'
							type='number'
							min={0}
							defaultValue={formData.attributes.zipcode}
							ref={(c) => { this.elZipcode = c; }}
							validation={{
								rules: 'required',
								name: 'zipcode'
							}}
						/>
					</Group>
					<Group>
						<Textarea
							label='Alamat *'
							placeholder='Masukkan Alamat Lengkap'
							name='address'
							defaultValue={formData.attributes.address}
							ref={(c) => { this.elAddress = c; }}
							validation={{
								rules: 'required',
								name: 'address'
							}}
						>address</Textarea>
					</Group>
					{
						this.state.formattedAddress && !this.state.showMap ? this.renderFormattedAddress() : this.renderButtonMap()
					}
					{this.state.showMap && this.renderGoogleMap()}
					<p><em>* {T.checkout.MUST_FILLED}</em></p>
					<Group>
						<Button
							block
							size='large'
							color='dark'
							onClick={(e) => this.validateAndSubmit(e)}
						>Simpan Alamat</Button>
					</Group>
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

export default GoogleApiWrapper({
	apiKey: ('AIzaSyBRfxjnu9S1OmoMslu7fb3uUdf3O2BNNYE')
})(withCookies(connect(mapStateToProps)(ModalAddress)));