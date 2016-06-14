module.exports = function (RED){
  return function (config) {
    var ROSLIB = require('roslib'); 

    RED.nodes.createNode(this,config);
    var node = this;

    node.server = RED.nodes.getNode(config.server);
    
    if (!node.server || !node.server.ros){
      return;
    }

    // if topic has not been advertised yet, keep trying again
    function topicQuery(topic){
      node.server.ros.getTopicType(topic.name, (type) => {
        if (!type){
          setTimeout(()=>{topicQuery(topic)}, 1000);
        } else {
          topic.subscribe(function(data){
            node.send({payload: data});
            node.log('got data: ' + data);
          });
        }
      })
    }

    node.server.on('ros connected', () => {
      node.topic = new ROSLIB.Topic({
        ros : node.server.ros,
        name : config.topicname
      });
      
      topicQuery(node.topic);
      node.status({fill:"green",shape:"dot",text:"connected"});
    });

    node.server.on('ros error', () => {
      node.status({fill:"red",shape:"dot",text:"error"});
    });

    node.on("close", function() {
      if (!node.server.closing){
        node.topic.unsubscribe();
      }
    });
  }
}

