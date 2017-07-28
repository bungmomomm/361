import React, { Component } from 'react';
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

	handleToggle() {
		this.setState({
			accordion: true
		});
	}
	
	render() {
		const boxClass = cx({
			box: true,
			row: !!this.props.row,
			accordion: !!this.props.accordion
		});
		return (
			<div role='button' tabIndex='-1' className={boxClass} onClick={() => this.handleToggle()}>
				{
					this.props.accordion ? this.props.children[0] : this.props.children
				}
				{
					this.props.accordion ? <Accordion>{this.props.children[1].props.children}</Accordion> : null
				}
			</div>
		);
	}
};

Box.Accordion = Accordion;