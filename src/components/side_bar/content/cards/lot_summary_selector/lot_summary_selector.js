import {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import * as styled from './lot_summary_selector.style';
import { defaultColors } from '../../../../basic/charts/nivo_theme';
import {setSummaryProcess} from '../../../../../redux/actions/card_page_actions'

const LotSummarySelector = (props) => {

    const processes = useSelector(state => state.processesReducer.processes)

    const history = useHistory()
    const dispatch = useDispatch()
    const dispatchSetSummaryProcess = (processId) => dispatch(setSummaryProcess(processId))
    const summaryProcess = useSelector(state => state.cardPageReducer.summaryProcess)

    useEffect(() => {
      history.push("/lots/summary")
    }, [])
    return (
        <styled.Page>
            <styled.Header>Processes</styled.Header>
            {Object.values(processes).map((process, i) => (
                <styled.ProcessCard onClick={() => {
                  history.push(process._id + "/lots")
                  dispatchSetSummaryProcess(process._id)
              }}
              >
                    <styled.Container style={{width: '50%'}}>
                        <styled.IconContainer className={'fas fa-route'} style={{color: '#924dff'}}/>
                        <styled.LabelContainer>
                            <styled.Label>{process.name}</styled.Label>
                            <styled.SubLabel>{process?.flattened_stations?.length || null} Stations</styled.SubLabel>
                        </styled.LabelContainer>
                    </styled.Container>
                    <styled.Container style={{flexGrow: '1'}}>
                    </styled.Container>
                    <styled.Chevron className="fas fa-chevron-right" />
                </styled.ProcessCard>
            ))}
        </styled.Page>
    )
}

export default LotSummarySelector
