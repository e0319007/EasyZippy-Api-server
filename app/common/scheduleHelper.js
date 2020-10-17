const schedule = require('node-schedule');


module.exports = {
  scheduleEvent: async(date, func) => {
    console.log('Now: ' + new Date().toLocaleString('en-SG'));
    console.log('Event scheduled')
    schedule.scheduleJob(date, function(y){
      console.log('Executing event at: ' + date.toLocaleString('en-SG'))
      await func();
      console.log('Event executed')
    });
  }

}