import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";

// Import Styles
import * as styled from "./content_list.style";

// Import Components
import ContentHeader from "../content_header/content_header";
import ContentListItem from "./content_list_item/content_list_item";
import Portal from "../../../../higher_order_components/portal";

// Import Utils
import { deepCopy } from "../../../../methods/utils/utils";

import { isOnlyHumanTask } from "../../../../methods/utils/route_utils";

export default function ContentList(props) {
    const {
        executeTask,
        hideHeader,
        handleCardView,
        elements,
        schema,

        onClick,
        onMouseEnter,
        onMouseLeave,
    } = props;

    const [sortKey, setSortKey] = useState('alphabetic')

    const sortedElements = useMemo(() => {
        let sortedElements = deepCopy(elements)
        switch (sortKey) {
            case 'alphabetic':
                sortedElements.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
                return sortedElements
            case 'created old-new':
                sortedElements.sort((a, b) => a.created_at > b.created_at ? 1 : a.created_at < b.created_at ? -1 : 0)
                return sortedElements
            case 'created new-old':
                sortedElements.sort((a, b) => a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0)
                return sortedElements
            case 'edited old-new':
                sortedElements.sort((a, b) => a.edited_at > b.edited_at ? 1 : a.edited_at < b.edited_at ? -1 : 0)
                return sortedElements
            case 'edited new-old':
                sortedElements.sort((a, b) => a.edited_at < b.edited_at ? 1 : a.edited_at > b.edited_at ? -1 : 0)
                return sortedElements
            default:
                return elements;
        }
    }, [elements, sortKey])

    // console.log(sortedElements.map(e => ({name: e.name, ed: e.edited_at, cr: e.created_at})))

    // const processes = useSelector(state => state.processesReducer.processes)
    // const routes = useSelector(state => state.tasksReducer.tasks)
    // console.log(Object.values(processes)[0].routes.map(routeId => routes[routeId]))

    let taskQueue = useSelector((state) => state.taskQueueReducer.taskQueue);
    const handleIconClick = useMemo(() => {
        switch (schema) {
            case "locations":
                return () => {};
            case "tasks":
                return (inQ) => !inQ && executeTask();
            case "processes":
                return (element) => handleCardView(element);
        }
    }, [schema]);

    const SortToggle = React.forwardRef(({ children, onClick }, ref) => (
        <styled.SortToggle
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
        </styled.SortToggle>
    ));


    return (
        <styled.Container>
            {!hideHeader && (
                <ContentHeader
                    content={props.schema}
                    onClickAdd={props.onPlus}
                />
            )}

            <styled.SortContainer>
                <Dropdown onSelect={e => setSortKey(e)}>
                    <Dropdown.Toggle
                        id="sort-dropdown"
                        className="sort-dropdown-toggle"
                        style={{userSelect: 'none !important', border: 'none !important'}}
                    >
                        Sort
                    </Dropdown.Toggle>

                    <Portal>
                        <Dropdown.Menu style={{zIndex: 10000}} >
                            <Dropdown.Item eventKey="alphabetic">Alphabetical</Dropdown.Item>
                            <Dropdown.Item eventKey="created new-old">Created Date (Newest -> Oldest)</Dropdown.Item>
                            <Dropdown.Item eventKey="created old-new">Created Date (Oldest -> Newest)</Dropdown.Item>
                            <Dropdown.Item eventKey="edited new-old">Last Edited Date (Newest -> Oldest)</Dropdown.Item>
                            <Dropdown.Item eventKey="edited old-new">Last Edited Date (Oldest -> Newest)</Dropdown.Item>
                        </Dropdown.Menu>
                    </Portal>
                </Dropdown>
            </styled.SortContainer>

            <styled.List>
                {sortedElements.map((element, ind) => {
                    const error =
                        props.schema === "processes" && element.broken
                            ? true
                            : false;
                    let inQueue = false;
                    Object.values(taskQueue).forEach((item) => {
                        if (
                            item.task_id == element._id &&
                            props.schema === "tasks"
                        ) {
                            if (
                                isOnlyHumanTask(element) &&
                                element.handoff === true
                            ) {
                                inQueue = false;
                            } else {
                                inQueue = true;
                            }
                        }
                    });

                    return (
                        <ContentListItem
                            id={`content-list-${element._id}`}
                            onIconClick={handleIconClick}
                            onEditClick={onClick}
                            ind={ind}
                            error={error}
                            element={element}
                            schema={schema}
                            inQueue={inQueue}
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                        />
                    );
                })}
            </styled.List>
        </styled.Container>
    );
}
