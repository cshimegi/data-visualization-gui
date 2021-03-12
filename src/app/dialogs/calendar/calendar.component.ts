import { Component, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarEvent, CalendarTriage, CalendarRemindMinute } from '@app/_models_';
import { CalenderService } from '@app/_services_';
import { CalendarRepositoryService } from '@app/_repos_';

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

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<CalendarComponent>,
        private formBuilder: FormBuilder,
        private calendarService: CalenderService
    ) {
        if (!data.title) {
            data.title = "Dialog"
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
            fromTime: [0, [
                Validators.required,
                Validators.pattern('[\d+]')
            ]],
            toTime: [0, [
                Validators.required,
                Validators.pattern('[\d+]')
            ]]
        });
    }

    get f ()
    {
        return this.form.controls;
    }

    private close (data: any): void
    {
        this.dialogRef.close(data);
    }

    onClose (): void
    {
        this.close("Thanks for using me!");
        this.dialogRef.afterClosed()
            .subscribe(value => {
                console.log(`Dialog sent: ${value}`); 
            });
    }

    onSubmit (): void
    {
        console.log(this.f);
        this.close("Thanks for using me!!");
    }

    @HostListener("keydown.esc") 
    onEsc (): void
    {
        this.close(false);
    }
}
