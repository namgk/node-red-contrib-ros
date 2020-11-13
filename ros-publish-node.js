module.exports = function(RED) {
  return function (config) {
    var ROSLIB = require('roslib'); 

    RED.nodes.createNode(this,config);
    var node = this;

    node.server = RED.nodes.getNode(config.server);
    
    if (!node.server || !node.server.ros){
      return;
    }

    var msgtype = config.typepackage + "/" + config.typename
    var topic = new ROSLIB.Topic({
      name : config.topicname,
      messageType : msgtype
    });

    node.on('input', (msg) => {
      topic.ros = node.server.ros;
      // node.log('publishing msg ' + msg.payload);
      // var pubslishMsg = new ROSLIB.Message({data: msg.payload});
      topic.publish(msg.payload);
    });

    node.server.on('ros connected', () => {
      node.status({fill:"green",shape:"dot",text:"connected"});
    });

    node.server.on('ros error', () => {
      node.status({fill:"red",shape:"dot",text:"error"});
    });

  }
}