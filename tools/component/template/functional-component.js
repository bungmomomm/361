export default (params) => `

import React, { Component } from 'react';
import styles from './${params.name}.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default class ${params.name} extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

// ----------------------------------------
// Component Event Handlers
// ----------------------------------------

// ----------------------------------------
// Getters
// ----------------------------------------

// ----------------------------------------
// Setters
// ----------------------------------------

// ----------------------------------------
// Behavior
// ----------------------------------------

// ----------------------------------------
// Compute
// ----------------------------------------

// ----------------------------------------
// Refs
// ----------------------------------------

// ----------------------------------------
// Render
// ----------------------------------------

	render() {
		const class${params.name} = cx({
			${params.name}: true
		});
		return (
			<div className={class${params.name}}>
				<h3>Functional Component</h3>
			</div>
		);
	}
};

`.trim();