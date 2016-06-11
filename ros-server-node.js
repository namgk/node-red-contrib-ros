module.exports = function (RED){
  return function (config) {
    RED.nodes.createNode(this,config);
    this.url = config.url;
  }
}  
