import React from 'react'

// Import styles
import * as styled from './contnet_header.style'
import theme from '../../../../theme'

// Import Utils
import { upperCaseFirstLetterInString } from '../../../../methods/utils/utils'

// Import Components
import PlusButton from '../../../basic/plus_button/plus_button'
import Button from '../../../basic/button/button'
import BackButton from '../../../basic/back_button/back_button'
//import BounceButton from '../../../basic/bounce_button/bounce_button'

import { useTranslation } from 'react-i18next';

const ContentHeader = (props) => {

    const { t, i18n } = useTranslation();
    
    const {
        content,
        onClickAdd,
        onClickSave,
        onClickBack,
        onClickClear,
        mode,
        disabled,
        saveEnabled,
        backEnabled,
    } = props

    // Handles the title
    const handleTitle = () => {

        if (content === 'scheduler') {
            return t('schedules','Schedules')
        }

        else if (content === 'taskQueue') {
            return t('taskqueue','Task Queue')
        }

        else if (content === 'tasks') {
            return t('routes','Routes')
        }

        else if (content === 'lots') {
            return t('travelers','Travelers')
        }

        else if (content === 'locations'){
            return t('locations','Locations')
        }

        else if (content === 'statistics'){
            return t('statistics','Statistics')
        }

        else if (content === 'processes'){
            return t('processes','Processes')
        }

        else if (content == 'settings'){
            return t('settings','Settings')
        }

        else {
            return upperCaseFirstLetterInString(content)
        }
    }

    // If the side bar is show a list of item, then have the title and add button
    if (mode === 'list') {
        return (
            <styled.Header>
                <styled.Title schema={content}>{handleTitle()}</styled.Title>

                {content !== 'locations' && content!== 'processes' ?
                    <>
                    </>
                    :
                    <PlusButton
                        style={{color: theme.main.schema[content].solid}}
                        onClick={onClickAdd}
                    />
                }

            </styled.Header>
        )
    }

    // If the side bar is in create mode then have a back button and a save button
    else if (mode === 'create') {
        return (
            <styled.Header>

                <BackButton schema={content} type = {"button"} style={{ display: 'inline-block'}}
                    onClick={onClickBack}
                />
                <styled.EditTitle style = {{marginTop: ".5rem"}}  schema={content}>{handleTitle()}</styled.EditTitle>
            </styled.Header>

        )
    }

    // If the side bar is in add mode then have a back button and a add button
    else if (mode === 'add') {
        return (
            <styled.Header>

                <BackButton schema={content} style={{ display: 'inline-block' }}
                    onClick={onClickBack}
                />
            </styled.Header>

        )
    }

    // If the side bar is in title mode then have a back button and if save is enabled then add a save button
    else if (mode === 'title') {
        return (
            <styled.Header>
            {content==="settings" || content==="devices"?
              <styled.Title schema={content}>{handleTitle()}</styled.Title>
              :
              <styled.EditTitle schema={content}>{handleTitle()}</styled.EditTitle>
            }


                {saveEnabled &&

                    <Button schema={content} style={{ display: 'inline-block', float: 'right' }}
                        onClick={onClickSave} disabled={disabled}
                    >
                        {t("save","Save")}
                    </Button>
                }

                {backEnabled &&
                    <BackButton schema={content} style={{ display: 'inline-block' }}
                        onClick={onClickBack}
                    />
                }
            </styled.Header>


        )
    }

}

ContentHeader.defaultProps = {
    mode: 'list'
}

export default ContentHeader
