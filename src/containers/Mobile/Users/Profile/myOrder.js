import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import Shared from '@/containers/Mobile/Shared';
import { Link } from 'react-router-dom';
import { actions as userAction } from '@/state/v4/User';
import {
	Header,
	Svg,
	Page,
	Navigation,
	Tabs,
	List,
	Spinner,
    Button
} from '@/components/mobile';
import styles from './profile.scss';
import Scroller from '@/containers/Mobile/Shared/scroller';
import { aux } from '@/utils';
import classNames from 'classnames';
import cookiesLabel from '@/data/cookiesLabel';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class MyOrder extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.menu = [
			{ id: 0, key: 'konfirmasi', title: 'Konfirmasi' }, { id: 1, key: 'dikirim', title: 'Dikirim' },
			{ id: 2, key: 'selesai', title: 'Selesai' }, { id: 3, key: 'batal', title: 'Batal' }
		];
		this.isLogin = this.props.cookies.get(cookiesLabel.isLogin) === 'true';
		
		if (!this.isLogin) {
			this.props.history.push('/');
		}
		this.isEmpty = false;
	}

	componentWillMount() {
		if ('serviceUrl' in this.props.shared) {
			this.getCurrentOrdes(this.props);
		}
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll, true);
	}

	componentWillReceiveProps(nextProps) {
		if (!('serviceUrl' in this.props.shared) && 'serviceUrl' in nextProps.shared) {
			this.getCurrentOrdes(nextProps);
		}
		if (nextProps.user.myOrders !== this.props.user.myOrders && nextProps.user.myOrders === false) {
			this.props.history.push('/profile');
		}
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll, true);
		const { dispatch } = this.props;
		dispatch(userAction.cleanMyOrderData());
	}

	getCurrentOrdes(props, newState) {
		const { cookies, dispatch, user } = this.props;

		if (user.isNoOrders === null) {
			dispatch(userAction.checkMyOrders(cookies.get(cookiesLabel.userToken)));
		}

		const data = {
			token: cookies.get(cookiesLabel.userToken),
			query: {
				page: 1,
				per_page: 20,
				status: newState || user.myOrdersCurrent
			}
		};
		dispatch(userAction.getMyOrderMore(data));
	}

	handlePick(idStatus) {
		const newState = this.menu.filter(tab => tab.id === idStatus)[0];
		const { dispatch } = this.props;
		dispatch(userAction.updateMyOrdersCurrent(newState.key));
		this.getCurrentOrdes(this.props, newState);
		dispatch(userAction.cleanMyOrderData());

	}

	renderOrders() {
		const { user } = this.props;
		const currentOrders = user.myOrders[user.myOrdersCurrent];
		const className = classNames('orderStatus');

		let styleStatus = styles.orderStatusProcess;
		if (user.myOrdersCurrent === 'batal') {
			styleStatus = styles.orderStatusCancel;
		} else if (user.myOrdersCurrent === 'selesai') {
			styleStatus = styles.orderStatusSuccess;
		}
		return currentOrders.orders && (
			currentOrders.orders.map((order, key) => {
				return (<List className={styles.orderMenu} key={key}>
					<Link style={{ flexFlow: 'row nowrap' }} to={`/profile/my-order/${order.so_number}`}>
						<List.Content className={styles.orderMenuList} >
							<div className={className}>
								<span>Pesanan <b>#{order.so_number}</b></span>
								<small className='font-color--primary-ext-3'>{order.created_time}</small>
								<div className={styles.orderStatus}><span className={styleStatus}>{order.status}</span></div>
							</div>
						</List.Content>
					</Link>
				</List>);
			})
		);
	}

	render() {
		const HeaderPage = ({
			left: (
				<Link to={'/profile'}>
					<Svg src='ico_arrow-back-left.svg' />
				</Link>
			),
			center: 'Pesanan Saya',
			right: null,
			rows: [{
				left: null,
				center: (<Tabs
					type='minimal'
					current={this.props.user.myOrdersCurrent}
					variants={this.menu}
					onPick={(e) => this.handlePick(e)}
				/>),
				right: null
			}]
		});

		const renderEmptyOrders = (
			<div style={{ margin: 'auto' }}>
				<div className='margin--medium-v flex-middle'><Svg src='mm_ico_no-order-shoppingbag.svg' /></div>
				<div className='margin--small-v flex-middle'>
					Anda belum memiliki pesanan.
				</div>
				<div className='margin--medium-v flex-center flex-middle'>
					<Link to='/category'>
						<Button color='secondary' size='large'>
							Beli Aja
						</Button>
					</Link>
				</div>
			</div>
		);

		const pageAttribute = {
			color: (this.props.user.isNoOrders === null) ? 'white' : 'grey'
		};

		const content = (this.props.user.isNoOrders === false) ? (
			<aux>
				{ this.renderOrders() }
				<div className='text-center'>
					{ this.props.scroller.loading && (<Spinner />)}
				</div>
			</aux>
		) : null;

		const initSpinner = (
			<div style={{ margin: '15px auto' }}>
				<Spinner />
			</div>
		);

		return (
			<div style={this.props.style}>
				<Page {...pageAttribute}>
					{ this.props.user.isNoOrders === null && (initSpinner) }
					{ this.props.user.isNoOrders === true ? renderEmptyOrders : null }
					<div className='margin--medium'>
						{content}
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Navigation active='Profile' botNav={this.props.botNav} isLogin={this.isLogin} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		shared: state.shared,
		user: state.users,
		scroller: state.scroller
	};
};

export default withCookies(connect(mapStateToProps)(Scroller(Shared(MyOrder))));
