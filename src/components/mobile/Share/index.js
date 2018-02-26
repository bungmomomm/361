import React, { PureComponent } from 'react';
import { Svg } from '@/components/mobile';
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
		isOpen: false
	};

	backdropStyle = {
		position: 'fixed',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'rgba(0,0,0,0.3)',
		padding: '60px 50px 50px 50px',
		zIndex: 1
	};

	modalStyle = {
		backgroundColor: '#fff',
		borderRadius: 2,
		maxWidth: 500,
		minHeight: 100,
		// margin: '0 0 0 auto',
		margin: '0 auto 0 auto',
		padding: 20,
		zIndex: 2,
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
				<a
					href='/'
					onClick={(e) => {
						e.preventDefault();
						this.toggleModal();
					}}
				>
					<Svg src={'ico_share.svg'} />
				</a>

				{this.state.isOpen && (
					<div className='backdrop' style={this.backdropStyle} onClick={this.toggleModal} role='button' tabIndex={0}>
						<div className='modal' style={this.modalStyle}>
							<div style={{ marginBottom: '5px' }}>
								Share to:
							</div>
							<div className={style.network}>
								<FacebookShareButton
									url={url}
									quote={title}
									className={style.share_button}
								>
									<FacebookIcon size={32} round />
								</FacebookShareButton>
								<FacebookShareCount
									url={url}
									className={style.share_count}
								>
									{count => count}
								</FacebookShareCount>
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
								<GooglePlusShareCount
									url={url}
									className={style.share_count}
								>
									{count => count}
								</GooglePlusShareCount>
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
					</div>
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
