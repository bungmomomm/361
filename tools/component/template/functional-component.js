export default (params) => `

import React, { Component } from 'react';
import styles from './${params.name}.scss';

export default class ${params.name} extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		return (
			<div className={styles.${params.name}}>
				<h2>${params.name}</h2>
				<h3>Functional Component</h3>
			</div>
		);
	}
};

`.trim();