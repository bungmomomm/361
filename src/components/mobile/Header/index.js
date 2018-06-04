import React from 'react';
// import Input from '../Input';
import styles from './header.scss';
import Svg from '../Svg';
// import Badge from '../Badge';
import Search from './search';
import SearchResult from './searchResult';
import Modal from './modal';
import { withRouter, Link } from 'react-router-dom';

const Header = props => {

	// const { location, lovelist } = props;

	// let searchReference = 'home';

	// if (location.pathname === '/category') {
		// searchReference = 'category';
	// }

	return (
		<nav className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.header}>
					<div className='flex-row row flex-spaceBetween padding--medium-h flex-middle'>
						<div className='col-xs-2'>
							<Link className='d-flex flex-middle' to='/mau-gaya-itu-gampang'><Svg src='ico_bar_361.svg' /></Link>
						</div>
						<div className='col-xs-2'>
							<Link className='d-flex flex-middle' to='/mau-gaya-itu-gampang'><Svg src='ico_search_361.svg' /></Link>
						</div>
						<div className='col-xs-4'>
							<Link className='d-flex flex-middle' to='/'><Svg src='logo_361.svg' /></Link>
						</div>
						<div className='col-xs-2'>
							<Link className='d-flex flex-middle' to='/mau-gaya-itu-gampang'><Svg src='ico_hashtags.svg' /></Link>
						</div>
						<div className='col-xs-2'>
							<Link className='d-flex flex-middle' to='/mau-gaya-itu-gampang'><Svg src='ico_bag_361.svg' /></Link>
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
	);
};

Header.Search = Search;
Header.SearchResult = SearchResult;
Header.Modal = Modal;

export default withRouter(Header);