import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { Header, Page, Card, Button, Svg, Image, Level, Modal, Spinner } from '@/components/mobile';
import _ from 'lodash';
import styles from './lovelist.scss';
import { actions as LoveListActionCreator } from '@/state/v4/Lovelist';
import ForeverBanner from '@/containers/Mobile/Shared/foreverBanner';
import Shared from '@/containers/Mobile/Shared';

class Lovelist extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			status: {
				listTypeGrid: true,
				listEmpty: true,
				loading: true,
				loggedIn: true, // should be adjust when user-login has done...,
				isBulkSet: false,
				showConfirmDelete: false
			},
			removedItemId: false
		};

		this.getLovelistCardsContent = this.getLovelistCardsContent.bind(this);
		this.renderLovelistPage = this.renderLovelistPage.bind(this);
		this.handleLovelistClicked = this.handleLovelistClicked.bind(this);
		this.handleCancelRemoveItem = this.handleCancelRemoveItem.bind(this);
		this.removeItem = this.removeItem.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const { loading, count, items, bulkieCountProducts } = nextProps.lovelist;
		const { status } = this.state;
		const { cookies, dispatch } = this.props;

		// checking resources availability
		if (!_.isEmpty(items.list) && count > 0 && status.listEmpty) {
			// gets number of total lovelist of each product item
			dispatch(LoveListActionCreator.bulkieCountByProduct(cookies.get('user.token'), items.ids));
			// updates listEmpty state
			status.listEmpty = false;
		}

		if (!_.isEmpty(bulkieCountProducts) && !status.isBulkSet) {
			status.isBulkSet = true;
			// updates total lovelist each product item
			items.list = items.list.map((item, idx) => {
				const productFound = dispatch(LoveListActionCreator.getProductBulk(item.original.product_id));
				if (productFound) item.totalLovelist = productFound.total;
				return item;
			});

			dispatch(new LoveListActionCreator.getList(items, false));
		}

		status.loading = loading;
		this.setState({ status });
	}

	getLovelistCardsContent() {
		const { items } = this.props.lovelist;
		const isLoved = true;
		const content = items.list.map((product, idx) => {
			return !this.state.status.listTypeGrid ?
				(<Card.Lovelist
					isLoved={isLoved}
					key={idx}
					data={product}
					onBtnLovelistClick={this.handleLovelistClicked}
				/>) :
				(<Card.LovelistGrid
					key={idx}
					data={product}
					isLoved={isLoved}
					onBtnLovelistClick={this.handleLovelistClicked}
				/>);
		});

		return <div className={styles.cardContainer}>{content}</div>;
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
		const { dispatch } = this.props;
		const { ids, list } = this.props.lovelist.items;
		const { removedItemId, status } = this.state;
		const idx = ids.indexOf(removedItemId);

		if (removedItemId && (idx > -1)) {
			// removes item from lovelist list
			dispatch(LoveListActionCreator.removeFromLovelist(this.userCookies, removedItemId));
			list.splice(idx, 1);
			ids.splice(idx, 1);
			status.showConfirmDelete = false;

			// updates state if Lovelist list is empty
			if (ids.length === 0) status.listEmpty = true;

			// updating lovelist items props
			dispatch(new LoveListActionCreator.getList({ ids, list }, false));
		} else status.showConfirmDelete = false;

		this.setState({ status, removedItemId: false });
	}

	renderLovelistPage(content) {
		const { status } = this.state;
		const HeaderPage = {
			left: (
				<Button
					className={status.loggedIn || !status.listEmpty ? null : 'd-none'}
					onClick={() => {
						status.listTypeGrid = (!status.listTypeGrid);
						this.setState({ status });
						this.setState({ status: { listEmpty: true } });
					}}
				>
					<Svg src={status.listTypeGrid ? 'ico_grid.svg' : 'ico_list.svg'} />
				</Button>
			),
			center: 'Lovelist',
			right: (
				<Link to='/'>
					<Svg src='ico_arrow-back.svg' />
				</Link>
			)
		};

		const { shared, dispatch } = this.props;

		return (
			<div style={this.props.style}>
				<Page>
					{ <ForeverBanner {...shared.foreverBanner} dispatch={dispatch} /> }
					{content}
				</Page>
				<Header.Modal {...HeaderPage} />

				<Modal show={status.showConfirmDelete}>
					<div className='font-medium'>
						<h3>Hapus Lovelist</h3>
						<Level style={{ padding: '0px' }} className='margin--medium'>
							<Level.Left />
							<Level.Item className='padding--medium'>
								<div className='font-small'>Kamu yakin mau hapus produk ini dari Lovelist kamu?</div>
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

	render() {
		const { status } = this.state;
		if (status.loading) {
			return this.renderLovelistPage(
				<div style={{ marginTop: '50%' }} className='text-center'>
					<Spinner size='large' />
				</div>
			);
		}

		if (status.listEmpty) {
			return (this.renderLovelistPage(
				<div className='text-center --disable-flex'>
					<p className={styles.lovelistEmpty}>Kamu belum memiliki Lovelist</p>
					<div className={styles.lovelistEmptyDescription}>
						Tekan&nbsp;<Svg width='20px' height='18px' src='ico_love.svg' />&nbsp;untuk menambahkan
					</div>
					<div className={styles.lovelistEmptyDescription}>produk ke Lovelist.</div>
					<p className='margin--medium'><Button to='/' inline size='medium' color='secondary'>BELANJA</Button></p>
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
		shared: state.shared
	};
};

const doAfterAnonymous = (props) => {

	const { dispatch, cookies } = props;

	dispatch(LoveListActionCreator.getLovelisItems(cookies.get('user.token')));
};

export default withCookies(connect(mapStateToProps)(Shared(Lovelist, doAfterAnonymous)));
