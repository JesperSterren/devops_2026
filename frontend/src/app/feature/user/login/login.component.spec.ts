import { HttpClient, HttpHandler } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { IndividualConfig, ToastrService } from "ngx-toastr";
import { ValidationMessagesComponent, ValidationService } from "src/app/core/components";
import { CoreModule } from "src/app/core/core.module";

import { LoginComponent } from "./login.component";
import { LoginService } from "./login.service";

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

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [
            RouterTestingModule,
            ReactiveFormsModule,
            HttpClientTestingModule,
            CoreModule
        ],
        declarations: [ LoginComponent, ValidationMessagesComponent ],
        providers: [LoginService, ValidationService, { provide: ToastrService, useValue: toastrService } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
