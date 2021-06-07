import React from 'react';
import PropTypes from 'prop-types';

import {SkuContext} from '../../sku_editor'
import StationWorkInstructions from "./station_work_instructions";

const SkuContextStationWorkInstructions = props => {
    return (
        <SkuContext.Consumer>
            {({setShowInstructionEditor, showInstructionEditor}) => {
                return(
                  <StationWorkInstructions
                      onEditClick={(value) => {
                          setShowInstructionEditor(value)
                      }}
                      {...props}
                  />
                )
            }}
        </SkuContext.Consumer>
    );
};

SkuContextStationWorkInstructions.propTypes = {

};

SkuContextStationWorkInstructions.defaultProps = {

};

export default SkuContextStationWorkInstructions;
