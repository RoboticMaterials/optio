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

const SkuEditor = (props) => {

    const {
        selectedLotTemplatesId,
        setShowLotTemplateEditor
    } = props

    const lotTemplate = useSelector(state => { return state.lotTemplatesReducer.lotTemplates[selectedLotTemplatesId] }) || BASIC_LOT_TEMPLATE

    const [editingFields, setEditingFields] = useState(false)

    const fields = getFormCustomFields(lotTemplate?.fields || [])

    console.log('lotTemplate',lotTemplate)
    console.log('fieldsfields',fields)

    return (
        <styled.Container
            isOpen={true}
            onRequestClose={() => {
                // close()
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
                            width: '50%'
                        }}
                    >
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
