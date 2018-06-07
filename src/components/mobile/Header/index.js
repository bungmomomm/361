import React from 'react';
import Input from '../Input';
import styles from './header.scss';
import Svg from '../Svg';
import classNames from 'classnames';
import Image from '../Image';
import Level from '../Level';
import Button from '../Button';
// import Badge from '../Badge';
import Search from './search';
import SearchResult from './searchResult';
import Modal from './modal';
import { withRouter, Link } from 'react-router-dom';

const Header = props => {

	// const { location, lovelist } = props;

	let searchReference = 'home';

	if (location.pathname === '/category') {
		searchReference = 'category';
	}
	
	const isBagEmpty = false;

	console.log(searchReference);
	
	
	const shoppingBagClass = classNames(
		styles.modalOnHeader,
		styles.shoppingBagModal
	);


	return (
		<div>
			<nav className={styles.container}>
				<div className={styles.wrapper}>
					<div className={styles.header}>
						<div className={styles.topbar}>
							<div className='container'>
								<div className='row'>
									<div className='col-xs-2 col-sm-2 col-md-2 col-lg-2'>
										<Link className='d-flex flex-middle' to='https://matahari.com'><Svg src='ico_matahari.svg' /> Matahari Department Store</Link>
									</div>
									<div className='col-xs-2 col-sm-2 col-md-2 col-lg-2'>
										<Link className='d-flex flex-middle' to='https://mataharimall.com'><Svg src='ico_mataharimall.svg' /> MatahariMall.com</Link>
									</div>
									<div className='col-md-offset-6 col-lg-offset-6 col-xs-2 col-sm-2 col-md-2 col-lg-2 text-right'>
										<Link to='https://mataharimall.com'>Tentang 361</Link>
									</div>
								</div>
							</div>
						</div>
						<div className='container'>
							<div className='row padding--medium-v flex-middle'>
								<div className='col-xs-2 col-sm-2 col-md-3 col-lg-3'>
									<Link className='d-flex flex-middle' to='/mau-gaya-itu-gampang'><Svg src='logo.svg' /></Link>
								</div>
								<div className='col-xs-2 col-md-6 col-lg-6'>
									<div className={styles.center}>
										<Input
											onFocus={() => props.history.push(`/search?ref=${searchReference}`)}
											placeholder=''
											value=''
										/>
										<div className={styles.dummyplaceholder}>
											<span className='padding--small-h'>Cari produk</span>
											<span><Svg src='ico_search_361_small.svg' /></span>
										</div>
									</div>
								</div>
								<div className='col-xs-2 col-md-1 col-lg-1' >
									<Link className='d-flex flex-middle flex-center' to='/mau-gaya-itu-gampang'><Svg src='ico_user.svg' /></Link>
								</div>
								<div className='col-xs-2 col-md-1 col-lg-1'>
									<Link className='d-flex flex-middle flex-center' to='/mau-gaya-itu-gampang'><Svg src='ico_hashtags.svg' /></Link>
								</div>
								<div className='col-xs-2 col-md-1 col-lg-1 d-flex flex-middle flex-center relative'>
									<Svg
										src='ico_bag_361.svg'
										onClick={
											() => {
												const shoppingBagModal = document.getElementById('shoppingBagModal');
												if (shoppingBagModal.style.display === 'none') {
													shoppingBagModal.style.display = 'block';
												} else {
													shoppingBagModal.style.display = 'none';
												}
											}
										}
									/>
									
									<div className={shoppingBagClass} id='shoppingBagModal'>
										{
											isBagEmpty && (
												<div className='flex-column flex-center flex-middle text-center'>
													<Svg src='ico_bag_empty.svg' />
													<div>
														Tas belanja anda masih kosong.
													</div>
												</div>
											)
										}
										{
											!isBagEmpty && (
												<div>
													<h3>Tas Belanja <span>(3 Barang)</span></h3>
													<div style={{ borderBottom: '1px solid #EEEEEE' }}>
														<Level style={{ paddingLeft: '0px' }} className='flex-row'>
															<Level.Item style={{ width: '30%', flex: 'none' }}>
																<Link className='font-color--black' to={''}>
																	<Image width='100%' src={''} />
																</Link>
															</Level.Item>
															<Level.Item className='padding--medium-l'>
																<div className='flex-row flex-spaceBetween'>
																	<Link className='font-color--black text-uppercase' to={''}>
																		MALE CASUAL SHOES
																	</Link>
																	<Button className='font-color--primary-ext-1 margin--medium-l margin--small-r'>
																		<Svg src='ico_trash.svg' />
																	</Button>
																</div>
																<div className='margin--medium-t'>
																	<div className='font-color--primary'>
																		Ukuran: 36
																	</div>
																	<div className='font-color--secondary margin--normal-v'>
																		Rp 240.000
																	</div>
																	<div className='font-color--primary-ext-1'>
																		Jumlah : 1
																	</div>
																</div>
															</Level.Item>
														</Level>
													</div>
													<div style={{ borderBottom: '1px solid #EEEEEE' }}>
														<Level style={{ paddingLeft: '0px' }} className='flex-row'>
															<Level.Item style={{ width: '30%', flex: 'none' }}>
																<Link className='font-color--black' to={''}>
																	<Image width='100%' src={''} />
																</Link>
															</Level.Item>
															<Level.Item className='padding--medium-l'>
																<div className='flex-row flex-spaceBetween'>
																	<Link className='font-color--black text-uppercase' to={''}>
																		MALE CASUAL SHOES
																	</Link>
																	<Button className='font-color--primary-ext-1 margin--medium-l margin--small-r'>
																		<Svg src='ico_trash.svg' />
																	</Button>
																</div>
																<div className='margin--medium-t'>
																	<div className='font-color--primary'>
																		Ukuran: 36
																	</div>
																	<div className='font-color--secondary margin--normal-v'>
																		Rp 240.000
																	</div>
																	<div className='font-color--primary-ext-1'>
																		Jumlah : 1
																	</div>
																</div>
															</Level.Item>
														</Level>
													</div>
													<div
														className='flex-row flex-spaceBetween'
														style={{
															marginBottom: '19px',
															marginTop: '20px'
														}}
													>
														<div>Subtotal</div>
														<div>Rp 745.000</div>
													</div>
													<div className='flex-column'>
														<Button color='secondary' size='large' style={{ marginBottom: '15px' }}>
															Lihat Pesanan
														</Button>
														<Button color='primary' size='large'>
															Checkout
														</Button>
													</div>
												</div>
											)
										}
									</div>
								</div>
							</div>
							{ /* <div className='flex-row row flex-spaceBetween padding--medium-h flex-middle'>
								<div className='col-xs-2 col-sm-2 col-md-2 col-lg-2'>
									<Link className='d-flex flex-middle flex-center' to='/mau-gaya-itu-gampang'><Svg src='ico_bar_361.svg' /></Link>
								</div>
								<div className='col-xs-2'>
									<Link className='d-flex flex-middle flex-center' to='/mau-gaya-itu-gampang'><Svg src='ico_search_361.svg' /></Link>
								</div>
								<div className='col-xs-4'>
									<Link className='d-flex flex-middle flex-center' to='/'><Svg src='logo_361.svg' /></Link>
								</div>
								<div className='col-xs-2'>
									<Link className='d-flex flex-middle flex-center' to='/mau-gaya-itu-gampang'><Svg src='ico_hashtags.svg' /></Link>
								</div>
								<div className='col-xs-2'>
									<Link className='d-flex flex-middle flex-center' to='/mau-gaya-itu-gampang'><Svg src='ico_bag_361.svg' /></Link>
								</div>
							</div> */ }
						</div>
						<div className={styles.main}>
							<div className='container'>
								<ul>
									<li><a className='flex-middle d-flex'>Sepatu Wanita <Svg className='margin--small-l' src='ico_arrow-down.svg' /></a></li>
									<li><a className='flex-middle d-flex'>Sepatu Pria <Svg className='margin--small-l' src='ico_arrow-down.svg' /></a></li>
									<li><a className='flex-middle d-flex'>Pakaian <Svg className='margin--small-l' src='ico_arrow-down.svg' /></a></li>
									<li><a className='flex-middle d-flex'>Aksesoris <Svg className='margin--small-l' src='ico_arrow-down.svg' /></a></li>
									<li className={styles.sale}><a>Sale</a></li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				{
					props.rows &&
					<div className={styles.subHeaderWrapper}>
						<div className={styles.subHeader}>
							{props.rows}
						</div>
					</div>
				}
			</nav>
		</div>
	);
};

Header.Search = Search;
Header.SearchResult = SearchResult;
Header.Modal = Modal;

export default withRouter(Header);