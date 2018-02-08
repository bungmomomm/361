import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Button from '../Button';
import styles from './select.scss';

const Content = (props) => {
	if (!props.show) return null;
	return (
		<div className={`${props.className || ''} ${styles.content}`}>
			<div className={styles.wrapper}>
				<div className={styles.action}>
					<div>{props.label}</div>
					<div><Button onClick={() => props.onClose()}>SELESAI</Button></div>
				</div>
				<div className={styles.lists}>
					{
						props.options.map((option, idx) => (
							<Button onClick={() => { props.onChange(option); props.onClose(); }}>
								<span>
									<span className={option.disabled ? 'text-line-through font-color--primary-ext-1' : ''}>{option.label}</span>
									{option.note && <span className='font-color--red font-small'> - {option.note}</span>}
								</span>
							</Button>
						))
					}
				</div>
			</div>
		</div>
	);
};


class Select extends PureComponent {
	render() {
		const { className, ...props } = this.props;

		const createClassName = classNames(
			styles.container,
			className
		);

		return (
			<div className={createClassName} {...props}>
				{Content}
			</div>
		);
	}
}

Select.Content = Content;


export default Select;
