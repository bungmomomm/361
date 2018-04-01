import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import util from 'util';
import { to } from 'await-to-js';
import Recaptcha from 'react-recaptcha';
import validator from 'validator';

import Shared from '@/containers/Mobile/Shared';
import Otp from '@/containers/Mobile/Shared/Otp';

import EditEmail from './layouts/editEmail';
import EditHp from './layouts/editHP';
import EditPassword from './layouts/editPassword';
import EditOvo from './layouts/editOVO';

import { Page, Svg, Level, Image, Input, Button, Spinner, Select, Notification } from '@/components/mobile';

import { actions as userActions } from '@/state/v4/User';

import CONST from '@/constants';

import styles from './profile.scss';
import cookiesLabel from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class UserProfileEdit extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			showSelect: false,
			newGender: null,
			layout: 'main',
			submittingForm: false,
			validName: true,
			nameHint: '',
			validBirthday: true,
			birthdayHint: '',
			formResult: {
				status: '',
				message: ''
			},
			formData: props.userProfile,
			otpCountdown: 0
		};
		this.isLogin = this.props.cookies.get(cookiesLabel.isLogin) === 'true';

		this.AVATAR_FIELD = CONST.USER_PROFILE_FIELD.avatar;
		this.NAME_FIELD = CONST.USER_PROFILE_FIELD.name;
		this.PHONE_FIELD = CONST.USER_PROFILE_FIELD.phone;
		this.GENDER_FIELD = CONST.USER_PROFILE_FIELD.gender;
		this.BIRTHDAY_FIELD = CONST.USER_PROFILE_FIELD.birthday;
		this.EMAIL_FIELD = CONST.USER_PROFILE_FIELD.email;
		this.OLD_PWD_FIELD = CONST.USER_PROFILE_FIELD.oldPwd;
		this.NEW_PWD_FIELD = CONST.USER_PROFILE_FIELD.newPwd;
		this.USER_POINT_FIELD = CONST.USER_PROFILE_FIELD.userPoint;
		this.OVO_ID_FIELD = CONST.USER_PROFILE_FIELD.ovoId;
		this.OVO_VERIFIED_FIELD = CONST.USER_PROFILE_FIELD.ovoVerified;
		this.HP_EMAIL_FIELD = CONST.USER_PROFILE_FIELD.hpEmail;
		this.OTP_FIELD = CONST.USER_PROFILE_FIELD.otp;

		this.loadingView = <Spinner />;
		this.editIcon = <Svg src='ico_edit.svg' />;
		this.recaptchaInstance = null;

		if (!this.isLogin) {
			const { history } = this.props;
			history.push('/login?redirect_uri=/profile');
		}
	}

	componentWillReceiveProps(nextProps) {
		const { formData } = this.state;
		if (nextProps.userProfile !== this.props.userProfile) {
			this.setState({
				formData: {
					...formData,
					...nextProps.userProfile
				}
			});
		}
	}

	setTimeoutForm(n) {
		window.setTimeout(() => {
			this.setState({
				layout: 'main',
				formResult: {
					status: '',
					message: ''
				}
			});
		}, n);
	}

	switchLayoutHandler(e, layout, data = null) {
		const { formData } = this.state;
		this.setState({ layout });

		if (data !== null) {
			this.setState({
				formData: {
					...formData,
					...data
				}
			});
		}

		if (layout === 'main') {
			this.setState({
				formResult: {
					status: '',
					message: ''
				}
			});
		}
	}

	inputHandler(e) {
		e.preventDefault();
		const { formData } = this.state;
		const name = e.target.name;
		const value = util.format('%s', e.target.value);

		this.inputValidation(name, value);

		this.setState({
			formData: {
				...formData,
				[name]: value
			}
		});
	}

	inputValidation(type, value) {
		if (type === this.NAME_FIELD) {
			let validName = false;
			let nameHint = '';

			if (value.length > 0 && value.length <= 3) {
				nameHint = 'Nama Lengkap harus lebih dari 3 karakter';
			} else if (validator.isEmpty(value)) {
				nameHint = 'Nama Lengkap wajib diisi';
			} else {
				validName = true;
			}

			this.setState({ validName, nameHint });
		} else if (type === this.BIRTHDAY_FIELD) {
			let validBirthday = false;
			let birthdayHint = '';

			if (moment(value).isValid() === false) {
				birthdayHint = 'Format tanggal lahir tidak sesuai';
			} else {
				validBirthday = true;
			}

			this.setState({ validBirthday, birthdayHint });
		}
	}

	showSelectGender() {
		const { showSelect } = this.state;
		this.setState({
			showSelect: !showSelect
		});
	}

	selectGenderHandler(value) {
		this.setState({ newGender: value });
	}

	updateGender() {
		const { newGender, formData } = this.state;
		if (newGender !== null) {
			this.setState({
				formData: {
					...formData,
					[this.GENDER_FIELD]: newGender
				},
				showSelect: false,
				newGender: null
			});
		} else {
			this.setState({
				showSelect: false,
				newGender: null
			});
		}
	}

	saveFormData(data = null) {
		const { formData } = this.state;
		if (this.recaptchaInstance !== null) {
			this.recaptchaInstance.execute();
		}

		if (data !== null) {
			this.setState({
				formData: {
					...formData,
					...data
				}
			});
		}
	}

	submitFormData = async (e) => {
		const { cookies, dispatch } = this.props;
		const { layout, formData } = this.state;

		if (!_.isEmpty(layout)) {
			let newData = null;
			if (layout === 'main') {
				newData = {
					[this.NAME_FIELD]: formData[this.NAME_FIELD],
					[this.GENDER_FIELD]: formData[this.GENDER_FIELD],
					[this.BIRTHDAY_FIELD]: formData[this.BIRTHDAY_FIELD]
				};
			} else if (layout === this.PHONE_FIELD) {
				newData = formData[this.HP_EMAIL_FIELD];
			} else if (layout === this.OVO_ID_FIELD) {
				newData = {
					[this.PHONE_FIELD]: formData[this.OVO_ID_FIELD]
				};
			} else if (layout === this.NEW_PWD_FIELD) {
				newData = {
					[this.NEW_PWD_FIELD]: formData[this.NEW_PWD_FIELD],
					[this.OLD_PWD_FIELD]: formData[this.OLD_PWD_FIELD],
				};
			} else {
				newData = {
					[layout]: formData[layout]
				};
			}

			this.setState({ submittingForm: true });

			let dispatchAction = null;
			if (layout === this.OVO_ID_FIELD) {
				dispatchAction = dispatch(userActions.userValidateOvo(cookies.get(cookiesLabel.userToken), newData));
			} else if (layout === this.PHONE_FIELD) {
				dispatchAction = dispatch(userActions.userOtp(cookies.get(cookiesLabel.userToken), newData, 'edit'));
			} else {
				dispatchAction = dispatch(userActions.userEditProfile(cookies.get(cookiesLabel.userToken), newData));
			}
			const [err, response] = await to(dispatchAction);
			if (err) {
				this.setState({
					formResult: {
						status: 'failed',
						message: err.error_message || 'Form failed'
					},
					submittingForm: false
				});
			} else if (response) {
				if (layout === this.PHONE_FIELD) {
					const countdown = _.chain(response).get('countdown').value() || 60;

					this.setState({
						otpCountdown: countdown,
						formData: {
							...formData,
							[this.HP_EMAIL_FIELD]: newData
						},
						layout: this.OTP_FIELD,
					});
				} else {
					dispatch(userActions.userGetProfile(cookies.get(cookiesLabel.userToken)));
					this.setState({
						formResult: {
							status: 'success',
							message: response.msg || 'Form success'
						},
						formData: {
							...formData,
							...newData
						},
						submittingForm: false
					});
					this.setTimeoutForm(5000);
				}
			}
		}

		if (this.recaptchaInstance !== null) {
			this.recaptchaInstance.reset();
		}
	}

	successValidateOtp = async (response) => {
		const { cookies, dispatch } = this.props;

		await dispatch(userActions.userGetProfile(cookies.get(cookiesLabel.userToken)));
		this.setState({
			layout: 'main',
			formResult: {
				status: 'success',
				message: response.msg || 'Nomor Handphone berhasil diubah'
			},
			otpCountdown: 0
		});

		this.setTimeoutForm(5000);
	}

	renderHeader() {
		const { isLoading } = this.props;
		const { validName, validBirthday, submittingForm } = this.state;
		const styleHeader = {
			parent: {
				height: '55px',
				marginBottom: '20px'
			},
			left: {
				width: '80px'
			},
			center: {
				alignItems: 'center',
				fontFamily: 'Lato-Regular',
				fontSize: '15px'
			},
			right: {
				width: '80px'
			}
		};

		const leftHeader = (
			<Link to='/profile'><Svg src='ico_arrow-back-left.svg' /></Link>
		);
		const centerHeader = 'Ubah Profil';
		const rightHeader = (
			<Button onClick={() => this.saveFormData()} disabled={submittingForm || !validName || !validBirthday} className={styles.saveButton}>SIMPAN</Button>
		);

		return (
			<Level style={styleHeader.parent}>
				<Level.Left style={styleHeader.left}>
					{leftHeader}
				</Level.Left>
				<Level.Item style={styleHeader.center}>
					{centerHeader}
				</Level.Item>
				<Level.Right style={styleHeader.right}>
					{isLoading ? this.loadingView : rightHeader}
				</Level.Right>
			</Level>
		);
	}

	renderNotif() {
		const { formResult } = this.state;
		if (!_.isEmpty(formResult.status) && !_.isEmpty(formResult.message)) {
			const notifColor = formResult.status === 'success' ? 'green' : 'pink';
			return (
				<Notification
					color={notifColor}
					disableClose
					show
				>
					<span>{formResult.message}</span>
				</Notification>
			);
		}

		return null;
	}

	renderAvatar(source = 'local') {
		const { formData } = this.state;

		if (_.isEmpty(formData)) {
			return (
				<form style={{ padding: '15px' }}>
					{this.loadingView}
				</form>
			);
		}

		const ppCtrClassName = classNames(
			styles.tempPPContainer,
			styles.big
		);

		let avatar;
		const defaultImage = require('@/assets/images/mobile/ico_avatar.png');
		if (source === 'api') {
			avatar = formData && formData[this.AVATAR_FIELD] ? (
				<Image width={80} height={80} avatar src={formData[this.AVATAR_FIELD]} alt={_.capitalize(formData[this.NAME_FIELD]) || ''} />
			) : (
				<Image width={80} height={80} avatar src={defaultImage} alt={_.capitalize(formData[this.NAME_FIELD]) || ''} />
			);
		} else {
			avatar = <Image width={80} height={80} avatar src={defaultImage} alt={_.capitalize(formData[this.NAME_FIELD]) || ''} />;
		}

		return (
			<div style={{ alignItems: 'center' }}>
				<div className={ppCtrClassName}>
					{avatar}
				</div>
			</div>
		);
	}

	renderOvo() {
		const { userProfile } = this.props;
		const { formData } = this.state;

		if (_.isEmpty(userProfile)) {
			return (
				<form style={{ padding: '15px' }}>
					{this.loadingView}
				</form>
			);
		}

		const ovoId = formData[this.OVO_ID_FIELD] || '';
		return (
			formData[this.OVO_VERIFIED_FIELD] === 1 && formData[this.OVO_ID_FIELD] !== 0 ?
				<div className='margin--medium-v'>
					<label className={styles.label} htmlFor='ovoID'><span style={{ color: '#4E2688', fontWeight: 'bold' }}>OVO ID</span></label>
					<div className={styles.inputChange}>
						<div className={styles.inputChangeInput}>
							<Input readOnly id='ovoID' flat defaultValue={ovoId} />
						</div>
						<Button className={styles.inputChangeLink} onClick={(e, value) => this.switchLayoutHandler(e, this.OVO_ID_FIELD)}>{this.editIcon}</Button>
					</div>
					<span style={{ color: '#4E2688', fontSize: '12px', marginTop: '10px' }}>
						<Svg src='ico_ovo_verified.svg' style={{ verticalAlign: 'text-bottom' }} /> OVO ID anda telah terhubung
					</span>
				</div> :
				<div className='margin--medium-v'>
					<Button color='purple' size='large' onClick={(e, value) => this.switchLayoutHandler(e, this.OVO_ID_FIELD)}>VERIFIKASI OVO ID</Button>
				</div>
		);
	}

	renderRecaptcha() {
		const { layout } = this.state;

		if (layout !== this.OTP_FIELD) {
			return (
				<Recaptcha
					ref={e => { this.recaptchaInstance = e; }}
					sitekey={process.env.GOOGLE_CAPTCHA_SITE_KEY}
					size='invisible'
					verifyCallback={(e) => this.submitFormData(e)}
				/>
			);
		}

		return null;
	}

	renderForm() {
		const { userProfile } = this.props;
		const { formData, validName, nameHint, validBirthday, birthdayHint } = this.state;

		if (_.isEmpty(userProfile)) {
			return (
				<form style={{ padding: '15px' }}>
					{this.loadingView}
				</form>
			);
		}

		const fullName = !_.isEmpty(formData[this.NAME_FIELD]) ? formData[this.NAME_FIELD] : '';
		const nameField = (
			<div className='margin--medium-v'>
				<label className={styles.label} htmlFor='fullName'>Nama Lengkap</label>
				<Input
					name={this.NAME_FIELD}
					id='fullName'
					flat
					defaultValue={fullName}
					onChange={(e) => this.inputHandler(e)}
					error={!validName}
					hint={nameHint}
				/>
			</div>
		);

		const emailValue = !_.isEmpty(formData[this.EMAIL_FIELD]) ? formData[this.EMAIL_FIELD] : '';
		const emailField = (
			<div className='margin--medium-v'>
				<label className={styles.label} htmlFor='email'>Email</label>
				<div className={styles.inputChange}>
					<div className={styles.inputChangeInput}>
						<Input autoComplete='off' readOnly id='email' flat defaultValue={emailValue} />
					</div>
					<Button className={styles.inputChangeLink} onClick={(e, value) => this.switchLayoutHandler(e, this.EMAIL_FIELD)}>{this.editIcon}</Button>
				</div>
			</div>
		);

		const phoneValue = !_.isEmpty(formData[this.PHONE_FIELD]) ? formData[this.PHONE_FIELD] : '';
		const phoneField = (
			<div className='margin--medium-v'>
				<label className={styles.label} htmlFor='cellPhone'>Nomor Handphone</label>
				<div className={styles.inputChange}>
					<div className={styles.inputChangeInput}>
						<Input autoComplete='off' readOnly id='cellPhone' flat defaultValue={phoneValue} />
					</div>
					<Button className={styles.inputChangeLink} onClick={(e, value) => this.switchLayoutHandler(e, this.PHONE_FIELD)}>{this.editIcon}</Button>
				</div>
			</div>
		);

		const genderValue = !_.isEmpty(formData[this.GENDER_FIELD]) ? formData[this.GENDER_FIELD] : 'male';
		const genderField = (
			<div className='margin--medium-v'>
				<label className={styles.label} htmlFor='gender'>Jenis Kelamin</label>
				<Level className='flex-row border-bottom' onClick={() => this.showSelectGender()}>
					<Level.Left>
						<div>{genderValue === 'male' ? 'Pria' : 'Wanita'}</div>
					</Level.Left>
					<Level.Right>
						<Button className='flex-center'>
							<Svg src='ico_chevron-down.svg' />
						</Button>
					</Level.Right>
				</Level>
			</div>
		);

		const birthdayValue = moment(formData[this.BIRTHDAY_FIELD]).isValid() === true ? moment(formData[this.BIRTHDAY_FIELD]).format('YYYY-MM-DD') : '1990-01-01';
		const birthdayField = (
			<div className='margin--medium-v'>
				<label className={styles.label} htmlFor='dob'>Tanggal Lahir</label>
				<Input
					type='date'
					name={this.BIRTHDAY_FIELD}
					id='dob'
					flat
					value={birthdayValue}
					onChange={(e) => this.inputHandler(e)}
					error={!validBirthday}
					hint={birthdayHint}
				/>
			</div>
		);

		const passwordField = (
			<div className='margin--medium-v'>
				<label className={styles.label} htmlFor='password'>Password</label>
				<div className={styles.inputChange}>
					<div className={styles.inputChangeInput}>
						<Input autoComplete='off' readOnly id='password' type='password' flat defaultValue='password' />
					</div>
					<Button className={styles.inputChangeLink} onClick={(e, value) => this.switchLayoutHandler(e, this.NEW_PWD_FIELD)}>{this.editIcon}</Button>
				</div>
			</div>
		);

		return (
			<form style={{ padding: '15px' }}>
				{nameField}
				{emailField}
				{phoneField}
				{genderField}
				{birthdayField}
				{passwordField}
				{this.renderOvo()}
			</form>
		);
	}

	renderGenderSelect() {
		const { showSelect, formData } = this.state;
		const genderList = [
			{ value: 'male', label: 'Pria' },
			{ value: 'female', label: 'Wanita' }
		];
		const defaultValue = !_.isEmpty(formData[this.GENDER_FIELD]) ? formData[this.GENDER_FIELD] : null;

		return (
			<Select
				show={showSelect}
				label='Pilih Jenis Kelamin'
				onChange={(e) => this.selectGenderHandler(e)}
				onClose={() => this.updateGender()}
				options={genderList}
				defaultValue={defaultValue}
			/>
		);
	}

	renderLayout() {
		const { layout, formResult, formData, otpCountdown } = this.state;
		let layoutView;
		switch (layout) {
		case this.EMAIL_FIELD:
			layoutView = (
				<EditEmail
					data={formData[this.EMAIL_FIELD]}
					onClickBack={(e, value) => this.switchLayoutHandler(e, 'main')}
					onSave={(e, data) => this.saveFormData(data)}
					formResult={formResult}
				/>
			);
			break;
		case this.PHONE_FIELD:
			layoutView = (
				<EditHp
					data={formData[this.PHONE_FIELD]}
					onClickBack={(e, value) => this.switchLayoutHandler(e, 'main')}
					onSave={(e, data) => this.saveFormData(data)}
					formResult={formResult}
				/>
			);
			break;
		case this.NEW_PWD_FIELD:
			layoutView = (
				<EditPassword
					onClickBack={(e, value) => this.switchLayoutHandler(e, 'main')}
					onSave={(e, data) => this.saveFormData(data)}
					formResult={formResult}
				/>
			);
			break;
		case this.OVO_ID_FIELD:
			layoutView = (
				<EditOvo
					data={formData[this.OVO_ID_FIELD]}
					onClickBack={(e, value) => this.switchLayoutHandler(e, 'main')}
					onSave={(e, data) => this.saveFormData(data)}
					formResult={formResult}
				/>
			);
			break;
		case this.OTP_FIELD:
			layoutView = (
				<Otp
					phoneEmail={formData[this.HP_EMAIL_FIELD]}
					countdownValue={otpCountdown}
					autoSend={false}
					onClickBack={(e, value) => this.switchLayoutHandler(e, this.PHONE_FIELD)}
					onSuccess={(response) => this.successValidateOtp(response)}
				/>
			);
			break;
		default:
			layoutView = (
				<Page style={{ paddingTop: 0 }} color='white'>
					{this.renderHeader()}
					{this.renderNotif()}
					{this.renderAvatar('api')}
					{this.renderForm()}
				</Page>
			);
		}

		return layoutView;
	}

	render() {
		return (
			<div>
				{this.renderLayout()}
				{this.renderRecaptcha()}
				{this.renderGenderSelect()}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		...state,
		userProfile: state.users.userProfile,
		isLoading: state.users.isLoading
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies, shared } = props;

	const serviceUrl = _.chain(shared).get('serviceUrl.account.url').value() || false;
	if (serviceUrl) {
		dispatch(userActions.userGetProfile(cookies.get(cookiesLabel.userToken)));
	}
};

export default withCookies(connect(mapStateToProps)(Shared(UserProfileEdit, doAfterAnonymous)));
