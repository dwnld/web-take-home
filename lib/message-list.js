import React, { Component } from 'react';

export default class MessageList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messageList: [],
			isChecking: false,
			lastChecked: null,
			isError: false
		}
		this.getMessageList = this._getMessageList.bind(this);
	}

	componentWillMount() {
		this.getMessageList();
	}

	render() {
		const { selectedMessageId, selectMessage } = this.props;
		const {
			messageList,
			isError,
			lastChecked,
			isChecking
		} = this.state;

		let loadingMessage;

		if (isError) {
			loadingMessage = 'Unable to load messages.'
		} else if (isChecking) {
			loadingMessage = 'Loading messages...'
		} else if (lastChecked) {
			loadingMessage = 'Last Checked: ' + lastChecked.toLocaleTimeString()
		}

		return <div className='message-list'>
			{
				messageList.map(m => <div
					className={
						m.id === selectedMessageId ?
							'message-list-item-active' :
							'message-list-item'
					}
					key={'message_'+m.id}
					onMouseDown={(e) => selectMessage(e, m.id)}
					>
					<div>
						{m.subject}
					</div>
				</div>
				)
			}
			<div className='message-list-loader'>
				<div 
					className='reload-btn'
					onMouseDown={(e) => this._getMessageList()}
					>
					Reload Messages
				</div>
				{loadingMessage}
			</div>
		</div>
	}

	_getMessageList() {
		this.setState({isChecking: true})
		return fetch(`/api/messages`, {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		})
		.then(response => response.json())
		.then(json => {this.setState({
			messageList: json,
			isError: false,
			isChecking: false,
			lastChecked: new Date()
		})
		})
		.catch(err => {this.setState({
			isError: true,
			isChecking: false
		})});
	}
}
