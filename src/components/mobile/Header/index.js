import React, { Component } from 'react';
import Input from '../Input';
import styles from './header.scss';
import Svg from '../Svg';
import Search from './search';
import SearchResult from './searchResult';
import ShoppingBagItem from './shoppingBagItem';
import UserDropDown from './userDropdown';
import Modal from './modal';
import { withRouter, Link } from 'react-router-dom';

class Header extends Component {

	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			showCart: false,
			showUserDropDown: false
		};

		this.toggleCart = this.toggleCart.bind(this);
		this.toggleUserDropDown = this.toggleUserDropDown.bind(this);
	}

	toggleCart() {
		this.setState((prevState) => {
			let value = true;
			if (prevState.showCart === true) {
				value = false;
			}
			return {
				showCart: value,
				showUserDropDown: false
			};
		});
	}
	
	toggleUserDropDown() {
		this.setState((prevState) => {
			let value = true;
			if (prevState.showUserDropDown === true) {
				value = false;
			}
			return {
				showCart: false,
				showUserDropDown: value
			};
		});
	}
	
	
	render() {
		// const { location, lovelist } = props;

		let searchReference = 'home';

		if (location.pathname === '/category') {
			searchReference = 'category';
		}

		console.log(searchReference);

		return (
			<div>
				<nav className={styles.container}>
					<div className={styles.wrapper}>
						<div className={styles.header}>
							<div className={styles.topbar}>
								<div className='container'>
									<div className='row row-small'>
										<div className='col-xs-2 col-sm-2 col-md-2 col-lg-2'>
											<Link className='d-flex flex-middle' to='https://matahari.com'><Svg src='ico_matahari.svg' /> Matahari Department Store</Link>
										</div>
										<div className='col-xs-2 col-sm-2 col-md-2 col-lg-2'>
											<Link className='d-flex flex-middle' to='https://mataharimall.com'><Svg src='ico_mataharimall.svg' /> MatahariMall.com</Link>
										</div>
										<div className='col-md-offset-6 col-lg-offset-6 col-xs-2 col-sm-2 col-md-2 col-lg-2 text-right'>
											<Link to='/tentang'>Tentang 361</Link>
										</div>
									</div>
								</div>
							</div>
							<div className='container'>
								<div className='row padding--medium-v flex-middle'>
									<div className='col-xs-2 col-sm-2 col-md-3 col-lg-3'>
										<Link className='d-flex flex-middle' to='/'><Svg src='logo.svg' /></Link>
									</div>
									<div className='col-xs-2 col-md-6 col-lg-6'>
										<div className={styles.center}>
											<Input
												onFocus={() => this.props.history.push(`/search?ref=${searchReference}`)}
												placeholder=''
												value=''
											/>
											<div className={styles.dummyplaceholder}>
												<span className='padding--small-h'>Cari produk</span>
												<span><Svg src='ico_search_361_small.svg' /></span>
											</div>
										</div>
									</div>
									<div className='col-xs-2 col-md-1 col-lg-1 d-flex flex-middle flex-center relative'>
										<Link className='d-flex flex-middle flex-center' to='/361style'><Svg src='ico_hashtags.svg' /></Link>
									</div>
									<div className='col-xs-2 col-md-1 col-lg-1 d-flex flex-middle flex-center relative' >
										<Svg
											src='ico_user.svg'
											onClick={() => {
												this.toggleUserDropDown();
											}}
										/>
										<UserDropDown
											username={'Supatmo Agus'}
											isLogin
											show={this.state.showUserDropDown}
										/>
									</div>
									<div className='col-xs-2 col-md-1 col-lg-1 d-flex flex-middle flex-center relative'>
										<Svg
											src='ico_bag_361.svg'
											onClick={() => {
												this.toggleCart();
											}}
										/>
										<ShoppingBagItem
											show={this.state.showCart}
											data={[
												{
													name: 'MALE CASUAL SHOES',
													size: '36',
													price: 240000,
													total: 1,
													image: 'dummy-shoes-01.png'
												},
												{
													name: 'FEMALE CASUAL SHOES',
													size: '37',
													price: 250000,
													total: 2,
													image: 'dummy-shoes-02.png'
												},
												{
													name: 'FEMALE CASUAL SHOES',
													size: '37',
													price: 145000,
													total: 1,
													image: 'dummy-shoes-03.png'
												}
											]}
										/>
									</div>
								</div>
							</div>
							<div className={styles.main}>
								<div className='container'>
									<ul>
										<li className={styles.subMenuParent}>
											<a className='flex-middle d-flex'>Sepatu Wanita <Svg className='margin--small-l' src='ico_arrow-down.svg' /></a>
											<ul className={styles.subMenu}>
												<li><Link to='https://mataharimall.com'>Submenu item 1</Link></li>
												<li><Link to='https://mataharimall.com'>Submenu item 2</Link></li>
												<li><Link to='https://mataharimall.com'>Submenu item 3</Link></li>
												<li><Link to='https://mataharimall.com'>Submenu item 4</Link></li>
											</ul>
										</li>
										<li className={styles.subMenuParent}>
											<a className='flex-middle d-flex'>Sepatu Pria <Svg className='margin--small-l' src='ico_arrow-down.svg' /></a>
											<ul className={styles.subMenu}>
												<li><Link to='https://mataharimall.com'>Submenu item 1</Link></li>
												<li><Link to='https://mataharimall.com'>Submenu item 2</Link></li>
												<li><Link to='https://mataharimall.com'>Submenu item 3</Link></li>
												<li><Link to='https://mataharimall.com'>Submenu item 4</Link></li>
											</ul>
										</li>
										<li className={styles.subMenuParent}>
											<a className='flex-middle d-flex'>Pakaian <Svg className='margin--small-l' src='ico_arrow-down.svg' /></a>
											<ul className={styles.subMenu}>
												<li><Link to='https://mataharimall.com'>Submenu item 1</Link></li>
												<li><Link to='https://mataharimall.com'>Submenu item 2</Link></li>
												<li><Link to='https://mataharimall.com'>Submenu item 3</Link></li>
												<li><Link to='https://mataharimall.com'>Submenu item 4</Link></li>
											</ul>
										</li>
										<li className={styles.subMenuParent}>
											<a className='flex-middle d-flex'>Aksesoris <Svg className='margin--small-l' src='ico_arrow-down.svg' /></a>
											<ul className={styles.subMenu}>
												<li><Link to='https://mataharimall.com'>Submenu item 1</Link></li>
												<li><Link to='https://mataharimall.com'>Submenu item 2</Link></li>
												<li><Link to='https://mataharimall.com'>Submenu item 3</Link></li>
												<li><Link to='https://mataharimall.com'>Submenu item 4</Link></li>
											</ul>
										</li>
										<li className={styles.sale}><a>Sale</a></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					{
						this.props.rows &&
						<div className={styles.subHeaderWrapper}>
							<div className={styles.subHeader}>
								{this.props.rows}
							</div>
						</div>
					}
				</nav>
			</div>
		);
	}
};

Header.Search = Search;
Header.SearchResult = SearchResult;
Header.Modal = Modal;

export default withRouter(Header);