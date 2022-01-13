import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import * as styled from './statistics_selector.style';
import { defaultColors } from '../../../basic/charts/nivo_theme';
import { secondsToReadable } from '../../../../methods/utils/time_utils';
import ContentList from '../content_list/content_list';
import { setSelectedProcess } from '../../../../redux/actions/processes_actions';

const StatisticsSelector = (props) => {

    const dispatch = useDispatch()
    const dispatchSetSelectedProcess = (process) => dispatch(setSelectedProcess(process))

    const processes = useSelector(state => state.processesReducer.processes)

    const history = useHistory()

    return (
        <ContentList
            title={'Statistics'}
            schema={'statistics'}
            // Filters out devices from being displayed in locations
            elements={
                Object.values(processes)
            }
            onClick={(process) => {
                history.push('/statistics/' + process._id + "/statistics")
            }}
            onMouseEnter={(process) => dispatchSetSelectedProcess(process)}
            onMouseLeave={() => dispatchSetSelectedProcess(null)}
            showEdit={false}
            showDelete={false}
            itemStyle={{cursor: 'pointer'}}
        />
    )

    // return (
    //     <styled.Page>
    //         <styled.Header>Processes</styled.Header>
    //         {Object.values(processes).map((process, i) => (
    //             <styled.ProcessCard onClick={() => history.push('/statistics/' + process._id + "/statistics")}>
    //                 <styled.Container style={{width: '50%'}}>
    //                     <styled.IconContainer className={'fas fa-route'} style={{color: process?.production_rate > 0 ? '#81d690' : '#ff6363' }}/>
    //                     <styled.LabelContainer>
    //                         <styled.Label>{process.name}</styled.Label>
    //                         <styled.SubLabel>{process?.flattened_stations?.length || null} Stations</styled.SubLabel>
    //                     </styled.LabelContainer>
    //                 </styled.Container>
    //                 <styled.Container style={{flexGrow: '1'}}>
    //                     <styled.Dot style={{background: process?.production_rate > 0 ? '#81d690' : '#ff6363'}} />
    //                     <styled.SubLabel>{secondsToReadable(process?.production_rate || 0)} per part</styled.SubLabel>
    //                 </styled.Container>
    //                 <styled.Chevron className="fas fa-chevron-right" />
    //             </styled.ProcessCard>
    //         ))}
    //     </styled.Page>
    // )
}

export default StatisticsSelector