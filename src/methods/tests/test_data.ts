export const testTasks = {
    "5dce4e79-758c-4a89-81f1-bd48a0a6550b":
    {
        "_id": "5dce4e79-758c-4a89-81f1-bd48a0a6550b",
        "name": "Route 1",
        "obj": "b81156bd-9859-498a-acfa-36c4451391f9",
        "type": "push",
        "quantity": 1,
        "device_type": "human",
        "handoff": true,
        "track_quantity": true,
        "map_id": "8cbe09ff-3bb0-11ea-975b-94c691a739e9",
        "processes": [
            "2e0104ee-b145-4e88-9c84-6166e641284d"
        ],
        "load": {
            "position": "1e133a26-dea9-4b06-b2b2-3b52d4b47ca2",
            "station": "1e133a26-dea9-4b06-b2b2-3b52d4b47ca2",
            "sound": null,
            "instructions": "Load",
            "timeout": "01:00"
        },
        "unload": {
            "position": "824e5467-b497-478e-8004-d09fcf3efbad",
            "station": "824e5467-b497-478e-8004-d09fcf3efbad",
            "sound": null,
            "instructions": "Unload"
        }
    },
    "12508e5c-abd3-4d57-9d02-9eb69fc0edbc":
    {
        "_id": "12508e5c-abd3-4d57-9d02-9eb69fc0edbc",
        "name": "Route 2",
        "obj": "b81156bd-9859-498a-acfa-36c4451391f9",
        "type": "push",
        "quantity": 1,
        "device_type": "human",
        "handoff": true,
        "track_quantity": true,
        "map_id": "8cbe09ff-3bb0-11ea-975b-94c691a739e9",
        "processes": [
            "2e0104ee-b145-4e88-9c84-6166e641284d"
        ],
        "load": {
            "position": "824e5467-b497-478e-8004-d09fcf3efbad",
            "station": "824e5467-b497-478e-8004-d09fcf3efbad",
            "sound": null,
            "instructions": "Load",
            "timeout": "01:00"
        },
        "unload": {
            "position": "b1e0891c-95a4-47af-97d1-2f33d5a15aa9",
            "station": "b1e0891c-95a4-47af-97d1-2f33d5a15aa9",
            "sound": null,
            "instructions": "Unload"
        }
    },
    "6012e366-9415-4731-99c7-b18ea6d280eb":
    {
        "_id": "6012e366-9415-4731-99c7-b18ea6d280eb",
        "name": "Route 3",
        "obj": "b81156bd-9859-498a-acfa-36c4451391f9",
        "type": "push",
        "quantity": 1,
        "device_type": "human",
        "handoff": false,
        "track_quantity": true,
        "map_id": "8cbe09ff-3bb0-11ea-975b-94c691a739e9",
        "processes": [
            "2e0104ee-b145-4e88-9c84-6166e641284d"
        ],
        "load": {
            "position": "b1e0891c-95a4-47af-97d1-2f33d5a15aa9",
            "station": "b1e0891c-95a4-47af-97d1-2f33d5a15aa9",
            "sound": null,
            "instructions": "Load",
            "timeout": "01:00"
        },
        "unload": {
            "position": "1e133a26-dea9-4b06-b2b2-3b52d4b47ca2",
            "station": "1e133a26-dea9-4b06-b2b2-3b52d4b47ca2",
            "sound": null,
            "instructions": "Unload"
        }
    }
}

export const testProcesses = {
    "2e0104ee-b145-4e88-9c84-6166e641284d":
    {
        "_id": "2e0104ee-b145-4e88-9c84-6166e641284d",
        "name": "Process 1",
        "routes": [
            "5dce4e79-758c-4a89-81f1-bd48a0a6550b",
            "12508e5c-abd3-4d57-9d02-9eb69fc0edbc",
            "6012e366-9415-4731-99c7-b18ea6d280eb"
        ],
        "broken": null
    }

}