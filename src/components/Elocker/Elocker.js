import React, { Component } from 'react';
import styles from './Elocker.scss';
// component load
import { Input, Select, Card } from '@/components/Base';

// Dummy Data
import { Provinsi, ElockerList } from '@/data';

export default class Elocker extends Component {
	constructor(props) {
		super(props);
		this.props = props;
	}

	render() {
		return (
			<div className={styles.eLocker}>
				<div className={styles.header}>
					<div className={styles.provinsiWrapper}>
						<Select options={Provinsi} />
					</div>
					<div className={styles.kotaFilterWrapper}>
						<Input placeholder='Nama Kota, Jakarta, Medan' />
					</div>
				</div>
				<div className={styles.eLockerList}>
					{
						ElockerList.map((elocker, index) => (
							<Card radius>
								<Card.Title>{elocker.name}</Card.Title>
								<p>{elocker.location}</p>
							</Card>
						))
					}
				</div>
			</div>
		);
	}
};