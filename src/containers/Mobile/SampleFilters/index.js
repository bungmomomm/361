import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import Filter from '@/containers/Mobile/Shared/Filter';
import Sort from '@/containers/Mobile/Shared/Sort';
import Shared from '@/containers/Mobile/Shared';
import { actions } from '@/state/v4/SortFilter';
import { Header, Page, Svg, Tabs } from '@/components/mobile';
import { Link } from 'react-router-dom';
import { to } from 'await-to-js';
import styles from './samplefilters';

class Filters extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			shown: true
		};
	}

	async onApply(e) {
		const { dispatch, cookies, filters } = this.props;
		const [err, response] = await to(dispatch(new actions.applyFilter(cookies.get('user.token'), 'category', filters)));
		if (err) {
			return err;
		}
		return response;
	}

	onUpdateFilter(e, type, value) {
		try {
			this.props.dispatch(new actions.updateFilter(type, value));
		} catch (error) {
			console.log(error);
		}
	}
	
	onReset(e) {
		this.props.dispatch(new actions.resetFilter());
	}

	onClose(e) {
		this.setState({
			shown: false
		});
	}

	handlePick(what) {
		console.log(what);
		this.setState({
			shown: what === 'filter'
		});
	}

	sort(e, value) {
		this.props.dispatch(new actions.updateSort(value));
	}

	render() {
		const { filters } = this.props;
		const { shown } = this.state;

		const HeaderPage = {
			left: (
				<Link to='/'>
					<Svg src={'ico_arrow-back-left.svg'} />
				</Link>
			),
			center: 'Sample Page',
			right: null
		};

		return (
			<div>
				{shown && (
					<Filter 
						shown={shown} 
						filters={filters} 
						onUpdateFilter={(e, type, value) => this.onUpdateFilter(e, type, value)} 
						onApply={(e) => this.onApply(e)} 
						onReset={(e) => this.onReset(e)}
						onClose={(e) => this.onClose(e)}
					/>
				)}

				{!shown && (
					<div style={this.props.style}>
						<Page>
							<div className={styles.cardContainer}>
								<Sort sorts={filters.sorts} onSelected={(e, value) => this.sort(e, value)} />
							</div>
						</Page>
						<Header.Modal {...HeaderPage} />
						<Tabs
							type='segment'
							variants={[
								{
									id: 'urutkan',
									title: 'Urutkan'
								},
								{
									id: 'filter',
									title: 'filter'
								},
								{
									id: 'view',
									title: <Svg src='ico_grid.svg' />
								}
							]}
							onPick={e => this.handlePick(e)}
						/>
					</div>
				)}

			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		...state
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch
	};
};

const doAfterAnonymous = (props) => {
	console.log('code here if you need anon token or token s');
};

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Shared(Filters, doAfterAnonymous)));