import { isMobile } from "react-device-detect";


export const defaultLocalSettings = {
    non_local_api_ip: '',
    non_local_api: false,
    mapViewEnabled: isMobile ? false : true,
    toggleDevOptions: false,
    currentMapId: "7166abf6-4b94-4373-8eb5-f6d8a775bfdf",
    authenticated: null,
    refreshToken: null,
    accessToken: null,
}
