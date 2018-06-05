import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import _ from 'lodash';
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
import { actions as userAction } from '@/state/v4/User';
import { aux, urlBuilder } from '@/utils';
import handler from '@/containers/Mobile/Shared/handler';
import cookiesLabel from '@/data/cookiesLabel';
import CONST from '@/constants';

@handler
class MyOrderDetail extends Component {
	
	constructor(props) {
		super(props);
		this.props = props;
		this.isLogin = this.props.cookies.get(cookiesLabel.isLogin) === 'true';
		this.soNumber = this.props.match.params.so_number;
		this.renderButtonLink = this.renderButtonLink.bind(this);

		if (!this.isLogin) {
			this.props.history.push('/');
		}
	}

	componentWillUnmount() {
		const { cookies, dispatch } = this.props;
		dispatch(userAction.cleanMyOrderDetail(cookies.get(cookiesLabel.userToken), this.soNumber));
	}

	onAddReview(soStoreNumber, seller, item) {
		const { dispatch } = this.props;
		dispatch(userAction.keepReviewInfo({ soStoreNumber, seller, item }));
	}

	/* static renderTrackingInfo(order) {
		const isResiInfoExist = Object.prototype.hasOwnProperty.call(order.shipping, 'resi');
		return (
			<Level style={{ borderBottom: '1px solid #D8D8D8', borderTop: '1px solid #D8D8D8' }}>
				<Level.Left style={{ justifyContent: 'center' }}><Svg src='ico_box.svg' /></Level.Left>
				<Level.Item style={{ padding: '0 15px' }} >
					<strong>{order.status}</strong>
					{ isResiInfoExist && (<small>No. Resi: {order.shipping.resi.resi}</small>) }
					<small>Layanan Pengiriman: {order.shipping.shipping_method}</small>
				</Level.Item>
				{
					(isResiInfoExist && order.shipping.resi.is_trackable === 1) && (
						<Level.Right style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
							<Link to={`/track/${order.shipping.resi.provider}/${order.shipping.resi.resi}`}>
								<Button rounded inline size='small' color='white'>Lacak</Button>
							</Link>
						</Level.Right>)
				}

			</Level>
		);
	} */

	renderButtonLink(item, seller) {
		const { user } = this.props;
		const btnTarget = (
			<Button
				rounded
				size='medium'
				color='secondary'
				className='margin--medium-t text-uppercase'
			>BELI LAGI</Button>
		);

		// digital order
		if (_.has(user, 'myOrdersDetail.is_digital_order') && user.myOrdersDetail.is_digital_order === 1) {
			return <a href={CONST.DIGITAL_URL}>{btnTarget}</a>;
		}

		// mm and mds
		let urlTarget = urlBuilder.setId(item.product_id).setName(item.product_title).buildPdp();
		if (typeof seller !== 'undefined' && process.env.MDS_STORE_IDS.includes(seller.seller_id)) {
			urlTarget = process.env.MDS_URL + urlBuilder.buildPdp(item.product_title, item.product_id, true);
		}
		return <Link to={urlTarget}>{btnTarget}</Link>;
	}

	renderDetail() {
		const order = this.props.user.myOrdersDetail;
		return order && (
			<aux>
				<Level>
					<Level.Left>
						<strong>Pesanan #{order.so_number}</strong>
					</Level.Left>
					<Level.Right>
						<small className='font-color--primary-ext-2'>{order.created_time}</small>
					</Level.Right>
				</Level>
				{order.group !== 'dikirim' && this.renderTopOrderInfo()}
				{this.renderOrderList()}
				{this.renderAddress()}
				{this.renderPembayaran()}
				{(order.group === 'konfirmasi' && order.payment_status_id === 1 && order.fg_show_payment_confirmation_button === 1) && (
					<Link to={`/profile/my-order-confirm/${order.so_number}`}>
						<Level className='bg--white flex-center'>
							<Button rounded size='medium' color='secondary'>Konfirmasi Pembayaran</Button>
						</Level>
					</Link>
				)}
			</aux>
		);
	}

	renderOrderList() {
		const myOrdersDetail = this.props.user.myOrdersDetail;
		const listOrderDetail = myOrdersDetail && (myOrdersDetail.sales_orders.map((order, key) => {
			const { seller } = order;
			const items = order.items.map((item, iKey) => {
				return (
					<div key={iKey}>
						<Level className='bg--white border-bottom'>
							<Level.Left>
								<Image width={60} height={77} src={item.images[0].thumbnail} />
							</Level.Left>
							<Level.Item className='margin--medium no-margin-v'>
								<span className='font-small text-uppercase'>{item.brand.name}</span>
								<span className='font-color--primary-ext-2'>{item.product_title}</span>
								<div className='flex-row flex-spaceBetween flex-middle margin--medium-t'>
									<div className='flex-row'>
										<div>
											{(!myOrdersDetail.is_digital_order && item.variant.title && item.variant.value) &&
												<span className='font-small'>{item.variant.title} <strong>{item.variant.value}</strong></span>
											}
											<span className='font-small'>Jumlah <strong>{item.qty}</strong></span>
											<strong className='margin--small-t'>{item.pricing.formatted.price}</strong>
										</div>
									</div>
									{ (myOrdersDetail.group === 'batal' || myOrdersDetail.group === 'selesai') && (
										<div>{this.renderButtonLink(item, seller)}</div>
									)}

								</div>
							</Level.Item>
						</Level>
						{(item.fg_have_review === 0 && myOrdersDetail.group === 'selesai') && (
							<div className='padding--normal bg--white'>
								<div className='flex-row flex-center flex-spaceBetween'>
									<Link to={'/profile/my-order/add-review'} onClick={() => this.onAddReview(order.so_store_number, order.seller, item)}>
										<Button size='medium'>
											<Svg src='ico_reviews.svg' className='SVGInline' />&nbsp;&nbsp;<span className='font-color--blue text-uppercase'>BERI ULASAN</span>
										</Button>
									</Link>
								</div>
							</div>
						)}
					</div>
				);
			});
			return (
				<li key={key}>
					<div>
						{myOrdersDetail.group === 'dikirim' && MyOrderDetail.renderTrackingInfo(order)}
						<Level className='bg--white'>
							<Level.Item className='padding--normal-b border-bottom'>
								<strong>{order.seller.seller}</strong>
							</Level.Item>
							<Level.Item className='padding--normal-b border-bottom' style={{ alignItems: 'flex-end' }}>
								<span className='font-color--primary-ext-2'>#{order.so_store_number}</span>
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
		let styleStatus = styles.orderStatusProcess;
		if (order.group === 'batal') {
			styleStatus = styles.orderStatusCancel;
		} else if (order.group === 'selesai') {
			styleStatus = styles.orderStatusSuccess;
		}
		return (
			<Level style={{ borderBottom: '1px solid #D8D8D8', backgroundColor: '#fff' }}>
				<Level.Item>
					<strong><span className={styleStatus}>{order.status}</span></strong>
				</Level.Item>
			</Level>
		);
	}

	renderAddress() {
		const shipping = this.props.user.myOrdersDetail.sales_orders[0].shipping;
		return (
			<aux>
				<div className='panel__container'>Alamat Pengiriman</div>
				<div className='bg--white padding--medium'>
					<strong className='margin--small-b'>{shipping.name}</strong>
					<div className='font-color--primary-ext-2'>
						{shipping.address}
					</div>
				</div>
			</aux>
		);
	}

	renderPembayaran() {
		const { user } = this.props;
		const { myOrdersDetail } = user;
		const detail = _.chain(user).get('myOrdersDetail.total.formatted').value();
		return (
			<aux>
				<div className='panel__container'>Pembayaran</div>
				<div className='bg--white padding--medium'>
					<ul className={styles.orderPaymentList}>
						<li><span>Subtotal</span><strong>{detail.subtotal}</strong></li>
						<li><span>Biaya Pengiriman</span><strong>{detail.shipping_cost}</strong></li>
						{(myOrdersDetail.coupon) && (
							<li><span>Kode Kupon</span><strong>{myOrdersDetail.coupon}</strong></li>
						)}
						{detail.discount && (
							<li><span>Diskon</span><strong>-{detail.discount}</strong></li>
						)}
						{detail.discount_shipping_cost && (
							<li><span>Diskon Biaya Pengiriman</span><strong>-{detail.discount_shipping_cost}</strong></li>
						)}
					</ul>
					<div className={styles.orderPaymentTotal}>
						<div>Total Pembayaran<br /><small className='font-color--primary-ext-2'>(Termasuk PPN)</small></div>
						<div><strong>{detail.total}</strong></div>
					</div>
					<small className='margin--normal'>Dibayar dengan <strong>{myOrdersDetail.payment_method}</strong></small>
				</div>
			</aux>
		);
	}

	render() {
		const HeaderPage = ({
			left: (
				<span
					onClick={() => this.props.history.goBack()}
					role='button'
					tabIndex='0'
				>
					<Svg src='ico_arrow-back-left.svg' />
				</span>
			),
			center: 'Detail Pesanan',
			right: null,
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

const doAfterAnonymous = (props) => {
	const { cookies, dispatch } = props;
	dispatch(userAction.getMyOrderDetail(cookies.get(cookiesLabel.userToken), props.match.params.so_number));
};

export default withCookies(connect(mapStateToProps)(Shared(MyOrderDetail, doAfterAnonymous)));
