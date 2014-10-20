<<<<<<< HEAD
var config     = require('config');
var monitor    = require('./lib/monitor');

// start the monitor
m = monitor.createMonitor(config.monitor);
m.start();
=======
var fs      = require('fs');
var config  = require('config');
var Monitor = require('./lib/monitor');

// start the monitor
monitor = Monitor.createMonitor(config.monitor);

// load plugins
config.plugins.forEach(function(pluginName) {
  var plugin = require(pluginName);
  if (typeof plugin.initMonitor !== 'function') return;
  console.log('loading plugin %s on monitor', pluginName);
  plugin.initMonitor({
    monitor: monitor,
    config:  config
  });
});

monitor.start();

module.exports = monitor;
>>>>>>> d9cc96cc835b65577e9bc8c94625eb2706a1b923
