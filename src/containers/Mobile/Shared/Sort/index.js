import React, { Components } from 'react';
import { List, Svg } from '@/components/mobile';
import styles from './sort.scss';

class Sort extends Components {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		return (
			<div className={styles.filterNavigation}>
				<List>
					<List.Content>
						Populer
						<Svg src='ico_check.svg' />
					</List.Content>
				</List>
				<List>
					<List.Content>
						Terbaru
						<Svg src='ico_empty.svg' />
					</List.Content>
				</List>
				<List>
					<List.Content>
						Harga Terendah
						<Svg src='ico_empty.svg' />
					</List.Content>
				</List>
				<List>
					<List.Content>
						Harga Tertinggi
						<Svg src='ico_empty.svg' />
					</List.Content>
				</List>
				<List>
					<List.Content>
						Diskon Terendah
						<Svg src='ico_empty.svg' />
					</List.Content>
				</List>
				<List>
					<List.Content>
						Diskon Tertinggi
						<Svg src='ico_empty.svg' />
					</List.Content>
				</List>
			</div>
		);
	}
}

export default Sort;