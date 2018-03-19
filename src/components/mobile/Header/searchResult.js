import React from 'react';
import Input from '../Input';
import classNames from 'classnames';
import styles from './header.scss';
import Svg from '../Svg';
// import { Link } from 'react-router-dom';

const SearchResult = props => {
	const modalClass = classNames(
		styles.search
	);

	let rightIcon;
	if (props.iconRightAction) {
		rightIcon = (
			<button onClick={props.iconRightAction}>
				<Svg src='ico_close-grey.svg' />
			</button>
		);
	} else {
		rightIcon = <button><Svg src='ico_close-grey.svg' /></button>;
	}

	return (
		<nav className={styles.container}>
			<div className={styles.wrapper}>
				<div className={modalClass}>
					<div className='flex-row flex-spaceBetween padding--small-h flex-middle'>
						<div className={styles.back}>
							<button onClick={props.back}> <Svg src='ico_arrow-back-left.svg' /> </button>
						</div>
						<div className={styles.center}>
							<Input
								iconLeft={<Svg src='ico_search.svg' />}
								iconRight={rightIcon}
								placeholder='Cari produk, #hashtags'
								value={props.value}
								onClickInputAction={props.onClickInputAction}
							/>
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

export default SearchResult;
