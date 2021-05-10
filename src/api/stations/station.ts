// export class Station
// {
//     public id: number;
//     public value: string;
// }

export interface StationInterface {
    email: string;
    password: string;
}

export class StationClass {
    private _id: string = "";

    get id(): string {
        return this._id;
    }
    set id(value: string) {
        this._id = value;
    }
}

export type Station = {
    id: string;
    name: string;
    dashboards: [any];
    children: [any];
    mapId: string;
    organizationId: string;
    pos_x: number;
    pos_y: number;
    rotation: number;
    schema: string;
    type: string;
    x: number;
    y: number;
}