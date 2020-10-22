const schedule = require('node-schedule');
const Advertisement = require('../models/Advertisement')
const BookingPackage = require('../models/BookingPackage')
const Promotion = require('../models/Promotion')

let rule = new schedule.RecurrenceRule();
rule.hour = 00;
rule.minute = 00;
rule.second = 00;
rule.dayOfWeek = new schedule.Range(0,6);

module.exports = {
  scheduleNotification: async(date, sender, receiver, func) => {
    console.log('Now: ' + new Date().toLocaleString('en-SG'));
    console.log('Notification scheduled')
    schedule.scheduleJob(date, async(y) => {
      console.log('Sending notification at: ' + date.toLocaleString('en-SG'))
      await func(sender, receiver);
      console.log('Notification sent')
    });
  },

  scheduleEvent: async(date, func) => {
    console.log('Now: ' + new Date().toLocaleString('en-SG'));
    console.log('Event scheduled')
    schedule.scheduleJob(date, async(y) => {
      console.log('Executing event at: ' + date.toLocaleString('en-SG'))
      await func();
      console.log('Event executed')
    });
  },

  /**
   * Events to be run everyday
   */

  scheduleSetExpiredAdvertisement: async() => {
    schedule.scheduleJob(rule, async() => {
      let advertisements = Advertisement.findAll({ where: { expired: false, deleted: false } });
      for(let ad of advertisements) {
        if(ad.endDate.getTime() < new Date().getTime()) {
          await ad.update({ expired: true });
        }
      }
    });
  },

  scheduleSetExpiredBookingPackage: async() => {
    schedule.scheduleJob(rule, async() => {
      let bookingPackages = BookingPackage.findAll({ where: { expired: false } });
      for(let bp of bookingPackages) {
        if(bp.endDate.getTime() < new Date().getTime()) {
          await bp.update({ expired: true });
        }
      }
    });
  },

  scheduleSetExpiredPromotion: async() => {
    schedule.scheduleJob(rule, async() => {
      let promotions = Promotion.findAll({ where: { expired: false, deleted: false } });
      for(let p of promotions) {
        if(p.endDate.getTime() < new Date().getTime()) {
          await p.update({ expired: true });
        }
      }
    });
  },
}