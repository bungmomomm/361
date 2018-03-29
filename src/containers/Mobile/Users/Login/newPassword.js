import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { actions as users } from '@/state/v4/User';
import {
	Header,
	Page,
	Button,
	Svg,
	Input
} from '@/components/mobile';
import Shared from '@/containers/Mobile/Shared';
import styles from '../user.scss';
import { to } from 'await-to-js';
import validator from 'validator';
import queryString from 'query-string';
import { userSource, userToken } from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class NewPassword extends Component {
	constructor(props) {
		super(props);
		this.source = this.props.cookies.get(userSource);
		this.props = props;
		const query = queryString.parse(location.search);
		this.state = {
			error: false,
			typed: false,
			isValidPassword: false,
			isValidConfirmPassword: false,
			pass1: '',
			pass2: '',
			token: query.token || false
		};
	}

	async onNewPassword(e) {
		const { dispatch, cookies, history } = this.props;
		const { pass1, pass2, token } = this.state;
		const [err, response] = await to(dispatch(new users.userNewPassword(cookies.get(userToken), pass1, pass2, token)));
		if (err) {
			this.setState({
				error: true,
			});
			return err;
		}
		this.setState({
			error: false,
			message: response.data,
			showModal: true
		});
		history.push('/login');
		return response;
	}

	onBack(e) {
		const { history } = this.props;
		history.goBack();
	}

	onPasswordChange(value) {
		const { pass2 } = this.state;
		let isValidPassword = false;
		let isValidConfirmPassword = false;
		if (!validator.isEmpty(value) && validator.isLength(value, { min: 6, max: undefined })) {
			isValidPassword = true;
		}
		if (pass2 !== '' && pass2 !== value) {
			isValidPassword = false;
		}
		if (pass2 === value) {
			isValidConfirmPassword = true;
		}
		this.setState({
			pass1Typed: (value !== ''),
			pass1: value,
			isValidPassword,
			isValidConfirmPassword
		});
	}

	onConfirmPasswordChange(value) {
		const { pass1 } = this.state;

		let isValidConfirmPassword = false;
		let isValidPassword = false;
		if (pass1 === value) {
			isValidConfirmPassword = true;
			isValidPassword = true;
		}
		this.setState({
			pass2Typed: (value !== ''),
			pass2: value,
			isValidConfirmPassword,
			isValidPassword
		});
	}

	handlePick(current) {
		this.setState({ current });
	}

	render() {
		const { loading } = this.props;
		const { pass1, pass2, error, pass1Typed, pass2Typed, isValidPassword, isValidConfirmPassword, visiblePassword, visibleConfirmPassword } = this.state;

		const HeaderPage = {
			left: (
				<Button onClick={(e) => this.onBack(e)}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: 'Buat Password Baru',
			right: null
		};

		const isValidAllPassword = isValidPassword && isValidConfirmPassword;

		return (
			<div className='full-height' style={this.props.style}>
				<Page color='white'>
					<div className={styles.container}>
						<div className='margin--medium-v text-center'>
							<Input
								disabled={loading}
								flat
								placeholder=''
								label='Password'
								type={visiblePassword ? 'text' : 'password'}
								onChange={(e) => this.onPasswordChange(e.target.value)}
								error={(!isValidPassword && pass1Typed) || error}
								iconRight={pass1Typed && (
									<Button onClick={() => this.setState({ visiblePassword: !visiblePassword })}>
										<Svg src={visiblePassword ? 'ico_password_hide.svg' : 'ico_password_show.svg'} />
									</Button>
								)}
								hint={error ? 'We are unable to proccess your request, please try again' : (pass1.length < 6 ? `${6 - pass1.length} karakter lagi` : '')}
							/>
						</div>
						<div className='margin--medium-v text-center'>
							<Input
								disabled={loading}
								flat
								placeholder=''
								label='Ulangi Password'
								type={visibleConfirmPassword ? 'text' : 'password'}
								onChange={(e) => this.onConfirmPasswordChange(e.target.value)}
								error={(!isValidConfirmPassword && pass2Typed) || error}
								iconRight={pass2Typed && (
									<Button onClick={() => this.setState({ visibleConfirmPassword: !visibleConfirmPassword })}>
										<Svg src={visibleConfirmPassword ? 'ico_password_hide.svg' : 'ico_password_show.svg'} />
									</Button>
								)}
								hint={error ? 'We are unable to proccess your request, please try again' : (pass2.length < 6 ? `${6 - pass2.length} karakter lagi` : '')}
							/>
						</div>
						<div className='margin--medium-v'>
							<Button
								className={'error'}
								color='yellow'
								size='large'
								disabled={!isValidAllPassword}
								loading={loading}
								onClick={e => this.onNewPassword(e)}
							>
								RESET PASSWORD
							</Button>
						</div>
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		...state,
		isLoginLoading: state.users.isLoading
	};
};
const doAfterAnonymous = props => {

};

export default withCookies(connect(mapStateToProps)(Shared(NewPassword, doAfterAnonymous)));
