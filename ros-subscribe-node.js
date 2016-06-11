module.exports = function (RED){
  return function (config) {
    var ROSLIB = require('roslib'); 

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
        node.status({fill:"green",shape:"dot",text:"connected"});
        node.log('connected to websocket server.');

        topic.subscribe(function(data){
          node.send({payload: data});
          node.log('got data: ' + data);
        });
      });

      ros.on('error', function(error) {
        node.status({fill:"red",shape:"dot",text:"error"});
        node.log('Error connecting : ', error);
        if (!node.closing) {
          node.tout = setTimeout(function(){ startconn(); }, 5000);
        }
      });

      ros.on('close', function() {
        node.status({fill:"red",shape:"dot",text:"disconnected"});
        node.log('Connection closed.');

        if (!node.closing) {
          node.tout = setTimeout(function(){ startconn(); }, 3000);
        }
      });
    }
    
    startconn();
    node.closing = false;
  }
}

