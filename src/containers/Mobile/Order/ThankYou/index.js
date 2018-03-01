import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import Shared from '@/containers/Mobile/Shared';
import {
	Page
} from '@/components/mobile';

import { Link } from 'react-router-dom';

class Brands extends Component {

	componentDidMount() {

	}

	componentWillReceiveProps(nextProps) {

	}

	render() {
		const style = {
			backgroundColor: 'black',
			color: 'white',
			height: '200px'
		};
		return (
			<div style={this.props.style}>
				<Page>
					<div style={style}>
						<div style={{ margin: 'auto' }}>
							<div>Thank You</div>
							<div>Hi, Ridha, Terima kasih telah berbelanja di MatahariMall.com</div>
						</div>
					</div>

					<div> Pesan pada: 2018-10-01 00:00:00</div>
					<div> Nomor BCA Virtual Accout</div>
					<div> 1234-1234-1234-1234 [image payment method]</div>

					<div>
						<span>
							<div>Total pembayaran</div>
							<div>Rp. 50.000</div>
						</span>
					</div>

					<div>
						<span>
							<div>No. Pesanan</div>
							<div>SO1231123123</div>
						</span>
					</div>
					<div>
						<span>
							<div>Kode Perusahaan </div>
							<div>SO1231123123</div>
						</span>
					</div>
					<div>
						<span>
							<div>Kode Pembayaran</div>
							<div>SO1231123123</div>
						</span>
					</div>
					<div>
						<span>
							<div>Metode Pembayaran</div>
							<div>Bank transfer</div>
						</span>
					</div>

					<div>
						<span>
							<div>Status Pembayaran</div>
							<div>Bank transfer</div>
						</span>
					</div>

					<div>
						Silahkan ikuti petunjuk dibawah untuk proses pemesanan barang Anda.
					</div>

					<div>
						Pembayaran melalui BCA Virtual Account dapat dilakukan dengan mengikuti petunju berikut:
					</div>

					<div>
						[KONTENT Tutorial payment method]
					</div>

					<Link to='/'> Lanjutkan Belanja</Link>
				</Page>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		shared: state.shared
	};
};

export default withCookies(connect(mapStateToProps)(Shared(Brands)));
