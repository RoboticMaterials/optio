import React from "react";

import { DeviceTypes } from "../../../../constants/position_constants";

const Device = () => {
  // Handles what type of svg to return based on the device model
  const onDeviceSVG = () => {
    // This will gray out devices that arent selected. The device becomes selected either on hover in device side bar list or editing device
    let selected = true;
    if (
      !!selectedStation &&
      !!selectedStation.device_id &&
      station.device_id !== selectedStation.device_id
    )
      selected = false;
    if (!!selectedStation && !selectedStation.device_id) selected = false;

    let device = {};
    try {
      device = devices[station.device_id];
    } catch (error) {
      console.log("Device is undefined and I dont know why...");
      return <></>;
    }

    // Sets the device type, if the device does not exits in the list of device item types, then it uses the generic device
    let deviceType = DeviceItemTypes["generic"];
    try {
      if (
        !!device &&
        !!device.device_model &&
        !!DeviceItemTypes[device.device_model]
      )
        deviceType = DeviceItemTypes[device.device_model];
      else if (device.device_model === "MiR100")
        deviceType = DeviceItemTypes["cart"];
    } catch (error) {
      throw "Get Kalervo and show him the console logs";
    }

    try {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" id={`${rd3tClassName}-device`}>
          <defs>
            <linearGradient
              id={device._id}
              x1="72.95"
              y1="153"
              x2="287.05"
              y2="153"
              gradientUnits="userSpaceOnUse"
            >
              <stop
                offset="0"
                style={{ stopColor: deviceType.startGradientColor }}
              />
              <stop
                offset="1"
                style={{ stopColor: deviceType.stopGradientColor }}
              />
            </linearGradient>
          </defs>
          <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_1-2" data-name="Layer 1">
              <rect fill="#4d4d4d" width="360" height="240" rx="30" />
              <path
                style={{ fill: !selected ? "gray" : `url(#${device._id})` }}
                d={deviceType.svgPath}
              />
            </g>
          </g>
        </svg>
      );
    } catch (error) {
      console.log("Catching error, please fix", error);
    }
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" id={`${rd3tClassName}-device`}>
      <defs>
        <linearGradient
          id={device._id}
          x1="72.95"
          y1="153"
          x2="287.05"
          y2="153"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0"
            style={{ stopColor: deviceType.startGradientColor }}
          />
          <stop
            offset="1"
            style={{ stopColor: deviceType.stopGradientColor }}
          />
        </linearGradient>
      </defs>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <rect fill="#4d4d4d" width="360" height="240" rx="30" />
          <path
            style={{ fill: !selected ? "gray" : `url(#${device._id})` }}
            d={DeviceTypes["Mir100"].svgPath}
          />
        </g>
      </g>
    </svg>
  );
};
