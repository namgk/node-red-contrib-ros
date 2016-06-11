module.exports = function(RED) {
	var RosSubscribeNode = require('./ros-subscribe-node')(RED);
	var RosPublishNode = require('./ros-publish-node')(RED);
	var RosServerNode = require('./ros-server-node')(RED);

	RED.nodes.registerType("ros-subscribe",RosSubscribeNode);
	RED.nodes.registerType("ros-publish",RosPublishNode);
	RED.nodes.registerType("ros-server",RosServerNode);
}