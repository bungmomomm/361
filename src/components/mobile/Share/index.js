import React, { PureComponent } from 'react';
import { Svg, Modal, Level, Button } from '@/components/mobile';
import {
	FacebookIcon,
	FacebookShareButton,
	FacebookShareCount,
	TwitterIcon,
	TwitterShareButton,
	GooglePlusIcon,
	GooglePlusShareButton,
	GooglePlusShareCount,
	WhatsappIcon,
	WhatsappShareButton,
	EmailIcon,
	EmailShareButton
} from 'react-share';
import style from './style.scss';
import PropTypes from 'prop-types';

class Share extends PureComponent {
	static propTypes = {
		url: PropTypes.string,
		title: PropTypes.string
	};

	state = {
		isOpen: false,
		shareCountEnabled: false
	};

	modalStyle = {
		backgroundColor: '#fff',
		borderRadius: 2,
		maxWidth: 500,
		margin: '0 auto 0 auto',
		zIndex: '2',
		display: 'block'
	};

	toggleModal = () => {
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	share = () => {
		const { title, url } = this.props;

		let share = (
			<span>
				<button onClick={this.toggleModal}>
					<Svg src={'ico_share.svg'} />
				</button>

				{this.state.isOpen && (
					<Modal show={1}>
						<div className='font-medium'>
							<h3>Bagikan</h3>
							<Level style={{ padding: '0px' }} className='margin--medium-v'>
								<Level.Left />
								<Level.Item className='padding--medium-h'>
									<div className='modal' style={this.modalStyle}>
										<div className={style.network}>
											<FacebookShareButton
												url={url}
												quote={title}
												className={style.share_button}
											>
												<FacebookIcon size={32} round />
											</FacebookShareButton>
											{this.state.shareCountEnabled &&
												<FacebookShareCount
													url={url}
													className={style.share_count}
												>
													{count => count}
												</FacebookShareCount>
											}
										</div>
										<div className={style.network}>
											<TwitterShareButton
												url={url}
												title={title}
												className={style.share_button}
											>
												<TwitterIcon size={32} round />
											</TwitterShareButton>
										</div>
										<div className={style.network}>
											<GooglePlusShareButton
												url={url}
												className={style.share_button}
											>
												<GooglePlusIcon size={32} round />
											</GooglePlusShareButton>
											{this.state.shareCountEnabled && 
												<GooglePlusShareCount
													url={url}
													className={style.share_count}
												>
													{count => count}
												</GooglePlusShareCount>
											}
										</div>
										<div className={style.network}>
											<WhatsappShareButton
												url={url}
												title={title}
												className={style.share_button}
											>
												<WhatsappIcon size={32} round />
											</WhatsappShareButton>
										</div>
										<div className={style.network} style={{ marginRight: '0px' }}>
											<EmailShareButton
												url={url}
												subject={title}
												className={style.share_button}
											>
												<EmailIcon size={32} round />
											</EmailShareButton>
										</div>
									</div>
								</Level.Item>
							</Level>
						</div>
						<Modal.Action
							closeButton={(
								<Button onClick={this.toggleModal}>
									<span className='font-color--primary-ext-2'>TUTUP</span>
								</Button>)}
						/>
					</Modal>
				)}
			</span>
		);

		if (navigator.share) {
			share = (
				<a
					href='/'
					onClick={(e) => {
						e.preventDefault();
						navigator.share({
							title,
							url
						});
					}}
				>
					<Svg src={'ico_share.svg'} />
				</a>
			);
		}

		return share;
	}

	render() {
		return this.share();
	}
}

export default Share;
