import { HttpClient, HttpHandler } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { UserService } from "src/app/core/services";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ProfileComponent } from "./profile.component";
import { ValidationMessagesComponent, ValidationService } from "src/app/core/components";
import { IndividualConfig, ToastrService } from "ngx-toastr";
import { RouterTestingModule } from "@angular/router/testing";
import { CoreModule } from "src/app/core/core.module";

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

// eslint-disable-next-line
const userService = { getCurrentUser: () => { return { firstName: "Henk" }; } };

describe("ProfileComponent", () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [
            RouterTestingModule,
            HttpClientTestingModule,
            ReactiveFormsModule,
            CoreModule
        ],
        declarations: [ ProfileComponent, ValidationMessagesComponent ],
        providers: [ValidationService,
            { provide: ToastrService, useValue: toastrService },
            { provide: UserService, useValue: userService }
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have field password type password", () => {
    const itemType = fixture.nativeElement.querySelector("[name='password']").getAttribute("type");
    expect(itemType).toEqual("password");
  });
});
