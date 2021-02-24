import React, { useState, useEffect } from "react";

import * as styled from "./device_statistics.style";

const DeviceStatistics = (props) => {
  const { device } = props;

  // TODO Make this work, currently not working
  const handleDeviceStatistics = () => {
    if (device.statistics) {
      // Maps through all the stats of the device and displays them with a title
      return device.statistics.map((statistic, ind) => {
        const title = statistic.title;

        const value = statistic.value;

        return (
          <styled.SettingsSectionsContainer key={ind}>
            <styled.SettingsLabel>{title}</styled.SettingsLabel>
            <p>{value}</p>
          </styled.SettingsSectionsContainer>
        );
      });
    }
  };

  return (
    <styled.SettingsContainer>
      <styled.SettingsSectionsContainer>
        <styled.SettingsLabel schema={"devices"}>
          Device Statistics
        </styled.SettingsLabel>
      </styled.SettingsSectionsContainer>

      {handleDeviceStatistics()}
    </styled.SettingsContainer>
  );
};

export default DeviceStatistics;
