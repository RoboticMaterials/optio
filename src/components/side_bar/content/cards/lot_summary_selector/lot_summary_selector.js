import {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import * as styled from './lot_summary_selector.style';
import { defaultColors } from '../../../../basic/charts/nivo_theme';
import {setSummaryProcess} from '../../../../../redux/actions/card_page_actions'
import ContentList from '../../content_list/content_list';
import { setSelectedProcess } from '../../../../../redux/actions/processes_actions';
import {getCards} from '../../../../../redux/actions/card_actions'
import {getSettings} from '../../../../../redux/actions/settings_actions'
const LotSummarySelector = (props) => {

    const processes = useSelector(state => state.processesReducer.processes)

    const history = useHistory()
    const dispatch = useDispatch()
    const dispatchSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))
    const dispatchSetSummaryProcess = (processId) => dispatch(setSummaryProcess(processId))
    const dispatchGetCards = () => dispatch(getCards())
    const dispatchGetSettings = () => dispatch(getSettings())
    const summaryProcess = useSelector(state => state.cardPageReducer.summaryProcess)

    useEffect(() => {
      dispatchGetCards()
      dispatchGetSettings()
      history.push("/lots/summary")
    }, [])


    return (
        <ContentList
            title={'Travelers'}
            schema={'lots'}
            // Filters out devices from being displayed in locations
            elements={
                Object.values(processes)
            }
            onClick={(process) => {
                history.push(process._id + "/lots")
                dispatchSetSummaryProcess(process._id)
            }}
            onMouseEnter={(process) => dispatchSetSelectedProcess(process)}
            onMouseLeave={() => dispatchSetSelectedProcess(null)}
            showEdit={false}
            showDelete={false}
            itemStyle={{cursor: 'pointer'}}
        />
    )
}

export default LotSummarySelector
