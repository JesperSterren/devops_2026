import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HeaderComponent } from "./header.component";
import { UserService } from "../../services";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { Router } from "@angular/router";
import { LoginService } from "src/app/feature/user/login/login.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ValidationMessagesComponent } from "../../components";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [ UserService, LoginService ],
      declarations: [ HeaderComponent, ValidationMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
