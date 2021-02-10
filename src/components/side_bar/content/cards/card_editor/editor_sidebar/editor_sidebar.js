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
import {setSelectedLotTemplate} from "../../../../../../redux/actions/lot_template_actions";
import {uuidv4} from "../../../../../../methods/utils/utils";

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
        name: "Fields",
        iconName: "fas fa-edit",
        color: "red"
    },
    TEMPLATES: {
        name: "Templates",
        iconName: "fas fa-file-invoice",
        color: "cyan"
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
    const dispatchSetSelectedLotTemplate = (id) => dispatch(setSelectedLotTemplate(id))


    const lotTemplates = useSelector(state => {return state.lotTemplatesReducer.lotTemplates})
    const selectedLotTemplatesId = useSelector(state => {return state.lotTemplatesReducer.selectedLotTemplatesId})

    const [width, setWidth] = useState(window.innerWidth < 2000 ? 450 : 450); // used for tracking sidebar dimensions
    const [isSmall, setSmall] = useState(testSize(width)); // used for tracking sidebar dimensions
    const [type, setType] = useState(Object.keys(EDITOR_SIDEBAR_TYPES)[0]); // used for tracking sidebar dimensions


    const getFieldTemplates = () => {
        return (
            <style.ListContainer>
                <Container
                    groupName="lot_field_buttons"
                    onDragStart={(dragStartParams)=>{
                        const {
                            isSource,
                            payload,
                            willAcceptDrop
                        } = dragStartParams

                        const {
                            component,
                            key,
                            _id
                        } = payload

                        if(isSource) {
                            dispatchSetFieldDragging(_id)
                        }

                    }}
                    onDragEnd={(dragEndParams)=>{
                        const {
                            isSource,
                            payload,
                            willAcceptDrop
                        } = dragEndParams

                        const {
                            component,
                            key,
                            _id
                        } = payload

                        if(isSource) {
                            dispatchSetFieldDragging(null)
                        }



                    }}
                    onDrop={(dropResult,b) => {
                        const {
                            addedIndex,
                            payload,
                            removedIndex
                        } = dropResult

                        dispatchSetFieldDragging(null)
                    }}
                    getChildPayload={index => {
                        const selected = Object.entries(LOT_EDITOR_SIDEBAR_OPTIONS)[index]
                        const payload = {
                            key: selected[0],
                            ...selected[1],
                            _id: uuidv4(),
                            fieldName: ""
                        }
                        return payload
                    }}
                    getGhostParent={()=>{
                        return document.body
                    }}
                    style={{
                        position: "relative",
                        padding: "1rem 0",
                        alignSelf: "stretch",
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                    }}
                >
                {
                    Object.entries(LOT_EDITOR_SIDEBAR_OPTIONS).map((currOption, currIndex) => {
                        const key = currOption[0]
                        const value = currOption[1]
                        return <Draggable
                            key={currIndex}
                            style={{
                                marginBottom: "1.5rem",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            {/*<div style={{margin: "auto auto"}}/>*/}
                                <FieldComponentMapper
                                    component={value.component}
                                />
                            {/*<div style={{margin: "auto auto"}}/>*/}
                        </Draggable>
                    })
                }
                </Container>
            </style.ListContainer>
        )
    }

    const getTemplateButtons = () => {
        return (
            <style.ListContainer style={{padding: "1rem 0"}}>
                <style.LotTemplateButton
                    onClick={() => dispatchSetSelectedLotTemplate(null)}
                >
                    <style.TemplateIcon
                        isSelected={!selectedLotTemplatesId}
                        className={SIDE_BAR_MODES.TEMPLATES.iconName}
                    />

                    <style.TemplateName>Empty</style.TemplateName>
                </style.LotTemplateButton>
                {
                    Object.values(lotTemplates).map((currTemplate, currIndex) => {
                        const {
                            fields,
                            name,
                            _id: currTemplateId
                        } = currTemplate
                        //

                        const isSelected = selectedLotTemplatesId === currTemplateId

                        return <style.LotTemplateButton
                            onClick={() => dispatchSetSelectedLotTemplate(currTemplateId)}
                        >
                            <style.TemplateIcon
                                isSelected={isSelected}
                                className={SIDE_BAR_MODES.TEMPLATES.iconName}
                            />

                           <style.TemplateName>{name}</style.TemplateName>
                        </style.LotTemplateButton>
                    })
                }
            </style.ListContainer>
        )
    }

    let renderButtons = () => {}

    switch(type) {
        case Object.keys(SIDE_BAR_MODES)[0]: {
            renderButtons = getFieldTemplates
            break
        }

        case Object.keys(SIDE_BAR_MODES)[1]: {
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
                        color={currValue.color}
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
