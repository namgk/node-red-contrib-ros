# node-red-contrib-ros
Node-RED nodes for connecting to ROS bridge and subscribe/publish to ROS topics.

These nodes uses roslibjs, the standard ROS Javascrip library. https://github.com/RobotWebTools/roslibjs

Currently there are only three message type supported: std_msgs/String, std_msgs/Int16 and std_msgs/Int32.

## install

`npm install node-red-contrib-ros`

or

`node-red-admin install node-red-contrib-ros`

## configuration

ROS server is the ROS bridge's websocket address. E.g ws://localhost:9000/

## usage

Messages sent to publish node need to conform the message type. 
For example, if message type is std_msgs/String, input msg to ros-publish should have a string payload.
If the type is std_msgs/Int16, it should have a number payload and the number should less than max value of an Int16 (32767?).

## sample flow

`[{"id":"f31cee7d.0ce31","type":"ros-server","z":"a1c6eb3b.5e3918","url":"ws://localhost:9090/"},{"id":"b44e0788.4bb1f8","type":"inject","z":"a1c6eb3b.5e3918","name":"","topic":"","payload":"2222","payloadType":"str","repeat":"","crontab":"","once":false,"x":111.5,"y":232,"wires":[["c2a8605a.3d57a"]]},{"id":"bbb8147a.4447e8","type":"ros-subscribe","z":"a1c6eb3b.5e3918","server":"f31cee7d.0ce31","topicname":"/st","x":112.5,"y":129,"wires":[["b8bcdc13.47432"]]},{"id":"b8bcdc13.47432","type":"debug","z":"a1c6eb3b.5e3918","name":"","active":true,"console":"false","complete":"true","x":333.5,"y":163,"wires":[]},{"id":"c2a8605a.3d57a","type":"ros-publish","z":"a1c6eb3b.5e3918","server":"f31cee7d.0ce31","topicname":"/st","msgtype":"std_msgs/String","x":288.5,"y":264,"wires":[]}]`
