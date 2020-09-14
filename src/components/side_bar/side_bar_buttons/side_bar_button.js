import React from 'react';
import * as style from './side_bar_button.style'

const SideBarButton = (props) => {

    if (props.mode === 'locations') {
        return (
            <style.SideBarButtonIcon
                className='fas fa-map-marker-alt'
                onClick={() => {
                    props.setShowSideBarPage(props.mode)
                }}
                currentMode={props.currentMode}
                mode={props.mode}
            />
        )
    }

    else if (props.mode === 'devices') {
        return (
            <style.SideBarButtonIcon
                className={'icon-rmLogo'}
                onClick={() => {
                    props.setShowSideBarPage(props.mode)
                }}
                currentMode={props.currentMode}
                mode={props.mode}
            />
        )
    }

    else if (props.mode === 'scheduler') {
        return (
            <style.SideBarButtonIcon
                className={'far fa-calendar-alt'}
                onClick={() => {
                    props.setShowSideBarPage(props.mode)
                }}
                currentMode={props.currentMode}
                mode={props.mode}
            />
        )
    }

    else if (props.mode === 'taskQueue') {
        return (
            <style.SideBarButtonIcon
                className={'fa fa-tasks'}
                onClick={() => {
                    props.setShowSideBarPage(props.mode)
                }}
                currentMode={props.currentMode}
                mode={props.mode}
            />
        )
    }

    else if (props.mode === 'settings') {
        return (
            <style.SideBarButtonIcon
                className={'fas fa-cog'}
                onClick={() => {
                    props.setShowSideBarPage(props.mode)
                }}
                currentMode={props.currentMode}
                mode={props.mode}
                style={{ position: 'absolute', bottom: '1rem' }}

            />
        )
    }

    else {
        return (
            <style.SideBarButtonIcon
                className={"icon-" + props.mode}
                onClick={() => {
                    props.setShowSideBarPage(props.mode)
                }}
                currentMode={props.currentMode}
                mode={props.mode}
            />
        )
    }

}

export default SideBarButton