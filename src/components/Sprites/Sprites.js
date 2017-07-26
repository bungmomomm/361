import React from 'react';
import styles from './Sprites.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default (props) => {
	const classSprites = cx({
		sprites: true,
		[`sprites__${props.name}`]: !!props.name,
	});
	return (
		<i className={classSprites} />
	);
};