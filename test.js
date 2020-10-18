const scheduleHelper = require('./app/common/scheduleHelper');
const notificationHelper = require('./app/common/notificationHelper');

const test = async () => {
  var date = new Date(new Date().getTime() + 0.1 * 60000) 
  scheduleHelper.scheduleEvent(date, testPrintMessage)
};

const testPrintMessage = () => {
  console.log('print in test')
};

exports.testPrintMessage;

test();