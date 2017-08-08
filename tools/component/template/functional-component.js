export default (params) => `

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { injectProps } from '@/decorators';
import styles from './${params.name}.scss';
const cx = classNames.bind(styles);

class ${params.name} extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

// ----------------------------------------
// Getters
// ----------------------------------------

// ----------------------------------------
// Setters
// ----------------------------------------

// ----------------------------------------
// Event Handlers
// ----------------------------------------

// ----------------------------------------
// Render
// ----------------------------------------

	@injectProps
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

${params.name}.propTypes = {
	test: PropTypes.bool
};

`.trim();