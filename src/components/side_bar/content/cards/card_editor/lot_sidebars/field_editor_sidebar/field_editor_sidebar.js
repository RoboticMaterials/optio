import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { DraggableCore } from "react-draggable";
import { Container } from 'react-smooth-dnd'
import { Draggable } from 'react-smooth-dnd';

import * as style from "../lot_sidebars.style"
import { ThemeContext } from "styled-components";


import log from '../../../../../../../logger'

import FieldComponentMapper from "../../field_component_mapper/field_component_mapper";
import {setFieldDragging} from "../../../../../../../redux/actions/card_page_actions";
import WidgetButton from "../../../../../../basic/widget_button/widget_button";
import {TYPES} from "../../../../../../widgets/widget_pages/dashboards_page/dashboards_sidebar/dashboards_sidebar";
import {setSelectedLotTemplate} from "../../../../../../../redux/actions/lot_template_actions";
import {uuidv4} from "../../../../../../../methods/utils/utils";
import * as styled from "../../../../../../basic/form/calendar_field/calendar_field.style";
import CalendarField from "../../../../../../basic/form/calendar_field/calendar_field";

const logger = log.getLogger("LotEditorSidebar")



export const EDITOR_SIDEBAR_TYPES = {
    FIELDS: {
        name: "Fields",
        iconName: "fas fa-route",
    }
}

export const FIELD_COMPONENT_NAMES = {
    TEXT_BOX: "TEXT_BOX",
    TEXT_BOX_BIG: "TEXT_BOX_BIG",
    NUMBER_INPUT: "NUMBER_INPUT",
    CALENDAR_SINGLE: "CALENDAR_SINGLE",
    CALENDAR_START_END: "CALENDAR_START_END",
}

export const LOT_EDITOR_SIDEBAR_OPTIONS = {
    TEXT_BOX: {
        component: FIELD_COMPONENT_NAMES.TEXT_BOX
    },
    TEXT_BOX_BIG: {
        component: FIELD_COMPONENT_NAMES.TEXT_BOX_BIG
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

export const EMPTY_DEFAULT_FIELDS =  [
    [{_id: 0, component: FIELD_COMPONENT_NAMES.TEXT_BOX_BIG, fieldName: "description", key: 0}],
    [{_id: 1, component: FIELD_COMPONENT_NAMES.CALENDAR_START_END, fieldName: "dates", key: 1}]
]

export const SIDE_BAR_MODES = {
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

export const BASIC_LOT_TEMPLATE_ID = "BASIC_LOT_TEMPLATE"

const LotEditorSidebar = (props) => {

    const {
        showFields,
        showTemplates,
        showNew,
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

    const [type, setType] = useState(showFields ? SIDE_BAR_MODES.FIELDS.name : SIDE_BAR_MODES.TEMPLATES.name); // used for tracking sidebar dimensions


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
                                alignItems: "center",
                            }}
                        >
                            <div style={{width: "fit-content"}}>
                                <FieldComponentMapper
                                    component={value.component}
                                />
                            </div>
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
                    isSelected={!selectedLotTemplatesId}
                    onClick={() => dispatchSetSelectedLotTemplate(null)}
                >

                    <style.TemplateName
                        isSelected={!selectedLotTemplatesId}
                    >New</style.TemplateName>
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
                            isSelected={isSelected}
                            onClick={() => dispatchSetSelectedLotTemplate(currTemplateId)}
                        >
                            <style.TemplateIcon
                                isSelected={isSelected}
                                className={SIDE_BAR_MODES.TEMPLATES.iconName}
                            />
                           <style.TemplateName
                               isSelected={isSelected}
                           >{name}</style.TemplateName>
                        </style.LotTemplateButton>
                    })
                }
            </style.ListContainer>
        )
    }

    let renderButtons = () => {}

    switch(type) {
        case SIDE_BAR_MODES.FIELDS.name: {
            renderButtons = getFieldTemplates
            break
        }

        case SIDE_BAR_MODES.TEMPLATES.name: {
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
            Object.entries(SIDE_BAR_MODES)
                .filter((currEntry, index) => {
                    const [currKey, currValue] = currEntry

                    if(currValue.name === SIDE_BAR_MODES.FIELDS.name && !showFields) {
                        return false
                    }
                    if(currValue.name === SIDE_BAR_MODES.TEMPLATES.name && !showTemplates) {
                        return false
                    }
                    return true

                })
                .map((currEntry, index) => {
                const [currKey, currValue] = currEntry

                return (
                    <WidgetButton
                        containerStyle={{marginRight: "1rem"}}
                        label={currValue.name}
                        color={currValue.color}
                        iconClassName={currValue.iconName}
                        selected={type === currValue.name}
                        onClick={()=>setType(currValue.name)}
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

// Specifies propTypes
LotEditorSidebar.propTypes = {
    showFields: PropTypes.bool,
    showTemplates: PropTypes.bool,
    showNew: PropTypes.bool,
};

// Specifies the default values for props:
LotEditorSidebar.defaultProps = {
    showFields: true,
    showTemplates: true,
    showNew: true,

};

export default LotEditorSidebar
