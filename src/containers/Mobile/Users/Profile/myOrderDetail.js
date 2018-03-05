import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import Shared from '@/containers/Mobile/Shared';
import { Link } from 'react-router-dom';
import {
	Header,
	Svg,
	Page,
	Level,
	Button,
	Image
} from '@/components/mobile';
import styles from './profile.scss';

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
			center: 'Detail Pesanan',
			right: null
		});

		return (
			<div style={this.props.style}>
				<Page>
					<Level>
						<Level.Left>
							<strong>Pesanan #C000008848057</strong>
							<small className='font-color--primary-ext-2'>Dipesan 6 April 2017</small>
						</Level.Left>
						<Level.Item style={{ alignItems: 'flex-end' }}>
							<Button circle inline size='medium' color='blue'><Svg src='ico_download.svg' /></Button>
						</Level.Item>
					</Level>
					<ul className={styles.orderList}>
						<li>
							<div>
								<Level className='bg--mm-blue-ext-3' style={{ borderBottom: '1px solid #D8D8D8' }}>
									<Level.Left><Svg src='ico_box.svg' /></Level.Left>
									<Level.Item className='padding--medium'>
										<strong>Pesanan Diterima</strong>
										<small>No. Resi: CGK-872365723652</small>
										<small>Layanan Pengiriman: JNE</small>
									</Level.Item>
									<Level.Right style={{ alignItems: 'flex-end' }}>
										<Button rounded inline size='small' color='white'>Lacak</Button>
									</Level.Right>
								</Level>
								<Level className='bg--white'>
									<Level.Item className='padding--normal-b' style={{ borderBottom: '1px solid #D8D8D8' }}>
										<strong>MatahariStore</strong>
									</Level.Item>
									<Level.Item className='padding--normal-b' style={{ borderBottom: '1px solid #D8D8D8', alignItems: 'flex-end' }}>
										<span className='font-color--mm-blue'>#SO00008848057</span>
									</Level.Item>
								</Level>
								<Level className='bg--white'>
									<Level.Left>
										<Image local width={60} height={77} src='temp/product-2.jpg' />
									</Level.Left>
									<Level.Item>
										<span className='font-xsmall text-uppercase'>BitterBallenBall</span>
										<span className='margin--small font-color--primary-ext-2'>Olivia Von Halle pink print</span>
										<span className='font-small margin--small-t'>Kuantitas <strong>1</strong></span>
									</Level.Item>
									<Level.Right>
										<strong>Rp1.199.000</strong>
									</Level.Right>
								</Level>
								<Level className='bg--white' style={{ borderBottom: '1px solid #D8D8D8' }}>
									<Level.Item className='padding--normal-r'>
										<Button rounded size='medium' color='secondary'><Svg src='ico_download.svg' /> Beri Ulasan</Button>
									</Level.Item>
									<Level.Item className='padding--normal-l'>
										<Button rounded size='medium' color='white'><Svg src='ico_download.svg' /> Beli Lagi</Button>
									</Level.Item>
								</Level>
							</div>
						</li>
						<li>
							<div>
								<Level className='bg--mm-blue-ext-3' style={{ borderBottom: '1px solid #D8D8D8' }}>
									<Level.Left><Svg src='ico_box.svg' /></Level.Left>
									<Level.Item className='padding--medium'>
										<strong>Pesanan Diterima</strong>
										<small>No. Resi: CGK-872365723652</small>
										<small>Layanan Pengiriman: JNE</small>
									</Level.Item>
									<Level.Right style={{ alignItems: 'flex-end' }}>
										<Button rounded inline size='small' color='white'>Lacak</Button>
									</Level.Right>
								</Level>
								<Level className='bg--white'>
									<Level.Item className='padding--normal-b' style={{ borderBottom: '1px solid #D8D8D8' }}>
										<strong>MatahariStore</strong>
									</Level.Item>
									<Level.Item className='padding--normal-b' style={{ borderBottom: '1px solid #D8D8D8', alignItems: 'flex-end' }}>
										<span className='font-color--mm-blue'>#SO00008848057</span>
									</Level.Item>
								</Level>
								<Level className='bg--white'>
									<Level.Left>
										<Image local width={60} height={77} src='temp/product-2.jpg' />
									</Level.Left>
									<Level.Item>
										<span className='font-xsmall text-uppercase'>BitterBallenBall</span>
										<span className='margin--small font-color--primary-ext-2'>Olivia Von Halle pink print</span>
										<span className='font-small margin--small-t'>Kuantitas <strong>1</strong></span>
									</Level.Item>
									<Level.Right>
										<strong>Rp1.199.000</strong>
									</Level.Right>
								</Level>
								<Level className='bg--white' style={{ borderBottom: '1px solid #D8D8D8' }}>
									<Level.Item className='padding--normal-r'>
										<Button rounded size='medium' color='secondary'><Svg src='ico_download.svg' /> Beri Ulasan</Button>
									</Level.Item>
									<Level.Item className='padding--normal-l'>
										<Button rounded size='medium' color='white'><Svg src='ico_download.svg' /> Beli Lagi</Button>
									</Level.Item>
								</Level>
							</div>
						</li>
					</ul>
					<div>Alamat Pengiriman</div>
					<div className='bg--white padding--medium margin--medium-b'>
						<strong className='margin--small-b'>Yannis Philippakis</strong>
						<div className='font-color--primary-ext-2'>
							Kampung Areman Jalan Alamanda RT10/07 No. 7A<br />
							Jawa Barat, Kota Depok, Cimanggis<br />
							16451 Indonesia<br />
							081381332182
						</div>
					</div>
					<div>Pembayaran</div>
					<div className='bg--white padding--medium'>
						<ul className={styles.orderPaymentList}>
							<li><span>Subtotal</span><strong>Rp2.600.000</strong></li>
							<li><span>Biaya Pengiriman (RCL)</span><strong>Rp2.600.000</strong></li>
						</ul>
						<div className={styles.orderPaymentTotal}>
							<div>Total Pembayaran<br /><small className='font-color--primary-ext-2'>(Termasuk PPN)</small></div>
							<div><strong>Rp2.619.000</strong></div>
						</div>
						<small className='margin--normal'>Dibayar dengan <strong>KlikBCA</strong></small>
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
