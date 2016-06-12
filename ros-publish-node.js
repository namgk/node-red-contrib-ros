module.exports = function(RED) {
  return function (config) {
    var ROSLIB = require('roslib'); 

    RED.nodes.createNode(this,config);
    var node = this;

    node.server = RED.nodes.getNode(config.server);
    
    if (!node.server){
      return;
    }

  	var ros = new ROSLIB.Ros({
     	  url : node.server.url
  	});

    ros.on('connection', function() {
      node.status({fill:"green",shape:"dot",text:"connected"});
      node.log('RosPublishNode connected to websocket server.');
    });

    ros.on('error', function(error) {
      node.status({fill:"red",shape:"dot",text:"error"});
      node.log('RosPublishNode Error connecting to websocket server: ', error);
    });

    ros.on('close', function() {
      node.status({fill:"red",shape:"dot",text:"disconnected"});
      node.log('RosPublishNode Connection to websocket server closed.');
    });

    node.on('input', (msg) => {
      var topic = new ROSLIB.Topic({
        ros : ros,
        name : config.topicname,
        messageType : config.msgtype
      });

      var pubslishMsg = new ROSLIB.Message(msg.payload);
      topic.publish(pubslishMsg);
    })
  }
}