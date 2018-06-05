import React from 'react';
import Input from '../Input';
import styles from './header.scss';
import Svg from '../Svg';
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
								<div className='col-xs-2 col-md-1 col-lg-1'>
									<Link className='d-flex flex-middle flex-center' to='/mau-gaya-itu-gampang'><Svg src='ico_user.svg' /></Link>
								</div>
								<div className='col-xs-2 col-md-1 col-lg-1'>
									<Link className='d-flex flex-middle flex-center' to='/mau-gaya-itu-gampang'><Svg src='ico_hashtags.svg' /></Link>
								</div>
								<div className='col-xs-2 col-md-1 col-lg-1'>
									<Link className='d-flex flex-middle flex-center' to='/mau-gaya-itu-gampang'><Svg src='ico_bag_361.svg' /></Link>
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