import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LotCreatorForm from "../lot_template_editor/template_form";
import * as styled from "./sku_editor.style";
import {isMobile} from "react-device-detect";
import ScaleWrapper from "../../../../../basic/scale_wrapper/scale_wrapper";
import LotEditor from "../card_editor/lot_editor";
import {immutableReplace, isArray, isNonEmptyArray} from "../../../../../../methods/utils/array_utils";
import {useSelector} from "react-redux";
import {getFormCustomFields} from "../../../../../../methods/utils/card_utils";
import LotFields from "../card_editor/lot_fields/lot_fields";
import {BASIC_LOT_TEMPLATE} from "../../../../../../constants/lot_contants";
import Button from "../../../../../basic/button/button";

const SkuEditor = (props) => {

    const {
        selectedLotTemplatesId,
        setShowLotTemplateEditor
    } = props

    const lotTemplate = useSelector(state => { return state.lotTemplatesReducer.lotTemplates[selectedLotTemplatesId] }) || BASIC_LOT_TEMPLATE

    const [editingFields, setEditingFields] = useState(false)

    const fields = getFormCustomFields(lotTemplate?.fields || [])

    return (
        <styled.Container
            isOpen={true}
            onRequestClose={() => {
                props.close()
            }}
            contentLabel="Lot Editor Form"
            style={{
                overlay: {
                    zIndex: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',

                },
                content: {
                    borderRadius: '0.4rem'
                }
            }}
        >
            <styled.Container2>
                {editingFields ?
                    <LotCreatorForm
                        isOpen={true}
                        onAfterOpen={null}
                        lotTemplateId={selectedLotTemplatesId}
                        close={()=>{
                            setShowLotTemplateEditor(false)
                        }}
                    />
                    :
                    <div
                        style={{
                            width: '50%',
                            position: 'relative'
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.15)',
                                justifyContent: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                zIndex: 1000
                            }}
                        >
                            <Button
                                label={'Edit Fields'}
                                schema={'lots'}
                                style={{
                                    zIndex: 1000,
                                    flex: 1,
                                    maxWidth: '30rem'
                                }}
                            />
                        </div>
                        <ScaleWrapper
                            scaleFactor={.5}
                        >
                            <styled.TheBody>

                                <LotFields
                                    fields={fields}
                                    usable={false}
                                    preview={true}
                                />
                            </styled.TheBody>

                        </ScaleWrapper>
                    </div>
            }
            </styled.Container2>
        </styled.Container>
    );
};

SkuEditor.propTypes = {

};

SkuEditor.defaultProps = {
    close: () => null
};

export default SkuEditor;
