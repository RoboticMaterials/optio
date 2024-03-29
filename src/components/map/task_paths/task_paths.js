import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

// Import Actions
import { setTaskAttributes } from "../../../redux/actions/tasks_actions";
import {
  getLoadPositionId,
  getUnloadPositionId,
} from "../../../methods/utils/route_utils";

export default function TaskPaths(props) {
  const { route } = props;

  const selectedTaskReducer = useSelector(
    (state) => state.tasksReducer.selectedTask
  );
  const selectedHoveringTask = useSelector(
    (state) => state.tasksReducer.selectedHoveringTask
  );
  const positions = useSelector((state) => state.positionsReducer.positions);
  const stations = useSelector((state) => state.stationsReducer.stations);
  const routes = useSelector(state => state.tasksReducer.tasks)
  const dispatch = useDispatch();

  let selectedTask = null;

  
  // This sets the selected task to either whats in the reducer or whats being passed in through props
  // It would be using props because this task path is part of a process
  if (!!route) {
    selectedTask = route;
  } else if (!!selectedHoveringTask) {
    selectedTask = selectedHoveringTask;
  } else {
    selectedTask = selectedTaskReducer;
  }

  const isDirectLoop = useMemo(() => {
    return (!!selectedTask && (Object.values(routes).find(route => (
      selectedTask.load === route.unload && 
      !!selectedTask.unload &&
      selectedTask.unload === route.load
    )) !== undefined))
  }, [selectedTask, routes])


  const stateRef = useRef();
  stateRef.current = selectedTask;

  const loadPositionId = selectedTask?.load;
  const unloadPositionId = selectedTask?.unload;

  const [mousePos] = useState({ x: 0, y: 0 });

  const [x1, setX1] = useState(0);
  const [y1, setY1] = useState(0);
  const [x2, setX2] = useState(null);
  const [y2, setY2] = useState(null);

  // To be able to remove the event listener, we need to reference the same function.
  // Therefore we save the function in the state
  const [lockToMouse] = useState(() => (e) => {
    setX2(e.clientX);
    setY2(e.clientY);
  });

  // A callback that will set the load position to null when you press escape
  const [exitTaskPath] = useState(() => (e) => {
    if (e.key == "Escape") {
      dispatch(setTaskAttributes(stateRef.current._id, { load: null }));
    }
  });

  // Set the start and end position if they exist
  useEffect(() => {
    let loadPositionId, unloadPositionId
    if (!!selectedTask) {
      loadPositionId = getLoadPositionId(selectedTask);
      unloadPositionId = getUnloadPositionId(selectedTask);
    } else {
      loadPositionId = getLoadPositionId(selectedHoveringTask);
      unloadPositionId = getUnloadPositionId(selectedHoveringTask);
    }

    if (selectedTask !== null || selectedHoveringTask !== null) {
      if (loadPositionId !== null) {
        // Check to see if its a station or position
        const startPos = !!positions[loadPositionId]
          ? positions[loadPositionId]
          : stations[loadPositionId];
        if (startPos) {
          setX1(startPos.x);
          setY1(startPos.y);
        }
      }
      if (unloadPositionId !== null) {
        // Check to see if its a station or position
        const endPos = !!positions[unloadPositionId]
          ? positions[unloadPositionId]
          : stations[unloadPositionId];
        if (endPos) {
          setX2(endPos.x);
          setY2(endPos.y);
        }
      }
    }
  });
  
  // If there is a load position but not an unload, set a listener to set the endpoint to the mouse position
  useEffect(() => {
    const loadPositionId = getLoadPositionId(selectedTask);
    const unloadPositionId = getUnloadPositionId(selectedTask);

    window.addEventListener("mousedown", lockToMouse, false);

    if (
      selectedTask !== null &&
      loadPositionId !== null &&
      unloadPositionId === null
    ) {
      setX2(x1);
      setY2(y1);
      window.addEventListener("mousemove", lockToMouse, false);
      window.addEventListener("keydown", exitTaskPath);
    } else {
      window.removeEventListener("mousemove", lockToMouse, false);
      window.removeEventListener("keydown", exitTaskPath);
    }

    return () => {
      window.removeEventListener("mousedown", lockToMouse, false);
      window.removeEventListener("mousemove", lockToMouse, false);
      window.removeEventListener("keydown", exitTaskPath);
    };
  }, [selectedTask]);

  if (selectedTask !== null && loadPositionId != null) {
    let tempX2 = !!x2 ? x2 : x1
    let tempY2 = !!y2 ? y2 : y1
    const lineLen = Math.sqrt(Math.pow(tempX2 - x1, 2) + Math.pow(tempY2 - y1, 2));
    const lineRot = Math.atan2(tempY2 - y1, tempX2 - x1);
    const arrowRot = (lineRot * 180) / Math.PI;

    const dashes = [
      ...Array(Math.ceil(lineLen / (10 * props.d3.scale))).keys(),
    ];

    // Changes the color based on whether it's a selected task or part of a process
    const primaryColor = selectedHoveringTask?._id === route?._id ? 'rgba(56, 235, 135, 0.95)' : 'rgba(255, 182, 46, 0.95)'
    const secondaryColor = selectedHoveringTask?._id === route?._id ? 'rgba(184, 255, 215, 0.7)' : 'rgba(255, 236, 201, 0.7)'
    const dashColor = selectedHoveringTask?._id === route?._id ? 'rgba(56, 235, 135, 0.95)' : 'rgba(255, 182, 47, 0.95)'
    return (
      <>
        <g>
          <defs>
            {/* a transparent glow that takes on the colour of the object it's applied to */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <line
            x1={`${x1}`}
            y1={`${y1}`}
            x2={`${!!x2 ? x2 : x1}`}
            y2={`${!!y2 ? y2 : y1}`}
            strokeWidth={`${props.d3.scale * 8}`}
            stroke={primaryColor}
            strokeLinecap="round"
          />
          <line
            x1={`${x1}`}
            y1={`${y1}`}
            x2={`${!!x2 ? x2 : x1}`}
            y2={`${!!y2 ? y2 : y1}`}
            strokeWidth={`${props.d3.scale * 6}`}
            stroke={secondaryColor}
            strokeLinecap="round"
          />

          {dashes.map((delta) => (
            <g
              key={`arrow-${delta}`}
              transform={`translate(${
                x1 + delta * props.d3.scale * 10 * Math.cos(lineRot)
              } ${y1 + delta * props.d3.scale * 10 * Math.sin(lineRot)})`}
            >
              <g
                viewBox="-50 -50 50 50"
                transform={`rotate(${arrowRot}) scale(${
                  0.05 * props.d3.scale
                })`}
              >
                <polygon points="-40,-50 -40,50 40,0" fill={dashColor} />
              </g>
            </g>
          ))}

          {isDirectLoop && // If there is a route for forward and one for backward, do the arrows both directions
            dashes.slice(1).map((delta) => (
              <g
                key={`arrow-${delta}`}
                transform={`translate(${
                  x1 + (delta-0.5) * props.d3.scale * 10 * Math.cos(lineRot)
                } ${y1 + (delta-0.5) * props.d3.scale * 10 * Math.sin(lineRot)})`}
              >
                <g
                  viewBox="-50 -50 50 50"
                  transform={`rotate(${arrowRot+180}) scale(${
                    0.05 * props.d3.scale
                  })`}
                >
                  <polygon points="-40,-50 -40,50 40,0" fill={dashColor} />
                </g>
              </g>
            ))
          }
        </g>
      </>
    );
  }

  return null;
}
