import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

import * as styled from "./objects_page.style";

// Import Components
import ObjectColumns from "./object_columns/object_columns";

// Import utils
import { handleParseTaskBasedOnLoadUnload } from "../../../../methods/utils/object_utils";

const ObjectsPage = () => {
  const params = useParams();
  const stationID = params.stationID;
  const tasks = useSelector((state) => state.tasksReducer.tasks);

  const [parsedObjects, setParsedObjects] = useState({});

  /**
   * Handle associated objects on page mount
   */
  useEffect(() => {
    handleAssociatedObjects();
  }, []);

  /**
   * Finds all asociated objects for the location
   */
  const handleAssociatedObjects = () => {
    const parsedObjectsReturned = handleParseTaskBasedOnLoadUnload(
      tasks,
      stationID
    );

    setParsedObjects(parsedObjectsReturned);
  };

  return (
    <styled.PageContainer>
      <ObjectColumns parsedObjects={parsedObjects} />
      <p>This'll Be the Objects Page</p>
    </styled.PageContainer>
  );
};

export default ObjectsPage;
