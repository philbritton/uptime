var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// main model
var TagMonthlyStat = new Schema({
  name           : String,
  timestamp      : Date,
<<<<<<< HEAD
  end            : Date, // end is stored becaus months have an uneven duration
=======
  end            : Date, // end is stored because months have an uneven duration
>>>>>>> d9cc96cc835b65577e9bc8c94625eb2706a1b923
  count          : Number,
  availability   : Number,
  responsiveness : Number,
  responseTime   : Number,
  downtime       : Number,
  outages        : Array,
});
TagMonthlyStat.index({ name: 1, timestamp: -1 }, { unique: true });
TagMonthlyStat.plugin(require('mongoose-lifecycle'));

module.exports = mongoose.model('TagMonthlyStat', TagMonthlyStat);