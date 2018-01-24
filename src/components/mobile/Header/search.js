import React from 'react';
import Input from '../Input';
import styles from './header.scss';
import Svg from '../Svg';
import { Link } from 'react-router-dom';

const Search = props => {
	const toEnd = (e) => {
		const val = e.target.value;
		e.target.value = '';
		e.target.value = val;
	};

	return (
		<nav className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.search}>
					<div className={styles.center}>
						<Input
							autoFocus
							onFocus={toEnd}
							iconLeft={<Svg src='ico_search.svg' />}
							iconRight={
								<button
									onClick={props.updatedKeywordHandler}
								>
									<Svg src='ico_close-grey.svg' />
								</button>}
							placeholder='Cari produk, #hashtags, @seller'
							onChange={props.updatedKeywordHandler}
							onKeyPress={props.onKeyPressHandler}
							value={props.value}
						/>
					</div>
					<div className={styles.right}><Link className={styles.cancelButton} to='/'>BATAL</Link></div>
				</div>
			</div>
		</nav>
	);
};

export default Search;
