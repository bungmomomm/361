import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import Shared from '@/containers/Mobile/Shared';
import { Link } from 'react-router-dom';
import {
	Header,
	Svg,
	Level,
	Page,
	Timeline
} from '@/components/mobile';
// import styles from './profile.scss';

class MyOrderDetail extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {};
	}

	render() {
		const HeaderPage = ({
			left: (
				<Link to={'/profile'}>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Lacak Pesanan',
			right: null
		});

		return (
			<div style={this.props.style}>
				<Page>
					<div className='margin--medium-v padding--medium-h bg--white'>
						<Level className='padding--none-h padding--medium-v' style={{ borderBottom: '1px solid #D8D8D8' }}>
							<Level.Left className='padding--medium-r'><Svg src='ico_truck-2.svg' /></Level.Left>
							<Level.Item>
								<strong>Status Pengiriman</strong>
								<p><small>
									No. Resi: CGK-872365723652<br />
									Layanan Pengiriman: JNE
								</small></p>
							</Level.Item>
						</Level>
						<Timeline className='margin--medium-v '>
							<Timeline.Item>
								<Timeline.Header>SERANG Paket akan dikirim ke alamat Penerima Penerima</Timeline.Header>
								<Timeline.Content><small>8 April 2017 12:30</small></Timeline.Content>
							</Timeline.Item>
							<Timeline.Item active>
								<Timeline.Header>SERANG Paket akan dikirim ke alamat Penerima Penerima</Timeline.Header>
								<Timeline.Content><small>8 April 2017 12:30</small></Timeline.Content>
							</Timeline.Item>
							<Timeline.Item>
								<Timeline.Header>SERANG Paket akan dikirim ke alamat Penerima Penerima</Timeline.Header>
								<Timeline.Content><small>8 April 2017 12:30</small></Timeline.Content>
							</Timeline.Item>
							<Timeline.Item>
								<Timeline.Header>TANGERANG Paket akan dikirim ke alamat Penerima Penerima</Timeline.Header>
								<Timeline.Content><small>8 April 2017 12:30</small></Timeline.Content>
							</Timeline.Item>
							<Timeline.Item>
								<Timeline.Header>TANGERANG Paket akan dikirim ke alamat Penerima Penerima</Timeline.Header>
								<Timeline.Content><small>8 April 2017 12:30</small></Timeline.Content>
							</Timeline.Item>
						</Timeline>
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		shared: state.shared
	};
};

export default withCookies(connect(mapStateToProps)(Shared(MyOrderDetail)));
