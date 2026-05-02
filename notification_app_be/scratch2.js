const { getTopNNotifications } = require('./priorityLogic');
const data = [
  {"ID":"84abbfd8-aef3-4d4a-a7d1-21899d4ed659","Type":"Placement","Message":"Apple Inc. hiring","Timestamp":"2026-05-01 18:50:45"},
  {"ID":"50fc8b95-d85a-4b36-a2c9-eeadccdcabee","Type":"Placement","Message":"Amgen Inc. hiring","Timestamp":"2026-05-02 00:50:39"}
];
try {
  console.log(getTopNNotifications(data, 5));
} catch(e) {
  console.log("ERROR", e);
}
