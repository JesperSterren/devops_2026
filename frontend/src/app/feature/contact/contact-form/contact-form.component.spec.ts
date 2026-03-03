import { HttpClient, HttpHandler } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { IndividualConfig, ToastrService } from "ngx-toastr";
import { ValidationMessagesComponent, ValidationService } from "src/app/core/components";
import { CoreModule } from "src/app/core/core.module";
import { ContactService } from "../contact.service";

import { ContactFormComponent } from "./contact-form.component";

const toastrService = {
    success: (
      message?: string,
      title?: string,
      override?: Partial<IndividualConfig>
    ) => {},
    error: (
      message?: string,
      title?: string,
      override?: Partial<IndividualConfig>
    ) => {},
  };

describe("ContactFormComponent", () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [
            RouterTestingModule,
            HttpClientTestingModule,
            ReactiveFormsModule,
            CoreModule
        ],
        declarations: [ ContactFormComponent, ValidationMessagesComponent ],
        providers: [ValidationService, ContactService, {
            provide: ToastrService, useValue: toastrService
        }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
