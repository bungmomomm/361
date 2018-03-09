import React, { Component } from 'react';
import _ from 'lodash';
import {
	Header,
	Button,
	Input,
	// Divider,
	Svg,
	Page,
	List,
} from '@/components/mobile';
import Action from './action';
// import C from '@/constants';
import styles from './brands.scss';
import utils from './utils';

class Brands extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			data: props.data || [],
			keyword: ''
		};
	}

	onClick(e, value) {
		let { data } = this.state;

		data = utils.updateChilds(data, value, {
			is_selected: value.is_selected === 1 ? 0 : 1
		});

		this.setState({
			data
		});
	}

	onApply(e) {
		const { data } = this.state;
		const { onApply } = this.props;
		const result = utils.getSelected(data);
		onApply(e, result);
	}

	reset() {
		const { data } = this.state;
		this.setState({
			keyword: '',
			data: utils.resetChilds(data)
		});
	}

	searchData(e) {
		this.setState({
			keyword: e.target.value
		});
	} 

	filterlist(key) {
		this.setState({
			filteredKey: key
		});
	}

	render() {
		const { onClose, title } = this.props;
		const { keyword } = this.state;
		
		let data = this.state.data;
		if (data.length > 0) {
			if (!_.isEmpty(keyword)) {
				data = _.filter(data, (value) => {
					const rgx = new RegExp(keyword, 'gi');
					return (value.facetdisplay.search(rgx)) > -1;
				});
			}
		}

		const HeaderPage = {
			left: (
				<Button onClick={onClose}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: _.capitalize(title),
			right: null
		};

		return (
			<div style={this.props.style}>
				<Page hideFooter>
					<div className={styles.filter}>
						<Input
							autoFocus
							iconLeft={<Svg src='ico_search.svg' />}
							placeholder={`cari nama ${title}`}
							value={keyword}
							onChange={(e) => this.searchData(e)}
						/>
					</div>
					<List>
						{_.map(data, (value, id) => {
							const icon = value.is_selected ? <Svg src='ico_check.svg' /> : <Svg src='ico_empty.svg' />;
							return (
								<Button key={id} align='left' wide onClick={(e) => this.onClick(e, value)}><List.Content>{value.facetdisplay} ({value.count}) {icon}</List.Content></Button>
							);
						})}
					</List>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action hasReset onReset={(e) => this.reset()} hasApply onApply={(e) => this.onApply(e)} />
			</div>
		);
	}
}


export default Brands;
