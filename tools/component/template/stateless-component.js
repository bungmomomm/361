export default (params) => `

import React from 'react';
import PropTypes from 'prop-types';
import styles from './${params.name}.scss';

const ${params.name} = (props) => {
	return (
		<div className={styles.${params.name}}>
			<h2>${params.name}</h2>
			<h3 className={styles.test}>Stateless Component</h3>
		</div>
	);
};

${params.name}.propTypes = {
	test: PropTypes.bool
};

`.trim();