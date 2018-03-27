import React, {
	PureComponent
} from 'react';
import {
	Button,
	Modal,
	Level
} from '@/components/mobile';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { actions as lovelistActions } from '@/state/v4/Lovelist';
import { actions as usersActions } from '@/state/v4/User';
import { actions as sharedActions } from '@/state/v4/Shared';
import { uniqid } from '@/utils';
import to from 'await-to-js';
import { isLogin } from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Love extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			loading: false,
			showModal: false,
			status: props.status || -1
		};
	}

	componentWillReceiveProps(nextProps) {
		const { status } = this.state;
		if (status === -1 && nextProps.status !== undefined) {
			this.setState({
				status: nextProps.status
			});
		}
	}

	async loveClicked(e) {
		const { cookies, data, dispatch, onClick, inline } = this.props;
		const { loading, status } = this.state;
		let message = '';
		if (cookies.get(isLogin) === 'false') {
			if (inline) {
				this.setState({
					showModal: true
				});
			} else {
				this.props.onNeedLogin();
			}
			return;
		}
		if (loading) {
			return;
		}
		this.setState({
			loading: true
		});
		let response;
		if (status === 1) {
			message = 'Produk berhasil dihapus dari Lovelist';
			response = await to(dispatch(lovelistActions.removeFromLovelist(cookies.get('user.token'), data)));
			if (response[1]) {
				this.setState({
					status: 0
				});
			}
		} else {
			message = 'Produk berhasil disimpan ke Lovelist';
			response = await to(dispatch(lovelistActions.addToLovelist(cookies.get('user.token'), data)));
			if (response[1]) {
				this.setState({
					status: 1
				});
			}
		}

		this.setState({
			loading: false
		});

		dispatch(sharedActions.showSnack(uniqid('err-'),
			{
				label: message,
				timeout: 3000
			},
			{
				css: {
					snack: {
						display: 'flex',
						position: 'fixed',
						bottom: '30px',
						right: 0,
						left: 0,
						marginRight: 'auto',
						marginLeft: 'auto',
						zIndex: '2',
						width: '300px',
						maxWidth: '480px',
						backgroundColor: 'rgba(0, 0, 0, 0.8)',
						padding: '15px',
						borderRadius: '40px',
						textAlign: 'center',
						largeScreen: {
							left: -15,
						}
					},
					label: {
						flex: '4',
						fontSize: '14px',
						lineHeight: 'normal',
						fontFamily: 'arial, sans-serif',
						color: 'rgba(255, 255, 255, 0.7)',
						width: '100%',
						display: 'block',
						paddingRight: '0px'
					}
				},
				sticky: true,
			}
		));

		if (onClick) {
			onClick(data);
		}
	}

	loginLater() {
		this.setState({
			showModal: false
		});
	}

	loginNow() {
		const { data, dispatch } = this.props;
		dispatch(new usersActions.addAfterLogin('Lovelist', 'addToLovelist', [data]));
		this.setState({
			showModal: false
		});
		this.props.onNeedLogin();
	}

	render() {
		const { disabled, showNumber, total } = this.props;
		const { loading, showModal, status } = this.state;
		return (
			<div>
				<Button.Love
					onClick={(e) => this.loveClicked(e)}
					disabled={loading || disabled}
					showNumber={showNumber}
					status={status}
					total={total}
				/>
				{showModal && (
					<Modal show>
						<div className='font-medium'>
							<h3 className='text-center'>Lovelist</h3>
							<Level style={{ padding: '0px' }} className='margin--medium-v'>
								<Level.Left />
								<Level.Item className='padding--medium-h'>
									<div className='font-small'>Silahkan login/register untuk menambahkan produk ke Lovelist</div>
								</Level.Item>
							</Level>
						</div>
						<Modal.Action
							closeButton={(
								<Button onClick={(e) => this.loginLater()}>
									<span className='font-color--primary-ext-2'>NANTI</span>
								</Button>)}
							confirmButton={(<Button onClick={(e) => this.loginNow()}>SEKARANG</Button>)}
						/>
					</Modal>
				)}
			</div>
		);
	}
}

Love.defaultProps = {
	inline: true
};

export default withCookies(connect()(Love));
