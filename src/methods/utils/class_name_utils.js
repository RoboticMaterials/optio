export function getBatteryClassName(battery) {
  var batteryClassName = "fas fa-";

  if(!battery || battery <= 5) {
    batteryClassName = batteryClassName.concat('battery-empty');
  } else if(battery <= 35) {
    batteryClassName = batteryClassName.concat('battery-quarter');
  } else if(battery <= 65) {
    batteryClassName = batteryClassName.concat('battery-half');
  } else if(battery <= 90) {
    batteryClassName = batteryClassName.concat('battery-three-quarters');
  } else {
    batteryClassName = batteryClassName.concat('battery-full');
  }

  return batteryClassName;
}
