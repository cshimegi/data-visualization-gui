import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DateService, CalenderService } from '@app/_services_';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import ja from '@fullcalendar/core/locales/ja';
import zhTw from '@fullcalendar/core/locales/zh-tw';
import { CalendarRepositoryService } from '@app/_repos_';
import { Calendar, CalendarEvent, CalendarTriage, CalendarRemindMinute } from '@app/_models_';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CalendarComponent } from '@app/dialogs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.scss']
})

export class ScheduleComponent implements OnInit, AfterViewInit {
    @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
    @ViewChild('external') external: ElementRef;

    isRemoveChecked: boolean = false;
    options: any;
    events: Array<CalendarEvent>;
    private registedEvents: Array<any> = [];
    private defaultTriage: CalendarTriage;
    private defaultRemindMinute: CalendarRemindMinute;

    constructor (
        private dateService: DateService,
        private calendarRepoService: CalendarRepositoryService,
        private calendarService: CalenderService,
        private matDialog: MatDialog
    )
    { }

    ngOnInit ()
    {
        this.events = this.calendarService.getDefaultEvents();
        this.defaultTriage = this.calendarService.getDefaultTriage();
        this.defaultRemindMinute = this.calendarService.getDefaultRemindMinute();
        this.getRegistedEvents();
    }

    ngAfterViewInit ()
    {
        this.initDraggableMenus();
    }

    private initFullCalendarOptions (): void
    {
        console.log(this.registedEvents)
        this.options = {
            // themeSystem: 'bootstrap',
            customButtons: {
                new: {
                    text: 'New',
                    click: this.newEventDialog.bind(this)
                }
            },
            headerToolbar: {
                left: 'prev,next today new',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            editable: true,
            droppable: true, // allow things to be dropped onto the calendar
            aspectRatio: 2.3,
            handleWindowResize: true, // make calendar be responsive
            initialView: 'dayGridMonth',
            dateClick: this.handleDateClick.bind(this), // bind to ScheduleComponent's scope
            eventResize: this.handleEventResize.bind(this),
            eventClick: this.handleEventClick.bind(this),
            eventDrop: this.handleEventDrop.bind(this),
            eventReceive: this.handleEventReceive.bind(this),
            events: this.registedEvents,
            locales: [ ja, zhTw ],
            locale: "en", //ja, zh-tw
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin]
        };
    }

    private initDraggableMenus (): void
    {
        new Draggable(this.external.nativeElement, {
            itemSelector: '.fc-event',
            eventData: function(eventEl) {
              return {
                title: eventEl.innerText
              }
            }
        });
    }

    /**
     * Get all registed events of current user
     * 
     * @return registedEvents
     */
    getRegistedEvents ()
    {
        const calendarObservable = this.calendarRepoService.getAllCalendars();
        const calendarObserver = {
            next: (data: any) => {
                this.registedEvents = this.formatCalendar(data);
                this.initFullCalendarOptions();
            },
            error: (error: HttpErrorResponse) => {
                console.error("Error => ", error);
            },
            complete: () => {}
        };
        
        calendarObservable.subscribe(calendarObserver);
    }

    private formatCalendar (results: any): Array<any>
    {
        const DATE_FORMAT = 'YYYY-MM-DD';

        return results.map((result) => {
            const start = this.dateService.formatDatetime(result['from_time'] * 1000, DATE_FORMAT);
            const end = result['to_time']
                ? this.dateService.formatDatetime(result['to_time'] * 1000, DATE_FORMAT)
                : start;
            const backgroundColor = this.calendarService.getTriageColor(result.triage);

            return {
                id: result.id,
                title: result.label,
                start: start,
                end: end,
                backgroundColor: backgroundColor,
                extendedProps: {
                    detail: result.detail,
                    doRemind: result['do_remind'],
                    remindMinutes: result['remind_minutes']
                }
            };
        });
    }

    private newEventDialog (): void
    {
        let dialogConfig = new MatDialogConfig();
        dialogConfig.width = '350px';
        dialogConfig.data = {
            title: "New Event",
            message: "Go ahead to create a new event",
            button: {
                onSubmitText: "Create",
                onCloseText: "Close"
            }
        };
        // dialogConfig.direction = 'rtl';
        this.matDialog.open(CalendarComponent, dialogConfig);
    }

    /**
     * Handle date click event
     * 
     * @param arg
     */
    handleDateClick (arg): void
    {
        // ToDo: show all events of that date
        console.log('date click! ', arg);
    }

    /**
     * Handle event resize event
     * 
     * @param eventInfo
     */
    handleEventResize (eventInfo): void
    {
        const params = this.processCalendarParams(eventInfo);
        const results = this.calendarRepoService.createCalendar(params);

        console.log(results);
    }

    /**
     * Handle event click event
     * 
     * @param eventInfo
     */
    handleEventClick (eventInfo): void
    {
        console.log('EventClick', eventInfo)
    }

    /**
     * Handle event drop event
     * 
     * @param eventInfo
     */
    handleEventDrop (eventInfo): void
    {
        const params = this.processCalendarParams(eventInfo);
        const results = this.calendarRepoService.createCalendar(params);

        console.log(results);
    }

    /**
     * Handle event receive event
     * 
     * @param eventInfo
     */
    handleEventReceive (eventInfo): void
    {
        const params = this.processCalendarParams(eventInfo);
        console.log(params)
        this.calendarRepoService.createCalendar(params)
            .subscribe(
                (data: any) => {
                    console.log(data)
                },
                (error: HttpErrorResponse) => {
                    console.error("Error => ", error);
                }
            );
        
        
        this.removeEventAfterDrop(eventInfo);
    }

    private processCalendarParams (eventInfo): Calendar
    {
        const label = eventInfo.event.title;
        let startDate = eventInfo.event.start;
        let endDate = eventInfo.event.end;
        startDate = startDate
            ? this.dateService.getUnixDatetime(startDate)
            : 0;
        endDate = endDate 
            ? this.dateService.getUnixDatetime(endDate)
            : 0;

        return this.getCalendarParams({
            label: label,
            fromTime: startDate,
            toTime: endDate
        });
    }

    /**
     * Remove dragged event from menu after dropped
     * 
     * @param eventInfo
     */
    private removeEventAfterDrop (eventInfo): void
    {
        // is the "remove after drop" checkbox checked?
        // if (checkbox.checked) {
        //   // if so, remove the element from the "Draggable Events" list
        //   eventInfo.draggedEl.parentNode.removeChild(eventInfo.draggedEl);
        // }
    }

    private getCalendarParams (data: any): Calendar
    {
        return {
            label: data.label,
            detail: data.detail ?? "",
            triage: data.triage ?? this.defaultTriage.id,
            do_remind: data.doRemind ?? false,
            remind_minutes: data.remindMinutes ?? this.defaultRemindMinute.id,
            from_time: data.fromTime,
            to_time: data.toTime
        };
    }
}