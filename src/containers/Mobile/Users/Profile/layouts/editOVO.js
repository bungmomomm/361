import React, { Component } from 'react';
import util from 'util';

import { Page, Level, Input, Svg, Button } from '@/components/mobile';

import styles from '../profile.scss';

class EditOvo extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			data: props.data || '',
		};
	}

	inputHandler(e) {
		const value = util.format('%s', e.target.value);

		this.setState({
			data: value
		});
	}

	saveData(e) {
		const { onSave } = this.props;
		const { data } = this.state;
		onSave(e, data);
	}

	render() {
		const { onClickBack } = this.props;
		const { data } = this.state;

		return (
			<Page>
				<Level style={{ height: '55px' }}>
					<Level.Left style={{ width: '80px' }}>
						<Button onClick={onClickBack}><Svg src='ico_arrow-back-left.svg' /></Button>
					</Level.Left>
					<Level.Item style={{ alignItems: 'center' }}>
						OVO
					</Level.Item>
					<Level.Right style={{ width: '80px' }}>&nbsp;</Level.Right>
				</Level>
				<form style={{ padding: '15px' }}>
					<div className='margin--medium'>
						<label className={styles.label} htmlFor='ovoID'>OVO ID</label>
						<Input id='ovoID' flat placeholder='No. Handphone yang terdaftar di OVO' defaultValue={data} onChange={(e) => this.inputHandler(e)} />
					</div>
					<div className='margin--medium'>
						<Button color='primary' size='large' onClick={(e) => this.saveData(e)}>VERIFIKASI OVO ID</Button>
					</div>
				</form>
			</Page>
		);
	}
}

export default EditOvo;
