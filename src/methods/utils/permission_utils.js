import {
    isMobile
} from "react-device-detect";

export const checkPermission = (userPermissions, request) => {
    return !isMobile
}