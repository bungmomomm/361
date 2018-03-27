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
import handler from '@/containers/Mobile/Shared/handler';

@handler
class Brands extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			data: props.data || [],
			keyword: '',
			resetDisabled: utils.getSelected(props.data).length < 1
		};
	}

	onClick(e, value) {
		let { data } = this.state;

		data = utils.updateChilds(data, value, {
			is_selected: value.is_selected === 1 ? 0 : 1
		});

		const resetDisabled = utils.getSelected(data).length < 1;

		this.setState({
			resetDisabled,
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
			resetDisabled: true,
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
		const { keyword, resetDisabled } = this.state;

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
			center: _.capitalize(title) || 'Default',
			right: null
		};

		return (
			<div style={this.props.style}>
				<Page color='white'>
					<div className={styles.filterSearch}>
						<div className='margin--medium-v flex-row flex-middle'>
							<div style={{ flex: 1 }}>
								<Input
									autoFocus
									iconLeft={<Svg src='ico_search.svg' />}
									placeholder={`cari nama ${title}`}
									value={keyword}
									onChange={(e) => this.searchData(e)}
									iconRight={<button><Svg src='ico_close-grey.svg' /></button>}
								/>
							</div>
							<Button className='font-bold margin--medium-l'>BATAL</Button>
						</div>
					</div>
					<List>
						{_.map(data, (value, id) => {
							const icon = value.is_selected ? <Svg src='ico_check.svg' /> : <Svg src='ico_empty.svg' />;
							return (
								<Button key={id} align='left' wide onClick={(e) => this.onClick(e, value)}>
									<List.Content className='padding--medium-v'>
										<div className='flex-row flex-middle'>
											<span>{value.facetdisplay}</span> <span className='font-color--primary-ext-2 margin--small-l'>({value.count})</span>
										</div>
										{icon}
									</List.Content>
								</Button>
							);
						})}
					</List>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action resetDisabled={resetDisabled} hasReset onReset={(e) => this.reset()} hasApply onApply={(e) => this.onApply(e)} />
			</div>
		);
	}
}


export default Brands;
