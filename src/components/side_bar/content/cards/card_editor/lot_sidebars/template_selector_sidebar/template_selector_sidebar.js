import React, { useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom'
import { DraggableCore } from "react-draggable";

import {
    isMobile
} from "react-device-detect";

import * as style from "../lot_sidebars.style"
import { ThemeContext } from "styled-components";


import log from '../../../../../../../logger'

import {setFieldDragging} from "../../../../../../../redux/actions/card_page_actions";
import {setSelectedLotTemplate, postLotTemplate} from "../../../../../../../redux/actions/lot_template_actions";
import {BASIC_LOT_TEMPLATE, SIDE_BAR_MODES} from "../../../../../../../constants/lot_contants";
import Button from "../../../../../../basic/button/button";

const logger = log.getLogger("TemplateSelectorSidebar")


const TemplateSelectorSidebar = (props) => {

    const {
        showFields,
        onTemplateEditClick,
        onTemplateSelectClick,
        selectedLotTemplatesId,
        minWidth,
        onCloseClick,
        processId
    } = props

    // theme
    const themeContext = useContext(ThemeContext);

    // actions
    const dispatch = useDispatch()
    const dispatchSetFieldDragging = (bool) => dispatch(setFieldDragging(bool))
    const dispatchSetSelectedLotTemplate = (id) => dispatch(setSelectedLotTemplate(id))

    const lotTemplates = useSelector(state => {return state.lotTemplatesReducer.lotTemplates})
    const processLotTemplates = useMemo(() => Object.values(lotTemplates).filter(template => template.processId === processId), [lotTemplates, processId])
    const history = useHistory()
    const params = useParams()
    const [width, setWidth] = useState(isMobile ? window.innerWidth : 100); // used for tracking sidebar dimensions

    const [type, setType] = useState(showFields ? SIDE_BAR_MODES.FIELDS.name : SIDE_BAR_MODES.TEMPLATES.name); // used for tracking sidebar dimensions

    useEffect(() => {
      if(!selectedLotTemplatesId){
        let basicTemplate = processLotTemplates.find(template => template.name === 'Basic')
        onTemplateSelectClick(basicTemplate?._id)
      }
    }, [])

    const getTemplateButtons = () => {
        return (

            <style.ListContainer>
                {!isMobile &&
                    <Button
                        schema={'lots'}
                        secondary
                        onClick={() => {
                            onTemplateSelectClick(null)
                            onTemplateEditClick(null)
                            history.push(`/lots/${params.id}/template`)

                        }}
                        style={{
                            margin: '0rem 0rem 1rem 0rem',
                            height: '3rem',
                        }}
                    >
                        <i style={{marginRight: '1rem'}} className="fa fa-plus" aria-hidden="true"/>
                        Create Product Template
                    </Button>
                }
                {
                    processLotTemplates.sort(template => template.name === 'Basic' ? -1 : 1).map((currTemplate, currIndex) => {
                        const {
                            fields,
                            name,
                            _id: currTemplateId
                        } = currTemplate
                        //
                        
                        const isSelected = (!!selectedLotTemplatesId && selectedLotTemplatesId !== 'BASIC_LOT_TEMPLATE') ? (selectedLotTemplatesId === currTemplateId) : name === 'Basic'

                        return <style.LotTemplateButton
                            key={currTemplateId}
                            isSelected={isSelected}
                            onClick={() => {
                                onTemplateSelectClick(currTemplateId)
                                isMobile && onCloseClick()
                            }}
                            onMouseEnter={() => {
                              dispatchSetSelectedLotTemplate(currTemplateId)
                            }}
                            onMouseLeave={() => {
                              dispatchSetSelectedLotTemplate(null)
                            }}
                        >
                            <style.TemplateIcon
                                isSelected={isSelected}
                                className={'fas fa-file-alt'}
                            />


                           <style.TemplateName
                               isSelected={isSelected}
                           >{name}</style.TemplateName>

                            {!isMobile && currTemplate.name !== 'Basic' &&
                                <style.EditTemplateIcon
                                    isSelected={isSelected}
                                    onClick={()=>{
                                        history.push(`/lots/${params.id}/template`)
                                        onTemplateSelectClick(currTemplateId)
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
    }


    return (
            <style.SidebarContent
                key="sidebar-content"
                style={{ width: width, minWidth: 400 }}
            >
                {getTemplateButtons()}

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
    minWidth: 400
};

export default TemplateSelectorSidebar
