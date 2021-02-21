export class CalendarUser {
    id      : bigint;
    username: string;
    email   : string;
}

export enum DefaultEvents {
    BREAKFAST = 1,
    LUNCH     = 2,
    DINNER    = 3,
    SPORTS    = 4,
    TRAVEL    = 5,
    FAMILY    = 6
}

export enum Triage {
    BLACK  = 4,
    GREEN  = 3,
    ORANGE = 2,
    RED    = 1
}

export enum RemindMinutes {
    NO_REMIND      = 0,
    TEN_MINS       = 10,
    ONE_QUARTER    = 15,
    HALF_HOUR      = 30,
    THREE_QUARTERS = 45,
    ONE_HOUR       = 60
}

export class Calendar {
    id            : number;
    user          : CalendarUser;
    label         : string;
    detail        : string;
    triage        : Triage = Triage.BLACK;
    do_remind     : boolean = false;
    remind_minutes: RemindMinutes = RemindMinutes.NO_REMIND;
    from_time     : number = 0;
    to_time       : number = 0;
}