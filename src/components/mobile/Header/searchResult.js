import React from 'react';
import Input from '../Input';
import styles from './header.scss';
import Svg from '../Svg';
import { Link } from 'react-router-dom';

const SearchResult = props => {
	return (
		<nav className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.search}>
					<div className={styles.back}>
						<button onClick={props.back}> <Svg src='ico_arrow-back-left.svg' /> </button>
					</div>
					<div className={styles.center}>
						<Link to='/search' >
							<Input
								iconLeft={<Svg src='ico_search.svg' />}
								iconRight={<button><Svg src='ico_close-grey.svg' /></button>}
								placeholder='Cari produk, #hashtags'
								value={props.value}
							/>
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default SearchResult;
