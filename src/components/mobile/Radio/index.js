import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './radio.scss';

class Radio extends PureComponent {
	render() {
		const { className } = this.props;
		const radioClass = classNames(
			className,
			styles.container,
			this.props.list ? styles.list : null,
			this.props.variant ? styles[this.props.variant] : styles.bullet
		);
		return (
			<div className={radioClass} style={this.props.style}>
				{
					this.props.data.map((list, idx) => (
						<label htmlFor={`${this.props.name}-${idx}`} key={idx}>
							<input disabled={list.disabled || false} onChange={() => this.props.onChange(list.value, list)} checked={this.props.checked === list.value} id={`${this.props.name}-${idx}`} type='radio' name={this.props.name} defaultValue={list.value} />
							<div className={styles.label}>{list.label}</div>
						</label>
					))
				}
			</div>
		);
	}
}


export default Radio;