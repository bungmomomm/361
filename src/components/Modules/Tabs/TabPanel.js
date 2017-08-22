import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Tabs.scss';
const cx = classNames.bind(styles);

const Panel = (props) => {
	const panelClass = cx({
		panel: true
	});
	return (
		<div className={panelClass}>
			{props.children}
		</div>
	);
};

export default Panel;

Panel.propTypes = {
	children: PropTypes.node
};