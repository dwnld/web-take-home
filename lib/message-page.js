import React, { Component } from 'react';
import MessageList from './message-list';
import Message from './message';

export default class MessagePage extends Component {
	constructor(props) {
		super(props);
		this.state = { selectedMessageId: null }
		this.selectMessage = this._selectMessage.bind(this);
	}

	componentWillMount() {
		this.setState({ isMobile: window.innerWidth < 420 })
	}

	render() {
		let render;
		if (this.state.isMobile) {
			if (this.state.selectedMessageId) {
				render = <div className='mobile-body'>
					<div 
						onMouseDown={(e) => this._selectMessage(e, null)}
						className='back-btn'> 
						&larr; Back to List 
					</div>
					<Message
						selectedMessageId={this.state.selectedMessageId}
					/>
				</div>
			} else {
				render = <div className='mobile-body'>
					<MessageList 
						selectedMessageId={this.state.selectedMessageId}
						selectMessage={this.selectMessage}
					/>
				</div>
			}
		} else {
			render = <div className='body'>
				<MessageList 
					selectedMessageId={this.state.selectedMessageId}
					selectMessage={this.selectMessage}
				/>
				<Message
					selectedMessageId={this.state.selectedMessageId}
				/>
			</div>
		}
		return <div className='message-page'>
			<div className='title'>DWNLD Messenger</div>
			{render}
		</div>
	}

	_selectMessage(e, messageId) {
		e.preventDefault();
		this.setState({selectedMessageId: messageId});
	}
}
