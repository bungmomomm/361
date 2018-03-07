import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import Shared from '@/containers/Mobile/Shared';
import { Link } from 'react-router-dom';
import {
	Header,
	Svg,
	Input,
	Radio,
	Page,
	Panel,
	Image,
	Button
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
			center: 'Konfirmasi Transfer',
			right: null
		});

		return (
			<div style={this.props.style}>
				<Page>
					<div className='padding--large-h padding--medium-v margin--medium-v bg--white'>
						<div className='margin--medium-b'>Pemesanan dengan Bank Transfer akan otomatis dibatalkan oleh sistem kami jika pembayaran tidak diterima dalam waktu 24 jam.</div>
						<Panel rounded color='blue' className='padding--normal flex-row flex-spaceBetween'>
							<span>Order ID</span><strong>C00000009873653</strong>
						</Panel>
						<form className='margin--large flex-column'>
							<Input
								label='Jumlah Yang Ditransfer'
								type='text'
								flat
								placeholder='Jumlah Yang Ditransfer'
							/>
							<Input
								label='Nama Bank Pengirim'
								type='text'
								flat
								placeholder='Nama Bank Pengirim'
							/>
							<Input
								label='Nama Pemegang Rekening'
								type='text'
								flat
								placeholder='Nama Pemegang Rekening'
							/>
							<Input
								label='Tanggal Transfer'
								type='text'
								flat
								placeholder='Tanggal Transfer'
							/>
							<Input
								label='Jam Transfer'
								type='text'
								flat
								placeholder='Jam Transfer'
							/>
							<strong className='font-medium margin--medium-v'>Pilih Bank Transfer Tujuan</strong>
							<Radio
								list
								name='size'
								checked={this.state.size}
								data={[
									{
										value: 1,
										label: (
											<div>
												<Image style={{ alignSelf: 'flex-start' }} local width={100} height={20} src='logo-mataharimall.png' />
												<span>No. Rek: <strong>4700101-227000</strong></span>
											</div>
										)
									},
									{
										value: 1,
										label: (
											<div>
												<Image style={{ alignSelf: 'flex-start' }} local width={100} height={20} src='logo-mataharimall.png' />
												<span>No. Rek: <strong>4700101-227000</strong></span>
											</div>
										)
									},
									{
										value: 1,
										label: (
											<div>
												<Image style={{ alignSelf: 'flex-start' }} local width={100} height={20} src='logo-mataharimall.png' />
												<span>No. Rek: <strong>4700101-227000</strong></span>
											</div>
										)
									}
								]}
							/>
							<div className='margin--medium-v'><Button rounded inline size='large' color='primary'>Konfirmasi</Button></div>
						</form>
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
