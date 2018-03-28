import React, { PureComponent } from 'react';
import { Svg, Button } from '@/components/mobile';
import styles from './action.scss';
import classNames from 'classnames';
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Action extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {};
	}

	render() {
		const { resetDisabled, onApply, onReset } = this.props;

		const cx = classNames(
			styles.item,
			resetDisabled ? styles.reset : null
		);

		return (
			<div className={styles.container}>
				<div className={styles.wrapper}>
					<div className={styles.navigation}>
						{
							this.props.hasReset && (
								<Button className={cx} disabled={resetDisabled} onClick={onReset}>
									<Svg src='ico_reset.svg' />
									Reset
								</Button>
							)
						}
						{
							this.props.hasApply && (
								<Button className={styles.item} onClick={onApply}>
									<Svg src='ico_check.svg' />
									Terapkan
								</Button>
							)
						}
					</div>
				</div>
			</div>
		);
	}
}

export default Action;
