import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { locationsSortedAlphabetically } from "../../../methods/utils/locations_utils";

import * as styled from "../list_view.style";

const LocationList = (props) => {
  const { onMouseEnter, onMouseLeave, onLocationClick } = props;

  LocationList.propTypes = {
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onLocationClick: PropTypes.func,
    onClick: PropTypes.func,
    name: PropTypes.string,
  };

  LocationList.defaultProps = {
    onMouseEnter: () => {},
    onLocationClick: () => {},
    onMouseLeave: () => {},
    onClick: () => {},
    name: "",
  };

  const locations = useSelector((state) => state.stationsReducer.stations);
  const devices = useSelector((state) => state.devicesReducer.devices);

  const locationsArr = locationsSortedAlphabetically(Object.values(locations));
  const devicesArr = Object.values(devices);

  const dashboardsArr = [...locationsArr, ...devicesArr];

  return (
    <styled.ListScrollContainer>
      {dashboardsArr.length > 0 ? (
        dashboardsArr.map((item, index, arr) => {
          const { name, device_name } = item;

          return (
            <styled.ListItem
              key={`li-${index}`}
              // onMouseEnter={() => onMouseEnter(item)}
              // onMouseLeave={() => onMouseLeave(item)}
            >
              <styled.ListItemRect>
                <styled.ListItemTitle
                  schema={"locations"}
                  onClick={() => onLocationClick(item)}
                >
                  {name ? name : device_name}
                </styled.ListItemTitle>
              </styled.ListItemRect>
            </styled.ListItem>
          );
        })
      ) : (
        <div></div>
      )}
    </styled.ListScrollContainer>
  );
};

export default LocationList;
