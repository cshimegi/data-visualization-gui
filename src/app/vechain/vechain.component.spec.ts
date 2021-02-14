import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VechainComponent } from './vechain.component';

describe('VechainComponent', () => {
    let component: VechainComponent;
    let fixture: ComponentFixture<VechainComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
        declarations: [ VechainComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VechainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
