import React, { useContext, useEffect, useRef, useState } from 'react'

// actions
import {setSelectedLotTemplate} from "../../../../../../redux/actions/lot_template_actions"
import {setFieldDragging} from "../../../../../../redux/actions/card_page_actions"

// components external
import { DraggableCore } from "react-draggable"
import { Container, Draggable } from 'react-smooth-dnd'

// components internal
import FieldComponentMapper from "../field_component_mapper/field_component_mapper"
import WidgetButton from "../../../../../basic/widget_button/widget_button"

// functions external
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeContext } from "styled-components"

// logging
import log from '../../../../../../logger'

// utils
import {uuidv4} from "../../../../../../methods/utils/utils"

// constants
import {LOT_EDITOR_SIDEBAR_OPTIONS, SIDE_BAR_MODES, TEMPLATE_FIELD_KEYS} from "../../../../../../constants/lot_contants"

// styles
import * as style from "../../card_editor/lot_sidebars/lot_sidebars.style"

// logger
const logger = log.getLogger("LotEditorSidebar")

const LotTemplateEditorSidebar = (props) => {

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
    const themeContext = useContext(ThemeContext)

    // actions
    const dispatch = useDispatch()
    const dispatchSetFieldDragging = (bool) => dispatch(setFieldDragging(bool))
    const dispatchSetSelectedLotTemplate = (id) => dispatch(setSelectedLotTemplate(id))


    const lotTemplates = useSelector(state => {return state.lotTemplatesReducer.lotTemplates})
    const selectedLotTemplatesId = useSelector(state => {return state.lotTemplatesReducer.selectedLotTemplatesId})

    const [width, setWidth] = useState(window.innerWidth < 2000 ? 450 : 450) // used for tracking sidebar dimensions
    const [isSmall, setSmall] = useState(testSize(width)) // used for tracking sidebar dimensions
    const [type, setType] = useState(showFields ? SIDE_BAR_MODES.FIELDS.name : SIDE_BAR_MODES.TEMPLATES.name) // used for tracking sidebar dimensions


    const getFieldTemplates = () => {

        return (
            <style.ListContainer>
                <Container
                    groupName="lot_field_buttons"
                    getChildPayload={index => {
                        const selected = Object.entries(LOT_EDITOR_SIDEBAR_OPTIONS)[index]
                        const payload = {
                            ...selected[1],
                            _id: uuidv4(),
                            [TEMPLATE_FIELD_KEYS.FIELD_NAME]: "",
                            [TEMPLATE_FIELD_KEYS.REQUIRED]: false,              // set to true to default checked when added
                            [TEMPLATE_FIELD_KEYS.SHOW_IN_PREVIEW]: false,       // set to true to default checked when added
                        }
                        return payload
                    }}

                    style={{
                        position: "relative",
                        alignSelf: "stretch",
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        // justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >

                </Container>
            </style.ListContainer>
        )
    }

    const getTemplateButtons = () => {
        return (

            <style.ListContainer>
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
                            id={currTemplateId}
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
                    <style.TitleText>Draggable Input Elements</style.TitleText>
                    {renderButtons()}

                    {/* <style.FooterContainer>
                        {renderNavButtons()}
                    </style.FooterContainer> */}
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
LotTemplateEditorSidebar.propTypes = {
    showFields: PropTypes.bool,
    showTemplates: PropTypes.bool,
    showNew: PropTypes.bool,
}

// Specifies the default values for props:
LotTemplateEditorSidebar.defaultProps = {
    showFields: true,
    showTemplates: true,
    showNew: true,

}

export default LotTemplateEditorSidebar
