import React, { PureComponent } from 'react';
import { Svg } from '@/components/mobile';
import { Link } from 'react-router-dom';
import styles from './action.scss';

class Action extends PureComponent {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {};
	}

	render() {
		return (
			<div className={styles.container}>
				<div className={styles.wrapper}>
					<div className={styles.navigation}>
						<Link className={styles.item} to='/'>
							<Svg src='ico_reset.svg' />
							Reset
						</Link>
						{
							this.props.hasApply && (
								<Link className={styles.item} to='/'>
									<Svg src='ico_check.svg' />
									Apply
								</Link>
							)
						}
					</div>
				</div>
			</div>
		);
	}
}

export default Action;
