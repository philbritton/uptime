/**
 * Module dependencies.
 */
var http = require('http');
var url  = require('url');
<<<<<<< HEAD
=======
var EventEmitter = require('events').EventEmitter;
var PollerCollection = require('./pollers/pollerCollection');
>>>>>>> d9cc96cc835b65577e9bc8c94625eb2706a1b923

/**
 * Monitor constructor
 *
<<<<<<< HEAD
 * The monitor pings the checks regularily and saves the response status and time.
=======
 * The monitor pings the checks regularly and saves the response status and time.
>>>>>>> d9cc96cc835b65577e9bc8c94625eb2706a1b923
 * The monitor doesn't interact with the model classes directly, but instead uses
 * the REST HTTP API. This way, the monitor can run on a separate process, so that the
 * ping measurements don't get distorted by a heavy usage of the GUI.
 *
 * The constructor expects a configuration object as parameter, with these properties:
 *   pollingInterval: Interval between each poll in milliseconds, defaults to 10 seconds
 *   timeout: Request timeout in milliseconds, defaults to 5 seconds
 *
 * @param {Object} Monitor configuration
 * @api   public
 */
function Monitor(config) {
  config.pollingInterval = config.pollingInterval || 10 * 1000;
  config.timeout = config.timeout || 5 * 1000;
  this.config = config;
<<<<<<< HEAD
}

/**
=======
  this.pollerCollection = new PollerCollection();
  this.apiHttpOptions = {};
}

/**
 * Inherit from EventEmitter.
 */
Monitor.prototype.__proto__ = EventEmitter.prototype;

/**
>>>>>>> d9cc96cc835b65577e9bc8c94625eb2706a1b923
 * Start the monitoring of all checks.
 *
 * The polling actually starts after the pollingInterval set to the constructor.
 *
 * @api   public
 */
Monitor.prototype.start = function() {
  // start polling right away
  this.pollChecksNeedingPoll();
  // schedule future polls
  this.intervalForPoll   = setInterval(this.pollChecksNeedingPoll.bind(this), this.config.pollingInterval);
  console.log('Monitor ' + this.config.name + ' started');
};

/**
 * Stop the monitoring of all checks
 *
 * @api   public
 */
Monitor.prototype.stop = function() {
  clearInterval(this.intervalForPoll);
<<<<<<< HEAD
=======
  console.log('Monitor ' + this.config.name + ' stopped');
>>>>>>> d9cc96cc835b65577e9bc8c94625eb2706a1b923
};

/**
 * Find checks that need to be polled.
 *
 * A check needs to be polled if it was last polled sine a longer time than its own interval.
 *
 * @param {Function} Callback function to be called with each Check
 * @api   private
 */
Monitor.prototype.pollChecksNeedingPoll = function(callback) {
  var self = this;
  this.findChecksNeedingPoll(function(err, checks) {
    if (err) {
<<<<<<< HEAD
      console.log(err);
=======
      console.error(err);
>>>>>>> d9cc96cc835b65577e9bc8c94625eb2706a1b923
      if (callback) callback(err);
      return;
    }
    checks.forEach(function(check) {
      self.pollCheck(check, function(err) {
<<<<<<< HEAD
        if (err) console.log(err);
      });
    });
  }); 
};

Monitor.prototype.findChecksNeedingPoll = function(callback) {
  var api = url.parse(this.config.apiUrl + '/checks/needingPoll');
  var self = this;
  http.get(api, function(res) {
=======
        if (err) console.error(err);
      });
    });
  });
};

Monitor.prototype.findChecksNeedingPoll = function(callback) {
  var options = url.parse(this.config.apiUrl + '/checks/needingPoll');
  this.applyApiHttpOptions(options);
  var self = this;
  http.get(options, function(res) {
>>>>>>> d9cc96cc835b65577e9bc8c94625eb2706a1b923
    if (res.statusCode != 200) {
      return callback(new Error(self.config.apiUrl + '/checks/needingPoll resource responded with error code: ' + res.statusCode));
    }
    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      callback(null, JSON.parse(body));
    });
  }).on('error', function(e) {
    callback(new Error(self.config.apiUrl + '/checks/needingPoll resource not available: ' + e.message));
  });
};

/**
 * Poll a given check, and create a ping according to the result.
 *
 * @param {Object} check is a simple JSON object returned by the API, NOT a Check object
 * @api   private
 */
Monitor.prototype.pollCheck = function(check, callback) {
  if (!check) return;
<<<<<<< HEAD
  var self = this;
  // change lastTested date right away to avoid polling twice if the target doesn't answer in timely fashion
  this.declarePoll(check, function(err) { });
  var Poller = require('./pollers/' + (check.type || 'http'));
  var p = new Poller(check.url, this.config.timeout, function(err, time) {
    self.createPing(check, err, Date.now(), time, callback);
  });
  if ('setUserAgent' in p) {
    p.setUserAgent(this.config.userAgent);
=======
  var Poller, p;
  var now = Date.now();
  var self = this;
  // change lastTested date right away to avoid polling twice if the target doesn't answer in timely fashion
  this.declarePoll(check, function(err) { });
  var details = {};
  try {
    Poller = this.pollerCollection.getForType(check.type || 'http');
  } catch (unknownPollerError) {
    return self.createPing(unknownPollerError, check, now, 0, details, callback);
  }
  var pollerCallback = function(err, time, res, pollerDetails) {
    if (err) {
      return self.createPing(err, check, now, time, pollerDetails || details, callback);
    }
    try {
      self.emit('pollerPolled', check, res, pollerDetails || details);
      self.createPing(null, check, now, time, pollerDetails || details, callback);
    } catch (error) {
      return self.createPing(error, check, now, time, pollerDetails || details, callback);
    }
  };
  try {
    p = new Poller(check.url, this.config.timeout, pollerCallback);
    if ('setUserAgent' in p) {
      p.setUserAgent(this.config.userAgent);
    }
    self.emit('pollerCreated', p, check, details);
  } catch (incorrectPollerUrl) {
    return self.createPing(incorrectPollerUrl, check, now, 0, details, callback);
>>>>>>> d9cc96cc835b65577e9bc8c94625eb2706a1b923
  }
  //p.setDebug(true);
  p.poll();
};

Monitor.prototype.declarePoll = function(check, callback) {
  var options = url.parse(this.config.apiUrl + '/check/' + check._id + '/test');
  options.method = 'PUT';
<<<<<<< HEAD
=======
  this.applyApiHttpOptions(options);
>>>>>>> d9cc96cc835b65577e9bc8c94625eb2706a1b923
  var self = this;
  var req = http.request(options, function(res) {
    if (res.statusCode != 200) {
      return callback(new Error(self.config.apiUrl + '/check/:id/test resource responded with error code: ' + res.statusCode));
    }
    res.on('data', function(chunk) {
      // do nothing
    });
    res.on('end', function() {
      if (callback) callback();
    });
  }).on('error', function(e) {
    callback(new Error(self.config.apiUrl + '/check/:id/test resource not available: ' + e.message));
  });
  req.end();
};

<<<<<<< HEAD
Monitor.prototype.createPing = function(check, error, timestamp, time, callback) {
  var status = error ? 'false' : 'true';
  var postData = 'checkId=' + check._id + '&status=' + status + '&timestamp=' + timestamp + '&time=' + time + '&name=' + this.config.name + '&error=' + (error ? error.message : '');
=======
Monitor.prototype.createPing = function(error, check, timestamp, time, details, callback) {
  var postData = 'checkId=' + check._id +
                '&status=' + (error ? 'false' : 'true') +
                '&timestamp=' + timestamp +
                '&time='+ time +
                '&name=' + this.config.name;
  if (error) {
    postData += '&error=' + error.message;
  }
  if (details) {
    postData += '&details=' + encodeURIComponent(JSON.stringify(details));
  }
>>>>>>> d9cc96cc835b65577e9bc8c94625eb2706a1b923
  var options = url.parse(this.config.apiUrl + '/pings');
  options.method = 'POST';
  options.headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
<<<<<<< HEAD
    'Content-Length': postData.length
  };
=======
    'Content-Length': Buffer.byteLength(postData)
  };
  this.applyApiHttpOptions(options);
>>>>>>> d9cc96cc835b65577e9bc8c94625eb2706a1b923
  var self = this;
  var req = http.request(options, function(res) {
    if (res.statusCode != 200) {
      return callback(new Error(self.config.apiUrl + '/pings resource responded with error code: ' + res.statusCode));
    }
    var body = '';
    res.on('data', function(chunk) {
    body += chunk;
    });
    res.on('end', function() {
      if (callback) callback(null, body);
    });
  }).on('error', function(e) {
    callback(new Error(self.config.apiUrl + '/pings resource not available: ' + e.message));
  });
  req.write(postData);
  req.end();
};

/**
<<<<<<< HEAD
=======
 * Add custom HTTP options to all the API calls
 * Useful to add proxy headers, Basic HTTP auth, etc.
 */
Monitor.prototype.addApiHttpOption = function(key, value) {
  this.apiHttpOptions[key] = value;
};

/**
 * Called before every API HTTP call
 */
Monitor.prototype.applyApiHttpOptions = function(options) {
  for (var key in this.apiHttpOptions) {
    options[key] = this.apiHttpOptions[key];
  }
};

/**
>>>>>>> d9cc96cc835b65577e9bc8c94625eb2706a1b923
 * Create a monitor to poll all checks at a given interval.
 * 
 * Example:
 *
 *    m = monitor.createMonitor({ pollingInterval: 60000});
 *    m.start();
 *    // the polling starts, every 60 seconds
 *    m.stop();
 *
 * @param {Object} Configuration object
 * @api   public
 */
exports.createMonitor = function(config) {
  return new Monitor(config);
};
