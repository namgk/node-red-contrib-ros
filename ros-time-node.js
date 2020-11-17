module.exports = function (RED){
  return function (config) {
    var ROSLIB = require('roslib'); 
    const Time = require('Time.js')

    RED.nodes.createNode(this,config);
    var node = this;
    node.mode = config.mode;
    node.sampletime = config.sampletime*1000;
    node.addstamp2input = config.addstamp2input;
    node.addheader2input = config.addheader2input;

    // Publish ROS time at interval
    if (node.mode==="Timed")
    {
      var timer_var = setInterval(publishTime, node.sampletime);
    }
    // Publish ROS time at arrival of msg
    else
    {
      node.on('input', (msg) => {
      var new_payload = {};
      isObject = typeof msg.payload === 'object' && msg.payload !== null;
      if(!isObject) {
        new_payload.data = msg.payload;
      }
      else {
        new_payload = msg.payload;
      }
      const now = Time.now();
      // Add stamp and header to input msg
      if (node.addstamp2input && node.addheader2input){
        new_payload = addStamp(new_payload, now);
        new_payload = addHeader(new_payload, now);
      }
      // Add/edit stamp to input msg
      else if (node.addstamp2input && !node.addheader2input){
        new_payload = addStamp(new_payload, now);
      }
      // Add/edit header to input msg
      else if (!node.addstamp2input && node.addheader2input){
        new_payload = addHeader(new_payload, now);
      }
      // Publish ROS time only
      else {
        new_payload = addStamp({}, now); 
      }
      node.send({payload: new_payload});
      });
    }
    function addHeader(payload_, now_)
    {      
      if ('header' in payload_){
        payload_.header.stamp = now_;
      }
      else{
        header = {};
        header.stamp = now_;
        header.seq = 0;
        header.frame_id = "";
        payload_.header = header;
      }
      return payload_;
    }
    function addStamp(payload_, now_)
    { 
      payload_.stamp = now_;
      return payload_;
    }
    function publishTime()
    {
      const now = Time.now();
      node.send({payload: now});
    }
  }
}