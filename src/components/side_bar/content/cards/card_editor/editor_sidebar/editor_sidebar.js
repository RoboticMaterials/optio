import React, { useContext, useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { DraggableCore } from "react-draggable";
import { Container } from 'react-smooth-dnd'

import * as style from "./editor_sidebar.style"
import { ThemeContext } from "styled-components";


import log from '../../../../../../logger'
import WidgetButton from "../../../../../basic/widget_button/widget_button";
import DashboardsSidebar
    from "../../../../../widgets/widget_pages/dashboards_page/dashboards_sidebar/dashboards_sidebar";
import TextField from "../../../../../basic/form/text_field/text_field";
import Textbox from "../../../../../basic/textbox/textbox";
import ColorField from "../../../../../basic/form/color_field/color_field";
import NumberField from "../../../../../basic/form/number_field/number_field";

const logger = log.getLogger("LotEditorSidebar")

export const EDITOR_SIDEBAR_TYPES = {
    FIELDS: {
        name: "Fields",
        iconName: "fas fa-route",
    }
}
const LotEditorSidebar = (props) => {

    const {
        // width,
        // setWidth,

        stationID,
    } = props

    const minWidth = 300

    /*
    * Tests sidebar width to  determine if styling should be for small or large width
    * Returns true if width is less than breakpoint, and false otherwise
    * */
    const testSize = (width) => {
        return width < 500
    }

    // theme
    const themeContext = useContext(ThemeContext);

    const [width, setWidth] = useState(window.innerWidth < 2000 ? 400 : 700); // used for tracking sidebar dimensions
    const [isSmall, setSmall] = useState(testSize(width)); // used for tracking sidebar dimensions
    const [type, setType] = useState(Object.keys(EDITOR_SIDEBAR_TYPES)[0]); // used for tracking sidebar dimensions

    const getFieldTemplates = () => {
        return <>
            <style.ButtonRow>
                <Textbox
                />
            </style.ButtonRow>

            {/*<style.ButtonRow style={{background: "blue"}}>*/}
            {/*<ColorField*/}
            {/*    mode={"twitter"}*/}
            {/*/>*/}
            {/*</style.ButtonRow>*/}

            {/*<style.ButtonRow>*/}
            {/*    <NumberField*/}
            {/*        name={"b"}*/}
            {/*    />*/}
            {/*</style.ButtonRow>*/}

            {/*<style.ButtonRow>*/}
            {/*    <div>as</div>*/}
            {/*</style.ButtonRow>*/}

        </>
    }

    let renderButtons = () => {}

    switch(type) {
        case Object.keys(EDITOR_SIDEBAR_TYPES)[0]:
            renderButtons = getFieldTemplates
            break

        default:
            break
    }

    const handleDrag = (e, ui) => {
        setWidth(width + ui.deltaX)
        setSmall(testSize(Math.max(minWidth, width + ui.deltaX)))  // check if width is less than styling breakpoint and update isSmall

    }

    return (
            <style.SidebarContent
                key="sidebar-content"
                style={{ width: width, minWidth: minWidth }}
            >
                <style.Container>
                    <style.ListContainer>
                        <Container
                            groupName="dashboard-buttons"
                            getChildPayload={index =>
                                index
                                // availableButtons[index]
                            }
                        >
                            {renderButtons()}
                        </Container>
                    </style.ListContainer>

                    <style.FooterContainer>
                        {/*{renderTypeButtons()}*/}
                    </style.FooterContainer>
                </style.Container>

                <DraggableCore key="handle" onDrag={handleDrag} >
                    <style.ResizeBar>
                        <style.ResizeHandle></style.ResizeHandle>
                    </style.ResizeBar>
                </DraggableCore>
            </style.SidebarContent>
    )
}

export default LotEditorSidebar
