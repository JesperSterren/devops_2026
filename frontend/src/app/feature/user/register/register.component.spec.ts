import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { IndividualConfig, ToastrService } from "ngx-toastr";
import { ValidationMessagesComponent, ValidationService } from "src/app/core/components";
import { CoreModule } from "src/app/core/core.module";
import { UserService } from "src/app/core/services";

import { RegisterComponent } from "./register.component";

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

describe("RegisterComponent", () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [
            RouterTestingModule,
            HttpClientTestingModule,
            ReactiveFormsModule,
            CoreModule
        ],
        declarations: [ RegisterComponent, ValidationMessagesComponent ],
        providers: [UserService, ValidationService, { provide: ToastrService, useValue: toastrService } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
