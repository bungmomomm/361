import React, { Component } from 'react';
import { Image } from '@/components';
// component load
import { Modal, Level } from 'mm-ui';
import styles from './ModalOVOCountdown.scss';
import { T } from '@/data/translations';

export default class OvoCountDownModal extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			countdown: this.props.secondsRemaining
		};
		this.coundown = null;
		this.updateTimer = this.updateTimer.bind(this);
	}

	componentDidMount() {
		this.coundown = setInterval(this.updateTimer, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.coundown);
	}

	updateTimer() {
		if (this.state.countdown < 1) {
			clearInterval(this.coundown);
			this.props.finishCountdown();
		} else {
			const time = this.state.countdown - 1;
			this.props.tick(time);
			this.setState({ countdown: time });
		}
	}

	render() {
		return (
			<Modal size='small' show showOverlayCloseButton={false}>
				<Modal.Header>
					<Level>
						<Level.Item className={styles.borderRight}>
							<Image src='loading-momo.png' />
						</Level.Item>
						<Level.Item>
							<div className={styles.countdown}>{this.state.countdown}</div>
						</Level.Item>
					</Level>
				</Modal.Header>
				<Modal.Body>
					<p className='font-purple text-center'><strong>{T.checkout.OVO_PAYMENT}</strong></p>
					<p className='text-center'>Silakan buka aplikasi OVO Anda untuk konfirmasi pembayaran. Pembayaran Anda akan kadaluarsa dalam waktu <strong>{this.props.secondsRemaining} detik</strong>. Terima Kasih</p>
				</Modal.Body>
			</Modal>
		);
	}
}
