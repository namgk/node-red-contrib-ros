module.exports = function(RED) {
  return function (config) {
    var ROSLIB = require('roslib'); 

    RED.nodes.createNode(this,config);
    var node = this;

    node.status({fill:"yellow",shape:"dot",text:"standby"});
    node.server = RED.nodes.getNode(config.server);
    
    if (!node.server){
      return;
    }

    var ros;
    var disconnected = true;

    node.on('input', (msg) => {
      if (disconnected){
        ros = new ROSLIB.Ros({
            url : node.server.url
        });
      }

      ros.on('connection', function() {
        disconnected = false;
        node.status({fill:"green",shape:"dot",text:"connected"});
        node.log('RosPublishNode connected to websocket server.');

        var topic = new ROSLIB.Topic({
          ros : ros,
          name : config.topicname,
          messageType : config.msgtype
        });

        var pubslishMsg = new ROSLIB.Message(msg.payload);
        topic.publish(pubslishMsg);
      });

      ros.on('error', function(error) {
        disconnected = true;
        node.status({fill:"red",shape:"dot",text:"error"});
        node.log('RosPublishNode Error connecting to websocket server: ', error);
      });

      ros.on('close', function() {
        disconnected = true;
        node.status({fill:"yellow",shape:"dot",text:"standby"});
        node.log('RosPublishNode Connection closed.');
      });

    })

  	var ros = new ROSLIB.Ros({
     	  url : node.server.url
  	});

    ros.on('connection', function() {
      node.status({fill:"green",shape:"dot",text:"connected"});

      node.log('RosPublishNode connected to websocket server.');
    });

    ros.on('error', function(error) {
      node.status({fill:"red",shape:"ring",text:"error"});

      node.log('RosPublishNode Error connecting to websocket server: ', error);
    });

    ros.on('close', function() {
      node.status({fill:"red",shape:"ring",text:"disconnected"});

      node.log('RosPublishNode Connection to websocket server closed.');
    });

    var cmdVel = new ROSLIB.Topic({
      ros : ros,
      name : config.name,
      messageType : config.type
    });

    cmdVel.subscribe(function(data){
      node.send({payload: data});
      node.log('RosPublishNode got data: ' + data);
    });
  }
}