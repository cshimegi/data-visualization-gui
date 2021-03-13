import { Component, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarEvent, CalendarTriage, CalendarRemindMinute } from '@app/_models_';
import { CalenderService, DateService } from '@app/_services_';
import { CalendarRepositoryService } from '@app/_repos_';
import { HttpErrorResponse } from '@angular/common/http';
import { Utils } from '@app/_helpers_';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent {
    form: FormGroup;
    eventLabels: Array<CalendarEvent>;
    eventTriages: Array<CalendarTriage>;
    eventRemindMinutes: Array<CalendarRemindMinute>;
    isDeleteButton: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<CalendarComponent>,
        private formBuilder: FormBuilder,
        private calendarService: CalenderService,
        private calendarRepoService: CalendarRepositoryService,
        private dateService: DateService
    ) {
        if (!this.data.title) {
            this.data.title = "Dialog"
        }

        if (this.data.hasOwnProperty('isDeleteButton')) {
            this.isDeleteButton = this.data.isDeleteButton;
        }
        
        this.eventLabels = this.calendarService.getDefaultEvents();
        this.eventTriages = this.calendarService.getTriages();
        this.eventRemindMinutes = this.calendarService.getRemindMinutes();
        const defaultTriage = this.calendarService.getDefaultTriage();
        const defaultRemindMinutes = this.calendarService.getDefaultRemindMinute();
        this.form = this.formBuilder.group({
            label: ['', [
                Validators.required,
                Validators.maxLength(64)
            ]],
            detail: [''],
            triage: [defaultTriage.id, [
                Validators.required
            ]],
            doRemind: [false, [
                Validators.required
            ]],
            remindMinutes: [defaultRemindMinutes.id, [
                Validators.required
            ]],
            fromTime: [null, [
                Validators.required
            ]],
            toTime: [null, [
                Validators.required
            ]]
        });
        
        if (!this.data.isCreate) {
            this.initUpdateFormValues();
        }

        this.initDialogAfterClosed();
    }

    private initUpdateFormValues (): void
    {
        const event = this.data.event;
        const values = Utils.pluckExclude(event, ['id']);
        
        this.form.setValue(values);
    }

    private initDialogAfterClosed (): void
    {
        this.dialogRef.afterClosed()
            .subscribe(value => {
                if (value) {
                    if (this.data.isCreate && this.data.addEventCallback) {
                        this.data.addEventCallback.apply(null, [value]);
                    } else {
                        if (this.data.updateEventCallback) {
                            this.data.updateEventCallback.apply(null, [value]);
                        }

                        if (this.data.deleteEventCallback) {
                            this.data.deleteEventCallback.apply(null, [value]);
                        }
                    }
                }
                
            });
    }

    private close (data: any): void
    {
        this.dialogRef.close(data);
    }

    onClose (): void
    {
        this.close(false);
    }

    onSubmit (): void
    {
        if (this.data.isCreate) {
            this.doCreation();
        } else {
            this.doUpdate();
        }
    }

    private doCreation (): void
    {
        this.form.patchValue({
            fromTime: this.dateService.getUnixDatetime(this.form.value.fromTime),
            toTime: this.dateService.getUnixDatetime(this.form.value.toTime)
        });

        const params = this.calendarService.formatParams(this.form.value);
        const createObservable = this.calendarRepoService.createCalendar(params);
        const createObserver = {
            next: (data: any) => {
                this.close(data);
            },
            error: (error: HttpErrorResponse) => {
                console.error("Error => ", error);
            },
            complete: () => {}
        };
        
        createObservable.subscribe(createObserver);
    }

    private doUpdate (): void
    {
        const id = this.data.event.id;
        const params = this.calendarService.formatParams(this.form.value);
        const updateObservable = this.calendarRepoService.updateById(id, params);
        const updateObserver = {
            next: (data: any) => {
                this.close(data);
            },
            error: (error: HttpErrorResponse) => {
                console.error("Error => ", error);
            },
            complete: () => {}
        };
        
        updateObservable.subscribe(updateObserver);
    }

    @HostListener("keydown.esc") 
    onEsc (): void
    {
        this.close(false);
    }

    onDelete (): void
    {
        const id = this.data.event.id;
        const deleteObservable = this.calendarRepoService.deleteById(id);
        const deleteObserver = {
            next: (data: any) => {
                this.close(id.toString());
            },
            error: (error: HttpErrorResponse) => {
                console.error("Error => ", error);
            },
            complete: () => {}
        };
        
        deleteObservable.subscribe(deleteObserver);
    }
}
