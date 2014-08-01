var Self = (function(Bacon) {
  var Self = function(client, settings) {
    var s_self = new Bacon.Bus();
    var p_self = s_self.toProperty();

    var getSelf = client.self.get;
    client.self.get = function() {
      var req = getSelf();
      var send = req.send;

      req.send = function(body) {
        var res = send(body);

        s_self.plug(res);

        return res;
      };

      return req;
    };

    var putSelf = client.self.put;
    client.self.put = function() {
      var req = putSelf();
      var send = req.send;

      req.send = function(body) {
        var res = send(body);

        s_self.plug(res);

        return res;
      };

      return req;
    };

    client.self.asProperty = function() {
      return p_self.map(function(user) {
        return user;
      });
    };
  };

  return Self;
})(
  typeof require == "function" && require("baconjs") ? require("baconjs") : Bacon
);
