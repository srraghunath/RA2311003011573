const { getTopNNotifications } = require('./priorityLogic');
const data = [{"ID":"84abbfd8-aef3-4d4a-a7d1-21899d4ed659","Type":"Placement","Message":"Apple Inc. hiring","Timestamp":"2026-05-01 18:50:45"}];
console.log(getTopNNotifications(data, 5));
