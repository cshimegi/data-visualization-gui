import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DateService, CalenderService } from '@app/_services_';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import ja from '@fullcalendar/core/locales/ja';
import zhTw from '@fullcalendar/core/locales/zh-tw';
import { CalendarRepositoryService } from '@app/_repos_';
import { Calendar, CalendarEvent } from '@app/_models_';
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
    private dateFormat: string = 'YYYY-MM-DD';

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
        this.getRegistedEvents();
    }

    ngAfterViewInit ()
    {
        this.initDraggableMenus();
    }

    /**
     * Initialize Full-Calendar options
     */
    private initFullCalendarOptions (): void
    {
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

    /**
     * Initialize draggle menus
     */
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
        const calendarObservable = this.calendarRepoService.getAll();
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

    /**
     * Format registered events
     * 
     * @param results
     * @return All Full-Calendar events
     */
    private formatCalendar (results: any): Array<any>
    {
        return results.map((result) => this.mapToCalendarEvent(result));
    }

    /**
     * Map to registed event to Full-Calendar event
     * 
     * @param data
     * @return a registerd Full-Calendar event
     */
    private mapToCalendarEvent (data: any): any
    {
        const start = this.dateService.formatDatetime(data['from_time'] * 1000, this.dateFormat);
        const end = data['to_time']
            ? this.dateService.formatDatetime(data['to_time'] * 1000,this.dateFormat)
            : start;
        const color = this.calendarService.getTriageColor(data.triage);

        return {
            id: data.id,
            title: data.label,
            start: start,
            end: end,
            backgroundColor: color,
            borderColor: color,
            extendedProps: {
                detail: data.detail,
                triage: data.triage,
                doRemind: data['do_remind'],
                remindMinutes: data['remind_minutes']
            }
        };
    }

    /**
     * New event dialog
     */
    private newEventDialog (): void
    {
        const data = {
            title: 'New Event',
            message: 'Create a new event',
            isCreate: true,
            isSubmitButton: true,
            isCloseButton: true,
            button: {
                onSubmitText: 'Create',
                onCloseText: 'Close'
            },
            addEventCallback: this.addEventToCalendar.bind(this)
        };

        this.openDialog(data);
    }

    /**
     * Open dialog for selected event
     * 
     * @param data
     */
    private openSelectedEventDialog (event: any): void
    {
        const data = {
            title: 'Registered event',
            message: 'Update it if necessary',
            event: event,
            isCreate: false,
            isSubmitButton: true,
            isDeleteButton: true,
            isCloseButton: true,
            button: {
                onSubmitText: 'Update',
                onDeleteText: 'Delete',
                onCloseText: 'Close'
            },
            updateEventCallback: () => {},
            deleteEventCallback: this.removeEventToCalendar.bind(this)
        };

        this.openDialog(data);
    }

    /**
     * Open dialog for new event creation
     * 
     * @param data
     */
    private openDialog (data: any): void
    {
        let dialogConfig = new MatDialogConfig();
        dialogConfig.width = '350px';
        dialogConfig.data = data;
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
        this.doCreation(eventInfo);
    }

    /**
     * Handle event click event
     * 
     * @param eventInfo
     */
    handleEventClick (eventInfo): void
    {
        const event = this.formatSelectedEventParams(eventInfo);
        this.openSelectedEventDialog(event);
    }

    /**
     * Format selected event params
     * 
     * @param eventInfo
     */
    private formatSelectedEventParams (eventInfo): any
    {
        const event = eventInfo.event;

        return {
            id: event.id,
            label: event.title,
            detail: event.extendedProps.detail,
            triage: event.extendedProps.triage,
            doRemind: event.extendedProps.doRemind,
            remindMinutes: event.extendedProps.remindMinutes,
            fromTime: event.start,
            toTime: event.end ?? event.start
        };
    }

    /**
     * Handle event drop event
     * 
     * @param eventInfo
     */
    handleEventDrop (eventInfo): void
    {
        this.doCreation(eventInfo);
    }

    /**
     * Handle event receive event
     * 
     * @param eventInfo
     */
    handleEventReceive (eventInfo): void
    {
        this.doCreation(eventInfo);
        this.removeEventAfterDrop(eventInfo);
    }

    /**
     * Process params for creation
     * 
     * @param eventInfo
     * @return Calendar
     */
    private processCreateParams (eventInfo: any): Calendar
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

        return this.calendarService.formatParams({
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

    /**
     * Request server to create an event
     * 
     * @param eventInfo
     */
    private doCreation (eventInfo): void
    {
        const params = this.processCreateParams(eventInfo);
        const calendarObservable = this.calendarRepoService.createCalendar(params);
        const calendarObserver = {
            next: (data: any) => {
                // ToDo: do something but not call addEventToCalendar
                // since it will be added by full-calendar itself
            },
            error: (error: HttpErrorResponse) => {
                // show error message and remove event from calendar due to fail
                console.error("Error => ", error);
            },
            complete: () => {}
        };
        
        calendarObservable.subscribe(calendarObserver);
    }

    /**
     * Add new registered event from dialog to calender without loading
     * 
     * @param newEvent
     */
    addEventToCalendar (newEvent: any): void
    {
        const event = this.mapToCalendarEvent(newEvent);

        this.fullcalendar.getApi()
            .addEvent(event);
    }

    /**
     * Remove an deleted event from calendar without loading
     * 
     * @param eventId
     */
    removeEventToCalendar (eventId: string): void
    {
        this.fullcalendar.getApi()
            .getEventById(eventId)
            .remove();
    }
}