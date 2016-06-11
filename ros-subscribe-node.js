module.exports = function(RED) {
  var ROSLIB = require('roslib'); 

  function RosSubscribeNode(config) {
    RED.nodes.createNode(this,config);
    var node = this;

    node.server = RED.nodes.getNode(config.server);
    
    if (!node.server){
      return;
    }

    node.closing = false;
    node.on("close", function() {
      node.closing = true;
      if (node.tout) { clearTimeout(node.tout); }
      if (node.ros){
        node.ros.close();
      }
    });

    function startconn() {    // Connect to remote endpoint
      var ros = new ROSLIB.Ros({
        url : node.server.url
      });
      node.ros = ros; // keep for closing
      handleConnection(ros);
    }

    function handleConnection(ros) {
      var topic = new ROSLIB.Topic({
        ros : ros,
        name : config.topicname,
        messageType : config.msgtype
      });

      ros.on('connection', function() {
        this.status({fill:"green",shape:"dot",text:"connected"});
        node.log('RosSubscribeNode connected to websocket server.');

        topic.subscribe(function(data){
          node.send({payload: data});
          node.log('RosSubscribeNode got data: ' + data);
        });
      });

      ros.on('error', function(error) {
        this.status({fill:"red",shape:"dot",text:"error"});
        node.log('RosSubscribeNode Error connecting to websocket server: ', error);
        if (!node.closing) {
          node.tout = setTimeout(function(){ startconn(); }, 5000);
        }
      });

      ros.on('close', function() {
        this.status({fill:"red",shape:"dot",text:"disconnected"});
        node.log('RosSubscribeNode Connection to websocket server closed.');

        if (!node.closing) {
          node.tout = setTimeout(function(){ startconn(); }, 3000);
        }
      });
    }
  	
    startconn();
    node.closing = false;
  }
  RED.nodes.registerType("ros-subsribe",RosSubscribeNode);


  function RosServerNode(n) {
    RED.nodes.createNode(this,n);
    this.url = n.url;
  }
  RED.nodes.registerType("ros-server",RosServerNode);
}
