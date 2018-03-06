import React, { PureComponent } from 'react';
import classNames from 'classNames';
import styles from './radio.scss';

class Radio extends PureComponent {
	render() {
		const { className } = this.props;
		const radioClass = classNames(
			className,
			styles.container,
			this.props.list ? styles.list : null
		);
		return (
			<div className={radioClass} style={this.props.style}>
				{
					this.props.data.map((list, idx) => (
						<label htmlFor={`label-${idx}`} key={idx}>
							<input disabled={list.disabled || false} onChange={() => this.props.onChange(list.value)} checked={this.props.checked === list.value} id={`label-${idx}`} type='radio' name={this.props.name} defaultValue={list.value} />
							<div className={styles.label}>{list.label}</div>
						</label>
					))
				}
			</div>
		);
	}
}


export default Radio;
