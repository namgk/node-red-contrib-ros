module.exports = function (RED){
  return function (config) {
    var ROSLIB = require('roslib'); 

    RED.nodes.createNode(this,config);
    var node = this;

    node.server = RED.nodes.getNode(config.server);
    
    if (!node.server || !node.server.ros){
      return;
    }

    var topic = new ROSLIB.Topic({
      ros : node.server.ros,
      name : config.topicname
    });

    // if topic has not been advertised yet, keep trying again
    function topicQuery(tname){
      node.server.ros.getTopicType(config.topicname, (type) => {
        if (!type){
          setTimeout(topicQuery, 1000);
        } else {
          topic.subscribe(function(data){
            node.send({payload: data});
            node.log('got data: ' + data);
          });
        }
      })
    }

    topicQuery(config.topicname);

    node.server.on('connected', () => {
      node.status({fill:"green",shape:"dot",text:"connected"});
    });

    node.server.on('error', () => {
      node.status({fill:"red",shape:"dot",text:"error"});
    });

    node.on("close", function() {
      if (!node.server.closing){
        topic.unsubscribe();
      }
    });
  }
}

