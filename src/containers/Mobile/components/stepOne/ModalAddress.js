import { connect } from 'react-redux';
import _ from 'lodash';
import { actions } from '@/state/Adresses';
import { withCookies } from 'react-cookie';
import React, { Component } from 'react';
import { Validator } from 'ree-validate';
import { 
	Gosend, 
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
			name: 'required',
			penerima: 'required',
			no_hp: 'required|min:6|max:14|regex:^([0-9]+)$',
			provinsi: 'required',
			kecamatan: 'required',
			kodepos: 'required|min:5',
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
			overflow: false
		};
		this.onChangeProvince = this.onChangeProvince.bind(this);
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
		if (this.isEdit) this.translateProvince(this.props.formData.attributes);
	}
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.formData && (this.props.formData !== nextProps.formData)) {
			this.translateProvince(nextProps.formData.attributes);
			if (this.isEdit) {
				this.setFormData(nextProps.formData);
			}
		}
	}

	onChangeProvince(selected) {
		this.constructor.fetchGetDistric(this.cookies, selected.value, this.props.dispatch);
		const isJakarta = selected.value.toLowerCase().includes('jakarta');
		this.setState({ isJakarta });
	}
	
	setFormData(data) {
		const formData = {
			id: data.id,
			addressLabel: data.attributes.addressLabel,
			fullname: data.attributes.fullname,
			phone: data.attributes.phone,
			province: data.attributes.province,
			kecamatan: data.attributes.kecamatan,
			zipcode: data.attributes.zipcode,
			address: data.attributes.address,
			latitude: data.attributes.latitude || null,
			longitude: data.attributes.longitude || null,
		};
		this.setState({ formData });
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
		this.toggleShow();
		setTimeout(() => { this.props.handleClose(); }, 310);
	}

	toggleShow() {
		this.setState({ show: !this.state.show });
	}

	validateAndSubmit(e) {
		e.preventDefault();
		const { formData } = this.state;
		this.validator.validateAll(formData).then(success => {
			if (success) {
				// this.submit(formData);
				console.log(success);
			} else {
				Object.keys(formData).forEach((key) => {
					this.setErrors(key, this.state.formData[key]);
				});
			}
		});
	}

	toggleOverflowModal(e) {
		document.querySelectorAll('.modalAddress')[0].scrollTop = 0;
		this.setState({ overflow: e });
	}
	
	render() {
		const { 
			formData,
			address
		} = this.props;

		const {
			errors,
			selected,
			show,
			overflow
		} = this.state;

		const defaultSelected = (selectedData, defaultOption) => {
			return 	_.isEmpty(selectedData) ? defaultOption : selectedData;
		};

		return (
			<Modal ref={(e) => { this.el = e; }} className='modalAddress' handleClose={() => this.hideModalAddress()} size='medium' show={show} disableOverflow={overflow} close>
				<Modal.Header>
					<div>{'Buat Alamat Baru'}</div>
				</Modal.Header>
				<Modal.Body>
					<InputGroup>
						<Input 
							label='Simpan Sebagai *' 
							placeholder='Contoh: rumah, kantor, rumah pacar'
							name='name'
							type='text'
							color={errors.has('name') ? 'red' : ''}
							message={errors.has('name') ? 'Name field is required.' : ''}
							value={formData ? formData.attributes.addressLabel : ''}
						/>
					</InputGroup>
					<InputGroup>
						<Input 
							label='Nama Penerima *'
							placeholder='Masukan nama lengkap penerima'
							name='penerima'
							type='text'
							color={errors.has('penerima') ? 'red' : ''}
							message={errors.has('penerima') ? 'Penerima field is required.' : ''}
							value={formData ? formData.attributes.fullname : ''}
						/>
					</InputGroup>
					<InputGroup>
						<Input 
							label='No Handphone *'
							placeholder='Contoh : 08123456789'
							name='no_hp'
							min={0}
							type='number'
							color={errors.has('no_hp') ? 'red' : ''}
							message={errors.first('no_hp')}
							value={formData ? formData.attributes.phone : ''}
						/>
					</InputGroup>
					{
						address.cityProv && (
							<InputGroup>
								<Select 
									label='Kota, Provinsi *'
									filter
									name='provinsi'
									onClick={(e) => this.toggleOverflowModal(e)}
									onChange={(e) => this.onChangeProvince(e)}
									options={address.cityProv}
									color={errors.has('provinsi') ? 'red' : ''}
									message={errors.has('provinsi') ? 'Provinsi field is required.' : ''}
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
									onClick={(e) => this.toggleOverflowModal(e)}
									name='kecamatan' 
									options={address.district}
									color={errors.has('kecamatan') ? 'red' : ''}
									message={errors.has('kecamatan') ? 'Kecamatan field is required.' : ''}
									selected={defaultSelected(selected.district, address.district[0])}
								/>
							</InputGroup>
						)
					}
					<InputGroup>
						<Input 
							label='Kode Pos *'
							placeholder='Contoh : 12345'
							name='kodepos'
							type='number'
							min={0}
							value={formData ? formData.attributes.zipcode : ''}
						/>
					</InputGroup>
					<InputGroup>
						<Textarea 
							label='Alamat *'
							placeholder='Masukkan Alamat Lengkap'
							name='address'
							value={formData ? formData.attributes.address : ''}
						/>
					</InputGroup>
					<InputGroup>
						<Alert color='yellow' show>
							<small>
								<em>
									Harap tidak mengisi alamat pickup point O2O tanpa melalui pilihan menu Ambil di Toko
									(O2O). Kami tidak bertanggung jawab bila terjadi kehirlangan
								</em>
							</small>
						</Alert>
					</InputGroup>
					<InputGroup>
						<Button 
							content='Tunjukan Dalam Peta'
							color='grey' 
							block
							icon='map-marker' 
							iconPosition='left' 
						/>
					</InputGroup>
					<InputGroup>
						<span><em>(Optional)</em></span>
					</InputGroup>
					<Segment row>
						<Level padded>
							<Level.Item>
								<Icon name='map-marker' />
							</Level.Item>
							<Level.Item>
								Jalan Bangka II No.20, Pela Mampang, 
								Mampang Prapatan, Kota Jakarta Selatan, 
								DKI jakarta 12720
							</Level.Item>
							<Level.Item>
								<button className='font-small font-orange'>Ganti Lokasi</button>
							</Level.Item>
						</Level>
					</Segment>
					<InputGroup>
						<p className='font-small font-orange'>Lokasi peta harus sesuai dengan alamat pengiriman. Lokasi diperlukan jika ingin menggunakan jasa pengiriman GO-SEND.</p>
					</InputGroup>
					{
						false && (
							<Gosend
								zoom={15} 
								center={Polygon[0].cakung.center} 
								polygonArea={Polygon[0].cakung.location_coords}
								displayMap
							/>
						)  
					}
					<InputGroup>
						<em>* wajib diisi</em>
					</InputGroup>
					<InputGroup>
						<Button onClick={() => this.validateAndSubmit()} block size='large' type='button' content='Simpan Alamat' color='dark' />
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

