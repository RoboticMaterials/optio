// Core domain types for Optio/rmstudio_2.0

export type MongoId = string | { $oid: string }

export const parseId = (id: MongoId): string =>
  typeof id === 'string' ? id : id.$oid

export interface Station {
  _id: MongoId
  name: string
  type: string
  dashboards: string[]
  x: number
  y: number
  rotation: number
  schema: string
  color?: string
  deviceEnabled?: boolean
}

export interface Bin {
  count: number
  [key: string]: any
}

export interface LotField {
  fieldName: string
  _id: string
  dataType: string
  displayName?: string
  label?: string
  fieldPath?: string
  value?: any
  [key: string]: any
}

export interface Lot {
  _id: MongoId
  name: string
  lotNum?: number
  lotTemplateId?: string
  totalQuantity?: number
  flags?: string[]
  bins: Record<string, Bin>
  process_id?: string
  fields: LotField[][]
  [key: string]: any
}

export interface Settings {
  _id?: MongoId
  pixelsPerFoot?: number
  scaleUnit?: 'ft' | 'm'
  iconSizeUnits?: number
  mapApps?: {
    labels?: boolean
    [key: string]: any
  }
  [key: string]: any
}

export interface Position {
  _id: MongoId
  name: string
  x: number
  y: number
  rotation: number
  type: string
  schema: string
  dashboards: string[]
  [key: string]: any
}

export interface Process {
  _id: MongoId
  name: string
  routes?: string[]
  [key: string]: any
}

export interface Route {
  _id: MongoId
  load: string
  unload: string
  processId?: string
  [key: string]: any
}

export interface Dashboard {
  _id: MongoId
  name: string
  station?: string
  locked?: boolean
  buttons?: any[]
  [key: string]: any
}

export interface LotTemplate {
  _id: MongoId
  name: string
  displayNames?: Record<string, string>
  fields?: LotField[][]
  [key: string]: any
}

// Redux state shape (partial — add slices as they are typed)
export interface RootState {
  settingsReducer: { settings: Settings }
  stationsReducer: { stations: Record<string, Station>; selectedStation: Station | null; editingStation: Station | null }
  positionsReducer: { positions: Record<string, Position>; selectedPosition: Position | null; editingPosition: Position | null }
  cardsReducer: { cards: Record<string, Lot>; stationCards: Record<string, Record<string, Lot>> }
  processesReducer: { processes: Record<string, Process> }
  tasksReducer: { tasks: Record<string, Route> }
  dashboardsReducer: { dashboards: Record<string, Dashboard> }
  lotTemplatesReducer: { lotTemplates: Record<string, LotTemplate> }
  mapReducer: { currentMap: any; maps: any[] }
  localReducer: { localSettings: any }
  [key: string]: any
}
