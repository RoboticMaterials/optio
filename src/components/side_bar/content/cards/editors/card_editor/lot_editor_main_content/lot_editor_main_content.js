import React from 'react';
import PropTypes from 'prop-types';
import * as styled from "./lot_editor_main_content.style";
import * as sharedStyles from "../lot_editor.style";
import LotFields from "../lot_fields/lot_fields";
import {isArray} from "../../../../../../../methods/utils/array_utils";
import {FORM_MODES} from "../../../../../../../constants/scheduler_constants";
import ButtonGroup from "../../../../../../basic/button_group/button_group";
import {getDisplayName} from "../../../../../../../methods/utils/lot_utils";
import {DEFAULT_COUNT_DISPLAY_NAME} from "../../../../../../../constants/lot_contants";
import NumberField from "../../../../../../basic/form/number_field/number_field";

const LotEditorMainContent = (props) => {

    const {
        fields,
        formMode,
        buttonGroupNames,
        lotTemplate,
        buttonGroupIds,
        binId,
        setBinId,
    } = props

    // renders main content
    const renderMainContent = () => {
        return(
            <>
                <sharedStyles.SectionContainer>
                    <sharedStyles.TheBody>
                        <LotFields
                            fields={fields}
                        />
                    </sharedStyles.TheBody>
                </sharedStyles.SectionContainer>
                <sharedStyles.BodyContainer>
                    {formMode === FORM_MODES.UPDATE &&
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            marginBottom: "2rem",
                        }}
                    >
                        <styled.FieldTitle>Station</styled.FieldTitle>

                        <ButtonGroup
                            buttonViewCss={styled.buttonViewCss}
                            buttons={buttonGroupNames}
                            selectedIndex={buttonGroupIds.findIndex((ele) => ele === binId)}
                            onPress={(selectedIndex)=>{
                                setBinId(buttonGroupIds[selectedIndex])
                                // setFieldValue("selectedBin", buttonGroupIds[selectedIndex])
                                // setSelectedBin(availableBins[selectedIndex])
                            }}
                            containerCss={styled.buttonGroupContainerCss}
                            buttonViewSelectedCss={styled.buttonViewSelectedCss}
                            buttonCss={styled.buttonCss}
                        />
                    </div>
                    }

                    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <sharedStyles.ObjectInfoContainer>
                            <styled.ObjectLabel>{getDisplayName(lotTemplate, "count", DEFAULT_COUNT_DISPLAY_NAME)}</styled.ObjectLabel>
                            <NumberField
                                minValue={1}
                                name={`bins.${binId}.count`}
                            />
                        </sharedStyles.ObjectInfoContainer>
                    </div>
                </sharedStyles.BodyContainer>
            </>
        )
    }

    return (
        renderMainContent()
    );
};

LotEditorMainContent.propTypes = {

};

LotEditorMainContent.defaultProps = {
    buttonGroupNames: [],
    buttonGroupIds: [],
};


export default LotEditorMainContent;
