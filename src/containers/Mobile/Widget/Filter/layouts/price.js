import React, { PureComponent } from 'react';
import { Button, Header, Page, Svg, Slider, Input } from '@/components/mobile';
// import { Link } from 'react-router-dom';
import styles from './price.scss';
import Action from './action';
import _ from 'lodash';
import currency from 'currency.js';

class Price extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			range: {
				min: parseInt(props.range.min, 10),
				max: parseInt(props.range.max, 10)
			},
			custom: false,
			data: props.data || []
		};
	}

	onClick(e, value) {
		let { data } = this.state;
		data = _.map(data, (facetData) => {
			if (facetData.facetrange === value.facetrange) {
				facetData.is_selected = facetData.is_selected === 1 ? 0 : 1;
			}
			return facetData;
		});

		this.setState({
			custom: false,
			data
		});
	}

	onApply(e) {
		const { data, range, custom } = this.state;
		const { onApply } = this.props;
		const result = _.filter(data, (facetData) => {
			return (facetData.is_selected === 1);
		});
		if (custom) {
			return onApply(e, result, range);
		}
		return onApply(e, result, false);
	}

	updateRange(value, changes) {
		const currentRange = this.state.range;
		const { range } = this.props;
		if (changes === 'min') {
			if (value.min > currentRange.max) {
				return;
			}
		} else if (changes === 'max') {
			if (value.max < currentRange.min) {
				return;
			}
		}
		const updatedValue = {
			...currentRange,
			...value
		};
		this.setState({
			custom: true,
			range: {
				min: Math.abs(updatedValue.min) < parseInt(range.max, 10) ? Math.abs(updatedValue.min) : parseInt(range.min, 10),
				max: Math.abs(updatedValue.max) < parseInt(range.max, 10) ? Math.abs(updatedValue.max) : parseInt(range.max, 10),
			}
		});
	}

	render() {
		const { onClose, range } = this.props;
		const HeaderPage = {
			left: (
				<Button onClick={onClose}>
					<Svg src='ico_arrow-back-left.svg' />
				</Button>
			),
			center: 'Harga',
			right: null
		};

		return (
			<div style={this.props.style}>
				<Page hideFooter>
					<div className={styles.priceSlider}>
						<div className={styles.sliderLabel}>
							<span>{currency(this.state.range.min, { symbol: 'Rp', precision: 0, formatWithSymbol: true }).format()}</span>
							<span>{currency(this.state.range.max, { symbol: 'Rp', precision: 0, formatWithSymbol: true }).format()}</span>
						</div>
						<Slider min={parseInt(range.min, 10)} max={parseInt(range.max, 10)} value={this.state.range} onChange={(value) => this.updateRange(value)} />
						<div className={styles.sliderInfo}>
							<span>min</span>
							<span>max</span>
						</div>
					</div>
					<div className={styles.priceInput}>
						<div className='flex-row flex-center flex-spaceBetween'>
							<div style={{ width: '45%' }}>
								<Input value={this.state.range.min} ref={c => { this.rangeMin = c; }} onChange={(event) => { this.updateRange({ min: parseInt(event.target.value, 10) }, 'min'); }} type='number' placeholder='Min price' />
							</div>
							<div style={{ width: '45%' }}>
								<Input value={this.state.range.max} ref={c => { this.rangeMax = c; }} onChange={(event) => { this.updateRange({ max: parseInt(event.target.value, 10) }, 'max'); }} type='number' placeholder='Max price' />
							</div>
						</div>
					</div>
					{/* <div className={styles.action}>
						<Button wide size='medium' outline color='secondary'>App Only</Button>
					</div> */}
				</Page>
				<Header.Modal {...HeaderPage} />
				<Action hasApply onApply={(e) => this.onApply(e)} />
			</div>
		);
	}
}

export default Price;
