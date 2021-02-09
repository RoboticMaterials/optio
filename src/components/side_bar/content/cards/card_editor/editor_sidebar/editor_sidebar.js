import React, { useContext, useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { DraggableCore } from "react-draggable";
import { Container } from 'react-smooth-dnd'
import { Draggable } from 'react-smooth-dnd';

import * as style from "./editor_sidebar.style"
import { ThemeContext } from "styled-components";


import log from '../../../../../../logger'

import FieldComponentMapper from "../field_component_mapper/field_component_mapper";
import {setFieldDragging} from "../../../../../../redux/actions/card_page_actions";
import WidgetButton from "../../../../../basic/widget_button/widget_button";
import {TYPES} from "../../../../../widgets/widget_pages/dashboards_page/dashboards_sidebar/dashboards_sidebar";

const logger = log.getLogger("LotEditorSidebar")

export const EDITOR_SIDEBAR_TYPES = {
    FIELDS: {
        name: "Fields",
        iconName: "fas fa-route",
    }
}

export const FIELD_COMPONENT_NAMES = {
    TEXT_BOX: "TEXT_BOX",
    NUMBER_INPUT: "NUMBER_INPUT",
    CALENDAR_SINGLE: "CALENDAR_SINGLE",
    CALENDAR_START_END: "CALENDAR_START_END",
    T: "CALENDAR_START_END",
}
export const LOT_EDITOR_SIDEBAR_OPTIONS = {
    TEXTBOX: {
        component: FIELD_COMPONENT_NAMES.TEXT_BOX
    },
    NUMBER_INPUT: {
        component: FIELD_COMPONENT_NAMES.NUMBER_INPUT
    },
    CALENDAR_SINGLE: {
        component: FIELD_COMPONENT_NAMES.CALENDAR_SINGLE
    },
    CALENDAR_START_END: {
        component: FIELD_COMPONENT_NAMES.CALENDAR_START_END
    },

}

const SIDE_BAR_MODES = {
    FIELDS: {
        name: "FIELDS",
        iconName: "fas fa-edit"
    },
    TEMPLATES: {
        name: "TEMPLATES",
        iconName: "fas fa-edit"
    }
}

const LotEditorSidebar = (props) => {

    const {
        // width,
        // setWidth,

        stationID,
    } = props

    const minWidth = 450

    /*
    * Tests sidebar width to  determine if styling should be for small or large width
    * Returns true if width is less than breakpoint, and false otherwise
    * */
    const testSize = (width) => {
        return width < 500
    }

    // theme
    const themeContext = useContext(ThemeContext);

    // actions
    const dispatch = useDispatch()
    const dispatchSetFieldDragging = (bool) => dispatch(setFieldDragging(bool))

    const lotTemplates = useSelector(state => {return state.lotTemplatesReducer.lotTemplates})


    const [width, setWidth] = useState(window.innerWidth < 2000 ? 450 : 450); // used for tracking sidebar dimensions
    const [isSmall, setSmall] = useState(testSize(width)); // used for tracking sidebar dimensions
    const [type, setType] = useState(Object.keys(EDITOR_SIDEBAR_TYPES)[0]); // used for tracking sidebar dimensions


    const getFieldTemplates = () => {
        return (
            <style.ListContainer>
                <Container
                    groupName="lot_field_buttons"
                    onDragStart={(dragStartParams, b, c)=>{
                        dispatchSetFieldDragging(true)
                    }}
                    onDragEnd={(dragEndParams)=>{
                        dispatchSetFieldDragging(true)
                    }}
                    onDrop={() => {
                        dispatchSetFieldDragging(false)
                    }}
                    getChildPayload={index => {
                        const selected = Object.entries(LOT_EDITOR_SIDEBAR_OPTIONS)[index]
                        const payload = {
                            key: selected[0],
                            ...selected[1]
                        }
                        console.log("payload",payload)
                        return payload
                    }}
                    getGhostParent={()=>{
                        return document.body
                    }}
                    style={{
                        position: "relative",

                        display: "flex",
                        flexDirection: "column",
                        alignSelf: "stretch",
                        flex: 1,
                        alignItems: "center",
                        overflowY: "auto",
                        overflowX: "hidden",

                    }}
                >
                {
                    Object.entries(LOT_EDITOR_SIDEBAR_OPTIONS).map((currOption, currIndex) => {
                        const key = currOption[0]
                        const value = currOption[1]
                        return <Draggable key={currIndex} style={{marginBottom: "1.5rem"}}>
                                <FieldComponentMapper
                                    component={value.component}
                                />
                        </Draggable>
                    })
                }
                </Container>
            </style.ListContainer>
        )
    }

    const getTemplateButtons = () => {
        return (
            <style.ListContainer>
                {
                    Object.values(lotTemplates).map((currTemplate, currIndex) => {
                        const {
                            fields,
                            name
                        } = currTemplate

                        return <style.LotTemplateButton>
                            {name}
                        </style.LotTemplateButton>
                    })
                }
            </style.ListContainer>
        )
    }

    let renderButtons = () => {}

    switch(type) {
        case Object.keys(EDITOR_SIDEBAR_TYPES)[0]: {
            renderButtons = getFieldTemplates
            break
        }

        case Object.keys(EDITOR_SIDEBAR_TYPES)[1]: {
            renderButtons = getTemplateButtons
            break
        }

        default:
            break
    }

    const handleDrag = (e, ui) => {
        setWidth(width + ui.deltaX)
        setSmall(testSize(Math.max(minWidth, width + ui.deltaX)))  // check if width is less than styling breakpoint and update isSmall

    }

    const renderNavButtons = () => {
        return(
            Object.entries(SIDE_BAR_MODES).map((currEntry, index) => {
                const [currKey, currValue] = currEntry

                return (
                    <WidgetButton
                        containerStyle={{marginRight: "1rem"}}
                        label={currValue.name}
                        color={"#dd12D2"}
                        iconClassName={currValue.iconName}
                        selected={type === currKey}
                        onClick={()=>setType(currKey)}
                        labelSize={"0.5rem"}
                    />
                )
            })
        )
    }

    return (
            <style.SidebarContent
                key="sidebar-content"
                style={{ width: width, minWidth: minWidth }}
            >
                <style.Container>
                    {renderButtons()}

                    <style.FooterContainer>
                        {renderNavButtons()}
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
