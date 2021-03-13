import { Injectable } from '@angular/core';
import {
    CalendarEvent,
    CalendarTriage,
    CalendarRemindMinute,
    Calendar
} from '@app/_models_';


@Injectable({ providedIn: 'root' })

export class CalenderService {
    private readonly defaultEvents: Array<CalendarEvent> = [
        { id: 1, label: "Breakfast" },
        { id: 2, label: "Lunch" },
        { id: 3, label: "Dinner" },
        { id: 4, label: "Sports" },
        { id: 5, label: "Travel" },
        { id: 6, label: "Family" }
    ];
    private readonly triages: Array<CalendarTriage> = [
        { id: 1, label: "Very high", color: "red" },
        { id: 2, label: "High", color: "orange" },
        { id: 3, label: "Normal", color: "#3788d8" },
        { id: 4, label: "Low", color: "#FFD700" },
        { id: 5, label: "Very low", color: "green" }
    ];
    private readonly remindMinutes: Array<CalendarRemindMinute> = [
        { id: 0, label: "No Remind" },
        { id: 10, label: "10 Minutes" },
        { id: 15, label: "15 Minutes" },
        { id: 30, label: "30 Minutes" },
        { id: 45, label: "45 Minutes" },
        { id: 60, label: "60 Minutes" }
    ];

    constructor (
    ) {}

    getDefaultEvents (): Array<CalendarEvent>
    {
        return this.defaultEvents;
    }

    getDefaultTriage (): CalendarTriage
    {
        return this.triages[2]; // normal
    }

    getTriages (): Array<CalendarTriage>
    {
        return this.triages;
    }

    getDefaultRemindMinute (): CalendarRemindMinute
    {
        return this.remindMinutes[0];
    }

    getRemindMinutes (): Array<CalendarRemindMinute>
    {
        return this.remindMinutes;
    }
    
    getTriageColor (triageId: number): string
    {
        const target = this.triages.filter(triage => triage.id === triageId)[0];

        return target ? target.color : '';
    }

    getRemindMinutesLabel (remindMinutesId: number): string
    {
        const target = this.remindMinutes.filter(rm => rm.id === remindMinutesId)[0];

        return target ? target.label : '';
    }

    formatParams (data: any): Calendar
    {
        return {
            label: data.label ?? "",
            detail: data.detail ?? "",
            triage: data.triage ?? this.getDefaultTriage().id,
            do_remind: data.doRemind ?? false,
            remind_minutes: data.remindMinutes ?? this.getDefaultRemindMinute().id,
            from_time: data.fromTime ?? 0,
            to_time: data.toTime ?? 0
        };
    }
}