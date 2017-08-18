import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Elocker.scss';
// component load
import { Input, Select, Card, Button } from '@/components/Base';

export default class Elocker extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.getSelectedProvince = this.getSelectedProvince.bind(this);
		this.getFilterLabel = this.getFilterLabel.bind(this);
		this.submitLocker = this.submitLocker.bind(this);
		this.provinceFilterResult = this.props.listo2o;
		this.state = {
			ElockerList: this.props.listo2o,
			selectedLocker: null,
		};
	}

// ----------------------------------------
// Getters
// ----------------------------------------

	getSelectedProvince(event) {
		this.props.onGetListO2o(event.value);
		this.props.setCurrentProvince(event);
		// const filterData = this.computeFilter(event.value, this.state.ElockerList, 'province');
		// this.provinceFilterResult = filterData;
	}

	getFilterLabel(event) {
		this.computeFilter(event.target.value, this.props.listo2o, 'label');
	}

// ----------------------------------------
// Setters
// ----------------------------------------

	setFilterProvince(filterData) {
		this.props.setFilterLocker(filterData);
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


	handleChooseElocker(i) {
		const TempElocker = this.props.filtero2o;
		for (let key = 0; key < TempElocker.length; key++) {
			TempElocker[key].selected = i === key || false;
		}
		this.setState({
			selectedLocker: TempElocker[i]
		});
		this.setFilterProvince(TempElocker);
	}
	
	submitLocker(event) {
		this.props.onSelectedLocker(this.state.selectedLocker);
	}

	render() {
		return (
			<div className={styles.eLocker}>
				<div className={styles.header}>
					<div className={styles.provinsiWrapper}>
						<Select 
							options={this.props.o2oProvinces ? this.props.o2oProvinces : []} 
							onChange={this.getSelectedProvince}
							selected={this.props.currentProvince}
							selectedLabel={this.props.currentProvince.label}
						/>
					</div>
					<div className={styles.kotaFilterWrapper}>
						<Input onChange={this.getFilterLabel} placeholder='Nama Kota, Jakarta, Medan' />
					</div>
				</div>
				<div className={styles.eLockerList}>
					{
						!this.props.filtero2o ? null :
						this.props.filtero2o.map((elocker, index) => (
							<Card onClick={() => this.handleChooseElocker(index)} key={index} selected={!!elocker.selected} radius>
								<Card.Title>{elocker.label}</Card.Title>
								<p>{elocker.info}</p>
							</Card>
						))
					}
				</div>
				<Button onClick={this.submitLocker} content='Pilih Lokasi Toko / E-locker' color='dark' block size='large' iconPosition='right' icon='angle-right' />
			</div>
		);
	}
};
