import React, { Component } from 'react';

export default class Message extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			message: null,
			isChecking: false,
			isError: false
		}
		this.getMessage = this._getMessage.bind(this);
	}

	componentDidMount() {
		if (this.props.selectedMessageId) {
			this._getMessage(this.props.selectedMessageId);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.selectedMessageId !== this.props.selectedMessageId) {
			this._getMessage(nextProps.selectedMessageId);
		}
	}

	render() {
		const {
			message,
			isError,
			isChecking
		} = this.state;

		let render;

		if (isError) {
			render = <span> Unable to load message </span>
		} else if (isChecking) {
			render = <span> Loading message... </span>
		} else if (message) {
			render = <div>
				<div className='message-subject'>{message.subject}</div>
				<div className='message-body'>{message.body}</div>
			</div>
		} else {
			render = <span> No message selected </span>
		}
		return <div className='message'>
			{render}
		</div>
	}

	_getMessage(messageId) {
		this.setState({isChecking: true})
		return fetch(`/api/messages/${messageId}`, {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		})
		.then(response => response.json())
		.then(json => {this.setState({
			message: json,
			isError: false,
			isChecking: false
		})
		})
		.catch(err => {this.setState({
			isError: true,
			isChecking: false
		})});
	}
}
