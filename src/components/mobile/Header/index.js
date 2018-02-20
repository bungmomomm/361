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
					<div className={styles.left}>
						<Link to='/lovelist'>
							<Svg src='ico_lovelist.svg' />
							<Badge circle attached size='small' className='bg--red font-color--white'>{props.lovelist}</Badge>
						</Link>
					</div>
					<div className={styles.center}>
						<Input
							iconLeft={<Svg src='ico_search.svg' />}
							onFocus={() => props.history.push('/search')}
							placeholder='Cari produk, #hashtags, @seller'
							value={props.value}
						/>
					</div>
					<div className={styles.right}><Link to='/search'><Svg src='ico_hashtags.svg' /></Link></div>
				</div>
			</div>
		</nav>
	);
};

Header.Search = Search;
Header.SearchResult = SearchResult;
Header.Modal = Modal;

export default withRouter(Header);
