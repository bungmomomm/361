import React from 'react';
import Input from '../Input';
import styles from './header.scss';
import Svg from '../Svg';

const SearchResult = props => {
	return (
		<nav className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.search}>
					<div className={styles.right}>Back Button</div>
					<div className={styles.center}>
						<Input
							iconLeft={<Svg src='ico_search.svg' />}
							iconRight={<button><Svg src='ico_close-grey.svg' /></button>}
							placeholder='Cari produk, #hashtags, @seller'
							value={props.value}
						/>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default SearchResult;
