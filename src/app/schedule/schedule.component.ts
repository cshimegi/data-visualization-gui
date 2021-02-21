import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DateService } from '@app/_services_';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import ja from '@fullcalendar/core/locales/ja';
import zhTw from '@fullcalendar/core/locales/zh-tw';
import { Calendar } from '@app/_models_';

declare var $: any;

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.scss']
})

export class ScheduleComponent implements OnInit, AfterViewInit {
    @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
    @ViewChild('external') external: ElementRef;

    private readonly externalCssPath: string = "/assets/css/schedule";
    isRemoveChecked: boolean = false;
    options: any;
    events: Array<any>;
    private registedEvents: Array<any>;

    constructor (
        private dateService: DateService
    )
    { }

    ngOnInit ()
    {
        this.events = this.getDefaultEvents();
        this.registedEvents = this.getRegistedEvents();
        this.options = {
            // themeSystem: 'bootstrap',
            headerToolbar: {
                left: 'prev,next today',
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

    ngAfterViewInit ()
    {
        this.initDraggableMenus();
        this.loadCustomStyles();
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
     * Load customized styles after view is completely loaded
     */
    private loadCustomStyles (): void
    {
        let css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = `${this.externalCssPath}/schedule.external.css`;

        document.getElementById("calendar-container")
            .appendChild(css);
    }

    /**
     * Get default events for draggable menus
     * 
     * @return draggableMenus
     */
    getDefaultEvents (): Array<any>
    {
        return [
            { id: 1, label: "Breakfast" },
            { id: 2, label: "Lunch" },
            { id: 3, label: "Dinner" },
            { id: 4, label: "Sports" },
            { id: 5, label: "Travel" },
            { id: 6, label: "Family" }
        ];
    }

    /**
     * Get all registed events of current user
     * 
     * @return registedEvents
     */
    getRegistedEvents (): Array<any>
    {
        return [
            { id: 1, title: 'event 1', date: '2021-02-15' },
            { id: 2, title: 'event 2', date: '2021-02-20' }
        ];
    }

    /**
     * Handle date click event
     * 
     * @param arg
     */
    handleDateClick (arg): void
    {
        // ToDo: show all events of that date
        console.log('date click! ' + arg.dateStr);
    }

    /**
     * Handle event resize event
     * 
     * @param eventInfo
     */
    handleEventResize (eventInfo): void
    {
        console.log('EventResize', eventInfo)
        const startDate = eventInfo.event.start;
        const dateDelta = eventInfo.endDelta;
        const deltaDays = dateDelta.days;
        console.log(startDate)
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
        console.log('EventDrop', eventInfo)
        
    }

    /**
     * Handle event receive event
     * 
     * @param eventInfo
     */
    handleEventReceive (eventInfo): void
    {
        console.log('EventReceive');
        console.log(eventInfo)
        const draggedEl = eventInfo.draggedEl;
        const eventTypeId = draggedEl.id;
        const startDate = eventInfo.event.start;
        

        this.removeEventAfterDrop(eventInfo);
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
}