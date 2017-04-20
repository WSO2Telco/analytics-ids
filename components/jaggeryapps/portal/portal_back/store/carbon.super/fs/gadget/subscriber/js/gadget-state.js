//listen to the subscriber channel
gadgets.HubSettings.onConnect = function() {
                    gadgets.Hub.subscribe('subscriber', function(topic, data, subscriberData) {
                        if(data.type === 'clear') {
                            $('.log').empty();
                            return;
                        }
                        wso2.gadgets.controls.showGadget();
                        $('.log').append('<div>Message received, <span class="message">Message: ' + JSON.stringify(data) + '</span></div>');
			 var newState = { 
					state: data
				};
			console.log(newState);
			//setting gadget specific state to the url hash
			wso2.gadgets.state.setGadgetState(newState);
                    });
};


//get the gadget specific state from the url hash
wso2.gadgets.state.getGadgetState(function(gadgetState) {
	wso2.gadgets.controls.showGadget();
        $('.log').append('<div>Message received, <span class="message">Message: ' + JSON.stringify(gadgetState.state) + '</span></div>');
});
