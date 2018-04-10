import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import _ from 'lodash';
import { Header, Page, Button, Svg, Image, Level, Modal, Spinner } from '@/components/mobile';
import { toastSytle } from '@/containers/Mobile/Shared/styleSnackbar';
import styles from './lovelist.scss';

import { actions as lovelistAction } from '@/state/v4/Lovelist';
import { actions as commentActions } from '@/state/v4/Comment';
import { actions as actionShared } from '@/state/v4/Shared';

import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import Scroller from '@/containers/Mobile/Shared/scroller';
import xhandler from '@/containers/Mobile/Shared/handler';
import Shared from '@/containers/Mobile/Shared';

import { uniqid } from '@/utils';
import cookiesLabel from '@/data/cookiesLabel';

import { LovedItemsSingle, LovedItemsGrid } from './List';

@xhandler
class Lovelist extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.isLogin = (typeof this.props.cookies.get(cookiesLabel.isLogin) === 'string' && this.props.cookies.get(cookiesLabel.isLogin) === 'true');
		this.state = {
			status: {
				listTypeGrid: true,
				showConfirmDelete: false,
				lovelistDisabled: false
			},
			removedItemId: false
		};

		this.goBackPreviousPage = this.goBackPreviousPage.bind(this);
		this.handleLovelistClicked = this.handleLovelistClicked.bind(this);
		this.handleCancelRemoveItem = this.handleCancelRemoveItem.bind(this);
		this.onGridViewModeClick = this.onGridViewModeClick.bind(this);
		this.removeItem = this.removeItem.bind(this);

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
			history.replace('/login?redirect_uri=/lovelist');
		}
	}

	componentWillReceiveProps(nextProps) {}

	componentWillUnmount() {
		const { cookies, dispatch } = this.props;
		dispatch(actionShared.totalLovelistAction(cookies.get(cookiesLabel.userToken)));
	}

	onGridViewModeClick(e) {
		const { status } = this.state;
		status.listTypeGrid = (!status.listTypeGrid);
		this.setState({ status });
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
		const { status } = this.state;
		const { id } = e.currentTarget.dataset;
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
		const { cookies, dispatch, lovelist } = this.props;
		const { ids, list } = lovelist.items;
		const { removedItemId, status } = this.state;
		const idx = ids.indexOf(removedItemId);

		status.lovelistDisabled = true;
		this.setState({ status });
		if (removedItemId && (idx > -1)) {
			const handler = new Promise((resolve, reject) => {
				resolve(dispatch(lovelistAction.removeFromLovelist(cookies.get(cookiesLabel.userToken), removedItemId)));
			});

			handler.then((res) => {
				status.lovelistDisabled = false;
				status.showConfirmDelete = false;

				// Updating product lovelist state ...
				list.splice(idx, 1);
				ids.splice(idx, 1);

				// updates state if Lovelist list is empty
				if (ids.length === 0) dispatch(lovelistAction.listEmptyAction({ lovedEmpty: true }));

				// updating lovelist items props
				dispatch(lovelistAction.getList({ ids, list }, false));
				dispatch(actionShared.showSnack(uniqid('err-'),
					{ label: 'Produk dihapus dari Lovelist', timeout: 3000 },
					toastSytle(),
				));

			}).catch((err) => {
				status.lovelistDisabled = false;
				dispatch(actionShared.showSnack(uniqid('err-'),
					{ label: 'Produk gagal dihapus dari Lovelist', timeout: 3000 },
					toastSytle(),
				));
				throw err;
			});

		} else status.showConfirmDelete = false;

		status.lovelistDisabled = false;
		this.setState({ status, removedItemId: false });
	}

	render() {
		const { lovedEmpty, loading, items } = this.props.lovelist;
		const { status } = this.state;
		const HeaderPage = {
			left: ((lovedEmpty) ? null : (
				<Button
					className={this.isLogin || !lovedEmpty ? null : 'd-none'}
					onClick={this.onGridViewModeClick}
				>
					<Svg src={status.listTypeGrid ? 'ico_list.svg' : 'ico_grid.svg'} />
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
			this.isLogin && 
			<div style={this.props.style}>
				<Page color='white'>
					{<ForeverBanner {...shared.foreverBanner} dispatch={dispatch} />}
					{(loading && _.isEmpty(items.list)) && this.loadingContent}
					{(!lovedEmpty && status.listTypeGrid) && 
						<LovedItemsGrid
							items={items}
							loading={loading}
							onIconLoveClick={this.handleLovelistClicked}
							cardContainerStyles={styles.cardContainer}
						/>
					}
					{(!lovedEmpty && !status.listTypeGrid) &&
						<LovedItemsSingle
							items={items}
							loading={loading}
							onIconLoveClick={this.handleLovelistClicked}
							cardContainerStyles={styles.cardContainer}
						/>
					}
					{this.props.scroller.loading && (<div style={{ paddingTop: '20px' }}> <Spinner /></div>)}
					{(!loading && lovedEmpty) && (
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
					)}
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
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { lovelist, comments } = state;
	state.lovelist = lovelistAction.mapItemsToLovelist(lovelist, comments);

	return {
		shared: state.shared,
		scroller: state.scroller,
		lovelist,
		comments
	};
};

const doAfterAnonymous = async (props) => {
	const { dispatch, cookies } = props;
	const token = cookies.get(cookiesLabel.userToken);
	const params = { token, query: { page: 1, per_page: 36 }, type: 'init' };
	const list = await dispatch(lovelistAction.getLovelisItems(params)) || [];
	const lovedEmpty = (_.has(list, 'products') && !_.isEmpty(list.products));
	if (lovedEmpty) {
		const ids = list.products.map((item) => item.product_id);
		if (ids.length > 0) {
			await dispatch(lovelistAction.bulkieCountByProduct(token, ids));
			await dispatch(commentActions.bulkieCommentAction(token, ids));
		}
	}
	await dispatch(lovelistAction.listEmptyAction({ lovedEmpty: !lovedEmpty }));
};

export default withCookies(connect(mapStateToProps)(Scroller(Shared(Lovelist, doAfterAnonymous))));
