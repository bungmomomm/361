import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import util from 'util';
import base64 from 'base-64';

import Shared from '@/containers/Mobile/Shared';

import { Page, Svg, Level, Image, Input, Button, Spinner } from '@/components/mobile';

import CONST from '@/constants';
import { splitString } from '@/utils';

import styles from './profile.scss';

class UserProfileEdit extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			edit: false,
			ovoVerified: false,
			hasPP: true,
			isBuyer: true, // buyer or seller
			formValid: false,
			formError: '',
			formData: props.userProfile,
		};
		this.userToken = this.props.cookies.get(CONST.COOKIE_USER_TOKEN);
		this.isLogin = this.props.cookies.get('isLogin') === 'true' && true;

		this.verifyOVO = this.verifyOVO.bind(this);

		this.loadingView = <div><Spinner /></div>;
	}

	componentWillMount() {
		if (!this.isLogin) {
			const { history } = this.props;
			history.push('/');
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.userProfile !== false) {
			this.setState({
				formData: nextProps.userProfile
			});
		}
	}

	inputHandler(e) {
		const { formData } = this.state;
		const name = e.target.name;
		const value = util.format('%s', e.target.value);

		if (name === 'password') {
			this.setState({
				formData: {
					...formData,
					[name]: base64.encode(value)
				}
			});
		} else {
			this.setState({
				formData: {
					...formData,
					[name]: value
				}
			});
		}
	}

	editProfile(e) {
		e.preventDefault();
		this.setState({ edit: true });
	}

	cancelProfile(e) {
		e.preventDefault();
		this.setState({ edit: false });
	}

	saveProfile(e) {
		e.preventDefault();
		this.setState({ edit: false });
	}

	verifyOVO(e) {
		e.preventDefault();
		this.props.history.push('/profile-edit-ovo');
	}

	renderHeader() {
		const { edit } = this.state;

		const styleHeader = {
			parent: {
				height: '55px'
			},
			left: {
				width: '80px'
			},
			center: {
				alignItems: 'center'
			},
			right: {
				width: '80px'
			}
		};

		const leftHeader = edit ? (
			<Link style={{ color: '#A4A4A4' }} onClick={(e) => (this.cancelProfile(e))} to='#save'>BATAL</Link>
		) : (
			<Link to='/profile'><Svg src='ico_arrow-back-left.svg' /></Link>
		);

		const centerHeader = edit ? 'Ubah Profil' : 'Informasi Akun';

		const rightHeader = edit ? (
			<Link onClick={(e) => (this.saveProfile(e))} to='#save'>SIMPAN</Link>
		) : (
			<Link onClick={(e) => (this.editProfile(e))} to='#edit'>UBAH</Link>
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
					{rightHeader}
				</Level.Right>
			</Level>
		);
	}

	renderAvatar() {
		const { userProfile } = this.props;
		const { isBuyer } = this.state;

		if (_.isEmpty(userProfile)) {
			return (
				<form style={{ padding: '15px' }}>
					{this.loadingView}
				</form>
			);
		}

		const ppClassName = classNames(
			styles.tempPP,
			isBuyer ? styles.buyer : styles.seller
		);

		const ppCtrClassName = classNames(
			styles.tempPPContainer,
			styles.big
		);

		const avatar = userProfile && userProfile.avatar ? (
			<Image width={80} height={80} avatar src={userProfile.avatar} alt={_.capitalize(userProfile.name) || ''} />
		) : (
			<div className={ppClassName}>{splitString(userProfile.name || '')}</div>
		);

		return (
			<div style={{ alignItems: 'center' }}>
				<div className={ppCtrClassName}>
					{avatar}
					{this.state.edit ? <Link className={styles.editPP} to='#editPhoto'>UBAH</Link> : null}
				</div>
			</div>
		);
	}

	renderOvo() {
		const { userProfile } = this.props;
		const { edit } = this.state;
		const enableInput = !edit;

		const hpValue = userProfile.hp || '081234567890';
		return (
			userProfile.fg_ovo_verified === 1 ?
				<div className='margin--medium'>
					<label className={styles.label} htmlFor='ovoID'><span style={{ color: '#4E2688' }}>OVO ID</span></label>
					<Input disabled={enableInput} id='ovoID' flat defaultValue={hpValue} />
					<span style={{ color: '#4E2688', fontSize: '12px' }}>OVO ID anda telah terhubung</span>
				</div> :
				<div className='margin--medium'>
					<Button color='primary' size='large' onClick={this.verifyOVO}>VERIFIKASI OVO ID</Button>
				</div>
		);
	}

	renderForm() {
		const { userProfile } = this.props;
		const { edit } = this.state;
		const enableInput = !edit;

		if (_.isEmpty(userProfile)) {
			return (
				<form style={{ padding: '15px' }}>
					{this.loadingView}
				</form>
			);
		}

		const fullName = _.chain(userProfile.name).lowerCase().startCase().value() || 'Nama Lengkap';
		const nameField = (
			<div className='margin--medium'>
				<label className={styles.label} htmlFor='fullName'>Nama Lengkap</label>
				<Input name='name' disabled={enableInput} id='fullName' flat defaultValue={fullName} onChange={(e) => this.inputHandler(e)} />
			</div>
		);

		const emailValue = !_.isEmpty(userProfile.email) ? userProfile.email : 'email@domain.com';
		const emailEditLink = edit ? (
			<Link className={styles.inputChangeLink} to='/profile-edit-email'>UBAH</Link>
		) : null;
		const emailField = (
			<div className='margin--medium'>
				<label className={styles.label} htmlFor='email'>Email</label>
				<div className={styles.inputChange}>
					<div className={styles.inputChangeInput}>
						<Input disabled={enableInput} autoComplete='off' readOnly id='email' flat defaultValue={emailValue} />
					</div>
					{emailEditLink}
				</div>
			</div>
		);

		const phoneValue = !_.isEmpty(userProfile.phone) ? userProfile.phone : '081234567890';
		const hpEditLink = edit ? (
			<Link className={styles.inputChangeLink} to='/profile-edit-hp'>UBAH</Link>
		) : null;
		const hpField = (
			<div className='margin--medium'>
				<label className={styles.label} htmlFor='cellPhone'>Nomor Handphone</label>
				<div className={styles.inputChange}>
					<div className={styles.inputChangeInput}>
						<Input disabled={enableInput} autoComplete='off' readOnly id='cellPhone' flat defaultValue={phoneValue} />
					</div>
					{hpEditLink}
				</div>
			</div>
		);

		const genderValue = !_.isEmpty(userProfile.gender) ? _.capitalize(userProfile.gender) : 'Pria';
		const genderField = (
			<div className='margin--medium'>
				<label className={styles.label} htmlFor='gender'>Jenis Kelamin</label>
				<Input name='gender' disabled={enableInput} autoComplete='off' id='gender' flat defaultValue={genderValue} onChange={(e) => this.inputHandler(e)} />
			</div>
		);

		
		const dobValue = moment(userProfile.birthday).isValid() === true ? moment(userProfile.birthday).format('DD/MM/YYYY') : 'DD/MM/YYYY';
		const dobField = (
			<div className='margin--medium'>
				<label className={styles.label} htmlFor='dob'>Tanggal Lahir</label>
				<Input name='birthday' disabled={enableInput} autoComplete='off' id='dob' flat defaultValue={dobValue} onChange={(e) => this.inputHandler(e)} />
			</div>
		);

		const passwordEditLink = edit ? (
			<Link className={styles.inputChangeLink} to='/profile-edit-password'>UBAH</Link>
		) : null;
		const passwordField = (
			<div className='margin--medium'>
				<label className={styles.label} htmlFor='password'>Password</label>
				<div className={styles.inputChange}>
					<div className={styles.inputChangeInput}>
						<Input disabled={enableInput} autoComplete='off' readOnly id='password' type='password' flat defaultValue='password' />
					</div>
					{passwordEditLink}
				</div>
			</div>
		);

		return (
			<form style={{ padding: '15px' }}>
				{nameField}
				{emailField}
				{hpField}
				{genderField}
				{dobField}
				{passwordField}
				{this.renderOvo()}
			</form>
		);
	}

	render() {
		return (
			<Page>
				{this.renderHeader()}
				{this.renderAvatar()}
				{this.renderForm()}
			</Page>
		);
	}
}

// UserProfileEdit.defaultProps = {
// 	userProfile: ''
// };

const mapStateToProps = (state) => {
	return {
		...state,
		userProfile: state.users.userProfile,
		isLoading: state.users.isLoading
	};
};

export default withCookies(connect(mapStateToProps)(Shared(UserProfileEdit)));