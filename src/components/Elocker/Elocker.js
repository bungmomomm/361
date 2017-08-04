import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Elocker.scss';
// component load
import { Input, Select, Card } from '@/components/Base';

// Dummy Data
import { Provinsi, ElockerList } from '@/data';

export default class Elocker extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.getSelectedProvince = this.getSelectedProvince.bind(this);
		this.getFilterCity = this.getFilterCity.bind(this);
		this.provinceFilterResult = ElockerList;
		this.state = {
			ElockerList
		};
	}

// ----------------------------------------
// Getters
// ----------------------------------------

	getSelectedProvince(event) {
		const filterData = this.computeFilter(event.value, ElockerList, 'province');
		this.provinceFilterResult = filterData;
	}

	getFilterCity(event) {
		this.computeFilter(event.target.value, this.provinceFilterResult, 'city');
	}

// ----------------------------------------
// Setters
// ----------------------------------------

	setFilterProvince(filterData) {
		this.setState({
			ElockerList: filterData
		});
	}

// ----------------------------------------
// Compute
// ----------------------------------------

	computeFilter(filter, List, field) {
		const filterData = List.map((item) => {
			const filterLabel = item[`${field}`].toUpperCase();
			return (filterLabel.toUpperCase().indexOf(filter.toUpperCase()) > -1) ? item : null;
		}).filter((item) => {
			return item;
		});
		this.setFilterProvince(filterData);
		return filterData;
	}


	render() {
		return (
			<div className={styles.eLocker}>
				<div className={styles.header}>
					<div className={styles.provinsiWrapper}>
						<Select options={Provinsi} onChange={this.getSelectedProvince} />
					</div>
					<div className={styles.kotaFilterWrapper}>
						<Input onChange={this.getFilterCity} placeholder='Nama Kota, Jakarta, Medan' />
					</div>
				</div>
				<div className={styles.eLockerList}>
					{
						this.state.ElockerList.map((elocker, index) => (
							<Card key={index} selected={!!elocker.selected} radius>
								<Card.Title>{elocker.label}</Card.Title>
								<p>{elocker.info}</p>
							</Card>
						))
					}
				</div>
			</div>
		);
	}
};
