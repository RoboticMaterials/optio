import React, { Component } from "react";
import PropTypes from 'prop-types';

import * as styled from './list_item_with_switch.style';
import Switch from 'react-ios-switch';

class ListItemWithSwitch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: false
        }

        this.handleSwitchPress = this.handleSwitchPress.bind(this);

    }

    handleSwitchPress(){
        const {checked} = this.state;
        this.setState({checked: !checked})
    }

    render() {

        const {} = this.state;
        const {
          id,
          text,
          title,
          MiddleContent,
          subtitle,
          SubtitleComponent,
          TitleComponent,
          containerStyle,
          checked,
          onSwitchPress,
          selected,
          onBackgroundPress,
          ContainerComponent,
          ContentComponent,
          contentComponentProps,
          SwitchContainerComponent,
          SelectedIconComponent,
          index,
          containerComponentProps,
          LeftContentComponent,
          PostTitleIcon,
          showPostTitleIcon,
          showSelected,
          disabled
        } = this.props;

        return (
            <ContainerComponent {...containerComponentProps}  onClick={() => onBackgroundPress(id)}>
              <ContentComponent {...contentComponentProps}>
                <LeftContentComponent>
                  {title ?
                    <>
                      <TitleComponent >
                          {title}
                      </TitleComponent>
                      {subtitle &&
                        <SubtitleComponent >
                            {subtitle}
                        </SubtitleComponent>
                      }
                    </>
                    :
                    <TitleComponent >
                        {subtitle}
                    </TitleComponent>
                  }

                </LeftContentComponent>



                <SwitchContainerComponent>
                  {(showPostTitleIcon && PostTitleIcon) &&
                    <PostTitleIcon/>
                  }

                  {MiddleContent &&
                    <MiddleContent/>
                  }
                  <Switch
                      checked={checked}
                      onChange={() => onSwitchPress(id)}
                      disabled={disabled}
                  />
                </SwitchContainerComponent>


              </ContentComponent>
              {selected && showSelected &&
                  <SelectedIconComponent>

                  </SelectedIconComponent>
              }
            </ContainerComponent>

        );
    }
}

// Specifies the default values for props:
ListItemWithSwitch.defaultProps = {
    SubtitleComponent: styled.Subtitle,
    TitleComponent: styled.Title,
    PostTitleIcon: null,
};

ListItemWithSwitch.propTypes = {
    text: PropTypes.string,
};

export default ListItemWithSwitch;
