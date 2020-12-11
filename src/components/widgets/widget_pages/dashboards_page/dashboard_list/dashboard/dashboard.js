import React, { useRef, useEffect } from 'react';
import PropTypes from "prop-types";

// import external functions
import { useDrag, useDrop } from "react-dnd";

// import external components
import ReactList from 'react-list';
import ReactTooltip from "react-tooltip";

// import internal components
import DashboardButton from "../../dashboard_buttons/dashboard_button/dashboard_button";

// Import styles
import * as style from './dashboard.style';

// import logging
import log from "../../../../../../logger"
import DashboardSidebarButton from "../../dashboards_sidebar/dashboard_sidebar_button/dashboard_sidebar_button";
import { randomHash } from "../../../../../../methods/utils/utils";
const logger = log.getLogger("Dashboards")

const Dashboard = React.memo(props => {
    logger.log("DashboardContainers: props", props)
    // extract props
    const {
        onDrop,
        deleted,
        HILTimer,
        editingclicked,
        onDeleteClick,
        setSelectedDashboard,
        openDashboard,
        id,
        key,
        title,
        buttons
    } = props

    logger.log("Dashboard: props", props)
    logger.log("Dashboard: taskButtons", buttons)

    // handle drop items
    const [{ opacity }, dropRef] = useDrop({
        accept: "DashboardSidebarButton",
        drop: (item, monitor) => {
            onDrop(item, id)
            return item
        },
        hover: (item, monitor) => {
            const isOver = monitor.isOver({ shallow: true })
            logger.log("isOver", isOver)

        },
        // collect: (monitor) => ({
        // 	opacity: monitor.isOver({ shallow: true }) ? 0.5 : 1
        // })
    })

    const listRef = useRef(null);
    const itemRenderer = (index, key) => {
        const button = buttons[index]

        logger.log("itemRenderer currentButton", button)

        return <style.TaskButton key={'task-button-' + index} color={button.color} onDragOver={() => console.log('hey')}>{button.name}</style.TaskButton>

    }

    React.useEffect(() => {
        listRef.current &&
            listRef.current.scrollTo(buttons.length);
    }, [buttons.length]);

    return (
        <style.Container
            ref={dropRef}
            onClick={props.openDashboard}
        >
            <style.HeaderContainer>
                <style.Title>{props.title ? props.title : "Untitled"}</style.Title>
            </style.HeaderContainer>

            <style.List>
                {(buttons && (buttons.length > 0)) ?
                    <ReactList
                        ref={listRef}
                        itemRenderer={itemRenderer}
                        length={buttons.length}
                        type='uniform'
                        itemsRenderer={(items, ref) => {
                            return (
                                <style.ListContainer ref={ref}>
                                    {items}
                                </style.ListContainer>

                            )
                        }}
                    />

                    :
                    <style.NoGoals>Dashboard is empty...</style.NoGoals>
                }

            </style.List>

        </style.Container>



    )
})


// Specifies propTypes
Dashboard.propTypes = {
    onDrop: PropTypes.func,
};

// Specifies the default values for props:
Dashboard.defaultProps = {
    onDrop: () => { logger.log("onDrop Called") },
};



export default Dashboard
