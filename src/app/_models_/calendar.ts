export interface CalendarEvent {
    id   : number;
    label: string;
}
export interface CalendarTriage {
    id   : number;
    label: string;
    color: string;
}

export interface CalendarRemindMinute {
    id   : number;
    label: string;
}

export interface Calendar {
    label         : string;
    detail        : string | null;
    triage        : number;
    do_remind     : boolean;
    remind_minutes: number;
    from_time     : number;
    to_time       : number;
}