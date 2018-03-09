import React from 'react';
import Input from '../Input';
import styles from './header.scss';
import Svg from '../Svg';

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
					<div className='flex-row flex-spaceBetween padding--medium-h flex-middle'>
						<div className={styles.center}>
							<Input
								autoFocus
								onFocus={toEnd}
								iconLeft={<Svg src='ico_search.svg' />}
								iconRight={<button onClick={props.updatedKeywordHandler}>
									<Svg src='ico_close-grey.svg' />
								</button>}
								placeholder='Cari produk, #hashtags'
								onChange={props.updatedKeywordHandler}
								onKeyPress={props.onKeyPressHandler}
								value={props.value}
							/>
						</div>
						<div className='d-flex flex-middle' ><button onClick={props.back}>BATAL</button></div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Search;
