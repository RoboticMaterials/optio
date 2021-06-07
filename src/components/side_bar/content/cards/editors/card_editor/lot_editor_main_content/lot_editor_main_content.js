import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import * as styled from "./lot_editor_main_content.style";
import * as sharedStyles from "../lot_editor.style";
import LotFields from "../lot_fields/lot_fields";
import {isArray} from "../../../../../../../methods/utils/array_utils";
import {FORM_MODES} from "../../../../../../../constants/scheduler_constants";
import ButtonGroup from "../../../../../../basic/button_group/button_group";
import {formatLotNumber, getDisplayName} from "../../../../../../../methods/utils/lot_utils";
import {
    DEFAULT_COUNT_DISPLAY_NAME,
    DEFAULT_NAME_DISPLAY_NAME,
    SIDE_BAR_MODES
} from "../../../../../../../constants/lot_contants";
import NumberField from "../../../../../../basic/form/number_field/number_field";
import LabeledButton from "../labeled_button/labeled_button";
import WobbleButton from "../../../../../../basic/wobble_button/wobble_button";
import TextField from "../../../../../../basic/form/text_field/text_field";
import Textbox from "../../../../../../basic/textbox/textbox";
import NumberInput from "../../../../../../basic/number_input/number_input";
import {ThemeContext} from "styled-components";

const LotEditorMainContent = (props) => {

    const {
        fields,
        formMode,
        buttonGroupNames,
        lotTemplate,
        buttonGroupIds,
        binId,
        setBinId,
        lotNumber,
        content,
        preview
    } = props

    const themeContext = useContext(ThemeContext)

    // renders main content
    const renderMainContent = () => {
        return(
            <>
                <styled.FieldsHeader>

                    <styled.RowContainer>
                        <styled.NameContainer style={{flex: 0}}>
                            <styled.FieldLabel>Lot Number</styled.FieldLabel>
                            <styled.LotNumber>{formatLotNumber(3)}</styled.LotNumber>
                        </styled.NameContainer>

                        <styled.NameContainer>
                            <styled.FieldLabel>{getDisplayName(lotTemplate, "name", DEFAULT_NAME_DISPLAY_NAME)}</styled.FieldLabel>
                            {preview ?
                                <Textbox
                                    style={{alignSelf: 'stretch'}}
                                    // inputStyle={{flex: 1}}
                                />
                                :
                                <TextField
                                    disabled={content !== null}
                                    inputStyle={content !== null ? {
                                        background: "transparent",
                                        border: "none",
                                        boxShadow: "none",

                                    } : {}}
                                    style={content !== null ? {
                                        background: "transparent",
                                        border: "none",
                                        boxShadow: "none",
                                    } : {}}
                                    name={"name"}
                                    type={"text"}
                                    placeholder={"Enter name..."}
                                    InputComponent={Textbox}
                                    schema={"lots"}
                                />
                            }
                        </styled.NameContainer>
                    </styled.RowContainer>
                </styled.FieldsHeader>

                <sharedStyles.SectionContainer>
                    <sharedStyles.TheBody>
                        <LotFields
                            preview={preview}
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
                            {preview ?
                                <NumberInput
                                    themeContext={themeContext}
                                />
                                :
                                <NumberField
                                    minValue={1}
                                    name={`bins.${binId}.count`}
                                />
                            }

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
