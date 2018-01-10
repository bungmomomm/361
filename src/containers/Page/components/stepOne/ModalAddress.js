import { connect } from 'react-redux';
import _ from 'lodash';
import { actions } from '@/state/Adresses';
import { withCookies } from 'react-cookie';
import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import {
	Button,
	Level,
	Icon,
	Select,
	Alert,
	Subtitle,
	Input,
	Textarea,
	Modal,
	Panel
} from 'mm-ui';
import GoogleMap from './GoogleMap';
import { T } from '@/data/translations';
import { Polygon } from '@/data/polygons';

class ModalAddress extends Component {
	static saveAddress(token, dispatch, formData, selectedAddress) {
		dispatch(new actions.saveAddress(token, formData, selectedAddress));
	}

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
			formData: {},
			showMap: false,
			formattedAddress: null,
			mapMarkerCenter: null,
			isValidMarkerPosition: true
		};
		this.cookies = this.props.cookies.get('user.token');
		this.mapIcon = 'gosend-marker.png';
		this.selectedPolygon = {};
		this.formattedAddress = '';
	}

	componentWillMount() {
		const { isEdit, formData } = this.props;
		if (isEdit && typeof formData.attributes.latitude !== 'undefined' && typeof formData.attributes.longitude !== 'undefined') {
			this.setState({
				mapMarkerCenter: {
					lat: formData.attributes.latitude,
					lng: formData.attributes.longitude
				}
			});
		}

		if (this.props.isEdit && formData.attributes) {
			if (typeof formData.attributes.latitude !== 'undefined' && typeof formData.attributes.longitude !== 'undefined') {
				this.getPinPointAddress(formData.attributes.latitude, formData.attributes.longitude);
			}
			this.translateProvince(this.props.formData.attributes);
		}
	}

	componentDidMount() {
		const { dispatch } = this.props;
		this.constructor.fetchGetCityProvince(this.cookies, dispatch);
	}
	
	onChangeProvince(e) {
		const value = e.value;
		if (value) {
			const isJakarta = value.toLowerCase().includes('jakarta');
			this.setState({
				isJakarta,
				selected: {
					province: {
						label: value,
						value,
					},
					district: {
						label: '-- Pilih Kecamatan',
						value: ''
					}
				},
				showMap: false,
				formattedAddress: null,
				tempFormattedAddress: null,
				mapMarkerCenter: null
			});
			this.constructor.fetchGetDistric(this.cookies, value, this.props.dispatch);
		}
	}

	onChangeDistrict(e) {
		const value = e.value;
		if (value) {
			this.setState({
				selected: {
					...this.state.selected,
					district: {
						label: value,
						value
					}
				},
				showMap: false,
				formattedAddress: null,
				mapMarkerCenter: null
			});
		}
	}

	get markerIcon() {
		return require(`@/assets/images/${this.mapIcon}`);
	}

	getPinPointAddress(lat = this.props.formData.attributes.latitude, lng = this.props.formData.attributes.longitude) {
		const { google } = this.props;
		if (google) {
			const geo = new google.maps.Geocoder();
			const latLng = new google.maps.LatLng(lat, lng);
			geo.geocode({ latLng }, (results, status) => {
				if (status === google.maps.GeocoderStatus.OK) {
					this.setState({ formattedAddress: results[0].formatted_address });
				}
			});
		}
	}
	
	getTemporaryPinPointAddress(lat, lng) {
		const { google } = this.props;
		if (google) {
			const geo = new google.maps.Geocoder();
			const latLng = new google.maps.LatLng(lat, lng);
			geo.geocode({ latLng }, (results, status) => {
				if (status === google.maps.GeocoderStatus.OK) {
					this.setState({ tempFormattedAddress: results[0].formatted_address });
				}
			});
		}
	}

	setPinPoint(e) {
		if (!this.state.isValidMarkerPosition) return;

		this.FormLongitude = this.selectedPolygon.center.lng;
		this.FormLatitude = this.selectedPolygon.center.lat;
		if (this.state.mapMarkerCenter && this.state.mapMarkerCenter.lat !== '' && this.state.mapMarkerCenter.lng !== '') {
			this.FormLongitude = this.state.mapMarkerCenter.lng;
			this.FormLatitude = this.state.mapMarkerCenter.lat;
		}
		this.getPinPointAddress(this.FormLatitude, this.FormLongitude);
		this.setState({ showMap: false });
	}

	validatePositionMarker(e) {
		const { google } = this.props;
		if (typeof e.geometry !== 'undefined') {
			const latLng = new google.maps.LatLng(e.geometry.location.lat(), e.geometry.location.lng());
			const isValidMarkerPosition = this.isValidPosition(latLng);
			this.setState({ 
				isValidMarkerPosition,
				mapMarkerCenter: {
					lat: e.geometry.location.lat(),
					lng: e.geometry.location.lng()
				},
				tempFormattedAddress: e.formatted_address || this.state.formattedAddress
			});
		}
	}

	isValidPosition(e) {
		const { google } = this.props;	
		const polygonArea = new google.maps.Polygon({ paths: this.selectedPolygon.location_coords });
		return !!google.maps.geometry.poly.containsLocation(e, polygonArea);
	}

	translateProvince(formDataAttributes) {
		const { city, district, province } = formDataAttributes;
		if (city && district && province) {
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

	validateAndSubmit(e) {
		e.preventDefault();
		const elAddressLabel = this.elAddressLabel.validation.checkValid();
		const elFullname = this.elFullname.validation.checkValid();
		const elPhone = this.elPhone.validation.checkValid();
		const elAddress = this.elAddress.validation.checkValid();
		const elZipcode = this.elZipcode.validation.checkValid();
		const elProvince = this.elProvince && this.elProvince.validation.checkValid();
		const elDistrict = this.elDistrict && this.elDistrict.validation.checkValid();
		if (elAddressLabel && elFullname && elPhone && elAddress && elZipcode && elProvince && elDistrict) {
			const formData = {
				id: this.props.isEdit && this.props.formData.id,
				name: this.elAddressLabel.validation.state.formData.Nama_Alamat,
				penerima: this.elFullname.validation.state.formData.Nama_Penerima,
				address: this.elAddress.validation.state.formData.Alamat,
				provinsi: this.state.selected.province.value,
				kecamatan: this.state.selected.district.value,
				kodepos: this.elZipcode.validation.state.formData.Kode_Pos,
				no_hp: this.elPhone.validation.state.formData.No_Handphone,
				isEdit: this.props.isEdit,
				longitude: this.state.isValidMarkerPosition ? this.FormLongitude : '',
				latitude: this.state.isValidMarkerPosition ? this.FormLatitude : '',
			};
			this.constructor.saveAddress(this.cookies, this.props.dispatch, formData, this.props.formData);
		}
	}

	toggleGoogleMap() {
		const showMap = !this.state.showMap;
		if (showMap) {
			// open
			const district = this.state.selected.district.value.toLowerCase().replace(/\W+(.)/g, (match, chr) => chr.toUpperCase());
			const selectedPolygon = _.find(Polygon, district);
			this.selectedPolygon = selectedPolygon[district];
		} else {
			// close
			let lat = this.selectedPolygon.center.lat;
			let lng = this.selectedPolygon.center.lng;

			if (this.props.isEdit) {
				if (typeof this.props.formData.attributes.latitude !== 'undefined' && typeof this.props.formData.attributes.longitude !== 'undefined') {
					lat = this.props.formData.attributes.latitude;
					lng = this.props.formData.attributes.longitude;
				}
			}

			if (typeof this.FormLongitude !== 'undefined' && typeof this.FormLatitude !== 'undefined') {
				lat = this.FormLatitude;
				lng = this.FormLongitude;
			}
			this.setState({ mapMarkerCenter: { lng, lat } });
		}
		this.setState({ 
			showMap,
			isValidMarkerPosition: true
		});
	}

	mapMoved(mapProps, map) {
		const isValidMarkerPosition = this.isValidPosition(map.center);
		this.getTemporaryPinPointAddress(map.getCenter().lat(), map.getCenter().lng());
		this.setState({ 
			isValidMarkerPosition,
			mapMarkerCenter: {
				lat: map.getCenter().lat(), 
				lng: map.getCenter().lng()
			} 
		});
	}

	centerMap() {
		const { mapMarkerCenter } = this.state;
		if (mapMarkerCenter && mapMarkerCenter.lat !== '' && mapMarkerCenter.lng !== '') {
			return mapMarkerCenter;	
		}
		return this.selectedPolygon.center;
	}

	renderButtonMap() {
		return this.state.isJakarta && this.state.selected.district.value && (
			<Level hasPadding style={{ marginBottom: '15px' }}>
				<Level.Left>
					<p>
						<Button
							block
							size='small'
							color='grey'
							onClick={() => this.toggleGoogleMap()}
							icon={this.state.showMap ? 'times' : 'map-marker'}
						>
							{this.state.showMap ? T.checkout.CANCEL : T.checkout.SHOW_IN_MAP}
						</Button>
					</p>
				</Level.Left>
				<Level.Right>
					<div className='font-small font-orange'>{T.checkout.GOSEND_ADDRESS_RULE}</div>
				</Level.Right>
			</Level>
		);
	}

	renderFormattedAddress() {
		return (
			<div>
				<Panel>
					<Level isMobile>
						<Level.Left><Icon name='map-marker' /></Level.Left>
						<Level.Item style={{ padding: '0px 10px' }}>{this.state.formattedAddress}</Level.Item>
						<Level.Right>
							<div role='button' tabIndex='-1' onClick={() => this.toggleGoogleMap()} className='font-orange'>Ubah</div>
						</Level.Right>
					</Level>
				</Panel>
				<p className='font-small font-orange'>{T.checkout.GOSEND_ADDRESS_RULE}</p>
			</div>
		);
	}

	renderGoogleMap() {
		const { mapMarkerCenter } = this.state;
		return (
			<div style={{ marginBottom: '15px' }}>
				<GoogleMap
					onChangeAutoComplete={(e) => this.validatePositionMarker(e)}
					defaultCenter={this.centerMap()}
					centerMap={mapMarkerCenter}
					onDragend={(mapProps, map) => this.mapMoved(mapProps, map)}
					marker={{
						icon: this.markerIcon,
						onClick: (e) => this.setPinPoint(e),
						center: this.centerMap()
					}}
					polygon={{
						area: this.selectedPolygon.location_coords
					}}
				/>
				{
					!this.state.isValidMarkerPosition ? 
						<Alert color='red'>{T.checkout.LOCATION_NOT_MATCH_WITH_SHIPPING_ADDRESS}</Alert> :
						<Panel><Icon name='map-marker' /> {this.state.tempFormattedAddress}</Panel>
				}
			</div>
		);
	}

	render() {
		const {
			address,
			open,
			formData
		} = this.props;

		if (this.props.isEdit && !formData) return null;
		return (
			<Modal
				size='medium'
				show={open}
				loading={typeof address.cityProv === 'undefined'}
				showOverlayCloseButton
				onCloseRequest={this.props.handleClose}
			>
				<Modal.Header>
					<Subtitle size={4}>{this.props.isEdit ? T.checkout.EDIT_ADDRESS : T.checkout.CREATE_NEW_ADDRESS}</Subtitle>
				</Modal.Header>
				<Modal.Body>
					<Input
						label='Simpan Sebagai *'
						placeholder='Contoh: rumah, kantor, rumah pacar'
						name='address_label'
						type='text'
						horizontal
						defaultValue={this.props.isEdit ? formData.attributes.addressLabel : ''}
						ref={(c) => { this.elAddressLabel = c; }}
						validation={{ rules: 'required', name: 'Nama_Alamat' }}
					/>
					<Input
						label='Nama Penerima *'
						placeholder='Masukan nama lengkap penerima'
						name='fullname'
						type='text'
						horizontal
						ref={(c) => { this.elFullname = c; }}
						defaultValue={this.props.isEdit ? formData.attributes.fullname : ''}
						validation={{ rules: 'required', name: 'Nama_Penerima' }}
					/>
					<Input
						label='No Handphone *'
						placeholder='Contoh : 08123456789'
						name='phone'
						type='number'
						horizontal
						defaultValue={this.props.isEdit ? formData.attributes.phone : ''}
						ref={(c) => { this.elPhone = c; }}
						validation={{ rules: 'required|min:7|max:14|numeric', name: 'No_Handphone' }}
					/>
					{
						typeof address.cityProv !== 'undefined' &&
						<Select
							block
							label='Kota, Provinsi *'
							hasFilter
							name='province'
							horizontal
							defaultValue={this.props.isEdit ? this.state.selected.province.value : ''}
							options={address.cityProv}
							onChange={(e) => this.onChangeProvince(e)}
							ref={(c) => { this.elProvince = c; }}
							validation={{ rules: 'required', name: 'Provinsi' }}
						/>
					}
					{
						typeof address.cityProv === 'object' && 
						typeof address.district !== 'undefined' &&
						<Select
							block
							label='Kecamatan *'
							hasFilter
							name='kecamatan'
							horizontal
							defaultValue={this.state.selected.district.value}
							options={address.district}
							onChange={(e) => this.onChangeDistrict(e)}
							ref={(c) => { this.elDistrict = c; }}
							validation={{ rules: 'required', name: 'Kecamatan' }}
						/>
					}
					<Input
						label='Kode Pos *'
						placeholder='Contoh : 12345'
						name='zipcode'
						type='number'
						horizontal
						defaultValue={this.props.isEdit ? formData.attributes.zipcode : ''}
						ref={(c) => { this.elZipcode = c; }}
						validation={{ rules: 'required|digits:5|numeric', name: 'Kode_Pos' }}
					/>
					<Textarea
						label='Alamat *'
						placeholder='Masukkan Alamat Lengkap'
						name='address'
						horizontal
						defaultValue={this.props.isEdit ? formData.attributes.address : ' '}
						ref={(c) => { this.elAddress = c; }}
						validation={{ rules: 'required', name: 'Alamat' }}
					/>
					{this.state.formattedAddress && !this.state.showMap ? this.renderFormattedAddress() : this.renderButtonMap()}
					{this.state.showMap && this.renderGoogleMap()}
					<Level>
						<Level.Left>
							<p><em>* {T.checkout.MUST_FILLED}</em></p>
						</Level.Left>
						<Level.Right>
							<Button
								block
								size='medium'
								color='dark'
								onClick={(e) => this.validateAndSubmit(e)}
							>{T.checkout.SAVE_ADDRESS}</Button>
						</Level.Right>
					</Level>
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