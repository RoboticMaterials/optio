import React from 'react'

// Import styles
import * as styled from './contnet_header.style'

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

                <BackButton schema={content} style={{ display: 'inline-block' }}
                    onClick={onClickBack}
                />

                <Button schema={content} style={{ display: 'inline-block', float: 'right' }}
                    onClick={onClickSave} disabled={disabled}
                >
                    Save
                </Button>
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

                <Button schema={content} style={{ display: 'inline-block', float: 'right' }}
                    onClick={onClickSave} disabled={disabled}
                >
                    Add
                    </Button>
            </styled.Header>

        )
    }

    // If the side bar is in title mode then have a back button and if save is enabled then add a save button
    else if (mode === 'title') {
        return (
            <styled.Header>

                <styled.Title schema={content}>{handleTitle()}</styled.Title>


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
