import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Elocker.scss';
// component load
import Input from '@/components/Elements/Input/Input';
import Select from '@/components/Modules/Select/Select';
import Card from '@/components/Elements/Card/Card';
import Button from '@/components/Elements/Button/Button';

export default class Elocker extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.getSelectedProvince = this.getSelectedProvince.bind(this);
		this.getFilterLabel = this.getFilterLabel.bind(this);
		this.submitLocker = this.submitLocker.bind(this);
		this.handleChooseElocker = this.handleChooseElocker.bind(this);
		this.provinceFilterResult = this.props.listo2o;
		this.state = {
			ElockerList: this.props.listo2o,
			selectedLocker: null,
			selected: null,
			filter: '',
		};
	}

// ----------------------------------------
// Getters
// ----------------------------------------

	getSelectedProvince(event) {
		this.props.onGetListO2o(event.value);
		this.props.setCurrentProvince(event);
		this.setState({
			filter: ''
		});
		// const filterData = this.computeFilter(event.value, this.state.ElockerList, 'province');
		// this.provinceFilterResult = filterData;
	}

	getFilterLabel(event) {
		this.computeFilter(event.target.value, this.props.listo2o, 'address_label');
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
			const filterLabel = item.attributes[`${field}`].toUpperCase();
			const isFilteredByLabel = (filterLabel.toUpperCase().indexOf(filter.toUpperCase()) > -1);
			const filterAddress = item.attributes.address.toLowerCase();
			const isFilteredByAddress = (filterAddress.toLowerCase().indexOf(filter.toLowerCase()) > -1);
			return (isFilteredByLabel || isFilteredByAddress) ? item : null;
		}).filter((item) => {
			return item;
		});
		this.setFilterProvince(filterData);
		this.setState({
			filter
		});
		return filterData;
	}


	handleChooseElocker(i) {
		const TempElocker = this.props.filtero2o;
		TempElocker.map((data, index) => {
			if (index === i) {
				this.setState({
					selectedLocker: data,
					selected: data.id
				});
			}
			return TempElocker;
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
						<Input onChange={this.getFilterLabel} placeholder='Nama Kota, Jakarta, Medan' value={this.state.filter} />
					</div>
				</div>
				<div className={styles.eLockerList}>
					{
						!this.props.filtero2o ? null :
						this.props.filtero2o.map((elocker, index) => (
							<Card onClick={() => this.handleChooseElocker(index)} key={index} selected={this.state.selected === elocker.id} radius>
								<Card.Title>{elocker.attributes.address_label}</Card.Title>
								<p>{elocker.attributes.address}</p>
							</Card>
						))
					}
				</div>
				<Button onClick={this.submitLocker} content='Pilih Lokasi Toko / E-locker' color='dark' block size='large' iconPosition='right' icon='angle-right' />
			</div>
		);
	}
};
