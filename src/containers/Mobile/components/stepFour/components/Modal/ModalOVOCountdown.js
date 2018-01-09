import React, { Component } from 'react';
import { Image } from '@/components';
// component load
import { Modal, Level } from 'mm-ui';
// import styles from './ModalOVOCountdown.scss';
// import { T } from '@/data/translations';

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
						<Level.Item className='text-center'>
							<Image src='loading-momo.png' />
						</Level.Item>
					</Level>	
				</Modal.Header>
				<Modal.Body>
					<p className='text-center font-purple'><strong>OVO Payment</strong></p>
					<p className='text-center'>Konfirmasi pembayaran telah dikirim ke Aplikasi OVO Anda 
						<br /> 
						Mohon lakukan konfirmasi pembayaran dalam <strong>30 detik</strong>.
					</p>
				</Modal.Body>
			</Modal>
		);
	}
}
