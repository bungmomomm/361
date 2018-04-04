import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import Shared from '@/containers/Mobile/Shared';
import { Page, Svg, Button, Header, Select, Level, Map } from '@/components/mobile';
import { actions } from '@/state/v4/Address';
import styles from './style.scss';
import { Form, Input } from '@/components/mobile/Formsy';
import { to } from 'await-to-js';
import { Promise } from 'es6-promise';
import { userToken, isLogin } from '@/data/cookiesLabel';
import Switch from 'react-switch';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Address extends Component {

	state = {
		allowSubmit: false,
		showSelect: {
			city: false,
			district: false
		},
		disabled: {
			city: false,
			district: true
		},
		selected: {
			city: '',
			district: ''
		},
		type: 'shipping',
		submitting: false,
		default: false,
		map: {
			display: false,
			address: '',
			lat: -6.24800035920893,
			lng: 106.81144165039063
		}
	};

	onChange = (v, which = 'city') => {
		this.setState({
			selected: {
				...this.state.selected,
				[which]: v
			}
		});

		if (which === 'city') {
			this.setState({
				disabled: {
					...this.state.disabled,
					district: true
				},
				selected: {
					...this.state.selected,
					district: ''
				}
			});

			if (v) {
				(async () => {
					const { address: { data, paging }, dispatch, cookies } = this.props;

					const c = data.cities[data.cities.length - 1];
					if (+v.split('_')[1] === +c.city_id && paging.cities) {
						const respCity = await to(dispatch(actions.getCity(cookies.get(userToken), paging.cities)));
						if (respCity[0]) {
							return Promise.reject(respCity[0]);
						}
					}

					const [err, resp] = await to(dispatch(actions.getDistrict(cookies.get(userToken), { city_id: v.split('_')[1] })));
					if (err) {
						return Promise.reject(err);
					}
					this.setState({
						disabled: {
							...this.state.disabled,
							district: false
						}
					});

					return Promise.resolve(resp);
				})();
			}
		}
	};

	onCitySearch = (el) => {
		const { cookies, dispatch } = this.props;
		if (el.target.value.length > 2) {
			dispatch(actions.getCity(cookies.get(userToken), { q: el.target.value }, 'init'));
		}
	};

	onSubmit = () => {
		this.formsy.submit();
	};

	handleLocationChange = ({ position, address }) => {
		this.setState({
			map: {
				...this.state.map,
				address,
				lat: position.lat,
				lng: position.lng
			}
		});
	};

	toggleShow = (which = 'city') => {
		this.setState({
			showSelect: {
				...this.state.showSelect,
				[which]: !this.state.showSelect[which]
			}
		});
	};

	disableButton = () => {
		this.setState({ allowSubmit: false });
	};

	enableButton = () => {
		this.setState({ allowSubmit: true });
	};

	radioChange = (v) => {
		this.setState({ default: v });
	};

	submit = async (model) => {
		const { city_id } = model;
		const splitr = city_id.split('_');

		model = {
			...model,
			province_id: splitr[0],
			city_id: splitr[1],
			type: this.state.type,
			country_id: 1,
			latitude: this.state.map.lat !== -6.24800035920893 ? this.state.map.lat.toString() : '',
			longitude: this.state.map.lng !== 106.81144165039063 ? this.state.map.lng.toString() : '',
			default: this.state.default
		};

		const { dispatch, cookies, history } = this.props;
		this.setState({ submitting: true });
		await dispatch(actions.addAddress(cookies.get(userToken), model));

		history.push('/address');
	};

	toggleMap = (e) => {
		e.preventDefault();

		if (navigator) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					const crd = pos.coords;
					this.setState({
						map: {
							...this.state.map,
							display: !this.state.map.display,
							lat: crd.latitude,
							lng: crd.longitude
						}
					});
				},
				(err) => {
					this.setState({
						map: {
							...this.state.map,
							display: !this.state.map.display
						}
					});
				}
			);

			return false;
		}

		this.setState({
			map: {
				...this.state.map,
				display: !this.state.map.display
			}
		});

		return null;
	};

	resetMap = () => {
		this.setState({
			map: {
				...this.state.map,
				display: false,
				lat: -6.24800035920893,
				lng: 106.81144165039063
			}
		});
	};

	saveMap = () => {
		this.setState({
			map: {
				...this.state.map,
				display: false
			}
		});
	};

	renderData = () => {
		const { address } = this.props;
		const cities = address.options.cities;
		const districts = address.options.districts;
		const { map: { lat, lng } } = this.state;
		const isMarked = lat !== -6.24800035920893 && lng !== 106.81144165039063;

		const selected = {
			city: cities.filter((obj) => {
				return obj.value === this.state.selected.city;
			}),
			district: districts.filter((obj) => {
				return obj.value === this.state.selected.district;
			})
		};

		const placeHasBeenMarkedContent = (
			<div className='flex-row flex-middle'>
				<div className='margin--small-r'><Svg src='ico_pin-poin-marked.svg' /></div>
				<div style={{ color: '#F57C00', fontSize: '14px' }}>&nbsp;LOKASI SUDAH DITANDAI</div>
			</div>
		);

		return (
			<Page color='grey'>
				<Form
					onValidSubmit={this.submit}
					onValid={this.enableButton}
					onInvalid={this.disableButton}
					ref={(form) => { this.formsy = form; }}
				>
					<Level className='padding--medium margin--medium-b bg--white' style={{ display: this.state.map.display ? 'none' : 'flex' }}>
						<Level.Left>
							<div className='padding--small-t'>
								<span>Jadikan Alamat Utama</span>
							</div>
						</Level.Left>
						<Level.Right>
							<div>
								<Switch
									onChange={this.radioChange}
									checked={this.state.default}
									name='default_address'
									id='default_address'
									checkedIcon={false}
									uncheckedIcon={false}
									offColor={'#d8d8d8'}
									onColor={'#191919'}
								/>
							</div>
						</Level.Right>
					</Level>
					<Level className='bg--white flex-column' style={{ display: this.state.map.display ? 'none' : 'flex' }}>
						<div className='padding--medium-v'>
							<label className={styles.label} htmlFor='address_label'>Simpan Sebagai</label>
							<Input
								id='address_label'
								name='address_label'
								flat
								placeholder='Rumah'
								validations={{
									matchRegexp: /^[0-9A-Za-z,.\s]+$/
								}}
								validationError='Invalid character supplied'
								disabled={this.state.submitting}
								required
							/>
						</div>
						<div className='padding--medium-v'>
							<label className={styles.label} htmlFor='fullname'>Nama Penerima</label>
							<Input
								id='fullname'
								name='fullname'
								flat
								placeholder='John Doe'
								validations={{
									matchRegexp: /^[0-9A-Za-z,.\s]+$/
								}}
								validationError='Invalid character supplied'
								disabled={this.state.submitting}
								required
							/>
						</div>
						<div className='padding--medium-v'>
							<label className={styles.label} htmlFor='telephone'>Nomor Handphone</label>
							<Input
								id='phone'
								name='phone'
								flat
								placeholder='085975049209'
								validations={{
									matchRegexp: /^[0-9]{6,14}$/
								}}
								validationError='Invalid character supplied'
								disabled={this.state.submitting}
								required
							/>
						</div>
						<div className='padding--medium-v'>
							<label className={styles.label} htmlFor='city'>Kota, Provinsi *</label>
							<Level
								className='flex-row border-bottom no-padding-h'
								onClick={
									(this.state.disabled.city || this.state.submitting) ? false : () => this.toggleShow()
								}
							>
								<Level.Left>
									<Button className='flex-center' disabled={(this.state.disabled.city || this.state.submitting)}>
										<span style={{ marginRight: '10px' }}>
											{selected.city.length ? selected.city[0].label : '- Select City -'}
										</span>
									</Button>
								</Level.Left>
								<Level.Right>
									<Svg src='ico_chevron-down.svg' />
								</Level.Right>
							</Level>
							<Select
								horizontal
								show={this.state.showSelect.city}
								label='Kota, Provinsi *'
								name='city'
								options={cities}
								search
								onSearch={this.onCitySearch}
								onChange={this.onChange}
								onClose={() => this.toggleShow()}
								defaultValue={selected.city.length ? selected.city[0].value : ''}
							/>
							<Input
								id='city_id'
								name='city_id'
								type='hidden'
								validations={{
									matchRegexp: /^[1-9][0-9]*_[1-9][0-9]*$/
								}}
								validationError='This field is required'
								value={this.state.selected.city}
								required
							/>
						</div>

						<div className='padding--medium-v'>
							<label className={styles.label} htmlFor='district'>Kecamatan</label>
							<Level
								className='flex-row border-bottom no-padding-h'
								onClick={
									(this.state.disabled.district || this.state.submitting) ? false : () => this.toggleShow('district')
								}
							>
								<Level.Left>
									<Button className='flex-center' disabled={(this.state.disabled.district || this.state.submitting)}>
										<span style={{ marginRight: '10px' }}>
											{selected.district.length ? selected.district[0].label : '- Select District -'}
										</span>
									</Button>
								</Level.Left>
								<Level.Right>
									<Svg src='ico_chevron-down.svg' />
								</Level.Right>
							</Level>
							<Select
								horizontal
								show={this.state.showSelect.district}
								label='Kecamatan *'
								name='district'
								options={districts}
								onChange={(v) => this.onChange(v, 'district')}
								onClose={() => this.toggleShow('district')}
								defaultValue={selected.district.length ? selected.district[0].value : ''}
							/>
							<Input
								id='district_id'
								name='district_id'
								type='hidden'
								validations={{
									matchRegexp: /^[1-9][0-9]*$/
								}}
								validationError='This field is required'
								value={this.state.selected.district}
								required
							/>
						</div>

						<div className='padding--medium-v'>
							<label className={styles.label} htmlFor='zipcode'>Kode Pos</label>
							<Input
								id='zipcode'
								name='zipcode'
								flat
								placeholder='16451'
								validations={{
									matchRegexp: /^[0-9]{5}$/
								}}
								validationError='Invalid character supplied'
								disabled={this.state.submitting}
								required
							/>
						</div>

						<div className='padding--medium-v'>
							<label className={styles.label} htmlFor='address'>Address</label>
							<Input
								id='address'
								name='address'
								as='textarea'
								flat
								placeholder='Jl. Perbanas No. 5A - Tugu'
								validationError='This field is required'
								disabled={this.state.submitting}
								required
								style={{
									background: 'transparent',
									paddingLeft: '0px',
									paddingRight: '0px',
									borderRadius: '0px',
									fontSize: '13px',
									lineHeight: '20px',
									overflowWrap: 'break-word',
									outline: '0px',
									border: '0px',
									borderBottom: '1px solid #D8D8D8',
									height: '60px'
								}}
							/>
						</div>
					</Level>

					{this.state.map.display && (
						<Level className='bg--white flex-column' style={{ padding: '0px' }}>
							<Map
								containerElement={<div style={{ height: '100%' }} />}
								mapElement={<div style={{ height: `${window.innerHeight - 60}px` }} />}
								defaultPosition={this.state.map}
								zoom={7}
								onChange={this.handleLocationChange}
								radius={200}
							/>
							<div style={{ marginTop: '5px' }}>
								<small>{this.state.map.address}</small>
							</div>
						</Level>
					)}


					<Level className='padding--medium margin--medium-t bg--white' style={{ display: this.state.map.display ? 'none' : 'flex' }}>
						<Level.Left style={{ margin: '0px auto 30px auto' }}>
							<div className='padding--small-t' style={{ textAlign: 'center' }}>
								<span>
									<p style={{ paddingBottom: '20px', fontSize: '14px' }}>
										Untuk pengiriman menggunakan Go-Jek, Anda harus <br />
										menentukan koordinat alamat pengiriman Anda.
									</p>

									<button
										onClick={this.toggleMap}
										style={
											!isMarked ? {
												backgroundColor: 'rgba(0, 0, 0, 0.8)',
												padding: '10px 25px',
												borderRadius: '40px',
												fontSize: '14px',
												color: '#fff'
											} : {}}
									>
										{isMarked ?
											placeHasBeenMarkedContent
											:
											<strong>
												<Svg src='ico_pin-poin-unmarked.svg' />&nbsp;&nbsp;
												Tunjukkan Alamat Dalam Peta
											</strong>}
									</button>
								</span>
							</div>
						</Level.Left>
					</Level>
				</Form>
			</Page>
		);
	};

	render() {
		const { history } = this.props;
		const HeaderPage = {
			left: (
				this.state.map.display ?
					<Button onClick={this.resetMap}>
						<Svg src={'ico_arrow-back-left.svg'} />
					</Button> :
					<Button onClick={history.goBack}>
						BATAL
					</Button>
			),
			center: this.state.map.display ? 'Tandai Lokasi Pengiriman' : 'Alamat Baru',
			right: (
				this.state.map.display ?
					<Button onClick={this.saveMap}>
						SIMPAN
					</Button> :
					<Button onClick={this.onSubmit} disabled={(!this.state.allowSubmit || this.state.submitting)}>
						SIMPAN
					</Button>
			)
		};

		return (
			<div>
				{this.renderData()}
				<Header.Modal {...HeaderPage} />
			</div>
		);
	};
};

const mapStateToProps = (state) => {
	return {
		...state
	};
};

const doAfterAnonymous = (props) => {
	const { cookies, history, dispatch } = props;
	if (!cookies.get(isLogin) || cookies.get(isLogin) === 'false') {
		history.push('/login');
	}

	dispatch(actions.getCity(cookies.get(userToken), { q: '' }, 'init'));
};

export default withCookies(connect(mapStateToProps)(Shared(Address, doAfterAnonymous, false)));
