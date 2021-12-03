import { ResponsiveBar } from '@nivo/bar'
import { capitalizeFirstLetter } from '../../../../methods/utils/string_utils'

const Scale = ({ data, labels }) => {


    const totalTime = (Math.abs(data[0].working) + Math.abs(data[0].idle))

    return (
        <div style={{position:'relative', height: '16px', display: 'flex', width: '100%', maxWidth: '100%'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingRight: '1rem', minWidth: '5rem'}}>
                <span style={{color: '#393975'}}>{capitalizeFirstLetter(labels[0])}</span>
                <span>{`${Math.round((data[0].working / totalTime)*1000)/10}%` || ''}</span>
            </div>
            <div style={{flexGrow: 1}}>
                <ResponsiveBar
                    data={data.map(bar => ({id: bar.id, working: Math.abs(bar.working), idle: Math.abs(bar.idle)}))}
                    keys={labels}
                    indexBy="id"
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    padding={0}
                    borderRadius={8}
                    layout="horizontal"
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={['#01F0E2', '#FF718B']}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={null}
                    axisLeft={null}
                    enableGridY={false}
                    enableLabel={false}
                />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '1rem', minWidth: '5rem'}}>
                <span style={{color: '#393975'}}>{capitalizeFirstLetter(labels[1])}</span>
                <span>{`${Math.round((Math.abs(data[0].idle) / totalTime)*1000)/10}%` || ''}</span>
            </div>
        </div>
    )
}

export default Scale;