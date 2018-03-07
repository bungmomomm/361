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
import CONST from '@/constants';
import { actions as userAction } from '@/state/v4/User';
import { aux } from '@/utils';

class MyOrderDetail extends Component {
	static renderTrackingInfo(order) {
		return (
			<Level className='bg--mm-blue-ext-3' style={{ borderBottom: '1px solid #D8D8D8' }}>
				<Level.Left><Svg src='ico_box.svg' /></Level.Left>
				<Level.Item className='padding--medium'>
					<strong>{order.status}</strong>
					<small>No. Resi: {order.shipping.resi.resi}</small>
					<small>Layanan Pengiriman: {order.shipping.shipping_method}</small>
				</Level.Item>
				<Level.Right style={{ alignItems: 'flex-end' }}>
					<Button rounded inline size='small' color='white'>Lacak</Button>
				</Level.Right>
			</Level>
		);
	}

	constructor(props) {
		super(props);
		this.props = props;
		this.isLogin = this.props.cookies.get('isLogin');
		this.userToken = this.props.cookies.get(CONST.COOKIE_USER_TOKEN);
		this.soNumber = this.props.match.params.so_number;

	}

	componentWillMount() {
		if ('serviceUrl' in this.props.shared) {
			const { dispatch } = this.props;
			dispatch(userAction.getMyOrderDetail(this.userToken, this.soNumber));
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!('serviceUrl' in this.props.shared) && 'serviceUrl' in nextProps.shared) {
			const { dispatch } = this.props;
			dispatch(userAction.getMyOrderDetail(this.userToken, this.soNumber));
		}

	}

	renderDetail() {
		const order = this.props.user.myOrdersDetail;
		return order && (
			<aux>
				<Level>
					<Level.Left>
						<strong>Pesanan #{order.so_number}</strong>
						<small className='font-color--primary-ext-2'>Dipesan {order.created_time}</small>
					</Level.Left>
				</Level>
				{order.group !== 'dikirim' && this.renderTopOrderInfo()}
				{this.renderOrderList()}
				{this.renderAddress()}
				{this.renderPembayaran()}
				{order.group !== 'konfirmasi' && (
					<Link to={'/profile-my-order-confirm/'}>
						<Button rounded size='medium' color='secondary'>Konfirmasi Pembayaran</Button>
					</Link>
				)}
			</aux>
		);
	}

	renderOrderList() {
		const myOrdersDetail = this.props.user.myOrdersDetail;
		const listOrderDetail = myOrdersDetail && (myOrdersDetail.sales_orders.map((order, key) => {
			const items = order.items.map((item, iKey) => {
				return (
					<div key={iKey}>
						<Level className='bg--white'>
							<Level.Left>
								<Image width={60} height={77} src={item.images[0].mobile} />
							</Level.Left>
							<Level.Item>
								<span className='font-xsmall text-uppercase'>{item.brand.brand_name}</span>
								<span className='margin--small font-color--primary-ext-2'>{item.product_title}</span>
								<span className='font-small margin--small-t'>Jumlah <strong>{item.qty}</strong></span>
							</Level.Item>
							<Level.Right>
								<strong>{item.pricing.formatted.price}</strong>
							</Level.Right>
						</Level>
						{/* <Level className='bg--white' style={{ borderBottom: '1px solid #D8D8D8' }}>
							<Level.Item className='padding--normal-r'>
								<Button rounded size='medium' color='secondary'><Svg src='ico_download.svg' /> Beri Ulasan</Button>
							</Level.Item>
							<Level.Item className='padding--normal-l'>
								<Button rounded size='medium' color='white'><Svg src='ico_download.svg' /> Beli Lagi</Button>
							</Level.Item>
						</Level> */}
					</div>
				);
			});
			return (
				<li key={key}>
					<div>
						{myOrdersDetail.group === 'dikirim' && MyOrderDetail.renderTrackingInfo(order)}
						<Level className='bg--white'>
							<Level.Item className='padding--normal-b' style={{ borderBottom: '1px solid #D8D8D8' }}>
								<strong>{order.seller.seller}</strong>
							</Level.Item>
							<Level.Item className='padding--normal-b' style={{ borderBottom: '1px solid #D8D8D8', alignItems: 'flex-end' }}>
								<span className='font-color--mm-blue'>#{order.so_store_number}</span>
							</Level.Item>
						</Level>
						{items}
					</div>
				</li>
			);
		}));

		return (
			<ul className={styles.orderList}>
				{listOrderDetail}
			</ul>
		);
	}

	renderTopOrderInfo() {
		const order = this.props.user.myOrdersDetail;
		const styleClass = order.group === 'batal' ? 'bg--mm-blue-ext-2' : 'bg--mm-blue-ext-3';
		return (
			<Level className={styleClass} style={{ borderBottom: '1px solid #D8D8D8' }}>
				<Level.Left><Svg src='ico_box.svg' /></Level.Left>
				<Level.Item className='padding--medium'>
					<strong>{order.status}</strong>
				</Level.Item>
			</Level>
		);
	}

	renderAddress() {
		const shipping = this.props.user.myOrdersDetail.sales_orders[0].shipping;
		return (
			<aux>
				<div>Alamat Pengiriman</div>
				<div className='bg--white padding--medium margin--medium-b'>
					<strong className='margin--small-b'>{shipping.name}</strong>
					<div className='font-color--primary-ext-2'>
						{shipping.address}
					</div>
				</div>
			</aux>
		);
	}

	renderPembayaran() {
		const order = this.props.user.myOrdersDetail;
		return (
			<aux>
				<div>Pembayaran</div>
				<div className='bg--white padding--medium'>
					<ul className={styles.orderPaymentList}>
						<li><span>Subtotal</span><strong>{order.total.formatted.subtotal}</strong></li>
						<li><span>Biaya Pengiriman (RCL)</span><strong>{order.total.formatted.shipping_cost}</strong></li>
					</ul>
					<div className={styles.orderPaymentTotal}>
						<div>Total Pembayaran<br /><small className='font-color--primary-ext-2'>(Termasuk PPN)</small></div>
						<div><strong>{order.total.formatted.total}</strong></div>
					</div>
					<small className='margin--normal'>Dibayar dengan <strong>{order.payment_method}</strong></small>
				</div>
			</aux>
		);
	}

	render() {
		const HeaderPage = ({
			left: (
				<Link to={'/profile-my-order/'}>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Detail Pesanan',
			right: null
		});

		return (
			<div style={this.props.style}>
				<Page>
					{ this.renderDetail() }
				</Page>
				<Header.Modal {...HeaderPage} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		shared: state.shared,
		user: state.users
	};
};

export default withCookies(connect(mapStateToProps)(Shared(MyOrderDetail)));
