import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import _ from 'lodash';
import { Header, Page, Card, Button, Svg, Image, Level, Modal, Spinner, Notification } from '@/components/mobile';
import styles from './lovelist.scss';

import { actions as LoveListActionCreator } from '@/state/v4/Lovelist';
import { actions as commentActions } from '@/state/v4/Comment';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import Shared from '@/containers/Mobile/Shared';
import { urlBuilder } from '@/utils';
import cookiesLabel from '@/data/cookiesLabel';
import xhandler from '@/containers/Mobile/Shared/handler';

@xhandler
class Lovelist extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.isLogin = (typeof this.props.cookies.get(cookiesLabel.isLogin) === 'string' && this.props.cookies.get(cookiesLabel.isLogin) === 'true');
		this.userCookies = this.props.cookies.get(cookiesLabel.userToken);
		this.state = {
			status: {
				listTypeGrid: true,
				listEmpty: false,
				loading: true,
				showConfirmDelete: false,
				lovelistDisabled: false
			},
			notif: {
				show: false,
				content: 'Produk dihapus dari Lovelist'
			},
			removedItemId: false
		};

		this.getLovelistCardsContent = this.getLovelistCardsContent.bind(this);
		this.goBackPreviousPage = this.goBackPreviousPage.bind(this);
		this.handleLovelistClicked = this.handleLovelistClicked.bind(this);
		this.handleCancelRemoveItem = this.handleCancelRemoveItem.bind(this);
		this.onGridViewModeClick = this.onGridViewModeClick.bind(this);
		this.onNotifClose = this.onNotifClose.bind(this);
		this.removeItem = this.removeItem.bind(this);
		this.renderLovelistPage = this.renderLovelistPage.bind(this);

		this.loadingContent = (
			<div style={{ margin: '20% auto 20% auto' }}>
				<Spinner size='large' />
			</div>
		);

	}

	componentWillMount() {
		// should be redirected to lovelist-login page
		if (!this.isLogin) {
			const { history } = this.props;
			history.push('/lovelist-login');
		}
	}

	componentWillReceiveProps(nextProps) {
		const { dispatch, lovelist, comments } = nextProps;
		const { status } = this.state;

		status.loading = lovelist.loading;
		// updates neccessary things and checking resources availability
		if (this.props.lovelist.items.list !== lovelist.items.list) {
			status.listEmpty = _.isEmpty(lovelist.items.list);
		}

		if (this.props.comments.data !== comments.data) {
			// updates total lovelist each product item
			if (!_.isEmpty(lovelist.bulkieCountProducts)) {
				lovelist.items.list = lovelist.items.list.map((item, idx) => {
					const productFound = LoveListActionCreator.getBulkItem(lovelist.bulkieCountProducts, item.original.product_id);
					item.last_comments = [];
					item.totalComments = 0;
					if (!_.isEmpty(comments.data)) {
						const commentFound = LoveListActionCreator.getBulkItem(comments.data, item.original.product_id);
						if (commentFound) {
							item.totalComments = commentFound.total || 0;
							item.last_comments = commentFound.last_comment || [];
						}
					}
					if (productFound) item.totalLovelist = productFound.total;
					return item;
				});

				// updating lovelist list
				dispatch(new LoveListActionCreator.getList(lovelist.items, false));
			}
		}

		this.setState({ status });
	}

	onNotifClose(e) {
		const { notif } = this.state;
		notif.show = false;
		notif.content = '';
	}

	onGridViewModeClick(e) {
		const { status } = this.state;
		status.listTypeGrid = (!status.listTypeGrid);
		this.setState({ status });
	}

	getLovelistCardsContent() {
		const { items } = this.props.lovelist;
		const { status } = this.state;
		const isLoved = true;
		const content = items.list.map((product, idx) => {
			return !status.listTypeGrid ?
				(<Card.Lovelist
					isLoved={isLoved}
					key={idx}
					data={product}
					onBtnLovelistClick={this.handleLovelistClicked}
					linkToPdp={urlBuilder.buildPdp(product.product_title, product.id)}
					linkToComments={urlBuilder.buildPcpCommentUrl(product.id)}
					lovelistDisabled={status.lovelistDisabled}
				/>) :
				(<Card.LovelistGrid
					key={idx}
					data={product}
					isLoved={isLoved}
					onBtnLovelistClick={this.handleLovelistClicked}
					linkToPdp={urlBuilder.buildPdp(product.product_title, product.id)}
					linkToComments={urlBuilder.buildPcpCommentUrl(product.id)}
					lovelistDisabled={status.lovelistDisabled}
					split={2}
				/>);
		});

		return <div className={styles.cardContainer}>{content}</div>;
	}

	goBackPreviousPage(e) {
		const { history } = this.props;
		if ((history.length - 1 >= 0)) {
			history.goBack();
		} else {
			history.push('/');
		}
	}

	handleLovelistClicked(e) {
		const { status, notif } = this.state;
		const { id } = e.currentTarget.dataset;
		notif.show = false;
		status.showConfirmDelete = !status.showConfirmDelete;
		this.setState({ status, removedItemId: _.toInteger(id) });
	}

	handleCancelRemoveItem(e) {
		const { status } = this.state;
		status.showConfirmDelete = false;
		this.setState({
			status,
			removedItemId: false
		});
	}

	removeItem() {
		const { dispatch } = this.props;
		const { ids, list } = this.props.lovelist.items;
		const { removedItemId, status, notif } = this.state;
		const idx = ids.indexOf(removedItemId);

		status.lovelistDisabled = true;
		this.setState({ status });
		if (removedItemId && (idx > -1)) {
			const handler = new Promise((resolve, reject) => {
				resolve(dispatch(LoveListActionCreator.removeFromLovelist(this.userCookies, removedItemId)));
			});

			handler.then((res) => {
				notif.show = true;
				notif.content = 'Produk dihapus dari Lovelist';
				this.setState({ notif });

				status.lovelistDisabled = false;
				// Updating product lovelist state ...
				list.splice(idx, 1);
				ids.splice(idx, 1);
				status.showConfirmDelete = false;

				// updates state if Lovelist list is empty
				if (ids.length === 0) status.listEmpty = true;

				// updating lovelist items props
				dispatch(new LoveListActionCreator.getList({ ids, list }, false));

			}).catch((err) => {
				status.lovelistDisabled = false;
				throw err;
			});

		} else status.showConfirmDelete = false;

		status.lovelistDisabled = false;
		this.setState({ status, removedItemId: false, notif });
	}

	renderLovelistPage(content) {
		const { items } = this.props.lovelist;
		const { status, notif } = this.state;
		const HeaderPage = {
			left: ((status.listEmpty) ? null : (
				<Button
					className={this.isLogin || !status.listEmpty ? null : 'd-none'}
					onClick={this.onGridViewModeClick}
				>
					<Svg src={status.listTypeGrid ? 'ico_grid.svg' : 'ico_list.svg'} />
				</Button>
			)),
			center: <strong>Lovelist</strong>,
			right: (
				<Button onClick={this.goBackPreviousPage}>
					<Svg src='ico_arrow-back.svg' />
				</Button>
			)
		};

		const { shared, dispatch } = this.props;

		return (
			<div style={this.props.style}>
				<Page color='white'>
					{ <ForeverBanner {...shared.foreverBanner} dispatch={dispatch} /> }
					{status.loading && this.loadingContent}
					{(!status.loading && !_.isEmpty(items.list)) && content}
				</Page>
				<Header.Modal {...HeaderPage} />

				<Modal show={status.showConfirmDelete}>
					<div className='font-medium'>
						<h3 className='text-center'>Hapus Lovelist</h3>
						<Level style={{ padding: '0px' }} className='margin--medium-v'>
							<Level.Left />
							<Level.Item className='padding--medium-h'>
								<center>Kamu yakin mau hapus produk ini dari Lovelist kamu?</center>
							</Level.Item>
						</Level>
					</div>
					<Modal.Action
						closeButton={(
							<Button onClick={this.handleCancelRemoveItem}>
								<span className='font-color--primary-ext-2'>BATALKAN</span>
							</Button>)}
						confirmButton={(<Button onClick={this.removeItem}>YA, HAPUS</Button>)}
					/>
				</Modal>

				<Notification style={{ marginTop: '90%' }} show={notif.show} toast disableClose onClose={this.onNotifClose}>
					<span>{notif.content}</span>
				</Notification>

			</div>
		);
	}

	render() {
		const { status } = this.state;

		if (!status.loading && status.listEmpty) {
			return (this.renderLovelistPage(
				<div className='text-center --disable-flex'>
					<p className={styles.lovelistEmpty}>Lovelist kamu masih kosong</p>
					<p className={styles.lovelistEmptyDescription}>Tekan <Svg width='20px' height='18px' src='ico_love.svg' /> untuk menambahkan
						<br />produk ke Lovelist.
					</p>
					<p className='margin--medium-v'>
						<Link to='/'>
							<Button inline size='medium' color='secondary'>BELANJA</Button>
						</Link>
					</p>
					<Image local className={styles.lovelistEmptyImg} alt='Tap the love icon' src='lovelist-guide.png' />
				</div>
			));
		}

		return (this.renderLovelistPage(this.getLovelistCardsContent()));
	}
}

const mapStateToProps = (state) => {
	return {
		lovelist: state.lovelist,
		shared: state.shared,
		comments: state.comments
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies } = props;

	const list = await dispatch(LoveListActionCreator.getLovelisItems(cookies.get(cookiesLabel.userToken))) || [];
	const ids = list.products.map((item) => item.product_id);
	if (ids.length > 0) {
		await dispatch(LoveListActionCreator.bulkieCountByProduct(cookies.get(cookiesLabel.userToken), ids));
		await dispatch(commentActions.bulkieCommentAction(cookies.get(cookiesLabel.userToken), ids));
	}

	// }
};

export default withCookies(connect(mapStateToProps)(Shared(Lovelist, doAfterAnonymous)));
