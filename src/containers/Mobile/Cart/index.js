import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { Page, Header, Svg, Panel, Image, Select, Level, Button, Modal, Spinner } from '@/components/mobile';
import styles from './cart.scss';
import Shared from '@/containers/Mobile/Shared';
import { connect } from 'react-redux';
import { actions as shopBagAction } from '@/state/v4/ShopBag';
import CONST from '@/constants';
import { urlBuilder } from '@/utils';
import CartEmpty from '@/containers/Mobile/Cart/empty';
import { actions as actionShared } from '@/state/v4/Shared';
class Cart extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			showSelect: false,
			showConfirmDelete: false,
			productWillDelete: { product_id: null, brand: null, title: null, image: null },
			productIdwillUpdate: null,
			selectList: [],
			qtyCurrent: null,
			qtyNew: null,
			selected: {
				label: null,
				value: null
			}
		};
		this.userToken = this.props.cookies.get(CONST.COOKIE_USER_TOKEN);
		this.deleteItemHandler = this.deleteItemHandler.bind(this);
		this.addToLovelistHandler = this.addToLovelistHandler.bind(this);
		this.selectItemHandler = this.selectItemHandler.bind(this);
		this.selectedNewQtyHander = this.selectedNewQtyHander.bind(this);
		this.updateCartHander = this.updateCartHander.bind(this);
		this.isLogin = this.props.cookies.get('isLogin');
	}

	componentWillMount() {
		if ('serviceUrl' in this.props.shared) {
			const { dispatch } = this.props;
			dispatch(shopBagAction.getAction(this.userToken));
		}
	}

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(new actionShared.totalLovelistAction(this.userToken));
	}

	componentWillReceiveProps(nextProps) {
		if (!('serviceUrl' in this.props.shared) && 'serviceUrl' in nextProps.shared) {
			const { dispatch } = this.props;
			dispatch(shopBagAction.getAction(this.userToken));
		}
	}

	addToLovelistHandler(productId) {
		const { dispatch } = this.props;
		dispatch(shopBagAction.addLovelistAction(this.userToken, productId));
	}

	deleteConfirmationItemHandler(productId, itemBrand, itemTitel, itemImage) {
		this.setState({ showConfirmDelete: true, productWillDelete: { product_id: productId, brand: itemBrand, title: itemTitel, image: itemImage } });
	}

	deleteItemHandler() {
		const { dispatch } = this.props;
		this.setState({ showConfirmDelete: false, productIdwillDelete: null });
		dispatch(shopBagAction.deleteAction(this.userToken, this.state.productIdwillDelete));
	}

	selectItemHandler(productId, maxQty, qty) {
		const selectListData = [];
		for (let step = 1; step <= maxQty; step++) {
			selectListData.push({ value: step, label: step });
		}
		this.setState({
			showSelect: !this.state.showSelect,
			productIdwillUpdate: productId,
			selectList: selectListData,
			qtyCurrent: qty
		});
	}

	selectedNewQtyHander(value) {
		this.setState({ qtyNew: value });
	}

	updateCartHander() {
		const { dispatch } = this.props;
		if (this.state.qtyNew !== null && this.state.qtyCurrent !== this.state.qtyNew) {
			dispatch(shopBagAction.updateAction(this.userToken, this.state.productIdwillUpdate, this.state.qtyNew));
		}
		this.setState({ showSelect: false, productIdwillUpdate: null, selectList: [], qtyCurrent: null, qtyNew: null });
	}

	renderList(shopBagData) {
		return (this.props.shopBag.carts !== null) && (this.props.shopBag.carts.map((cart, key) => {
			const items = cart.items.map((item, keyItem) => {
				return (
					<div key={keyItem}>
						<Level style={{ paddingLeft: '0px' }} className='flex-row border-bottom'>
							<Level.Item>
								<Link to={urlBuilder.setId(item.product_id).setName(item.product_title).buildPdp()}>
									<Image width='100%' src={item.images[0].mobile} />
								</Link>
							</Level.Item>
							<Level.Item className='padding--medium'>
								<div>
									<Link to={urlBuilder.setId(item.brand.id).setName(item.brand.brand_name).buildBrand()}>
										{item.brand.brand_name}
									</Link>
								</div>
								<div className='font-color--primary-ext-1'>
									<Link to={urlBuilder.setId(item.product_id).setName(item.product_title).buildPdp()}>
										{item.product_title}
									</Link>
								</div>
								<div className='margin--medium'>
									<div>{item.pricing.formatted.effective_price}</div>
									{(item.pricing.formatted.effective_price !== item.pricing.formatted.base_price) && (
										<div className='font-color--primary-ext-1 font-small text-line-through'>
											{item.pricing.formatted.base_price}
										</div>
									) }
								</div>
								<Level className='flex-row border-bottom'>
									<Level.Left>
										<div>Jumlah</div>
									</Level.Left>
									<Level.Item>
										<Button
											onClick={() => this.selectItemHandler(
												item.product_id, item.max_quantity, item.qty
											)}
											className='flex-center'
										>
											<span style={{ marginRight: '10px' }}>{item.qty}</span>
											<Svg src='ico_chevron-down.svg' />
										</Button>
									</Level.Item>
								</Level>
							</Level.Item>
						</Level>
						<div className='flex-row flex-center flex-spaceBetween margin--medium'>
							<div>
								<Button
									onClick={() => this.addToLovelistHandler(item.product_id)}
									outline
									color='secondary'
									size='medium'
								>
									<Svg src='ico_reply.svg' /> &nbsp; Pindahkan ke Lovelist
								</Button>
							</div>
							<div className='padding--large'>
								<Button
									onClick={() => this.deleteConfirmationItemHandler(
										item.product_id, item.brand.brand_name, item.product_title, item.images[0].mobile
									)}
									className='font-color--primary-ext-1'
								>
									<Svg src='ico_trash.svg' /> &nbsp; Hapus
								</Button>
							</div>
						</div>
					</div>
				);
			});
			return (
				<div
					key={key}
					style={{ paddingLeft: '15px', paddingTop: '15px', marginBottom: '20px', background: '#fff' }}
				>
					<div>
						<Link to={urlBuilder.setId(cart.seller.seller_id).setName(cart.seller.seller).buildStore()} >
							{cart.seller.seller}
						</Link>
					</div>
					{items}
				</div>
			);
		}));
	}

	renderTotal() {
		return (this.props.shopBag.total !== null) && (
			<div className='padding--medium' style={{ backgroundColor: '#fff' }}>
				<div className='margin--medium'>
					<div className='flex-row flex-spaceBetween'>
						<div>Subtotal</div>
						<div className='font-medium'>{this.props.shopBag.total.formatted.subtotal}</div>
					</div>
					<div className='flex-row flex-spaceBetween'>
						<div>
							<div>Estimasi biaya pengiriman</div>
							<div className='font-small'>({this.props.shopBag.location_default})</div>
						</div>
						<div className='font-medium'>{this.props.shopBag.total.formatted.shipping_estimation}</div>
					</div>
					<hr className='margin--medium' />
					<div className='flex-row flex-spaceBetween'>
						<div>
							<div>Total Pembayaran</div>
							<div className='font-color--primary-ext-1 font-small'>(Termasuk PPN)</div>
						</div>
						<div className='font-medium'>{this.props.shopBag.total.formatted.total}</div>
					</div>
				</div>
			</div>
		);
	}

	renderHeaderShopBag() {
		if (this.props.shopBag.carts === null) {
			return null;
		}
		const totalItem = this.props.shopBag.carts.map(e => (parseInt(e.total_items, 16))).reduce((a, b) => (a + b), 0);
		return (
			<Panel className='flex-row flex-spaceBetween'>
				<div className='flex-row'>
					<span className='font-color--primary'>Total:</span>
					<span className='padding--medium'>{(totalItem)} ITEM(S)</span>
				</div>
				<div className='font-medium font-color--primary'>
					{this.props.shopBag.total.formatted.total}
				</div>
			</Panel>
		);
	}

	render() {
		const headerOption = {
			left: (
				<Link to='/'>
					<Svg src={'ico_close-large.svg'} />
				</Link>
			),
			center: (<div><span> Tas Belanja {this.props.shopBag.loading ? (<Spinner />) : ''}</span></div>),
			right: null
		};

		if (this.props.shopBag.carts && this.props.shopBag.carts.length < 1) {
			return <CartEmpty />;
		}

		return (
			<div>
				<Page>
					<div style={{ backgroundColor: '#F5F5F5' }}>
						{this.renderHeaderShopBag()}
						{this.renderList()}
						{this.renderTotal()}
					</div>
				</Page>

				<Header.Modal {...headerOption} />
				<div className={styles.paymentLink}>
					<div>
						<div>
							<Link to={(this.isLogin) ? process.env.CHECKOUT_URL : '/login'}>
								Lanjutkan ke Pembayaran <Svg color='#fff' src='ico_arrow-back.svg' />
							</Link>
						</div>
					</div>
				</div>

				<Select
					show={this.state.showSelect}
					label='Pilih Ukuran'
					onChange={(e) => this.selectedNewQtyHander(e)}
					onClose={this.updateCartHander}
					options={this.state.selectList}
				/>

				<Modal show={this.state.showConfirmDelete}>
					<div className='font-medium'>Anda mau menghapus produk ini?</div>
					<Level style={{ padding: '0px' }} className='margin--medium'>
						<Level.Left><Image width='40px' src={this.state.productWillDelete.image} /></Level.Left>
						<Level.Item className='padding--medium'>
							<div className='font-small'>{this.state.productWillDelete.brand}</div>
							<div className='font-small font-color--primary-ext-1'>{this.state.productWillDelete.title}</div>
						</Level.Item>
					</Level>
					<Modal.Action
						closeButton={
							<Button
								onClick={() => {
									this.setState({ showConfirmDelete: false, productIdwillDelete: null, selectList: [] });
								}}
							> BATAL
							</Button>
						}
						confirmButton={
							<Button onClick={this.deleteItemHandler}>
								<span className='font-color--primary-ext-2'>HAPUS</span>
							</Button>
						}
					/>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		shared: state.shared,
		shopBag: state.shopBag
	};
};

export default withCookies(connect(mapStateToProps)(Shared(Cart)));
