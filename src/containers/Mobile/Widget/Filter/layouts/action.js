import React, { PureComponent } from 'react';
import { Svg, Button } from '@/components/mobile';
import styles from './action.scss';

class Action extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {};
	}

	render() {
		const { onApply, onReset } = this.props;
		return (
			<div className={styles.container}>
				<div className={styles.wrapper}>
					<div className={styles.navigation}>
						{
							this.props.hasReset && (
								<Button className={`${styles.item} ${styles.reset}`} onClick={onReset}>
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
