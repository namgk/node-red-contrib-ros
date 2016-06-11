var ROSLIB = require('roslib');

module.exports = function(RED) {
  function RosSubscribeNode(config) {
    RED.nodes.createNode(this,config);
    this.server = RED.nodes.getNode(config.server);

    var node = this;

  	var ros = new ROSLIB.Ros({
     	  url : this.server.url
  	});

    ros.on('connection', function() {
      this.status({fill:"green",shape:"dot",text:"connected"});

      node.log('RosSubscribeNode connected to websocket server.');
    });

    ros.on('error', function(error) {
      this.status({fill:"red",shape:"ring",text:"error"});

      node.log('RosSubscribeNode Error connecting to websocket server: ', error);
    });

    ros.on('close', function() {
      this.status({fill:"red",shape:"ring",text:"disconnected"});

      node.log('RosSubscribeNode Connection to websocket server closed.');
    });

    var cmdVel = new ROSLIB.Topic({
      ros : ros,
      name : config.name,
      messageType : config.type
    });

    cmdVel.subscribe(function(data){
      msg.payload = data;
      node.send(msg);
      node.log('RosSubscribeNode got data: ' + data);
    });
   //     msg.payload = msg.payload.toLowerCase();
     //   node.send(msg);
  }
  RED.nodes.registerType("ros-subsribe",RosSubscribeNode);


  function RosServerNode(n) {
    RED.nodes.createNode(this,n);
    this.url = n.url;
  }
  RED.nodes.registerType("ros-server",RosServerNode);
}
