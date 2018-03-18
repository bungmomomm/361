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
import { actions as commentActions } from '@/state/v4/Comment';
import { actions as usersActions } from '@/state/v4/User';
import { actions as sharedActions } from '@/state/v4/Shared';
import { uniqid } from '@/utils';

class Love extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			loading: false,
			showModal: false
		};
	}

	async loveClicked(e) {
		const { cookies, data, dispatch, onClick, status } = this.props;
		const { loading } = this.state;
		let message = '';
		if (cookies.get('isLogin') === 'false') {
			this.setState({
				showModal: true
			});
			return;
		}
		if (loading) {
			return;
		}
		this.setState({
			loading: true
		});
		if (status === 1) {
			message = 'Produk berhasil dihapus dari Lovelist';
			await dispatch(lovelistActions.removeFromLovelist(cookies.get('user.token'), data));
		} else {
			message = 'Produk berhasil disimpan ke Lovelist';
			await dispatch(lovelistActions.addToLovelist(cookies.get('user.token'), data));
		}
		dispatch(commentActions.bulkieCommentAction(cookies.get('user.token'), [data]));
		await dispatch(lovelistActions.bulkieCountByProduct(cookies.get('user.token'), [data]));
		this.setState({
			loading: false
		});
		dispatch(sharedActions.showSnack(uniqid('err-'), {
			label: message,
			timeout: 3000
		}));

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
		const { disabled, showNumber, status, total } = this.props;
		const { loading, showModal } = this.state;
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

export default withCookies(connect()(Love));