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
import BounceButton from '../../../basic/bounce_button/bounce_button'

const ContentHeader = (props) => {

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
            return 'Schedules'
        }

        else if (content === 'taskQueue') {
            return 'Task Queue'
        }

        else if (content === 'tasks') {
            return 'Routes'
        }

        else {
            return upperCaseFirstLetterInString(content)
        }
    }

    // If the side bar is show a list of itemts, then have the title and add button
    if (mode === 'list') {
        return (
            <styled.Header>
                <styled.Title schema={content}>{handleTitle()}</styled.Title>

                {content === 'taskQueue' ?
                    <BounceButton
                        color={"red"}
                        onClick={onClickClear}
                        disabled={disabled}
                    >
                        <styled.ClearIcon
                            fontSize={"medium"}
                        />
                    </BounceButton>
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
                        Save
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
