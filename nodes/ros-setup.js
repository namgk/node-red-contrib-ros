const rosnodejs = require('rosnodejs')

module.exports = function(RED) {
  RED.httpAdmin.get("/packages/:type", function(req, res) {
    var x = rosnodejs.getAvailableMessagePackages()
    var a = []
    for (var key in x) {
      if (x.hasOwnProperty(key)) {
        a.push(key.trim())
      }
    }
    a = a.sort()
    var o = {}
    for (var i = 0; i < a.length; i++) {
      try {
        var xy = rosnodejs.require(a[i])[req.params.type] // type is either msg or srv
        var ar = []
        for (var k in xy) {
          if (xy.hasOwnProperty(k)) {
            ar.push(k.trim())
          }
        }
        ar = ar.sort()
        o[a[i]] = ar
      } catch (e) {
        console.error('Error in retrieving ROS packages: ' + e);
      }
    }
    res.json(o)
  })

  RED.httpAdmin.get("/ROSTopicInfo/:package/:messageType", function(req, res) {
    try {
      var q = rosnodejs.require(req.params.package).msg[req.params.messageType]
      if (q) {
        var x = new q()
        res.json(JSON.parse(JSON.stringify(x)))
      } else {
        console.error('ROSTOPIC type not found: ' + req.params.package + "/" + req.params.messageType);
        res.json({})
      }
    } catch (e) {
      console.error('Error in ROSTopicInfo: ' + req.params.package + "/" + req.params.messageType + ". Error: " + e);
      res.json({})
    }
  })

  RED.httpAdmin.get("/ROSServiceInfo/:package/:messageType", function(req, res) {
    try {
      var q = rosnodejs.require(req.params.package).srv[req.params.messageType]
      if (q) {
        var x = new q.Request()
        res.json(JSON.parse(JSON.stringify(x)))
      } else {
        console.error('ROSSERVICE type not found: ' + req.params.package + "/" + req.params.messageType);
        res.json({})
      }
    } catch (e) {
      console.error('Error in ROSServiceInfo: ' + req.params.package + "/" + req.params.messageType + ". Error: " + e);
      res.json({})
    }
  })
}
