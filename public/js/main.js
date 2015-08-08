/* global App */
/* global DOM */

var user = {
	hash: "jdnjksnmNJJbh437bhj"	
};

App.Chat = (function(Api) {
	'use strict';	
	
	var VERSION = '0.0.1';
	
	var _settings = {
		chatId: "chatID",
		initialMessageCount: 40,
		loadMoreAmount: 10,
		textMessageTemplate: '<li class="message">{{message}}</li>',
		imageMessageTemplate: '<img class="" src="{{src}}">'
	}
	
	var client;
	var room;
	
	// Cache DOM:
	var $container = DOM('.chat-container');
	var $messagesContainer = $container.find('.messages');
	var $messageForm = $container.find('.message-form textarea');

	// Private:
	function _init() {
		client = new Api(user.hash);
		room = client.getRoom(_settings.id);
		
		if (client.hasPermission(room)) {
			_bindEvents();
			_displayInitialMessages();
		} else {
			console.log('You do no have permission');
		}
		
	}
	
	function _bindEvents() {
		// Socket Events
		// io.on('userEntered', indicateNewUser);
		
		room.onNewMessage(function(message) {
			console.log(message);
			_displayNewMessage(message);
		});

		// io.on('userStartedTying', addTyper);
		// io.on('userStoppedTyping', removeTyper);
		
		// DOM events
		$messageForm.on('keydown', function(e) {
			room.userIsTyping();
			// Handle enter press
			if (e.keyCode === 13) {
				e.preventDefault();
				sendMessage();
			}
		});
	}
	
	function _createTextMessage(message) {
		return DOM.renderTemplate(_settings.textMessageTemplate, { message: message });
	}
	
	function _createImageMessage(src) {
		return DOM.renderTemplate(_settings.imageMessageTemplate, { src: src });
	}
	
	function _displayInitialMessages() {
		var amount = _settings.initialMessageCount;

		room.getMessages(amount, function(messages) {
			for (var i = 0; i < messages.length; ++i) {
				var message = messages[i];
				_displayNewMessage(message);
			}			
		});
	}
	
	function _displayNewMessage(message) {
		var messageNode;
		if (message.type === Api.messageType.IMAGE) {
			messageNode = _createImageMessage(message.value);
		} else {
			messageNode = _createTextMessage(message.value);
		}
		$messagesContainer.append(messageNode);
	}
	
	function _displayOldMessages(messages) {
		// TODO
	}
	
	// Public:
	function sendMessage(message) {
		if (typeof message === 'undefined') {
			room.sendMessage($messageForm.value());
			$messageForm.value('');	
		} else {
			room.sendMessage(message);	
		}
	}
		
	
	_init();
	return {
		VERSION: VERSION,
		sendMessage: sendMessage
	}
		
})(App.Api);
