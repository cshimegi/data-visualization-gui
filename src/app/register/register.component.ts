import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services_';
import { comparePassword } from '@app/_helpers_';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
    form: FormGroup;
    returnUrl: string;

    isLoading = false;
    isSubmitted = false;
    isSubmittedError = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            name: ['', [
                Validators.required,
                Validators.pattern('[-\w]+'),
                Validators.minLength(8),
                Validators.maxLength(32)
            ]],
            email: ['', [
                Validators.required,
                Validators.email
            ]],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(32)
            ]],
            confirmPassword: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(32)
            ]]
        },
        {
          // Used custom form validator
          validator: comparePassword()
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    /**
     * convenient getter for easy access to form fields
     */
    get f() { return this.form.controls; }

    /**
     * 
     */
    onSubmit() {
        this.isSubmitted = true;
        this.isLoading = true;
        this.isSubmittedError = false;

        if (this.form.invalid) {
            return
        };

        let formData = this.form.getRawValue();
        formData['confirmed_password'] = formData.confirmPassword;
        
        delete formData.confirmPassword;
        this.accountService.register(formData)
            .pipe(first())
            .subscribe(
                (data: any) => {
                    this.router.navigate([this.returnUrl]);
                },
                (error: HttpErrorResponse) => {
                    this.isLoading = false;
                    this.isSubmittedError = true;
                }
            );
    }
}
