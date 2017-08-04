import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectProps } from '@/decorators';
import classNames from 'classnames/bind';
import styles from './Box.scss';
import Accordion from './BoxAccordion';

const cx = classNames.bind(styles);

export default class Box extends Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			accordion: false
		};
	}
	
	@injectProps
	render({
		row,
		accordion,
		children
	}) {
		const boxClass = cx({
			box: true,
			row: !!row,
			accordion: !!accordion
		});
		return (
			<div role='button' className={boxClass}>
				{
					accordion ? (
						<div>
							{ children[0] }
							<Accordion shown={this.state.accordion} >
								{children[1].props.children}
							</Accordion>
						</div>)
					: 
					children
				}
			</div>
		);
	}
};

Box.Accordion = Accordion;

Box.propTypes = {
	accordion: PropTypes.bool,
	row: PropTypes.bool,
	children: PropTypes.node
};