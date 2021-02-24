// regex for time string
export const timeStringRegex = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;

// regex for OID's
export const oidRegex = /^([0-2])((\.0)|(\.[1-9][0-9]*))*$/;

// valid if input does NOT match "broken" or "BROKEN"
export const notBrokenRegex = /^(?!.*(broken|.*BROKEN))/;

// valid if input does NOT match "TASK DELETED"
export const notTaskDeletedRegex = /^(?!.*(TASK DELETED))/;

export const hoursRegex = /^(2[0-4]|1[0-9]|0[0-9]|[0-9])$/;
export const minutesRegex = /^(5[0-9]|4[0-9]|3[0-9]|2[0-9]|1[0-9]|[0-9])$/;
export const secondsRegex = /^(5[0-9]|4[0-9]|3[0-9]|2[0-9]|1[0-9]|[0-9])$/;
