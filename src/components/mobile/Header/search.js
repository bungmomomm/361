import React from 'react';
import Input from '../Input';
import styles from './header.scss';
import Svg from '../Svg';
import { Link } from 'react-router-dom';

const Search = props => {
	return (
		<nav className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.search}>
					<div className={styles.center}>
						<Input 
							autoFocus
							iconLeft={<Svg src='ico_search.svg' />}  
							iconRight={<button><Svg src='ico_close-grey.svg' /></button>}  
							placeholder='Cari produk, #hashtags, @seller' 
						/>
					</div>
					<div className={styles.right}><Link className={styles.cancelButton} to='/'>BATAL</Link></div>
				</div>
			</div>
		</nav>
	);
};

export default Search;
