# node-red-contrib-ros
Node-RED nodes for connecting to ROS bridge and subscribe/publish to ROS topics.

These nodes uses roslibjs, the standard ROS Javascrip library. https://github.com/RobotWebTools/roslibjs

## install

`npm install node-red-contrib-ros`

or

`node-red-admin install node-red-contrib-ros`

## configuration

ROS server is the ROS bridge's websocket address. E.g ws://localhost:9000/

## usage

### ros-publish
Messages sent to publish node need to conform the message type. The publish node retrieves the compiled ROS messages in your workspace. Also custom ROS message will be retrieved. You can also add a ROS timestamp in the message. Note that this is only possible if the ROS message contains a header. 

### ros-subscribe
Messages are received using the ros-subscribe node. The payload is the content of the ROS message.

### ros-time
This node outputs a ROS time stamp. You can select two modes: 1) Timed and 2) Input. The first mode outputs the time stamp at a specific rate. The second mode outputs the time stamp when receiving an input message. In the latter mode, you can choose to add the stamp to the input message and/or to add a header with stamp to the input message. 

## sample flow
This sample flow is outdated

`[{"id":"f31cee7d.0ce31","type":"ros-server","z":"a1c6eb3b.5e3918","url":"ws://localhost:9090/"},{"id":"b44e0788.4bb1f8","type":"inject","z":"a1c6eb3b.5e3918","name":"","topic":"","payload":"2222","payloadType":"str","repeat":"","crontab":"","once":false,"x":111.5,"y":232,"wires":[["c2a8605a.3d57a"]]},{"id":"bbb8147a.4447e8","type":"ros-subscribe","z":"a1c6eb3b.5e3918","server":"f31cee7d.0ce31","topicname":"/st","x":112.5,"y":129,"wires":[["b8bcdc13.47432"]]},{"id":"b8bcdc13.47432","type":"debug","z":"a1c6eb3b.5e3918","name":"","active":true,"console":"false","complete":"true","x":333.5,"y":163,"wires":[]},{"id":"c2a8605a.3d57a","type":"ros-publish","z":"a1c6eb3b.5e3918","server":"f31cee7d.0ce31","topicname":"/st","msgtype":"std_msgs/String","x":288.5,"y":264,"wires":[]}]`
