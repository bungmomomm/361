import React, { PureComponent } from 'react';
import { Header, Page, Svg, List, Button } from '@/components/mobile';
import Action from './action';
// import styles from './tree.scss';

import _ from 'lodash';
import utils from './utils';

class Location extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			activeTree: null,
			selected: null,
			data: props.data || [],
			resetData: props.data ? _.cloneDeep(props.data) : [],
		};
	}
	
	onApply(e) {
		const { data } = this.state;
		const { onApply } = this.props;
		const result = utils.getSelected(data);
		onApply(e, result);
	}

	onClick(e, value) {
		const { data } = this.state;
		this.setState({
			data: utils.updateChilds(data, value, {
				is_selected: value.is_selected === 1 ? 0 : 1
			})
		});
	}

	reset() {
		const { data } = this.state;
		this.setState({
			data: utils.resetChilds(data)
		});
	}

	render() {
		const { onClose, title } = this.props;
		const { data } = this.state;
		const HeaderPage = {
			left: (
				<Button onClick={onClose}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: title || 'Default',
			right: null
		};

		const Icon = (active) => {
			if (active) {
				return <Svg src='ico_check.svg' />;
			}
			return <Svg src='ico_empty.svg' />;
		};

		return (
			<div style={this.props.style}>
				<Page>
					<div>
						{_.map(data, (value, id) => {
							return (
								<List key={id}><Button onClick={(e) => this.onClick(e, value)}><List.Content>{value.facetdisplay} {Icon(value.is_selected)}</List.Content></Button></List>
							);
						})}
					</div>
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action hasReset onReset={(e) => this.reset()} hasApply onApply={(e) => this.onApply(e)} />
			</div>
		);
	}
}

export default Location;
