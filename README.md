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

### ros-service-call
Requests sent to ros-service-call node need to conform the srv Request type. The service-call node retrieves the compiled ROS services in your workspace. Also custom ROS services will be retrieved. The service response will be sent as a payload.

### ros-subscribe
Messages are received using the ros-subscribe node. The payload is the content of the ROS message.

### ros-time
This node outputs a ROS time stamp. You can select two modes: 1) Timed and 2) Input. The first mode outputs the time stamp at a specific rate. The second mode outputs the time stamp when receiving an input message. In the latter mode, you can choose to add the stamp to the input message and/or to add a header with stamp to the input message. 

## sample flow
This sample flow is outdated

`[{"id":"b4238dd8.4de73","type":"tab","label":"Test ROS","disabled":false,"info":""},{"id":"bea48291.f1bba","type":"ros-subscribe","z":"b4238dd8.4de73","server":"ee3330f0.5c8af","topicname":"/st","x":170,"y":145,"wires":[["438e6d48.a9cc4c"]]},{"id":"438e6d48.a9cc4c","type":"debug","z":"b4238dd8.4de73","name":"","active":true,"console":"false","complete":"true","x":330,"y":145,"wires":[]},{"id":"11d3437d.505b0d","type":"ros-time","z":"b4238dd8.4de73","mode":"Timed","sampletime":"1","addstamp2input":false,"addheader2input":false,"x":175,"y":75,"wires":[["ab7795ef.fc3b88"]]},{"id":"ab7795ef.fc3b88","type":"debug","z":"b4238dd8.4de73","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","x":330,"y":75,"wires":[]},{"id":"b4340ad8.57b428","type":"inject","z":"b4238dd8.4de73","name":"","topic":"","payload":"{\"header\":{\"seq\":0,\"stamp\":{\"secs\":0,\"nsecs\":0},\"frame_id\":\"\"},\"status\":{\"status\":0,\"service\":0},\"latitude\":0,\"longitude\":0,\"altitude\":0,\"position_covariance\":[0,0,0,0,0,0,0,0,0],\"position_covariance_type\":0}","payloadType":"json","repeat":"","crontab":"","once":true,"onceDelay":"1","x":105,"y":280,"wires":[["34001ee9.1da0ba","c3be5e3.251c62"]]},{"id":"34001ee9.1da0ba","type":"function","z":"b4238dd8.4de73","name":"set lon lat","func":"msg.payload.latitude = 49.083205;\nmsg.payload.longitude = -35.762847;\nreturn msg;","outputs":1,"noerr":0,"x":300,"y":280,"wires":[["3bf5134f.4a5e1c","3d6dceba.8efd22"]]},{"id":"c3be5e3.251c62","type":"ros-time","z":"b4238dd8.4de73","mode":"On input","sampletime":"20","addstamp2input":false,"addheader2input":true,"x":310,"y":220,"wires":[["e00fcb25.98a55"]]},{"id":"3bf5134f.4a5e1c","type":"ros-publish","z":"b4238dd8.4de73","server":"72fc6571.2d53c4","topicname":"/gps/fix","typepackage":"sensor_msgs","typename":"NavSatFix","stampheader":true,"x":520,"y":280,"wires":[]},{"id":"3d6dceba.8efd22","type":"debug","z":"b4238dd8.4de73","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","x":510,"y":225,"wires":[]},{"id":"e00fcb25.98a55","type":"debug","z":"b4238dd8.4de73","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","x":510,"y":185,"wires":[]},{"id":"ee3330f0.5c8af","type":"ros-server","z":"b4238dd8.4de73","url":"ws://localhost:9090/"},{"id":"72fc6571.2d53c4","type":"ros-server","z":"","url":"ws://0.0.0.0:9090"}]`
