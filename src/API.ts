/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type TaskQueue = {
  __typename: "TaskQueue",
  id?: string,
  organizationId?: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  device_type?: string,
  mission_status?: string | null,
  owner?: string | null,
  taskId?: string,
  custom_task?: string | null,
  dashboard?: string | null,
  showModal?: boolean | null,
  hil_response?: boolean | null,
  quantity?: number | null,
  lotId?: string | null,
  start_time?: number | null,
  end_time?: number | null,
  hil_station_id?: string | null,
  hil_message?: string | null,
};

export type StationStatsData = {
  __typename: "StationStatsData",
  stationId?: string,
  organizationId?: string,
  date?: string,
  throughPut?: string,
};

export type ReportStatsData = {
  __typename: "ReportStatsData",
  date?: string,
  throughPut?: string,
};

export type MapData = {
  __typename: "MapData",
  posted?: boolean | null,
};

export type CreateUserInput = {
  id?: string | null,
  organizationId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  username: string,
};

export type ModelUserConditionInput = {
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  username?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type User = {
  __typename: "User",
  id?: string,
  organizationId?: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  username?: string,
  organization?: Organization,
  owner?: string | null,
};

export type Organization = {
  __typename: "Organization",
  id?: string,
  organizationId?: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  name?: string,
  key?: string,
  users?: ModelUserConnection,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items?:  Array<User | null > | null,
  nextToken?: string | null,
};

export type UpdateUserInput = {
  id: string,
  organizationId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  username?: string | null,
};

export type DeleteUserInput = {
  id?: string | null,
};

export type CreateOrganizationInput = {
  id?: string | null,
  organizationId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  name: string,
  key: string,
};

export type ModelOrganizationConditionInput = {
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  name?: ModelStringInput | null,
  key?: ModelStringInput | null,
  and?: Array< ModelOrganizationConditionInput | null > | null,
  or?: Array< ModelOrganizationConditionInput | null > | null,
  not?: ModelOrganizationConditionInput | null,
};

export type UpdateOrganizationInput = {
  id: string,
  organizationId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  name?: string | null,
  key?: string | null,
};

export type DeleteOrganizationInput = {
  id?: string | null,
};

export type CreateStationInput = {
  id?: string | null,
  organizationId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  name: string,
  schema: string,
  type: string,
  pos_x?: number | null,
  pos_y?: number | null,
  rotation: number,
  x: number,
  y: number,
  mapId: string,
  children: string,
  dashboards: string,
};

export type ModelStationConditionInput = {
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  name?: ModelStringInput | null,
  schema?: ModelStringInput | null,
  type?: ModelStringInput | null,
  pos_x?: ModelFloatInput | null,
  pos_y?: ModelFloatInput | null,
  rotation?: ModelIntInput | null,
  x?: ModelFloatInput | null,
  y?: ModelFloatInput | null,
  mapId?: ModelStringInput | null,
  children?: ModelStringInput | null,
  dashboards?: ModelStringInput | null,
  and?: Array< ModelStationConditionInput | null > | null,
  or?: Array< ModelStationConditionInput | null > | null,
  not?: ModelStationConditionInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Station = {
  __typename: "Station",
  id?: string,
  organizationId?: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  name?: string,
  schema?: string,
  type?: string,
  pos_x?: number | null,
  pos_y?: number | null,
  rotation?: number,
  x?: number,
  y?: number,
  mapId?: string,
  children?: string,
  dashboards?: string,
};

export type UpdateStationInput = {
  id: string,
  organizationId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  name?: string | null,
  schema?: string | null,
  type?: string | null,
  pos_x?: number | null,
  pos_y?: number | null,
  rotation?: number | null,
  x?: number | null,
  y?: number | null,
  mapId?: string | null,
  children?: string | null,
  dashboards?: string | null,
};

export type DeleteStationInput = {
  id?: string | null,
};

export type CreateStationEventInput = {
  id?: string | null,
  organizationId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  object?: string | null,
  outgoing: boolean,
  quantity: number,
  station: string,
  time: number,
};

export type ModelStationEventConditionInput = {
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  object?: ModelStringInput | null,
  outgoing?: ModelBooleanInput | null,
  quantity?: ModelIntInput | null,
  station?: ModelStringInput | null,
  time?: ModelIntInput | null,
  and?: Array< ModelStationEventConditionInput | null > | null,
  or?: Array< ModelStationEventConditionInput | null > | null,
  not?: ModelStationEventConditionInput | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type StationEvent = {
  __typename: "StationEvent",
  id?: string,
  organizationId?: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  object?: string | null,
  outgoing?: boolean,
  quantity?: number,
  station?: string,
  time?: number,
};

export type UpdateStationEventInput = {
  id: string,
  organizationId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  object?: string | null,
  outgoing?: boolean | null,
  quantity?: number | null,
  station?: string | null,
  time?: number | null,
};

export type DeleteStationEventInput = {
  id?: string | null,
};

export type CreatePositionInput = {
  id?: string | null,
  organizationId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  change_key: string,
  mapId: string,
  name: string,
  parent?: string | null,
  pos_x?: number | null,
  pos_y?: number | null,
  rotation?: number | null,
  schema: string,
  type: string,
  x: number,
  y: number,
};

export type ModelPositionConditionInput = {
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  change_key?: ModelStringInput | null,
  mapId?: ModelStringInput | null,
  name?: ModelStringInput | null,
  parent?: ModelStringInput | null,
  pos_x?: ModelFloatInput | null,
  pos_y?: ModelFloatInput | null,
  rotation?: ModelIntInput | null,
  schema?: ModelStringInput | null,
  type?: ModelStringInput | null,
  x?: ModelIntInput | null,
  y?: ModelIntInput | null,
  and?: Array< ModelPositionConditionInput | null > | null,
  or?: Array< ModelPositionConditionInput | null > | null,
  not?: ModelPositionConditionInput | null,
};

export type Position = {
  __typename: "Position",
  id?: string,
  organizationId?: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  change_key?: string,
  mapId?: string,
  name?: string,
  parent?: string | null,
  pos_x?: number | null,
  pos_y?: number | null,
  rotation?: number | null,
  schema?: string,
  type?: string,
  x?: number,
  y?: number,
};

export type UpdatePositionInput = {
  id: string,
  organizationId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  change_key?: string | null,
  mapId?: string | null,
  name?: string | null,
  parent?: string | null,
  pos_x?: number | null,
  pos_y?: number | null,
  rotation?: number | null,
  schema?: string | null,
  type?: string | null,
  x?: number | null,
  y?: number | null,
};

export type DeletePositionInput = {
  id?: string | null,
};

export type CreateTaskInput = {
  id?: string | null,
  organizationId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  device_types: string,
  handoff: boolean,
  load: string,
  mapId: string,
  name: string,
  processes: string,
  quantity: number,
  track_quantity: boolean,
  type: string,
  unload: string,
  obj: string,
  route_object?: string | null,
};

export type ModelTaskConditionInput = {
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  device_types?: ModelStringInput | null,
  handoff?: ModelBooleanInput | null,
  load?: ModelStringInput | null,
  mapId?: ModelStringInput | null,
  name?: ModelStringInput | null,
  processes?: ModelStringInput | null,
  quantity?: ModelIntInput | null,
  track_quantity?: ModelBooleanInput | null,
  type?: ModelStringInput | null,
  unload?: ModelStringInput | null,
  obj?: ModelStringInput | null,
  route_object?: ModelStringInput | null,
  and?: Array< ModelTaskConditionInput | null > | null,
  or?: Array< ModelTaskConditionInput | null > | null,
  not?: ModelTaskConditionInput | null,
};

export type Task = {
  __typename: "Task",
  id?: string,
  organizationId?: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  device_types?: string,
  handoff?: boolean,
  load?: string,
  mapId?: string,
  name?: string,
  processes?: string,
  quantity?: number,
  track_quantity?: boolean,
  type?: string,
  unload?: string,
  obj?: string,
  route_object?: string | null,
};

export type UpdateTaskInput = {
  id: string,
  organizationId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  device_types?: string | null,
  handoff?: boolean | null,
  load?: string | null,
  mapId?: string | null,
  name?: string | null,
  processes?: string | null,
  quantity?: number | null,
  track_quantity?: boolean | null,
  type?: string | null,
  unload?: string | null,
  obj?: string | null,
  route_object?: string | null,
};

export type DeleteTaskInput = {
  id?: string | null,
};

export type CreateProcessInput = {
  id?: string | null,
  organizationId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  name: string,
  broken: string,
  routes: string,
  mapId?: string | null,
};

export type ModelProcessConditionInput = {
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  name?: ModelStringInput | null,
  broken?: ModelStringInput | null,
  routes?: ModelStringInput | null,
  mapId?: ModelStringInput | null,
  and?: Array< ModelProcessConditionInput | null > | null,
  or?: Array< ModelProcessConditionInput | null > | null,
  not?: ModelProcessConditionInput | null,
};

export type Process = {
  __typename: "Process",
  id?: string,
  organizationId?: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  name?: string,
  broken?: string,
  routes?: string,
  mapId?: string | null,
};

export type UpdateProcessInput = {
  id: string,
  organizationId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  name?: string | null,
  broken?: string | null,
  routes?: string | null,
  mapId?: string | null,
};

export type DeleteProcessInput = {
  id?: string | null,
};

export type CreateObjectInput = {
  id?: string | null,
  organizationId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  description: string,
  mapId: string,
  modelName: string,
  name: string,
  dimensions?: string | null,
  quantity?: string | null,
};

export type ModelObjectConditionInput = {
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  mapId?: ModelStringInput | null,
  modelName?: ModelStringInput | null,
  name?: ModelStringInput | null,
  dimensions?: ModelStringInput | null,
  quantity?: ModelStringInput | null,
  and?: Array< ModelObjectConditionInput | null > | null,
  or?: Array< ModelObjectConditionInput | null > | null,
  not?: ModelObjectConditionInput | null,
};

export type Object = {
  __typename: "Object",
  id?: string,
  organizationId?: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  description?: string,
  mapId?: string,
  modelName?: string,
  name?: string,
  dimensions?: string | null,
  quantity?: string | null,
};

export type UpdateObjectInput = {
  id: string,
  organizationId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  description?: string | null,
  mapId?: string | null,
  modelName?: string | null,
  name?: string | null,
  dimensions?: string | null,
  quantity?: string | null,
};

export type DeleteObjectInput = {
  id?: string | null,
};

export type CreateCardInput = {
  id?: string | null,
  organizationId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  bins: string,
  flags: string,
  templateValues: string,
  lotNumber: number,
  lotTemplateId: string,
  name: string,
  processId: string,
  count?: number | null,
};

export type ModelCardConditionInput = {
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  bins?: ModelStringInput | null,
  flags?: ModelStringInput | null,
  templateValues?: ModelStringInput | null,
  lotNumber?: ModelIntInput | null,
  lotTemplateId?: ModelStringInput | null,
  name?: ModelStringInput | null,
  processId?: ModelStringInput | null,
  count?: ModelIntInput | null,
  and?: Array< ModelCardConditionInput | null > | null,
  or?: Array< ModelCardConditionInput | null > | null,
  not?: ModelCardConditionInput | null,
};

export type Card = {
  __typename: "Card",
  id?: string,
  organizationId?: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  bins?: string,
  flags?: string,
  templateValues?: string,
  lotNumber?: number,
  lotTemplateId?: string,
  name?: string,
  processId?: string,
  count?: number | null,
};

export type UpdateCardInput = {
  id: string,
  organizationId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  bins?: string | null,
  flags?: string | null,
  templateValues?: string | null,
  lotNumber?: number | null,
  lotTemplateId?: string | null,
  name?: string | null,
  processId?: string | null,
  count?: number | null,
};

export type DeleteCardInput = {
  id?: string | null,
};

export type CreateCardEventInput = {
  id?: string | null,
  organizationId: string,
  cardId: string,
  userId?: string | null,
  username?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  delta: string,
};

export type ModelCardEventConditionInput = {
  organizationId?: ModelIDInput | null,
  cardId?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  username?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  delta?: ModelStringInput | null,
  and?: Array< ModelCardEventConditionInput | null > | null,
  or?: Array< ModelCardEventConditionInput | null > | null,
  not?: ModelCardEventConditionInput | null,
};

export type CardEvent = {
  __typename: "CardEvent",
  id?: string,
  organizationId?: string,
  cardId?: string,
  userId?: string | null,
  username?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  delta?: string,
};

export type UpdateCardEventInput = {
  id: string,
  organizationId?: string | null,
  cardId?: string | null,
  userId?: string | null,
  username?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  delta?: string | null,
};

export type DeleteCardEventInput = {
  id?: string | null,
};

export type CreateSettingsInput = {
  id?: string | null,
  organizationId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  MiRMapEnabled?: boolean | null,
  accessToken?: string | null,
  authenticated?: boolean | null,
  currentMapId?: string | null,
  deviceEnabled?: boolean | null,
  loggers?: string | null,
  mapViewEnabled?: boolean | null,
  non_local_api?: boolean | null,
  non_local_api_ip?: string | null,
  refreshToken?: string | null,
  shiftDetails?: string | null,
  toggleDevOptions?: boolean | null,
  timezone?: string | null,
};

export type ModelSettingsConditionInput = {
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  MiRMapEnabled?: ModelBooleanInput | null,
  accessToken?: ModelStringInput | null,
  authenticated?: ModelBooleanInput | null,
  currentMapId?: ModelStringInput | null,
  deviceEnabled?: ModelBooleanInput | null,
  loggers?: ModelStringInput | null,
  mapViewEnabled?: ModelBooleanInput | null,
  non_local_api?: ModelBooleanInput | null,
  non_local_api_ip?: ModelStringInput | null,
  refreshToken?: ModelStringInput | null,
  shiftDetails?: ModelStringInput | null,
  toggleDevOptions?: ModelBooleanInput | null,
  timezone?: ModelStringInput | null,
  and?: Array< ModelSettingsConditionInput | null > | null,
  or?: Array< ModelSettingsConditionInput | null > | null,
  not?: ModelSettingsConditionInput | null,
};

export type Settings = {
  __typename: "Settings",
  id?: string,
  organizationId?: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  MiRMapEnabled?: boolean | null,
  accessToken?: string | null,
  authenticated?: boolean | null,
  currentMapId?: string | null,
  deviceEnabled?: boolean | null,
  loggers?: string | null,
  mapViewEnabled?: boolean | null,
  non_local_api?: boolean | null,
  non_local_api_ip?: string | null,
  refreshToken?: string | null,
  shiftDetails?: string | null,
  toggleDevOptions?: boolean | null,
  timezone?: string | null,
};

export type UpdateSettingsInput = {
  id: string,
  organizationId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  MiRMapEnabled?: boolean | null,
  accessToken?: string | null,
  authenticated?: boolean | null,
  currentMapId?: string | null,
  deviceEnabled?: boolean | null,
  loggers?: string | null,
  mapViewEnabled?: boolean | null,
  non_local_api?: boolean | null,
  non_local_api_ip?: string | null,
  refreshToken?: string | null,
  shiftDetails?: string | null,
  toggleDevOptions?: boolean | null,
  timezone?: string | null,
};

export type DeleteSettingsInput = {
  id?: string | null,
};

export type CreateLotTemplateInput = {
  id?: string | null,
  organizationId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  name: string,
  displayNames: string,
  fields: string,
};

export type ModelLotTemplateConditionInput = {
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  name?: ModelStringInput | null,
  displayNames?: ModelStringInput | null,
  fields?: ModelStringInput | null,
  and?: Array< ModelLotTemplateConditionInput | null > | null,
  or?: Array< ModelLotTemplateConditionInput | null > | null,
  not?: ModelLotTemplateConditionInput | null,
};

export type LotTemplate = {
  __typename: "LotTemplate",
  id?: string,
  organizationId?: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  name?: string,
  displayNames?: string,
  fields?: string,
};

export type UpdateLotTemplateInput = {
  id: string,
  organizationId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  name?: string | null,
  displayNames?: string | null,
  fields?: string | null,
};

export type DeleteLotTemplateInput = {
  id?: string | null,
};

export type CreateDeviceInput = {
  id?: string | null,
  organizationId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  battery_percentage: number,
  connected: boolean,
  current_task_queue_id?: string | null,
  dashboards: string,
  device_model: string,
  device_name: string,
  distance_to_next_target: number,
  idle_location: string,
  mapId: string,
  position: string,
  shelf_attached: number,
  state_text: string,
};

export type ModelDeviceConditionInput = {
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  battery_percentage?: ModelIntInput | null,
  connected?: ModelBooleanInput | null,
  current_task_queue_id?: ModelStringInput | null,
  dashboards?: ModelStringInput | null,
  device_model?: ModelStringInput | null,
  device_name?: ModelStringInput | null,
  distance_to_next_target?: ModelIntInput | null,
  idle_location?: ModelStringInput | null,
  mapId?: ModelStringInput | null,
  position?: ModelStringInput | null,
  shelf_attached?: ModelIntInput | null,
  state_text?: ModelStringInput | null,
  and?: Array< ModelDeviceConditionInput | null > | null,
  or?: Array< ModelDeviceConditionInput | null > | null,
  not?: ModelDeviceConditionInput | null,
};

export type Device = {
  __typename: "Device",
  id?: string,
  organizationId?: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  battery_percentage?: number,
  connected?: boolean,
  current_task_queue_id?: string | null,
  dashboards?: string,
  device_model?: string,
  device_name?: string,
  distance_to_next_target?: number,
  idle_location?: string,
  mapId?: string,
  position?: string,
  shelf_attached?: number,
  state_text?: string,
};

export type UpdateDeviceInput = {
  id: string,
  organizationId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  battery_percentage?: number | null,
  connected?: boolean | null,
  current_task_queue_id?: string | null,
  dashboards?: string | null,
  device_model?: string | null,
  device_name?: string | null,
  distance_to_next_target?: number | null,
  idle_location?: string | null,
  mapId?: string | null,
  position?: string | null,
  shelf_attached?: number | null,
  state_text?: string | null,
};

export type DeleteDeviceInput = {
  id?: string | null,
};

export type CreateStatusInput = {
  id?: string | null,
  organizationId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  active_map?: boolean | null,
  mir_connection?: string | null,
  pause_status?: boolean | null,
};

export type ModelStatusConditionInput = {
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  active_map?: ModelBooleanInput | null,
  mir_connection?: ModelStringInput | null,
  pause_status?: ModelBooleanInput | null,
  and?: Array< ModelStatusConditionInput | null > | null,
  or?: Array< ModelStatusConditionInput | null > | null,
  not?: ModelStatusConditionInput | null,
};

export type Status = {
  __typename: "Status",
  id?: string,
  organizationId?: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  active_map?: boolean | null,
  mir_connection?: string | null,
  pause_status?: boolean | null,
};

export type UpdateStatusInput = {
  id: string,
  organizationId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  active_map?: boolean | null,
  mir_connection?: string | null,
  pause_status?: boolean | null,
};

export type DeleteStatusInput = {
  id?: string | null,
};

export type CreateTaskQueueInput = {
  id?: string | null,
  organizationId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  device_type: string,
  mission_status?: string | null,
  owner?: string | null,
  taskId: string,
  custom_task?: string | null,
  dashboard?: string | null,
  showModal?: boolean | null,
  hil_response?: boolean | null,
  quantity?: number | null,
  lotId?: string | null,
  start_time?: number | null,
  end_time?: number | null,
  hil_station_id?: string | null,
  hil_message?: string | null,
};

export type ModelTaskQueueConditionInput = {
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  device_type?: ModelStringInput | null,
  mission_status?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  taskId?: ModelStringInput | null,
  custom_task?: ModelStringInput | null,
  dashboard?: ModelStringInput | null,
  showModal?: ModelBooleanInput | null,
  hil_response?: ModelBooleanInput | null,
  quantity?: ModelIntInput | null,
  lotId?: ModelStringInput | null,
  start_time?: ModelIntInput | null,
  end_time?: ModelIntInput | null,
  hil_station_id?: ModelStringInput | null,
  hil_message?: ModelStringInput | null,
  and?: Array< ModelTaskQueueConditionInput | null > | null,
  or?: Array< ModelTaskQueueConditionInput | null > | null,
  not?: ModelTaskQueueConditionInput | null,
};

export type UpdateTaskQueueInput = {
  id: string,
  organizationId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  device_type?: string | null,
  mission_status?: string | null,
  owner?: string | null,
  taskId?: string | null,
  custom_task?: string | null,
  dashboard?: string | null,
  showModal?: boolean | null,
  hil_response?: boolean | null,
  quantity?: number | null,
  lotId?: string | null,
  start_time?: number | null,
  end_time?: number | null,
  hil_station_id?: string | null,
  hil_message?: string | null,
};

export type DeleteTaskQueueInput = {
  id?: string | null,
};

export type CreateTaskQueueEventsInput = {
  id?: string | null,
  organizationId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  device_type: string,
  mission_status?: string | null,
  owner?: string | null,
  taskId: string,
  custom_task?: string | null,
  dashboard?: string | null,
  showModal?: boolean | null,
  hil_response?: boolean | null,
  quantity?: number | null,
  lotId?: string | null,
  start_time?: number | null,
  end_time?: number | null,
  hil_station_id?: string | null,
  hil_message?: string | null,
};

export type ModelTaskQueueEventsConditionInput = {
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  device_type?: ModelStringInput | null,
  mission_status?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  taskId?: ModelStringInput | null,
  custom_task?: ModelStringInput | null,
  dashboard?: ModelStringInput | null,
  showModal?: ModelBooleanInput | null,
  hil_response?: ModelBooleanInput | null,
  quantity?: ModelIntInput | null,
  lotId?: ModelStringInput | null,
  start_time?: ModelIntInput | null,
  end_time?: ModelIntInput | null,
  hil_station_id?: ModelStringInput | null,
  hil_message?: ModelStringInput | null,
  and?: Array< ModelTaskQueueEventsConditionInput | null > | null,
  or?: Array< ModelTaskQueueEventsConditionInput | null > | null,
  not?: ModelTaskQueueEventsConditionInput | null,
};

export type TaskQueueEvents = {
  __typename: "TaskQueueEvents",
  id?: string,
  organizationId?: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  device_type?: string,
  mission_status?: string | null,
  owner?: string | null,
  taskId?: string,
  custom_task?: string | null,
  dashboard?: string | null,
  showModal?: boolean | null,
  hil_response?: boolean | null,
  quantity?: number | null,
  lotId?: string | null,
  start_time?: number | null,
  end_time?: number | null,
  hil_station_id?: string | null,
  hil_message?: string | null,
};

export type UpdateTaskQueueEventsInput = {
  id: string,
  organizationId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  device_type?: string | null,
  mission_status?: string | null,
  owner?: string | null,
  taskId?: string | null,
  custom_task?: string | null,
  dashboard?: string | null,
  showModal?: boolean | null,
  hil_response?: boolean | null,
  quantity?: number | null,
  lotId?: string | null,
  start_time?: number | null,
  end_time?: number | null,
  hil_station_id?: string | null,
  hil_message?: string | null,
};

export type DeleteTaskQueueEventsInput = {
  id?: string | null,
};

export type CreateDashboardInput = {
  id?: string | null,
  organizationId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  data: string,
};

export type ModelDashboardConditionInput = {
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  data?: ModelStringInput | null,
  and?: Array< ModelDashboardConditionInput | null > | null,
  or?: Array< ModelDashboardConditionInput | null > | null,
  not?: ModelDashboardConditionInput | null,
};

export type Dashboard = {
  __typename: "Dashboard",
  id?: string,
  organizationId?: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  data?: string,
};

export type UpdateDashboardInput = {
  id: string,
  organizationId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  data?: string | null,
};

export type DeleteDashboardInput = {
  id?: string | null,
};

export type CreateMapInput = {
  id?: string | null,
  organizationId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  allowed_methods?: string | null,
  created_by?: string | null,
  created_by_id?: string | null,
  created_by_name?: string | null,
  map: string,
  name?: string | null,
  one_way_map?: string | null,
  origin_theta?: number | null,
  origin_x?: number | null,
  origin_y?: number | null,
  path_guides?: string | null,
  paths?: string | null,
  positions?: string | null,
  resolution?: number | null,
  session_id?: string | null,
};

export type ModelMapConditionInput = {
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  allowed_methods?: ModelStringInput | null,
  created_by?: ModelStringInput | null,
  created_by_id?: ModelStringInput | null,
  created_by_name?: ModelStringInput | null,
  map?: ModelStringInput | null,
  name?: ModelStringInput | null,
  one_way_map?: ModelStringInput | null,
  origin_theta?: ModelIntInput | null,
  origin_x?: ModelIntInput | null,
  origin_y?: ModelIntInput | null,
  path_guides?: ModelStringInput | null,
  paths?: ModelStringInput | null,
  positions?: ModelStringInput | null,
  resolution?: ModelFloatInput | null,
  session_id?: ModelStringInput | null,
  and?: Array< ModelMapConditionInput | null > | null,
  or?: Array< ModelMapConditionInput | null > | null,
  not?: ModelMapConditionInput | null,
};

export type Map = {
  __typename: "Map",
  id?: string,
  organizationId?: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  allowed_methods?: string | null,
  created_by?: string | null,
  created_by_id?: string | null,
  created_by_name?: string | null,
  map?: string,
  name?: string | null,
  one_way_map?: string | null,
  origin_theta?: number | null,
  origin_x?: number | null,
  origin_y?: number | null,
  path_guides?: string | null,
  paths?: string | null,
  positions?: string | null,
  resolution?: number | null,
  session_id?: string | null,
};

export type UpdateMapInput = {
  id: string,
  organizationId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  allowed_methods?: string | null,
  created_by?: string | null,
  created_by_id?: string | null,
  created_by_name?: string | null,
  map?: string | null,
  name?: string | null,
  one_way_map?: string | null,
  origin_theta?: number | null,
  origin_x?: number | null,
  origin_y?: number | null,
  path_guides?: string | null,
  paths?: string | null,
  positions?: string | null,
  resolution?: number | null,
  session_id?: string | null,
};

export type DeleteMapInput = {
  id?: string | null,
};

export type CreateReportEventInput = {
  id?: string | null,
  organizationId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  dashboardId: string,
  date: number,
  reportButtonId: string,
  stationId: string,
};

export type ModelReportEventConditionInput = {
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  dashboardId?: ModelStringInput | null,
  date?: ModelIntInput | null,
  reportButtonId?: ModelStringInput | null,
  stationId?: ModelStringInput | null,
  and?: Array< ModelReportEventConditionInput | null > | null,
  or?: Array< ModelReportEventConditionInput | null > | null,
  not?: ModelReportEventConditionInput | null,
};

export type ReportEvent = {
  __typename: "ReportEvent",
  id?: string,
  organizationId?: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  dashboardId?: string,
  date?: number,
  reportButtonId?: string,
  stationId?: string,
};

export type UpdateReportEventInput = {
  id: string,
  organizationId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  dashboardId?: string | null,
  date?: number | null,
  reportButtonId?: string | null,
  stationId?: string | null,
};

export type DeleteReportEventInput = {
  id?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  username?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelOrganizationFilterInput = {
  id?: ModelIDInput | null,
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  name?: ModelStringInput | null,
  key?: ModelStringInput | null,
  and?: Array< ModelOrganizationFilterInput | null > | null,
  or?: Array< ModelOrganizationFilterInput | null > | null,
  not?: ModelOrganizationFilterInput | null,
};

export type ModelOrganizationConnection = {
  __typename: "ModelOrganizationConnection",
  items?:  Array<Organization | null > | null,
  nextToken?: string | null,
};

export type ModelStationFilterInput = {
  id?: ModelIDInput | null,
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  name?: ModelStringInput | null,
  schema?: ModelStringInput | null,
  type?: ModelStringInput | null,
  pos_x?: ModelFloatInput | null,
  pos_y?: ModelFloatInput | null,
  rotation?: ModelIntInput | null,
  x?: ModelFloatInput | null,
  y?: ModelFloatInput | null,
  mapId?: ModelStringInput | null,
  children?: ModelStringInput | null,
  dashboards?: ModelStringInput | null,
  and?: Array< ModelStationFilterInput | null > | null,
  or?: Array< ModelStationFilterInput | null > | null,
  not?: ModelStationFilterInput | null,
};

export type ModelStationConnection = {
  __typename: "ModelStationConnection",
  items?:  Array<Station | null > | null,
  nextToken?: string | null,
};

export type ModelStationEventFilterInput = {
  id?: ModelIDInput | null,
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  object?: ModelStringInput | null,
  outgoing?: ModelBooleanInput | null,
  quantity?: ModelIntInput | null,
  station?: ModelStringInput | null,
  time?: ModelIntInput | null,
  and?: Array< ModelStationEventFilterInput | null > | null,
  or?: Array< ModelStationEventFilterInput | null > | null,
  not?: ModelStationEventFilterInput | null,
};

export type ModelStationEventConnection = {
  __typename: "ModelStationEventConnection",
  items?:  Array<StationEvent | null > | null,
  nextToken?: string | null,
};

export type ModelPositionFilterInput = {
  id?: ModelIDInput | null,
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  change_key?: ModelStringInput | null,
  mapId?: ModelStringInput | null,
  name?: ModelStringInput | null,
  parent?: ModelStringInput | null,
  pos_x?: ModelFloatInput | null,
  pos_y?: ModelFloatInput | null,
  rotation?: ModelIntInput | null,
  schema?: ModelStringInput | null,
  type?: ModelStringInput | null,
  x?: ModelIntInput | null,
  y?: ModelIntInput | null,
  and?: Array< ModelPositionFilterInput | null > | null,
  or?: Array< ModelPositionFilterInput | null > | null,
  not?: ModelPositionFilterInput | null,
};

export type ModelPositionConnection = {
  __typename: "ModelPositionConnection",
  items?:  Array<Position | null > | null,
  nextToken?: string | null,
};

export type ModelTaskFilterInput = {
  id?: ModelIDInput | null,
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  device_types?: ModelStringInput | null,
  handoff?: ModelBooleanInput | null,
  load?: ModelStringInput | null,
  mapId?: ModelStringInput | null,
  name?: ModelStringInput | null,
  processes?: ModelStringInput | null,
  quantity?: ModelIntInput | null,
  track_quantity?: ModelBooleanInput | null,
  type?: ModelStringInput | null,
  unload?: ModelStringInput | null,
  obj?: ModelStringInput | null,
  route_object?: ModelStringInput | null,
  and?: Array< ModelTaskFilterInput | null > | null,
  or?: Array< ModelTaskFilterInput | null > | null,
  not?: ModelTaskFilterInput | null,
};

export type ModelTaskConnection = {
  __typename: "ModelTaskConnection",
  items?:  Array<Task | null > | null,
  nextToken?: string | null,
};

export type ModelProcessFilterInput = {
  id?: ModelIDInput | null,
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  name?: ModelStringInput | null,
  broken?: ModelStringInput | null,
  routes?: ModelStringInput | null,
  mapId?: ModelStringInput | null,
  and?: Array< ModelProcessFilterInput | null > | null,
  or?: Array< ModelProcessFilterInput | null > | null,
  not?: ModelProcessFilterInput | null,
};

export type ModelProcessConnection = {
  __typename: "ModelProcessConnection",
  items?:  Array<Process | null > | null,
  nextToken?: string | null,
};

export type ModelObjectFilterInput = {
  id?: ModelIDInput | null,
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  description?: ModelStringInput | null,
  mapId?: ModelStringInput | null,
  modelName?: ModelStringInput | null,
  name?: ModelStringInput | null,
  dimensions?: ModelStringInput | null,
  quantity?: ModelStringInput | null,
  and?: Array< ModelObjectFilterInput | null > | null,
  or?: Array< ModelObjectFilterInput | null > | null,
  not?: ModelObjectFilterInput | null,
};

export type ModelObjectConnection = {
  __typename: "ModelObjectConnection",
  items?:  Array<Object | null > | null,
  nextToken?: string | null,
};

export type ModelCardFilterInput = {
  id?: ModelIDInput | null,
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  bins?: ModelStringInput | null,
  flags?: ModelStringInput | null,
  templateValues?: ModelStringInput | null,
  lotNumber?: ModelIntInput | null,
  lotTemplateId?: ModelStringInput | null,
  name?: ModelStringInput | null,
  processId?: ModelStringInput | null,
  count?: ModelIntInput | null,
  and?: Array< ModelCardFilterInput | null > | null,
  or?: Array< ModelCardFilterInput | null > | null,
  not?: ModelCardFilterInput | null,
};

export type ModelCardConnection = {
  __typename: "ModelCardConnection",
  items?:  Array<Card | null > | null,
  nextToken?: string | null,
};

export type ModelCardEventFilterInput = {
  id?: ModelIDInput | null,
  organizationId?: ModelIDInput | null,
  cardId?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  username?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  delta?: ModelStringInput | null,
  and?: Array< ModelCardEventFilterInput | null > | null,
  or?: Array< ModelCardEventFilterInput | null > | null,
  not?: ModelCardEventFilterInput | null,
};

export type ModelCardEventConnection = {
  __typename: "ModelCardEventConnection",
  items?:  Array<CardEvent | null > | null,
  nextToken?: string | null,
};

export type ModelSettingsFilterInput = {
  id?: ModelIDInput | null,
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  MiRMapEnabled?: ModelBooleanInput | null,
  accessToken?: ModelStringInput | null,
  authenticated?: ModelBooleanInput | null,
  currentMapId?: ModelStringInput | null,
  deviceEnabled?: ModelBooleanInput | null,
  loggers?: ModelStringInput | null,
  mapViewEnabled?: ModelBooleanInput | null,
  non_local_api?: ModelBooleanInput | null,
  non_local_api_ip?: ModelStringInput | null,
  refreshToken?: ModelStringInput | null,
  shiftDetails?: ModelStringInput | null,
  toggleDevOptions?: ModelBooleanInput | null,
  timezone?: ModelStringInput | null,
  and?: Array< ModelSettingsFilterInput | null > | null,
  or?: Array< ModelSettingsFilterInput | null > | null,
  not?: ModelSettingsFilterInput | null,
};

export type ModelSettingsConnection = {
  __typename: "ModelSettingsConnection",
  items?:  Array<Settings | null > | null,
  nextToken?: string | null,
};

export type ModelLotTemplateFilterInput = {
  id?: ModelIDInput | null,
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  name?: ModelStringInput | null,
  displayNames?: ModelStringInput | null,
  fields?: ModelStringInput | null,
  and?: Array< ModelLotTemplateFilterInput | null > | null,
  or?: Array< ModelLotTemplateFilterInput | null > | null,
  not?: ModelLotTemplateFilterInput | null,
};

export type ModelLotTemplateConnection = {
  __typename: "ModelLotTemplateConnection",
  items?:  Array<LotTemplate | null > | null,
  nextToken?: string | null,
};

export type ModelDeviceFilterInput = {
  id?: ModelIDInput | null,
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  battery_percentage?: ModelIntInput | null,
  connected?: ModelBooleanInput | null,
  current_task_queue_id?: ModelStringInput | null,
  dashboards?: ModelStringInput | null,
  device_model?: ModelStringInput | null,
  device_name?: ModelStringInput | null,
  distance_to_next_target?: ModelIntInput | null,
  idle_location?: ModelStringInput | null,
  mapId?: ModelStringInput | null,
  position?: ModelStringInput | null,
  shelf_attached?: ModelIntInput | null,
  state_text?: ModelStringInput | null,
  and?: Array< ModelDeviceFilterInput | null > | null,
  or?: Array< ModelDeviceFilterInput | null > | null,
  not?: ModelDeviceFilterInput | null,
};

export type ModelDeviceConnection = {
  __typename: "ModelDeviceConnection",
  items?:  Array<Device | null > | null,
  nextToken?: string | null,
};

export type ModelStatusFilterInput = {
  id?: ModelIDInput | null,
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  active_map?: ModelBooleanInput | null,
  mir_connection?: ModelStringInput | null,
  pause_status?: ModelBooleanInput | null,
  and?: Array< ModelStatusFilterInput | null > | null,
  or?: Array< ModelStatusFilterInput | null > | null,
  not?: ModelStatusFilterInput | null,
};

export type ModelStatusConnection = {
  __typename: "ModelStatusConnection",
  items?:  Array<Status | null > | null,
  nextToken?: string | null,
};

export type ModelTaskQueueFilterInput = {
  id?: ModelIDInput | null,
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  device_type?: ModelStringInput | null,
  mission_status?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  taskId?: ModelStringInput | null,
  custom_task?: ModelStringInput | null,
  dashboard?: ModelStringInput | null,
  showModal?: ModelBooleanInput | null,
  hil_response?: ModelBooleanInput | null,
  quantity?: ModelIntInput | null,
  lotId?: ModelStringInput | null,
  start_time?: ModelIntInput | null,
  end_time?: ModelIntInput | null,
  hil_station_id?: ModelStringInput | null,
  hil_message?: ModelStringInput | null,
  and?: Array< ModelTaskQueueFilterInput | null > | null,
  or?: Array< ModelTaskQueueFilterInput | null > | null,
  not?: ModelTaskQueueFilterInput | null,
};

export type ModelTaskQueueConnection = {
  __typename: "ModelTaskQueueConnection",
  items?:  Array<TaskQueue | null > | null,
  nextToken?: string | null,
};

export type ModelDashboardFilterInput = {
  id?: ModelIDInput | null,
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  data?: ModelStringInput | null,
  and?: Array< ModelDashboardFilterInput | null > | null,
  or?: Array< ModelDashboardFilterInput | null > | null,
  not?: ModelDashboardFilterInput | null,
};

export type ModelDashboardConnection = {
  __typename: "ModelDashboardConnection",
  items?:  Array<Dashboard | null > | null,
  nextToken?: string | null,
};

export type ModelMapFilterInput = {
  id?: ModelIDInput | null,
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  allowed_methods?: ModelStringInput | null,
  created_by?: ModelStringInput | null,
  created_by_id?: ModelStringInput | null,
  created_by_name?: ModelStringInput | null,
  map?: ModelStringInput | null,
  name?: ModelStringInput | null,
  one_way_map?: ModelStringInput | null,
  origin_theta?: ModelIntInput | null,
  origin_x?: ModelIntInput | null,
  origin_y?: ModelIntInput | null,
  path_guides?: ModelStringInput | null,
  paths?: ModelStringInput | null,
  positions?: ModelStringInput | null,
  resolution?: ModelFloatInput | null,
  session_id?: ModelStringInput | null,
  and?: Array< ModelMapFilterInput | null > | null,
  or?: Array< ModelMapFilterInput | null > | null,
  not?: ModelMapFilterInput | null,
};

export type ModelMapConnection = {
  __typename: "ModelMapConnection",
  items?:  Array<Map | null > | null,
  nextToken?: string | null,
};

export type ModelReportEventFilterInput = {
  id?: ModelIDInput | null,
  organizationId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  dashboardId?: ModelStringInput | null,
  date?: ModelIntInput | null,
  reportButtonId?: ModelStringInput | null,
  stationId?: ModelStringInput | null,
  and?: Array< ModelReportEventFilterInput | null > | null,
  or?: Array< ModelReportEventFilterInput | null > | null,
  not?: ModelReportEventFilterInput | null,
};

export type ModelReportEventConnection = {
  __typename: "ModelReportEventConnection",
  items?:  Array<ReportEvent | null > | null,
  nextToken?: string | null,
};

export type ManageTaskQueueMutationVariables = {
  taskQueueItem?: string,
};

export type ManageTaskQueueMutation = {
  manageTaskQueue?:  {
    __typename: "TaskQueue",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_type: string,
    mission_status?: string | null,
    owner?: string | null,
    taskId: string,
    custom_task?: string | null,
    dashboard?: string | null,
    showModal?: boolean | null,
    hil_response?: boolean | null,
    quantity?: number | null,
    lotId?: string | null,
    start_time?: number | null,
    end_time?: number | null,
    hil_station_id?: string | null,
    hil_message?: string | null,
  } | null,
};

export type TaskStatsMutationVariables = {
  taskId?: string | null,
  organizationId?: string,
};

export type TaskStatsMutation = {
  taskStats?:  {
    __typename: "TaskQueue",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_type: string,
    mission_status?: string | null,
    owner?: string | null,
    taskId: string,
    custom_task?: string | null,
    dashboard?: string | null,
    showModal?: boolean | null,
    hil_response?: boolean | null,
    quantity?: number | null,
    lotId?: string | null,
    start_time?: number | null,
    end_time?: number | null,
    hil_station_id?: string | null,
    hil_message?: string | null,
  } | null,
};

export type StationStatsMutationVariables = {
  stationId?: string,
  timeSpan?: string,
  index?: number,
  sortKey?: string | null,
};

export type StationStatsMutation = {
  stationStats?:  {
    __typename: "StationStatsData",
    stationId: string,
    organizationId: string,
    date: string,
    throughPut: string,
  } | null,
};

export type ReportStatsMutationVariables = {
  stationId?: string,
  timeSpan?: string,
  index?: number,
};

export type ReportStatsMutation = {
  reportStats?:  {
    __typename: "ReportStatsData",
    date: string,
    throughPut: string,
  } | null,
};

export type CreateBlankMapMutationVariables = {
  organizationId?: string,
};

export type CreateBlankMapMutation = {
  createBlankMap?:  {
    __typename: "MapData",
    posted?: boolean | null,
  } | null,
};

export type CreateUserMutationVariables = {
  input?: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    username: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      name: string,
      key: string,
    } | null,
    owner?: string | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  input?: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    username: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      name: string,
      key: string,
    } | null,
    owner?: string | null,
  } | null,
};

export type DeleteUserMutationVariables = {
  input?: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    username: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      name: string,
      key: string,
    } | null,
    owner?: string | null,
  } | null,
};

export type CreateOrganizationMutationVariables = {
  input?: CreateOrganizationInput,
  condition?: ModelOrganizationConditionInput | null,
};

export type CreateOrganizationMutation = {
  createOrganization?:  {
    __typename: "Organization",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    key: string,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type UpdateOrganizationMutationVariables = {
  input?: UpdateOrganizationInput,
  condition?: ModelOrganizationConditionInput | null,
};

export type UpdateOrganizationMutation = {
  updateOrganization?:  {
    __typename: "Organization",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    key: string,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type DeleteOrganizationMutationVariables = {
  input?: DeleteOrganizationInput,
  condition?: ModelOrganizationConditionInput | null,
};

export type DeleteOrganizationMutation = {
  deleteOrganization?:  {
    __typename: "Organization",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    key: string,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type CreateStationMutationVariables = {
  input?: CreateStationInput,
  condition?: ModelStationConditionInput | null,
};

export type CreateStationMutation = {
  createStation?:  {
    __typename: "Station",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    schema: string,
    type: string,
    pos_x?: number | null,
    pos_y?: number | null,
    rotation: number,
    x: number,
    y: number,
    mapId: string,
    children: string,
    dashboards: string,
  } | null,
};

export type UpdateStationMutationVariables = {
  input?: UpdateStationInput,
  condition?: ModelStationConditionInput | null,
};

export type UpdateStationMutation = {
  updateStation?:  {
    __typename: "Station",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    schema: string,
    type: string,
    pos_x?: number | null,
    pos_y?: number | null,
    rotation: number,
    x: number,
    y: number,
    mapId: string,
    children: string,
    dashboards: string,
  } | null,
};

export type DeleteStationMutationVariables = {
  input?: DeleteStationInput,
  condition?: ModelStationConditionInput | null,
};

export type DeleteStationMutation = {
  deleteStation?:  {
    __typename: "Station",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    schema: string,
    type: string,
    pos_x?: number | null,
    pos_y?: number | null,
    rotation: number,
    x: number,
    y: number,
    mapId: string,
    children: string,
    dashboards: string,
  } | null,
};

export type CreateStationEventMutationVariables = {
  input?: CreateStationEventInput,
  condition?: ModelStationEventConditionInput | null,
};

export type CreateStationEventMutation = {
  createStationEvent?:  {
    __typename: "StationEvent",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    object?: string | null,
    outgoing: boolean,
    quantity: number,
    station: string,
    time: number,
  } | null,
};

export type UpdateStationEventMutationVariables = {
  input?: UpdateStationEventInput,
  condition?: ModelStationEventConditionInput | null,
};

export type UpdateStationEventMutation = {
  updateStationEvent?:  {
    __typename: "StationEvent",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    object?: string | null,
    outgoing: boolean,
    quantity: number,
    station: string,
    time: number,
  } | null,
};

export type DeleteStationEventMutationVariables = {
  input?: DeleteStationEventInput,
  condition?: ModelStationEventConditionInput | null,
};

export type DeleteStationEventMutation = {
  deleteStationEvent?:  {
    __typename: "StationEvent",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    object?: string | null,
    outgoing: boolean,
    quantity: number,
    station: string,
    time: number,
  } | null,
};

export type CreatePositionMutationVariables = {
  input?: CreatePositionInput,
  condition?: ModelPositionConditionInput | null,
};

export type CreatePositionMutation = {
  createPosition?:  {
    __typename: "Position",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    change_key: string,
    mapId: string,
    name: string,
    parent?: string | null,
    pos_x?: number | null,
    pos_y?: number | null,
    rotation?: number | null,
    schema: string,
    type: string,
    x: number,
    y: number,
  } | null,
};

export type UpdatePositionMutationVariables = {
  input?: UpdatePositionInput,
  condition?: ModelPositionConditionInput | null,
};

export type UpdatePositionMutation = {
  updatePosition?:  {
    __typename: "Position",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    change_key: string,
    mapId: string,
    name: string,
    parent?: string | null,
    pos_x?: number | null,
    pos_y?: number | null,
    rotation?: number | null,
    schema: string,
    type: string,
    x: number,
    y: number,
  } | null,
};

export type DeletePositionMutationVariables = {
  input?: DeletePositionInput,
  condition?: ModelPositionConditionInput | null,
};

export type DeletePositionMutation = {
  deletePosition?:  {
    __typename: "Position",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    change_key: string,
    mapId: string,
    name: string,
    parent?: string | null,
    pos_x?: number | null,
    pos_y?: number | null,
    rotation?: number | null,
    schema: string,
    type: string,
    x: number,
    y: number,
  } | null,
};

export type CreateTaskMutationVariables = {
  input?: CreateTaskInput,
  condition?: ModelTaskConditionInput | null,
};

export type CreateTaskMutation = {
  createTask?:  {
    __typename: "Task",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_types: string,
    handoff: boolean,
    load: string,
    mapId: string,
    name: string,
    processes: string,
    quantity: number,
    track_quantity: boolean,
    type: string,
    unload: string,
    obj: string,
    route_object?: string | null,
  } | null,
};

export type UpdateTaskMutationVariables = {
  input?: UpdateTaskInput,
  condition?: ModelTaskConditionInput | null,
};

export type UpdateTaskMutation = {
  updateTask?:  {
    __typename: "Task",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_types: string,
    handoff: boolean,
    load: string,
    mapId: string,
    name: string,
    processes: string,
    quantity: number,
    track_quantity: boolean,
    type: string,
    unload: string,
    obj: string,
    route_object?: string | null,
  } | null,
};

export type DeleteTaskMutationVariables = {
  input?: DeleteTaskInput,
  condition?: ModelTaskConditionInput | null,
};

export type DeleteTaskMutation = {
  deleteTask?:  {
    __typename: "Task",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_types: string,
    handoff: boolean,
    load: string,
    mapId: string,
    name: string,
    processes: string,
    quantity: number,
    track_quantity: boolean,
    type: string,
    unload: string,
    obj: string,
    route_object?: string | null,
  } | null,
};

export type CreateProcessMutationVariables = {
  input?: CreateProcessInput,
  condition?: ModelProcessConditionInput | null,
};

export type CreateProcessMutation = {
  createProcess?:  {
    __typename: "Process",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    broken: string,
    routes: string,
    mapId?: string | null,
  } | null,
};

export type UpdateProcessMutationVariables = {
  input?: UpdateProcessInput,
  condition?: ModelProcessConditionInput | null,
};

export type UpdateProcessMutation = {
  updateProcess?:  {
    __typename: "Process",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    broken: string,
    routes: string,
    mapId?: string | null,
  } | null,
};

export type DeleteProcessMutationVariables = {
  input?: DeleteProcessInput,
  condition?: ModelProcessConditionInput | null,
};

export type DeleteProcessMutation = {
  deleteProcess?:  {
    __typename: "Process",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    broken: string,
    routes: string,
    mapId?: string | null,
  } | null,
};

export type CreateObjectMutationVariables = {
  input?: CreateObjectInput,
  condition?: ModelObjectConditionInput | null,
};

export type CreateObjectMutation = {
  createObject?:  {
    __typename: "Object",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    description: string,
    mapId: string,
    modelName: string,
    name: string,
    dimensions?: string | null,
    quantity?: string | null,
  } | null,
};

export type UpdateObjectMutationVariables = {
  input?: UpdateObjectInput,
  condition?: ModelObjectConditionInput | null,
};

export type UpdateObjectMutation = {
  updateObject?:  {
    __typename: "Object",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    description: string,
    mapId: string,
    modelName: string,
    name: string,
    dimensions?: string | null,
    quantity?: string | null,
  } | null,
};

export type DeleteObjectMutationVariables = {
  input?: DeleteObjectInput,
  condition?: ModelObjectConditionInput | null,
};

export type DeleteObjectMutation = {
  deleteObject?:  {
    __typename: "Object",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    description: string,
    mapId: string,
    modelName: string,
    name: string,
    dimensions?: string | null,
    quantity?: string | null,
  } | null,
};

export type CreateCardMutationVariables = {
  input?: CreateCardInput,
  condition?: ModelCardConditionInput | null,
};

export type CreateCardMutation = {
  createCard?:  {
    __typename: "Card",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    bins: string,
    flags: string,
    templateValues: string,
    lotNumber: number,
    lotTemplateId: string,
    name: string,
    processId: string,
    count?: number | null,
  } | null,
};

export type UpdateCardMutationVariables = {
  input?: UpdateCardInput,
  condition?: ModelCardConditionInput | null,
};

export type UpdateCardMutation = {
  updateCard?:  {
    __typename: "Card",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    bins: string,
    flags: string,
    templateValues: string,
    lotNumber: number,
    lotTemplateId: string,
    name: string,
    processId: string,
    count?: number | null,
  } | null,
};

export type DeleteCardMutationVariables = {
  input?: DeleteCardInput,
  condition?: ModelCardConditionInput | null,
};

export type DeleteCardMutation = {
  deleteCard?:  {
    __typename: "Card",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    bins: string,
    flags: string,
    templateValues: string,
    lotNumber: number,
    lotTemplateId: string,
    name: string,
    processId: string,
    count?: number | null,
  } | null,
};

export type CreateCardEventMutationVariables = {
  input?: CreateCardEventInput,
  condition?: ModelCardEventConditionInput | null,
};

export type CreateCardEventMutation = {
  createCardEvent?:  {
    __typename: "CardEvent",
    id: string,
    organizationId: string,
    cardId: string,
    userId?: string | null,
    username?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    delta: string,
  } | null,
};

export type UpdateCardEventMutationVariables = {
  input?: UpdateCardEventInput,
  condition?: ModelCardEventConditionInput | null,
};

export type UpdateCardEventMutation = {
  updateCardEvent?:  {
    __typename: "CardEvent",
    id: string,
    organizationId: string,
    cardId: string,
    userId?: string | null,
    username?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    delta: string,
  } | null,
};

export type DeleteCardEventMutationVariables = {
  input?: DeleteCardEventInput,
  condition?: ModelCardEventConditionInput | null,
};

export type DeleteCardEventMutation = {
  deleteCardEvent?:  {
    __typename: "CardEvent",
    id: string,
    organizationId: string,
    cardId: string,
    userId?: string | null,
    username?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    delta: string,
  } | null,
};

export type CreateSettingsMutationVariables = {
  input?: CreateSettingsInput,
  condition?: ModelSettingsConditionInput | null,
};

export type CreateSettingsMutation = {
  createSettings?:  {
    __typename: "Settings",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    MiRMapEnabled?: boolean | null,
    accessToken?: string | null,
    authenticated?: boolean | null,
    currentMapId?: string | null,
    deviceEnabled?: boolean | null,
    loggers?: string | null,
    mapViewEnabled?: boolean | null,
    non_local_api?: boolean | null,
    non_local_api_ip?: string | null,
    refreshToken?: string | null,
    shiftDetails?: string | null,
    toggleDevOptions?: boolean | null,
    timezone?: string | null,
  } | null,
};

export type UpdateSettingsMutationVariables = {
  input?: UpdateSettingsInput,
  condition?: ModelSettingsConditionInput | null,
};

export type UpdateSettingsMutation = {
  updateSettings?:  {
    __typename: "Settings",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    MiRMapEnabled?: boolean | null,
    accessToken?: string | null,
    authenticated?: boolean | null,
    currentMapId?: string | null,
    deviceEnabled?: boolean | null,
    loggers?: string | null,
    mapViewEnabled?: boolean | null,
    non_local_api?: boolean | null,
    non_local_api_ip?: string | null,
    refreshToken?: string | null,
    shiftDetails?: string | null,
    toggleDevOptions?: boolean | null,
    timezone?: string | null,
  } | null,
};

export type DeleteSettingsMutationVariables = {
  input?: DeleteSettingsInput,
  condition?: ModelSettingsConditionInput | null,
};

export type DeleteSettingsMutation = {
  deleteSettings?:  {
    __typename: "Settings",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    MiRMapEnabled?: boolean | null,
    accessToken?: string | null,
    authenticated?: boolean | null,
    currentMapId?: string | null,
    deviceEnabled?: boolean | null,
    loggers?: string | null,
    mapViewEnabled?: boolean | null,
    non_local_api?: boolean | null,
    non_local_api_ip?: string | null,
    refreshToken?: string | null,
    shiftDetails?: string | null,
    toggleDevOptions?: boolean | null,
    timezone?: string | null,
  } | null,
};

export type CreateLotTemplateMutationVariables = {
  input?: CreateLotTemplateInput,
  condition?: ModelLotTemplateConditionInput | null,
};

export type CreateLotTemplateMutation = {
  createLotTemplate?:  {
    __typename: "LotTemplate",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    displayNames: string,
    fields: string,
  } | null,
};

export type UpdateLotTemplateMutationVariables = {
  input?: UpdateLotTemplateInput,
  condition?: ModelLotTemplateConditionInput | null,
};

export type UpdateLotTemplateMutation = {
  updateLotTemplate?:  {
    __typename: "LotTemplate",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    displayNames: string,
    fields: string,
  } | null,
};

export type DeleteLotTemplateMutationVariables = {
  input?: DeleteLotTemplateInput,
  condition?: ModelLotTemplateConditionInput | null,
};

export type DeleteLotTemplateMutation = {
  deleteLotTemplate?:  {
    __typename: "LotTemplate",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    displayNames: string,
    fields: string,
  } | null,
};

export type CreateDeviceMutationVariables = {
  input?: CreateDeviceInput,
  condition?: ModelDeviceConditionInput | null,
};

export type CreateDeviceMutation = {
  createDevice?:  {
    __typename: "Device",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    battery_percentage: number,
    connected: boolean,
    current_task_queue_id?: string | null,
    dashboards: string,
    device_model: string,
    device_name: string,
    distance_to_next_target: number,
    idle_location: string,
    mapId: string,
    position: string,
    shelf_attached: number,
    state_text: string,
  } | null,
};

export type UpdateDeviceMutationVariables = {
  input?: UpdateDeviceInput,
  condition?: ModelDeviceConditionInput | null,
};

export type UpdateDeviceMutation = {
  updateDevice?:  {
    __typename: "Device",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    battery_percentage: number,
    connected: boolean,
    current_task_queue_id?: string | null,
    dashboards: string,
    device_model: string,
    device_name: string,
    distance_to_next_target: number,
    idle_location: string,
    mapId: string,
    position: string,
    shelf_attached: number,
    state_text: string,
  } | null,
};

export type DeleteDeviceMutationVariables = {
  input?: DeleteDeviceInput,
  condition?: ModelDeviceConditionInput | null,
};

export type DeleteDeviceMutation = {
  deleteDevice?:  {
    __typename: "Device",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    battery_percentage: number,
    connected: boolean,
    current_task_queue_id?: string | null,
    dashboards: string,
    device_model: string,
    device_name: string,
    distance_to_next_target: number,
    idle_location: string,
    mapId: string,
    position: string,
    shelf_attached: number,
    state_text: string,
  } | null,
};

export type CreateStatusMutationVariables = {
  input?: CreateStatusInput,
  condition?: ModelStatusConditionInput | null,
};

export type CreateStatusMutation = {
  createStatus?:  {
    __typename: "Status",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    active_map?: boolean | null,
    mir_connection?: string | null,
    pause_status?: boolean | null,
  } | null,
};

export type UpdateStatusMutationVariables = {
  input?: UpdateStatusInput,
  condition?: ModelStatusConditionInput | null,
};

export type UpdateStatusMutation = {
  updateStatus?:  {
    __typename: "Status",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    active_map?: boolean | null,
    mir_connection?: string | null,
    pause_status?: boolean | null,
  } | null,
};

export type DeleteStatusMutationVariables = {
  input?: DeleteStatusInput,
  condition?: ModelStatusConditionInput | null,
};

export type DeleteStatusMutation = {
  deleteStatus?:  {
    __typename: "Status",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    active_map?: boolean | null,
    mir_connection?: string | null,
    pause_status?: boolean | null,
  } | null,
};

export type CreateTaskQueueMutationVariables = {
  input?: CreateTaskQueueInput,
  condition?: ModelTaskQueueConditionInput | null,
};

export type CreateTaskQueueMutation = {
  createTaskQueue?:  {
    __typename: "TaskQueue",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_type: string,
    mission_status?: string | null,
    owner?: string | null,
    taskId: string,
    custom_task?: string | null,
    dashboard?: string | null,
    showModal?: boolean | null,
    hil_response?: boolean | null,
    quantity?: number | null,
    lotId?: string | null,
    start_time?: number | null,
    end_time?: number | null,
    hil_station_id?: string | null,
    hil_message?: string | null,
  } | null,
};

export type UpdateTaskQueueMutationVariables = {
  input?: UpdateTaskQueueInput,
  condition?: ModelTaskQueueConditionInput | null,
};

export type UpdateTaskQueueMutation = {
  updateTaskQueue?:  {
    __typename: "TaskQueue",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_type: string,
    mission_status?: string | null,
    owner?: string | null,
    taskId: string,
    custom_task?: string | null,
    dashboard?: string | null,
    showModal?: boolean | null,
    hil_response?: boolean | null,
    quantity?: number | null,
    lotId?: string | null,
    start_time?: number | null,
    end_time?: number | null,
    hil_station_id?: string | null,
    hil_message?: string | null,
  } | null,
};

export type DeleteTaskQueueMutationVariables = {
  input?: DeleteTaskQueueInput,
  condition?: ModelTaskQueueConditionInput | null,
};

export type DeleteTaskQueueMutation = {
  deleteTaskQueue?:  {
    __typename: "TaskQueue",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_type: string,
    mission_status?: string | null,
    owner?: string | null,
    taskId: string,
    custom_task?: string | null,
    dashboard?: string | null,
    showModal?: boolean | null,
    hil_response?: boolean | null,
    quantity?: number | null,
    lotId?: string | null,
    start_time?: number | null,
    end_time?: number | null,
    hil_station_id?: string | null,
    hil_message?: string | null,
  } | null,
};

export type CreateTaskQueueEventsMutationVariables = {
  input?: CreateTaskQueueEventsInput,
  condition?: ModelTaskQueueEventsConditionInput | null,
};

export type CreateTaskQueueEventsMutation = {
  createTaskQueueEvents?:  {
    __typename: "TaskQueueEvents",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_type: string,
    mission_status?: string | null,
    owner?: string | null,
    taskId: string,
    custom_task?: string | null,
    dashboard?: string | null,
    showModal?: boolean | null,
    hil_response?: boolean | null,
    quantity?: number | null,
    lotId?: string | null,
    start_time?: number | null,
    end_time?: number | null,
    hil_station_id?: string | null,
    hil_message?: string | null,
  } | null,
};

export type UpdateTaskQueueEventsMutationVariables = {
  input?: UpdateTaskQueueEventsInput,
  condition?: ModelTaskQueueEventsConditionInput | null,
};

export type UpdateTaskQueueEventsMutation = {
  updateTaskQueueEvents?:  {
    __typename: "TaskQueueEvents",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_type: string,
    mission_status?: string | null,
    owner?: string | null,
    taskId: string,
    custom_task?: string | null,
    dashboard?: string | null,
    showModal?: boolean | null,
    hil_response?: boolean | null,
    quantity?: number | null,
    lotId?: string | null,
    start_time?: number | null,
    end_time?: number | null,
    hil_station_id?: string | null,
    hil_message?: string | null,
  } | null,
};

export type DeleteTaskQueueEventsMutationVariables = {
  input?: DeleteTaskQueueEventsInput,
  condition?: ModelTaskQueueEventsConditionInput | null,
};

export type DeleteTaskQueueEventsMutation = {
  deleteTaskQueueEvents?:  {
    __typename: "TaskQueueEvents",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_type: string,
    mission_status?: string | null,
    owner?: string | null,
    taskId: string,
    custom_task?: string | null,
    dashboard?: string | null,
    showModal?: boolean | null,
    hil_response?: boolean | null,
    quantity?: number | null,
    lotId?: string | null,
    start_time?: number | null,
    end_time?: number | null,
    hil_station_id?: string | null,
    hil_message?: string | null,
  } | null,
};

export type CreateDashboardMutationVariables = {
  input?: CreateDashboardInput,
  condition?: ModelDashboardConditionInput | null,
};

export type CreateDashboardMutation = {
  createDashboard?:  {
    __typename: "Dashboard",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    data: string,
  } | null,
};

export type UpdateDashboardMutationVariables = {
  input?: UpdateDashboardInput,
  condition?: ModelDashboardConditionInput | null,
};

export type UpdateDashboardMutation = {
  updateDashboard?:  {
    __typename: "Dashboard",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    data: string,
  } | null,
};

export type DeleteDashboardMutationVariables = {
  input?: DeleteDashboardInput,
  condition?: ModelDashboardConditionInput | null,
};

export type DeleteDashboardMutation = {
  deleteDashboard?:  {
    __typename: "Dashboard",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    data: string,
  } | null,
};

export type CreateMapMutationVariables = {
  input?: CreateMapInput,
  condition?: ModelMapConditionInput | null,
};

export type CreateMapMutation = {
  createMap?:  {
    __typename: "Map",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    allowed_methods?: string | null,
    created_by?: string | null,
    created_by_id?: string | null,
    created_by_name?: string | null,
    map: string,
    name?: string | null,
    one_way_map?: string | null,
    origin_theta?: number | null,
    origin_x?: number | null,
    origin_y?: number | null,
    path_guides?: string | null,
    paths?: string | null,
    positions?: string | null,
    resolution?: number | null,
    session_id?: string | null,
  } | null,
};

export type UpdateMapMutationVariables = {
  input?: UpdateMapInput,
  condition?: ModelMapConditionInput | null,
};

export type UpdateMapMutation = {
  updateMap?:  {
    __typename: "Map",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    allowed_methods?: string | null,
    created_by?: string | null,
    created_by_id?: string | null,
    created_by_name?: string | null,
    map: string,
    name?: string | null,
    one_way_map?: string | null,
    origin_theta?: number | null,
    origin_x?: number | null,
    origin_y?: number | null,
    path_guides?: string | null,
    paths?: string | null,
    positions?: string | null,
    resolution?: number | null,
    session_id?: string | null,
  } | null,
};

export type DeleteMapMutationVariables = {
  input?: DeleteMapInput,
  condition?: ModelMapConditionInput | null,
};

export type DeleteMapMutation = {
  deleteMap?:  {
    __typename: "Map",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    allowed_methods?: string | null,
    created_by?: string | null,
    created_by_id?: string | null,
    created_by_name?: string | null,
    map: string,
    name?: string | null,
    one_way_map?: string | null,
    origin_theta?: number | null,
    origin_x?: number | null,
    origin_y?: number | null,
    path_guides?: string | null,
    paths?: string | null,
    positions?: string | null,
    resolution?: number | null,
    session_id?: string | null,
  } | null,
};

export type CreateReportEventMutationVariables = {
  input?: CreateReportEventInput,
  condition?: ModelReportEventConditionInput | null,
};

export type CreateReportEventMutation = {
  createReportEvent?:  {
    __typename: "ReportEvent",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    dashboardId: string,
    date: number,
    reportButtonId: string,
    stationId: string,
  } | null,
};

export type UpdateReportEventMutationVariables = {
  input?: UpdateReportEventInput,
  condition?: ModelReportEventConditionInput | null,
};

export type UpdateReportEventMutation = {
  updateReportEvent?:  {
    __typename: "ReportEvent",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    dashboardId: string,
    date: number,
    reportButtonId: string,
    stationId: string,
  } | null,
};

export type DeleteReportEventMutationVariables = {
  input?: DeleteReportEventInput,
  condition?: ModelReportEventConditionInput | null,
};

export type DeleteReportEventMutation = {
  deleteReportEvent?:  {
    __typename: "ReportEvent",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    dashboardId: string,
    date: number,
    reportButtonId: string,
    stationId: string,
  } | null,
};

export type UsersbyOrgQueryVariables = {
  organizationId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersbyOrgQuery = {
  UsersbyOrg?:  {
    __typename: "ModelUserConnection",
    items?:  Array< {
      __typename: "User",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      username: string,
      owner?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type UsersbyIdQueryVariables = {
  id?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersbyIdQuery = {
  UsersbyId?:  {
    __typename: "ModelUserConnection",
    items?:  Array< {
      __typename: "User",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      username: string,
      owner?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OrgsByIdQueryVariables = {
  organizationId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelOrganizationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type OrgsByIdQuery = {
  OrgsById?:  {
    __typename: "ModelOrganizationConnection",
    items?:  Array< {
      __typename: "Organization",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      name: string,
      key: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OrgsByKeyQueryVariables = {
  key?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelOrganizationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type OrgsByKeyQuery = {
  OrgsByKey?:  {
    __typename: "ModelOrganizationConnection",
    items?:  Array< {
      __typename: "Organization",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      name: string,
      key: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type StationsByOrgIdQueryVariables = {
  organizationId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelStationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type StationsByOrgIdQuery = {
  StationsByOrgId?:  {
    __typename: "ModelStationConnection",
    items?:  Array< {
      __typename: "Station",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      name: string,
      schema: string,
      type: string,
      pos_x?: number | null,
      pos_y?: number | null,
      rotation: number,
      x: number,
      y: number,
      mapId: string,
      children: string,
      dashboards: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type StationEventsByOrgIdQueryVariables = {
  organizationId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelStationEventFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type StationEventsByOrgIdQuery = {
  StationEventsByOrgId?:  {
    __typename: "ModelStationEventConnection",
    items?:  Array< {
      __typename: "StationEvent",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      object?: string | null,
      outgoing: boolean,
      quantity: number,
      station: string,
      time: number,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type PositionsByOrgIdQueryVariables = {
  organizationId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPositionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PositionsByOrgIdQuery = {
  PositionsByOrgId?:  {
    __typename: "ModelPositionConnection",
    items?:  Array< {
      __typename: "Position",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      change_key: string,
      mapId: string,
      name: string,
      parent?: string | null,
      pos_x?: number | null,
      pos_y?: number | null,
      rotation?: number | null,
      schema: string,
      type: string,
      x: number,
      y: number,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type TasksByOrgIdQueryVariables = {
  organizationId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTaskFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type TasksByOrgIdQuery = {
  TasksByOrgId?:  {
    __typename: "ModelTaskConnection",
    items?:  Array< {
      __typename: "Task",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      device_types: string,
      handoff: boolean,
      load: string,
      mapId: string,
      name: string,
      processes: string,
      quantity: number,
      track_quantity: boolean,
      type: string,
      unload: string,
      obj: string,
      route_object?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type TaskByIdQueryVariables = {
  id?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTaskFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type TaskByIdQuery = {
  TaskById?:  {
    __typename: "ModelTaskConnection",
    items?:  Array< {
      __typename: "Task",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      device_types: string,
      handoff: boolean,
      load: string,
      mapId: string,
      name: string,
      processes: string,
      quantity: number,
      track_quantity: boolean,
      type: string,
      unload: string,
      obj: string,
      route_object?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type ProcessesByOrgIdQueryVariables = {
  organizationId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelProcessFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ProcessesByOrgIdQuery = {
  ProcessesByOrgId?:  {
    __typename: "ModelProcessConnection",
    items?:  Array< {
      __typename: "Process",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      name: string,
      broken: string,
      routes: string,
      mapId?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type ObjectsByOrgIdQueryVariables = {
  organizationId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelObjectFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ObjectsByOrgIdQuery = {
  ObjectsByOrgId?:  {
    __typename: "ModelObjectConnection",
    items?:  Array< {
      __typename: "Object",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      description: string,
      mapId: string,
      modelName: string,
      name: string,
      dimensions?: string | null,
      quantity?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type CardsByOrgIdQueryVariables = {
  organizationId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelCardFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type CardsByOrgIdQuery = {
  CardsByOrgId?:  {
    __typename: "ModelCardConnection",
    items?:  Array< {
      __typename: "Card",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      bins: string,
      flags: string,
      templateValues: string,
      lotNumber: number,
      lotTemplateId: string,
      name: string,
      processId: string,
      count?: number | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetCardByIdQueryVariables = {
  id?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelCardFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GetCardByIdQuery = {
  GetCardById?:  {
    __typename: "ModelCardConnection",
    items?:  Array< {
      __typename: "Card",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      bins: string,
      flags: string,
      templateValues: string,
      lotNumber: number,
      lotTemplateId: string,
      name: string,
      processId: string,
      count?: number | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type CardsEventsByOrgIdQueryVariables = {
  organizationId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelCardEventFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type CardsEventsByOrgIdQuery = {
  CardsEventsByOrgId?:  {
    __typename: "ModelCardEventConnection",
    items?:  Array< {
      __typename: "CardEvent",
      id: string,
      organizationId: string,
      cardId: string,
      userId?: string | null,
      username?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
      delta: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type SettingsByOrgIdQueryVariables = {
  organizationId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelSettingsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SettingsByOrgIdQuery = {
  SettingsByOrgId?:  {
    __typename: "ModelSettingsConnection",
    items?:  Array< {
      __typename: "Settings",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      MiRMapEnabled?: boolean | null,
      accessToken?: string | null,
      authenticated?: boolean | null,
      currentMapId?: string | null,
      deviceEnabled?: boolean | null,
      loggers?: string | null,
      mapViewEnabled?: boolean | null,
      non_local_api?: boolean | null,
      non_local_api_ip?: string | null,
      refreshToken?: string | null,
      shiftDetails?: string | null,
      toggleDevOptions?: boolean | null,
      timezone?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type LotTemplatesByOrgIdQueryVariables = {
  organizationId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelLotTemplateFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type LotTemplatesByOrgIdQuery = {
  LotTemplatesByOrgId?:  {
    __typename: "ModelLotTemplateConnection",
    items?:  Array< {
      __typename: "LotTemplate",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      name: string,
      displayNames: string,
      fields: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type DevicesByOrgIdQueryVariables = {
  organizationId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelDeviceFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type DevicesByOrgIdQuery = {
  DevicesByOrgId?:  {
    __typename: "ModelDeviceConnection",
    items?:  Array< {
      __typename: "Device",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      battery_percentage: number,
      connected: boolean,
      current_task_queue_id?: string | null,
      dashboards: string,
      device_model: string,
      device_name: string,
      distance_to_next_target: number,
      idle_location: string,
      mapId: string,
      position: string,
      shelf_attached: number,
      state_text: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type StatusByOrgIdQueryVariables = {
  organizationId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelStatusFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type StatusByOrgIdQuery = {
  StatusByOrgId?:  {
    __typename: "ModelStatusConnection",
    items?:  Array< {
      __typename: "Status",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      active_map?: boolean | null,
      mir_connection?: string | null,
      pause_status?: boolean | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type TaskQueueByOrgIdQueryVariables = {
  organizationId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTaskQueueFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type TaskQueueByOrgIdQuery = {
  TaskQueueByOrgId?:  {
    __typename: "ModelTaskQueueConnection",
    items?:  Array< {
      __typename: "TaskQueue",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      device_type: string,
      mission_status?: string | null,
      owner?: string | null,
      taskId: string,
      custom_task?: string | null,
      dashboard?: string | null,
      showModal?: boolean | null,
      hil_response?: boolean | null,
      quantity?: number | null,
      lotId?: string | null,
      start_time?: number | null,
      end_time?: number | null,
      hil_station_id?: string | null,
      hil_message?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type DashboardsByOrgIdQueryVariables = {
  organizationId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelDashboardFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type DashboardsByOrgIdQuery = {
  DashboardsByOrgId?:  {
    __typename: "ModelDashboardConnection",
    items?:  Array< {
      __typename: "Dashboard",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      data: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type MapsByOrgIdQueryVariables = {
  organizationId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMapFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MapsByOrgIdQuery = {
  MapsByOrgId?:  {
    __typename: "ModelMapConnection",
    items?:  Array< {
      __typename: "Map",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      allowed_methods?: string | null,
      created_by?: string | null,
      created_by_id?: string | null,
      created_by_name?: string | null,
      map: string,
      name?: string | null,
      one_way_map?: string | null,
      origin_theta?: number | null,
      origin_x?: number | null,
      origin_y?: number | null,
      path_guides?: string | null,
      paths?: string | null,
      positions?: string | null,
      resolution?: number | null,
      session_id?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type ReportEventByOrgIdQueryVariables = {
  organizationId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelReportEventFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ReportEventByOrgIdQuery = {
  ReportEventByOrgId?:  {
    __typename: "ModelReportEventConnection",
    items?:  Array< {
      __typename: "ReportEvent",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      dashboardId: string,
      date: number,
      reportButtonId: string,
      stationId: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnDeltaDashboardSubscription = {
  onDeltaDashboard?:  {
    __typename: "Dashboard",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    data: string,
  } | null,
};

export type OnDeltaSettingsSubscription = {
  onDeltaSettings?:  {
    __typename: "Settings",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    MiRMapEnabled?: boolean | null,
    accessToken?: string | null,
    authenticated?: boolean | null,
    currentMapId?: string | null,
    deviceEnabled?: boolean | null,
    loggers?: string | null,
    mapViewEnabled?: boolean | null,
    non_local_api?: boolean | null,
    non_local_api_ip?: string | null,
    refreshToken?: string | null,
    shiftDetails?: string | null,
    toggleDevOptions?: boolean | null,
    timezone?: string | null,
  } | null,
};

export type OnDeltaStationSubscription = {
  onDeltaStation?:  {
    __typename: "Station",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    schema: string,
    type: string,
    pos_x?: number | null,
    pos_y?: number | null,
    rotation: number,
    x: number,
    y: number,
    mapId: string,
    children: string,
    dashboards: string,
  } | null,
};

export type OnDeltaPositionSubscription = {
  onDeltaPosition?:  {
    __typename: "Position",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    change_key: string,
    mapId: string,
    name: string,
    parent?: string | null,
    pos_x?: number | null,
    pos_y?: number | null,
    rotation?: number | null,
    schema: string,
    type: string,
    x: number,
    y: number,
  } | null,
};

export type OnDeltaTaskSubscription = {
  onDeltaTask?:  {
    __typename: "Task",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_types: string,
    handoff: boolean,
    load: string,
    mapId: string,
    name: string,
    processes: string,
    quantity: number,
    track_quantity: boolean,
    type: string,
    unload: string,
    obj: string,
    route_object?: string | null,
  } | null,
};

export type OnDeltaProcessSubscription = {
  onDeltaProcess?:  {
    __typename: "Process",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    broken: string,
    routes: string,
    mapId?: string | null,
  } | null,
};

export type OnDeltaObjectSubscription = {
  onDeltaObject?:  {
    __typename: "Object",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    description: string,
    mapId: string,
    modelName: string,
    name: string,
    dimensions?: string | null,
    quantity?: string | null,
  } | null,
};

export type OnDeltaCardSubscription = {
  onDeltaCard?:  {
    __typename: "Card",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    bins: string,
    flags: string,
    templateValues: string,
    lotNumber: number,
    lotTemplateId: string,
    name: string,
    processId: string,
    count?: number | null,
  } | null,
};

export type OnDeltaLotTemplateSubscription = {
  onDeltaLotTemplate?:  {
    __typename: "LotTemplate",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    displayNames: string,
    fields: string,
  } | null,
};

export type OnDeltaDeviceSubscription = {
  onDeltaDevice?:  {
    __typename: "Device",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    battery_percentage: number,
    connected: boolean,
    current_task_queue_id?: string | null,
    dashboards: string,
    device_model: string,
    device_name: string,
    distance_to_next_target: number,
    idle_location: string,
    mapId: string,
    position: string,
    shelf_attached: number,
    state_text: string,
  } | null,
};

export type OnDeltaStatusSubscription = {
  onDeltaStatus?:  {
    __typename: "Status",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    active_map?: boolean | null,
    mir_connection?: string | null,
    pause_status?: boolean | null,
  } | null,
};

export type OnDeltaTaskQueueSubscription = {
  onDeltaTaskQueue?:  {
    __typename: "TaskQueue",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_type: string,
    mission_status?: string | null,
    owner?: string | null,
    taskId: string,
    custom_task?: string | null,
    dashboard?: string | null,
    showModal?: boolean | null,
    hil_response?: boolean | null,
    quantity?: number | null,
    lotId?: string | null,
    start_time?: number | null,
    end_time?: number | null,
    hil_station_id?: string | null,
    hil_message?: string | null,
  } | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    username: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      name: string,
      key: string,
    } | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    username: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      name: string,
      key: string,
    } | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    username: string,
    organization?:  {
      __typename: "Organization",
      id: string,
      organizationId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      name: string,
      key: string,
    } | null,
    owner?: string | null,
  } | null,
};

export type OnCreateOrganizationSubscription = {
  onCreateOrganization?:  {
    __typename: "Organization",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    key: string,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnUpdateOrganizationSubscription = {
  onUpdateOrganization?:  {
    __typename: "Organization",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    key: string,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnDeleteOrganizationSubscription = {
  onDeleteOrganization?:  {
    __typename: "Organization",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    key: string,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnCreateStationSubscription = {
  onCreateStation?:  {
    __typename: "Station",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    schema: string,
    type: string,
    pos_x?: number | null,
    pos_y?: number | null,
    rotation: number,
    x: number,
    y: number,
    mapId: string,
    children: string,
    dashboards: string,
  } | null,
};

export type OnUpdateStationSubscription = {
  onUpdateStation?:  {
    __typename: "Station",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    schema: string,
    type: string,
    pos_x?: number | null,
    pos_y?: number | null,
    rotation: number,
    x: number,
    y: number,
    mapId: string,
    children: string,
    dashboards: string,
  } | null,
};

export type OnDeleteStationSubscription = {
  onDeleteStation?:  {
    __typename: "Station",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    schema: string,
    type: string,
    pos_x?: number | null,
    pos_y?: number | null,
    rotation: number,
    x: number,
    y: number,
    mapId: string,
    children: string,
    dashboards: string,
  } | null,
};

export type OnCreateStationEventSubscription = {
  onCreateStationEvent?:  {
    __typename: "StationEvent",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    object?: string | null,
    outgoing: boolean,
    quantity: number,
    station: string,
    time: number,
  } | null,
};

export type OnUpdateStationEventSubscription = {
  onUpdateStationEvent?:  {
    __typename: "StationEvent",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    object?: string | null,
    outgoing: boolean,
    quantity: number,
    station: string,
    time: number,
  } | null,
};

export type OnDeleteStationEventSubscription = {
  onDeleteStationEvent?:  {
    __typename: "StationEvent",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    object?: string | null,
    outgoing: boolean,
    quantity: number,
    station: string,
    time: number,
  } | null,
};

export type OnCreatePositionSubscription = {
  onCreatePosition?:  {
    __typename: "Position",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    change_key: string,
    mapId: string,
    name: string,
    parent?: string | null,
    pos_x?: number | null,
    pos_y?: number | null,
    rotation?: number | null,
    schema: string,
    type: string,
    x: number,
    y: number,
  } | null,
};

export type OnUpdatePositionSubscription = {
  onUpdatePosition?:  {
    __typename: "Position",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    change_key: string,
    mapId: string,
    name: string,
    parent?: string | null,
    pos_x?: number | null,
    pos_y?: number | null,
    rotation?: number | null,
    schema: string,
    type: string,
    x: number,
    y: number,
  } | null,
};

export type OnDeletePositionSubscription = {
  onDeletePosition?:  {
    __typename: "Position",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    change_key: string,
    mapId: string,
    name: string,
    parent?: string | null,
    pos_x?: number | null,
    pos_y?: number | null,
    rotation?: number | null,
    schema: string,
    type: string,
    x: number,
    y: number,
  } | null,
};

export type OnCreateTaskSubscription = {
  onCreateTask?:  {
    __typename: "Task",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_types: string,
    handoff: boolean,
    load: string,
    mapId: string,
    name: string,
    processes: string,
    quantity: number,
    track_quantity: boolean,
    type: string,
    unload: string,
    obj: string,
    route_object?: string | null,
  } | null,
};

export type OnUpdateTaskSubscription = {
  onUpdateTask?:  {
    __typename: "Task",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_types: string,
    handoff: boolean,
    load: string,
    mapId: string,
    name: string,
    processes: string,
    quantity: number,
    track_quantity: boolean,
    type: string,
    unload: string,
    obj: string,
    route_object?: string | null,
  } | null,
};

export type OnDeleteTaskSubscription = {
  onDeleteTask?:  {
    __typename: "Task",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_types: string,
    handoff: boolean,
    load: string,
    mapId: string,
    name: string,
    processes: string,
    quantity: number,
    track_quantity: boolean,
    type: string,
    unload: string,
    obj: string,
    route_object?: string | null,
  } | null,
};

export type OnCreateProcessSubscription = {
  onCreateProcess?:  {
    __typename: "Process",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    broken: string,
    routes: string,
    mapId?: string | null,
  } | null,
};

export type OnUpdateProcessSubscription = {
  onUpdateProcess?:  {
    __typename: "Process",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    broken: string,
    routes: string,
    mapId?: string | null,
  } | null,
};

export type OnDeleteProcessSubscription = {
  onDeleteProcess?:  {
    __typename: "Process",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    broken: string,
    routes: string,
    mapId?: string | null,
  } | null,
};

export type OnCreateObjectSubscription = {
  onCreateObject?:  {
    __typename: "Object",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    description: string,
    mapId: string,
    modelName: string,
    name: string,
    dimensions?: string | null,
    quantity?: string | null,
  } | null,
};

export type OnUpdateObjectSubscription = {
  onUpdateObject?:  {
    __typename: "Object",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    description: string,
    mapId: string,
    modelName: string,
    name: string,
    dimensions?: string | null,
    quantity?: string | null,
  } | null,
};

export type OnDeleteObjectSubscription = {
  onDeleteObject?:  {
    __typename: "Object",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    description: string,
    mapId: string,
    modelName: string,
    name: string,
    dimensions?: string | null,
    quantity?: string | null,
  } | null,
};

export type OnCreateCardSubscription = {
  onCreateCard?:  {
    __typename: "Card",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    bins: string,
    flags: string,
    templateValues: string,
    lotNumber: number,
    lotTemplateId: string,
    name: string,
    processId: string,
    count?: number | null,
  } | null,
};

export type OnUpdateCardSubscription = {
  onUpdateCard?:  {
    __typename: "Card",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    bins: string,
    flags: string,
    templateValues: string,
    lotNumber: number,
    lotTemplateId: string,
    name: string,
    processId: string,
    count?: number | null,
  } | null,
};

export type OnDeleteCardSubscription = {
  onDeleteCard?:  {
    __typename: "Card",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    bins: string,
    flags: string,
    templateValues: string,
    lotNumber: number,
    lotTemplateId: string,
    name: string,
    processId: string,
    count?: number | null,
  } | null,
};

export type OnCreateCardEventSubscription = {
  onCreateCardEvent?:  {
    __typename: "CardEvent",
    id: string,
    organizationId: string,
    cardId: string,
    userId?: string | null,
    username?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    delta: string,
  } | null,
};

export type OnUpdateCardEventSubscription = {
  onUpdateCardEvent?:  {
    __typename: "CardEvent",
    id: string,
    organizationId: string,
    cardId: string,
    userId?: string | null,
    username?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    delta: string,
  } | null,
};

export type OnDeleteCardEventSubscription = {
  onDeleteCardEvent?:  {
    __typename: "CardEvent",
    id: string,
    organizationId: string,
    cardId: string,
    userId?: string | null,
    username?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    delta: string,
  } | null,
};

export type OnCreateSettingsSubscription = {
  onCreateSettings?:  {
    __typename: "Settings",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    MiRMapEnabled?: boolean | null,
    accessToken?: string | null,
    authenticated?: boolean | null,
    currentMapId?: string | null,
    deviceEnabled?: boolean | null,
    loggers?: string | null,
    mapViewEnabled?: boolean | null,
    non_local_api?: boolean | null,
    non_local_api_ip?: string | null,
    refreshToken?: string | null,
    shiftDetails?: string | null,
    toggleDevOptions?: boolean | null,
    timezone?: string | null,
  } | null,
};

export type OnUpdateSettingsSubscription = {
  onUpdateSettings?:  {
    __typename: "Settings",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    MiRMapEnabled?: boolean | null,
    accessToken?: string | null,
    authenticated?: boolean | null,
    currentMapId?: string | null,
    deviceEnabled?: boolean | null,
    loggers?: string | null,
    mapViewEnabled?: boolean | null,
    non_local_api?: boolean | null,
    non_local_api_ip?: string | null,
    refreshToken?: string | null,
    shiftDetails?: string | null,
    toggleDevOptions?: boolean | null,
    timezone?: string | null,
  } | null,
};

export type OnDeleteSettingsSubscription = {
  onDeleteSettings?:  {
    __typename: "Settings",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    MiRMapEnabled?: boolean | null,
    accessToken?: string | null,
    authenticated?: boolean | null,
    currentMapId?: string | null,
    deviceEnabled?: boolean | null,
    loggers?: string | null,
    mapViewEnabled?: boolean | null,
    non_local_api?: boolean | null,
    non_local_api_ip?: string | null,
    refreshToken?: string | null,
    shiftDetails?: string | null,
    toggleDevOptions?: boolean | null,
    timezone?: string | null,
  } | null,
};

export type OnCreateLotTemplateSubscription = {
  onCreateLotTemplate?:  {
    __typename: "LotTemplate",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    displayNames: string,
    fields: string,
  } | null,
};

export type OnUpdateLotTemplateSubscription = {
  onUpdateLotTemplate?:  {
    __typename: "LotTemplate",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    displayNames: string,
    fields: string,
  } | null,
};

export type OnDeleteLotTemplateSubscription = {
  onDeleteLotTemplate?:  {
    __typename: "LotTemplate",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    name: string,
    displayNames: string,
    fields: string,
  } | null,
};

export type OnCreateDeviceSubscription = {
  onCreateDevice?:  {
    __typename: "Device",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    battery_percentage: number,
    connected: boolean,
    current_task_queue_id?: string | null,
    dashboards: string,
    device_model: string,
    device_name: string,
    distance_to_next_target: number,
    idle_location: string,
    mapId: string,
    position: string,
    shelf_attached: number,
    state_text: string,
  } | null,
};

export type OnUpdateDeviceSubscription = {
  onUpdateDevice?:  {
    __typename: "Device",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    battery_percentage: number,
    connected: boolean,
    current_task_queue_id?: string | null,
    dashboards: string,
    device_model: string,
    device_name: string,
    distance_to_next_target: number,
    idle_location: string,
    mapId: string,
    position: string,
    shelf_attached: number,
    state_text: string,
  } | null,
};

export type OnDeleteDeviceSubscription = {
  onDeleteDevice?:  {
    __typename: "Device",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    battery_percentage: number,
    connected: boolean,
    current_task_queue_id?: string | null,
    dashboards: string,
    device_model: string,
    device_name: string,
    distance_to_next_target: number,
    idle_location: string,
    mapId: string,
    position: string,
    shelf_attached: number,
    state_text: string,
  } | null,
};

export type OnCreateStatusSubscription = {
  onCreateStatus?:  {
    __typename: "Status",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    active_map?: boolean | null,
    mir_connection?: string | null,
    pause_status?: boolean | null,
  } | null,
};

export type OnUpdateStatusSubscription = {
  onUpdateStatus?:  {
    __typename: "Status",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    active_map?: boolean | null,
    mir_connection?: string | null,
    pause_status?: boolean | null,
  } | null,
};

export type OnDeleteStatusSubscription = {
  onDeleteStatus?:  {
    __typename: "Status",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    active_map?: boolean | null,
    mir_connection?: string | null,
    pause_status?: boolean | null,
  } | null,
};

export type OnCreateTaskQueueSubscription = {
  onCreateTaskQueue?:  {
    __typename: "TaskQueue",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_type: string,
    mission_status?: string | null,
    owner?: string | null,
    taskId: string,
    custom_task?: string | null,
    dashboard?: string | null,
    showModal?: boolean | null,
    hil_response?: boolean | null,
    quantity?: number | null,
    lotId?: string | null,
    start_time?: number | null,
    end_time?: number | null,
    hil_station_id?: string | null,
    hil_message?: string | null,
  } | null,
};

export type OnUpdateTaskQueueSubscription = {
  onUpdateTaskQueue?:  {
    __typename: "TaskQueue",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_type: string,
    mission_status?: string | null,
    owner?: string | null,
    taskId: string,
    custom_task?: string | null,
    dashboard?: string | null,
    showModal?: boolean | null,
    hil_response?: boolean | null,
    quantity?: number | null,
    lotId?: string | null,
    start_time?: number | null,
    end_time?: number | null,
    hil_station_id?: string | null,
    hil_message?: string | null,
  } | null,
};

export type OnDeleteTaskQueueSubscription = {
  onDeleteTaskQueue?:  {
    __typename: "TaskQueue",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_type: string,
    mission_status?: string | null,
    owner?: string | null,
    taskId: string,
    custom_task?: string | null,
    dashboard?: string | null,
    showModal?: boolean | null,
    hil_response?: boolean | null,
    quantity?: number | null,
    lotId?: string | null,
    start_time?: number | null,
    end_time?: number | null,
    hil_station_id?: string | null,
    hil_message?: string | null,
  } | null,
};

export type OnCreateTaskQueueEventsSubscription = {
  onCreateTaskQueueEvents?:  {
    __typename: "TaskQueueEvents",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_type: string,
    mission_status?: string | null,
    owner?: string | null,
    taskId: string,
    custom_task?: string | null,
    dashboard?: string | null,
    showModal?: boolean | null,
    hil_response?: boolean | null,
    quantity?: number | null,
    lotId?: string | null,
    start_time?: number | null,
    end_time?: number | null,
    hil_station_id?: string | null,
    hil_message?: string | null,
  } | null,
};

export type OnUpdateTaskQueueEventsSubscription = {
  onUpdateTaskQueueEvents?:  {
    __typename: "TaskQueueEvents",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_type: string,
    mission_status?: string | null,
    owner?: string | null,
    taskId: string,
    custom_task?: string | null,
    dashboard?: string | null,
    showModal?: boolean | null,
    hil_response?: boolean | null,
    quantity?: number | null,
    lotId?: string | null,
    start_time?: number | null,
    end_time?: number | null,
    hil_station_id?: string | null,
    hil_message?: string | null,
  } | null,
};

export type OnDeleteTaskQueueEventsSubscription = {
  onDeleteTaskQueueEvents?:  {
    __typename: "TaskQueueEvents",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    device_type: string,
    mission_status?: string | null,
    owner?: string | null,
    taskId: string,
    custom_task?: string | null,
    dashboard?: string | null,
    showModal?: boolean | null,
    hil_response?: boolean | null,
    quantity?: number | null,
    lotId?: string | null,
    start_time?: number | null,
    end_time?: number | null,
    hil_station_id?: string | null,
    hil_message?: string | null,
  } | null,
};

export type OnCreateDashboardSubscription = {
  onCreateDashboard?:  {
    __typename: "Dashboard",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    data: string,
  } | null,
};

export type OnUpdateDashboardSubscription = {
  onUpdateDashboard?:  {
    __typename: "Dashboard",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    data: string,
  } | null,
};

export type OnDeleteDashboardSubscription = {
  onDeleteDashboard?:  {
    __typename: "Dashboard",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    data: string,
  } | null,
};

export type OnCreateReportEventSubscription = {
  onCreateReportEvent?:  {
    __typename: "ReportEvent",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    dashboardId: string,
    date: number,
    reportButtonId: string,
    stationId: string,
  } | null,
};

export type OnUpdateReportEventSubscription = {
  onUpdateReportEvent?:  {
    __typename: "ReportEvent",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    dashboardId: string,
    date: number,
    reportButtonId: string,
    stationId: string,
  } | null,
};

export type OnDeleteReportEventSubscription = {
  onDeleteReportEvent?:  {
    __typename: "ReportEvent",
    id: string,
    organizationId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    dashboardId: string,
    date: number,
    reportButtonId: string,
    stationId: string,
  } | null,
};
