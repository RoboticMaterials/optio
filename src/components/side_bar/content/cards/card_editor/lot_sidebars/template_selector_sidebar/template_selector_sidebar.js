import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { DraggableCore } from "react-draggable";

import {
    isMobile
} from "react-device-detect";

import * as style from "../lot_sidebars.style"
import { ThemeContext } from "styled-components";


import log from '../../../../../../../logger'

import {setFieldDragging} from "../../../../../../../redux/actions/card_page_actions";
import {setSelectedLotTemplate} from "../../../../../../../redux/actions/lot_template_actions";
import {BASIC_LOT_TEMPLATE_ID, SIDE_BAR_MODES} from "../../../../../../../constants/lot_contants";
import Button from "../../../../../../basic/button/button";

const logger = log.getLogger("TemplateSelectorSidebar")


const TemplateSelectorSidebar = (props) => {

    const {
        showFields,
        onTemplateEditClick,
        selectedLotTemplatesId,
        minWidth,
        onCloseClick,
    } = props


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

    const [width, setWidth] = useState(
        isMobile ? window.innerWidth :
        window.innerWidth < 2000 ? 450 : 450
    ); // used for tracking sidebar dimensions
    const [isSmall, setSmall] = useState(testSize(width)); // used for tracking sidebar dimensions

    const [type, setType] = useState(showFields ? SIDE_BAR_MODES.FIELDS.name : SIDE_BAR_MODES.TEMPLATES.name); // used for tracking sidebar dimensions

    const getTemplateButtons = () => {
        return (

            <style.ListContainer>
                {!isMobile &&
                    <Button 
                        schema={'lots'}
                        secondary
                        onClick={() => {
                            dispatchSetSelectedLotTemplate(null)
                            onTemplateEditClick(null)
                        }}
                        style={{
                            marginBottom: '1rem',
                            height: '3rem',
                        }}
                    >
                        <i style={{marginRight: '1rem'}} className="fa fa-plus" aria-hidden="true"/>
                        Create New Template
                    </Button>
                }
                <style.LotTemplateButton
                    isSelected={selectedLotTemplatesId === BASIC_LOT_TEMPLATE_ID}
                    onClick={() => dispatchSetSelectedLotTemplate(BASIC_LOT_TEMPLATE_ID)}
                >
                    <style.TemplateIcon
                        isSelected={selectedLotTemplatesId === BASIC_LOT_TEMPLATE_ID}
                        className={SIDE_BAR_MODES.TEMPLATES.iconName}
                    />

                    <style.TemplateName
                        isSelected={selectedLotTemplatesId === BASIC_LOT_TEMPLATE_ID}
                    >Basic</style.TemplateName>
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
                            key={currTemplateId}
                            isSelected={isSelected}
                            onClick={() => {
                                dispatchSetSelectedLotTemplate(currTemplateId)
                            }}
                        >
                            <style.TemplateIcon
                                // style={{marginRight: "5rem"}}
                                isSelected={isSelected}
                                className={SIDE_BAR_MODES.TEMPLATES.iconName}
                            />
                            

                           <style.TemplateName
                               isSelected={isSelected}
                           >{name}</style.TemplateName>

                            {!isMobile &&
                                <style.EditTemplateIcon
                                    isSelected={isSelected}
                                    onClick={()=>{
                                        dispatchSetSelectedLotTemplate(currTemplateId)
                                        onTemplateEditClick(null)
                                    }}
                                    type={"button"}
                                    className={"fas fa-edit"}
                                />
                            }
                        </style.LotTemplateButton>
                    })
                }
            </style.ListContainer>
        )
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
                    {getTemplateButtons()}
                    {/* <style.FooterContainer
                        style={{justifyContent: "center"}}
                    >
                        <Button
                            onClick={onCloseClick}
                            schema={"lots"}
                            type={"button"}
                            label={"Close"}
                        />
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
TemplateSelectorSidebar.propTypes = {
    showFields: PropTypes.bool,
    showTemplates: PropTypes.bool,
    showNew: PropTypes.bool,
    onTemplateClick: PropTypes.func,
    onTemplateEditClick: PropTypes.func,
};

// Specifies the default values for props:
TemplateSelectorSidebar.defaultProps = {
    showFields: true,
    showTemplates: true,
    showNew: true,
    onTemplateClick: () => {},
    onTemplateEditClick: () => {},
    onCloseClick: () => {},
    minWidth: 450
};

export default TemplateSelectorSidebar
