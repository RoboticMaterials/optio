import React from 'react';

import Switch from 'react-ios-switch';

import theme from '../../../theme';
import * as styled from './rm_switch.style';

const RmSwitch = (props) => {
    return(
      <Switch
          {...props}
          onColor = {theme.main.bg.secondary}
          handleColor = {theme.main.fg.primary}
          //style={{borderColor: theme.main.bg.quinary}}
          offColor={theme.main.bg.quaternary}

          /*
          className={undefined}
          disabled={undefined}
          name={undefined}
          pendingOffColor={undefined}
          pendingOnColor={undefined}
          readOnly={undefined}

          */
      />
    );
};

export default RmSwitch;
