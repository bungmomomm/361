import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import Shared from '@/containers/Mobile/Shared';
import { Page, Svg, Button, Header, Select, Level, Radio } from '@/components/mobile';
import { actions } from '@/state/v4/Address';
import styles from './style.scss';
import { Form, Input } from '@/components/mobile/Formsy';
import { to } from 'await-to-js';
import { Promise } from 'es6-promise';
import _ from 'lodash';

class Address extends Component {

	state = {
		allowSubmit: false,
		showSelect: {
			province: false,
			city: false,
			district: false
		},
		disabled: {
			province: false,
			city: false,
			district: false
		},
		selected: {
			province: '',
			city: '',
			district: ''
		},
		type: 'shipping',
		submitting: false,
		default: 0,
		edit: {}
	};

	componentWillReceiveProps(nextProps) {
		if (this.props.address.edit !== nextProps.address.edit) {
			(async () => {
				const { dispatch, cookies, address, address: { edit } } = nextProps;
				const selected = { };

				selected.province = address.data.provinces.filter((obj) => {
					return obj.name === edit.province;
				});

				if (selected.province.length) {
					const cities = await dispatch(actions.getCity(cookies.get('user.token'), { province_id: selected.province[0].id }));
					selected.city = cities.data.data.cities.filter((obj) => {
						return obj.name === edit.city;
					});

					if (selected.city.length) {
						const districts = await dispatch(actions.getDistrict(cookies.get('user.token'), { city_id: selected.city[0].id }));
						selected.district = districts.data.data.districts.filter((obj) => {
							return obj.name === edit.district;
						});
					}
				}

				this.setState({
					...this.state,
					edit: address.edit,
					selected: {
						province: selected.province.length ? selected.province[0].id : '',
						city: selected.city.length ? selected.city[0].id : '',
						district: selected.district.length ? selected.district[0].id : '',
					},
					default: edit.fg_default
				});

			})();
		}
	}

	componentWillUnmount() {
		const { dispatch } = this.props;
		dispatch(actions.mutateState({ edit: {} }));
	}

	onSelectChange = (v, which = 'province') => {
		this.setState({
			selected: {
				...this.state.selected,
				[which]: v
			}
		});

		if (which === 'province') {
			this.setState({
				disabled: {
					...this.state.disabled,
					city: true,
					district: true
				},
				selected: {
					...this.state.selected,
					city: '',
					district: ''
				}
			});

			if (v) {
				(async () => {
					const { dispatch, cookies } = this.props;
					const [err, resp] = await to(dispatch(actions.getCity(cookies.get('user.token'), { province_id: v })));

					if (err) {
						return Promise.reject(err);
					}

					this.setState({
						disabled: {
							...this.state.disabled,
							city: false
						}
					});

					return Promise.resolve(resp);
				})();
			}
		} else if (which === 'city') {
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
					const { dispatch, cookies } = this.props;
					const [err, resp] = await to(dispatch(actions.getDistrict(cookies.get('user.token'), { offset: 30 })));

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

	onTextChange = (e) => {
		this.setState({
			edit: {
				...this.state.edit,
				[e.currentTarget.name]: e.currentTarget.value
			}
		});
	};

	onSubmit = () => {
		this.formsy.submit();
	};

	toggleShow = (which = 'province') => {
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
		model = {
			...model,
			type: this.state.type,
			country_id: 1,
			is_supported_pin_point: 0,
			latitude: '',
			longitude: '',
			default: this.state.default,
			address_id: this.state.edit.id
		};

		const { dispatch, cookies, history } = this.props;
		this.setState({ submitting: true });
		await dispatch(actions.editAddress(cookies.get('user.token'), model));

		history.push('/address');
	};

	renderData = () => {
		const { address } = this.props;
		const provinces = address.options.provinces;
		const cities = address.options.cities;
		const districts = address.options.districts;

		const selected = {
			province: provinces.filter((obj) => {
				return obj.value === this.state.selected.province;
			}),
			city: cities.filter((obj) => {
				return obj.value === this.state.selected.city;
			}),
			district: districts.filter((obj) => {
				return obj.value === this.state.selected.district;
			})
		};

		return (
			<Page>
				<Form
					style={{ padding: '15px' }}
					onValidSubmit={this.submit}
					onValid={this.enableButton}
					onInvalid={this.disableButton}
					ref={(form) => { this.formsy = form; }}
				>
					<div className='margin--medium' style={{ marginTop: '50px' }}>
						<label className={styles.label} htmlFor='default_address'>Jadikan Alamat Utama</label>
						<div style={{ marginTop: '10px' }}>
							<Radio
								list
								name='default_address'
								onChange={this.radioChange}
								checked={this.state.default}
								data={[
									{
										value: 0,
										label: (
											<div>
												<span>Tidak</span>
											</div>
										)
									},
									{
										value: 1,
										label: (
											<div>
												<span>Ya</span>
											</div>
										)
									}
								]}
							/>
						</div>
					</div>
					<div className='margin--medium'>
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
							hint='This is hint'
							value={this.state.edit.address_label || ''}
							onChange={this.onTextChange}
						/>
					</div>

					<div className='margin--medium'>
						<label className={styles.label} htmlFor='fullname'>Nama Penerima</label>
						<Input
							id='fullname'
							name='fullname'
							flat
							placeholder='John Doe'
							validations='isWords'
							validationError='Invalid character supplied'
							disabled={this.state.submitting}
							required
							value={this.state.edit.fullname || ''}
							onChange={this.onTextChange}
						/>
					</div>

					<div className='margin--medium'>
						<label className={styles.label} htmlFor='telephone'>Nomor Handphone</label>
						<Input
							id='phone'
							name='phone'
							flat
							placeholder='085975049209'
							validations={{
								matchRegexp: /^[0-9]{7,14}$/
							}}
							validationError='Invalid character supplied'
							disabled={this.state.submitting}
							required
							value={this.state.edit.phone || ''}
							onChange={this.onTextChange}
						/>
					</div>

					<div className='margin--medium'>
						<label className={styles.label} htmlFor='province'>Provinsi</label>
						<Level
							className='flex-row border-bottom'
							onClick={
								(this.state.disabled.province || this.state.submitting) ? false : () => this.toggleShow()
							}
						>
							<Level.Left>
								<Button className='flex-center' disabled={(this.state.disabled.province || this.state.submitting)}>
									<span style={{ marginRight: '10px' }}>
										{selected.province.length ? selected.province[0].label : '- Select Province -'}
									</span>
								</Button>
							</Level.Left>
							<Level.Right>
								<Svg src='ico_chevron-down.svg' />
							</Level.Right>
						</Level>
						<Select
							horizontal
							show={this.state.showSelect.province}
							label='Kota, Provinsi *'
							name='province'
							options={provinces}
							onChange={this.onSelectChange}
							onClose={() => this.toggleShow()}
							defaultValue={selected.province.length ? selected.province[0].value : ''}
						/>
						<Input
							id='province_id'
							name='province_id'
							type='hidden'
							validations={{
								matchRegexp: /^[1-9][0-9]*$/
							}}
							validationError='This field is required'
							value={this.state.selected.province}
							required
						/>
					</div>

					<div className='margin--medium'>
						<label className={styles.label} htmlFor='city'>Kota, Kabupaten</label>
						<Level
							className='flex-row border-bottom'
							onClick={
								(this.state.disabled.city || this.state.submitting) ? false : () => this.toggleShow('city')
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
							label='Kota, Kabupaten *'
							name='city'
							options={cities}
							onChange={(v) => this.onSelectChange(v, 'city')}
							onClose={() => this.toggleShow('city')}
							defaultValue={selected.city.length ? selected.city[0].value : ''}
						/>
						<Input
							id='city_id'
							name='city_id'
							type='hidden'
							validations={{
								matchRegexp: /^[1-9][0-9]*$/
							}}
							validationError='This field is required'
							value={this.state.selected.city}
							required
						/>
					</div>

					<div className='margin--medium'>
						<label className={styles.label} htmlFor='district'>Kecamatan</label>
						<Level
							className='flex-row border-bottom'
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
							onChange={(v) => this.onSelectChange(v, 'district')}
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

					<div className='margin--medium'>
						<label className={styles.label} htmlFor='zipcode'>Kode Pos</label>
						<Input
							id='zipcode'
							name='zipcode'
							flat
							placeholder='16451'
							validations={{
								matchRegexp: /^[0-9]{5,6}$/
							}}
							validationError='Invalid character supplied'
							disabled={this.state.submitting}
							required
							value={this.state.edit.zipcode || ''}
							onChange={this.onTextChange}
						/>
					</div>

					<div className='margin--medium'>
						<label className={styles.label} htmlFor='address'>Address</label>
						<Input
							id='address'
							name='address'
							flat
							placeholder='Jl. Perbanas No. 5A - Tugu'
							validationError='This field is required'
							disabled={this.state.submitting}
							required
							value={this.state.edit.address || ''}
							onChange={this.onTextChange}
						/>
					</div>
				</Form>
			</Page>
		);
	};

	render() {
		const { history } = this.props;
		const HeaderPage = {
			left: (
				<Button onClick={history.goBack}>
					<Svg src={'ico_arrow-back-left.svg'} />
				</Button>
			),
			center: 'Ubah Alamat',
			right: (
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

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, history, match: { params } } = props;
	if (!cookies.get('isLogin')) {
		history.push('/login');
	}

	await dispatch(actions.getProvinces(cookies.get('user.token')));
	const address = await dispatch(actions.getAddress(cookies.get('user.token')));
	const shipping = _.chain(address).get('data.data.shipping').value();

	if (!shipping) {
		return Promise.reject(new Error('Invalid, address not found.'));
	}

	const edit = shipping.filter((obj) => {
		return parseInt(obj.id, 10) === parseInt(params.id, 10);
	});

	if (!edit.length) {
		return Promise.reject(new Error('Invalid, address not found.'));
	}

	return dispatch(actions.mutateState({ edit: edit[0] }));
};

export default withCookies(connect(mapStateToProps)(Shared(Address, doAfterAnonymous)));
