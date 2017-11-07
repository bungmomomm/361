import { connect } from 'react-redux';
// import _ from 'lodash';
import { actions } from '@/state/Adresses';
import { withCookies } from 'react-cookie';
import React, { Component } from 'react';
// import Gosend from '@/components/Views/Gosend/Gosend.Mobile.js';
// import { 
// 	Modal, 
// 	Textarea, 
// 	Message,
// 	Input, 
// 	Alert, 
// 	Select, 
// 	Group, 
// 	Level, 
// 	Icon, 
// 	Button 
// } from '@/components';
import {
	Button,
	Level,
	Icon,
	Select,
	Group,
	Alert,
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
			renderDistrict: true,
			formData: {},
			formattedAddress: null
		};
		this.onChangeInput = this.onChangeInput.bind(this);
		this.translateProvince = this.translateProvince.bind(this);
		this.setFormData = this.setFormData.bind(this);
		this.cookies = this.props.cookies.get('user.token');
		this.isEdit = false;
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
		if (this.props.formData) {
			this.isEdit = true;
			this.translateProvince(this.props.formData.attributes);
		} else {
			this.isEdit = false;
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.address.district !== nextProps.address.district) {
			this.setState({
				renderDistrict: true
			});
		}
	}

	onChangeProvince(e) {
		const isJakarta = e.value.toLowerCase().includes('jakarta');
		this.setState({ 
			isJakarta,
			selected: {
				province: e.value,
				district: {
					label: '-- Pilih Kecamatan',
					value: ''
				}
			},
			renderDistrict: false
		});
		this.constructor.fetchGetDistric(this.cookies, e.value, this.props.dispatch);
	}

	onChangeDistrict(e) {
		this.setState({ 
			formData: {
				...this.state.formData,
				kecamatan: e.value
			}
		});
	}

	onChangeInput(e) {
		this.setStateFormData(e.target.name, e.target.value);
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
			this.setState({ selected: stateProvince, isJakarta });
		}
	}

	validateAndSubmit(e) {
		e.preventDefault();
		console.log(this);
	}

	selectedPinPoint(data) {
		this.setState({
			formattedAddress: data.formattedAddress,
			showMap: false
		});
	}

	toggleMap() {
		this.setState({ showMap: !this.state.showMap });
	}
	
	render() {

		const { 
			address,
			open,
			formData,
		} = this.props;

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
						/>
					</Group>
					<Group>
						<Input 
							label='Nama Penerima *'
							placeholder='Masukan nama lengkap penerima'
							name='fullname'
							type='text'
							defaultValue={formData.attributes.fullname}
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
						(address.cityProv && address.district && this.state.renderDistrict) && (
							<Group>
								<Select 
									label='Kecamatan *'
									hasFilter
									name='kecamatan'
									defaultValue={this.state.selected.district.value}
									options={address.district}
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
						/>
					</Group>
					<Group>
						<Textarea 
							label='Alamat *'
							placeholder='Masukkan Alamat Lengkap'
							name='address'
							defaultValue={formData.attributes.address}
						>address</Textarea>
					</Group>
					{
						(this.state.isJakarta && this.state.formData.kecamatan) && (
							<div>
								{
									(!this.state.formattedAddress || this.state.showMap) && (
										<div>
											<Group>
												<Alert color='yellow' show>
													{T.checkout.O2O_ADDRESS_RULE}
												</Alert>
											</Group>
											<Group>
												<Button 
													color='grey' 
													block
													icon={!this.state.showMap ? 'map-marker' : 'times'} 
													onClick={() => this.toggleMap()}
												>{!this.state.showMap ? T.checkout.SHOW_IN_MAP : T.checkout.CANCEL}</Button>
											</Group>
											<div><em>(Optional)</em></div>
										</div>	
									)
								}
								{
									(this.state.formattedAddress && !this.state.showMap) && (
										<div>
											<Message>
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
											</Message>
											<Group>
												<p className='font-small font-orange'>{T.checkout.GOSEND_ADDRESS_RULE}</p>
											</Group>
										</div>
									)
								}
								<div><em>* {T.checkout.MUST_FILLED}</em></div>
							</div>
						)
					}
					<Alert color='yellow'>Harap tidak mengisi alamat pickup point O2O tanpa melalui pilihan menu Ambil di Toko (O2O). Kami tidak bertanggung jawab bila terjadi kehirlangan</Alert>
					<Message>
						<Level>
							<Level.Left><Icon name='map-marker' /></Level.Left>
							<Level.Item style={{ paddingLeft: '15px' }}>
									Jalan Bangka II No.20, Pela Mampang, 
									Mampang Prapatan, Kota Jakarta Selatan, 
									DKI jakarta 12720
							</Level.Item>
							<Level.Right>
								<div className='font-orange'>Ubah</div>
							</Level.Right>
						</Level>
					</Message>
					<Button block color='grey'>
						<Icon name='map-marker' /> Tunjukan Dalam Peta
					</Button>
					<div className='font-orange'>Lokasi peta harus sesuai dengan alamat pengiriman. Lokasi diperlukan jika ingin menggunakan jasa pengiriman GO-SEND.</div>
					<GoogleMap
						apiKey='YOUR_API_KEY'
						zoom={15}
						hasAutocomplete
						onChangeAutoComplete={(e) => console.log(e)}
						style={{
							width: '100%',
							height: '250px'
						}}
						defaultCenter={Polygon[0].cakung.center}
						updateCenter={Polygon[0].cakung.center}
						marker={{
							icon: 'https://www.google.com/intl/en_us/mapfiles/marker.png',
							onClick: (e) => console.log('from marker:', e),
							defaultCenter: Polygon[0].cakung.center,
							updateCenter: Polygon[0].cakung.center
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
							onClick: (data) => this.selectedPinPoint(data)
						}}
					/>
					<Message><Icon name='map-marker' /> Jalan Bangka II No.20</Message>
					<div><em>* Wajib Diisi</em></div>
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

export default withCookies(connect(mapStateToProps)(ModalAddress));

