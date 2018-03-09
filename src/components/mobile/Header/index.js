import React from 'react';
import Input from '../Input';
import styles from './header.scss';
import Svg from '../Svg';
import Badge from '../Badge';
import Search from './search';
import SearchResult from './searchResult';
import Modal from './modal';
import { withRouter, Link } from 'react-router-dom';

const Header = props => {
	return (
		<nav className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.header}>
					<div className='flex-row flex-spaceBetween padding--medium-h flex-middle'>
						<div>
							<Link className='d-flex flex-middle' to='/lovelist'>
								<Svg src='ico_lovelist.svg' />
								<Badge circle attached size='small' className='bg--secondary-ext-1 font-color--white'>{props.lovelist}</Badge>
							</Link>
						</div>
						<div className={styles.center}>
							<Input
								onFocus={() => props.history.push('/search')}
								placeholder=''
								value={props.value}
							/>
							<div className={styles.dummyplaceholder}>
								<span><Svg src='ico_search.svg' /></span>
								<span className='padding--small-h'>Cari produk, #hashtags</span>
							</div>
						</div>
						<Link className='d-flex flex-middle' to='/mau-gaya-itu-gampang'><Svg src='ico_hashtags.svg' /></Link>
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
