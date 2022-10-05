module.exports = function(RED) {
    var ROSLIB = require('roslib');
  
    function RosServiceCallNode(config) {
      RED.nodes.createNode(this,config);
      var node = this;
  
      node.server = RED.nodes.getNode(config.server);
      
      if (!node.server || !node.server.ros){
        return;
      }
  
      // Calling a service
      // -----------------
  
      var msgtype = config.typepackage + "/" + config.typename
      var serviceClient = new ROSLIB.Service({
        ros : node.server.ros,
        name : config.servicename,
        serviceType : msgtype
      });
  
      node.on('input', (msg) => {
        serviceClient.callService(msg.payload, function(result) {
          console.log('Result for service call on '
            + serviceClient.name
            + ': '
            + result.success
            + ', '
            + result.message);
          var o = JSON.parse(JSON.stringify(result))
          node.send({payload: o});
        });
      });
  
      node.server.on('ros connected', () => {
        node.status({fill:"green",shape:"dot",text:"connected"});
      });
  
      node.server.on('ros error', () => {
        node.status({fill:"red",shape:"dot",text:"error"});
      });
  
    }
  
    RED.nodes.registerType("ros-service-call",RosServiceCallNode);
  };