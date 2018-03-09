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
	Spinner
} from '@/components/mobile';
import styles from './profile.scss';
import CONST from '@/constants';
import Scroller from '@/containers/Mobile/Shared/scroller';
import { aux } from '@/utils';

class MyOrder extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.menu = [
			{ id: 0, key: 'konfirmasi', title: 'Konfirmasi' }, { id: 1, key: 'dikirim', title: 'Dikirim' },
			{ id: 2, key: 'selesai', title: 'Selesai' }, { id: 3, key: 'batal', title: 'Batal' }
		];
		this.isLogin = this.props.cookies.get('isLogin');
		this.userToken = this.props.cookies.get(CONST.COOKIE_USER_TOKEN);

		if (this.isLogin !== 'true') {
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
		const { dispatch, user } = this.props;

		if (user.isNoOrders === null) {
			dispatch(userAction.checkMyOrders(this.userToken));
		}

		const data = {
			token: this.userToken,
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
		const currentOrders = this.props.user.myOrders[this.props.user.myOrdersCurrent];
		return currentOrders.orders && (
			currentOrders.orders.map((order, key) => {
				return (<List key={key}>
					<Link style={{ flexFlow: 'row nowrap' }} to={`/profile/my-order/${order.so_number}`}>
						<List.Image>
							<div className={styles.orderIconCtr}>
								<Svg src='ico_money-time.svg' />
							</div>
						</List.Image>
						<List.Content>
							<div className='orderDesc'>
								<span>Pesanan <b>#{order.so_number}</b></span>
								<small className='font-color--primary-ext-3'>{order.created_time}</small>
								<small className='font-color--primary-ext-2'>{order.status}</small>
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

		const renderEmptyOrders = (<div> Tidak ada order</div>);

		const content = (this.props.user.isNoOrders === false) ? (
			<aux>
				{ this.renderOrders() }
				{ this.props.scroller.loading && (<Spinner />)}
			</aux>
		) : (<aux> {renderEmptyOrders} </aux>);

		return (
			<div style={this.props.style}>
				<Page scroll='forcescroll'>
					<div className='margin--medium'>
						{content}
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Navigation active='Profile' />
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
