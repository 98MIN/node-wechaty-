const schedule = require('node-schedule')


function setSchedule(data,callback){
  schedule.scheduleJob(data,callback)
}

module.exports={
  setSchedule
}
