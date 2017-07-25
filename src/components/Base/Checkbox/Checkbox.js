import React, { Component } from 'react';
import styles from './Checkbox.scss';
import newId from '@/utils/newId.js';

export default class Checkbox extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		const idFor = newId();
		return (
			<label className={styles.checkboxWrapper} htmlFor={idFor}>
				<input id={idFor} type='checkbox' className={styles.Checkbox} defaultValue={this.props.value} name={this.props.name} />
				<span className={styles.checkboxInput} />
				<span className={styles.checkboxText}>{this.props.text}</span>
			</label>
		);
	}
};