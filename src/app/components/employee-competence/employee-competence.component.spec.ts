import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EmployeeCompetenceComponent} from './employee-competence.component';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { PreferencesService } from 'app/_services/preferences.service';
import { AuthService } from 'app/_services/auth.service';
import { WINDOW_PROVIDERS } from 'app/window.provider';
import { RouterTestingModule } from '@angular/router/testing';

describe('EmployeeCompetenceComponent', () => {
  let component: EmployeeCompetenceComponent;
  let fixture: ComponentFixture<EmployeeCompetenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeCompetenceComponent],
      providers: [
        PreferencesService,
        AuthService,
        WINDOW_PROVIDERS
      ],
      imports: [ToasterModule, FormsModule, NgxDatatableModule, NgbPopoverModule, HttpClientModule,
        RouterTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeCompetenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create employee-competence/employee-competence.component', () => {
    expect(component).toBeTruthy();
  });
});
