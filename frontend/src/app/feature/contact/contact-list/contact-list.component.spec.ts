import { HttpClient, HttpHandler } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ValidationMessagesComponent } from "src/app/core/components";
import { CoreModule } from "src/app/core/core.module";
import { ContactService } from "../contact.service";

import { ContactListComponent } from "./contact-list.component";

describe("ContactListComponent", () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [
            RouterTestingModule,
            HttpClientTestingModule,
            NgxDatatableModule,
            CoreModule
        ],
        declarations: [ ContactListComponent, ValidationMessagesComponent ],
        providers: [ ContactService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
