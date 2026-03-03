import { Component, OnInit } from "@angular/core";
import { UserService } from "../../../core/services/user.service";
import { User } from "../../../core/models/user.interface";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ValidationService } from "../../../core/components";
import { Router } from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
  user: User;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  createProfileForm(): void {
    // eslint-disable-next-line
    this.profileForm = this.formBuilder.group({
      _id: [""],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", Validators.required],
      mobile: ["", [Validators.required, Validators.minLength(10)]]
    });
  }
  createPasswordForm(): void {
    // eslint-disable-next-line
    this.passwordForm = this.formBuilder.group(
      {
        username: ["", Validators.required],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required]
      },
      {
        validator: this.validationService.MustMatch("password", "confirmPassword")
      }
    );
  }

  resetProfileForm(): void {
    this.profileForm.reset();
    this.profileForm.patchValue(this.userService.getCurrentUser());
  }
  updateProfile(): void {
    this.userService.update(this.profileForm.value).subscribe(
      (data) => {
        this.toastrService.success("Profile updated successful");
        const user = data;
        user.token = this.user.token;
        localStorage.setItem("currentUser", JSON.stringify(user));
      },
      (error) => {}
    );
  }

  resetPasswordForm(): void {
    this.passwordForm.reset();
    this.passwordForm.get("username").patchValue(this.user.username);
  }
  updatePassword(): void {
    // eslint-disable-next-line no-underscore-dangle
    this.userService.changePassword(this.user._id, this.passwordForm.get("password").value).subscribe(
      (data) => {
        this.toastrService.success("Profile updated successful");
        this.router.navigate(["/login"]);
      },
      (error) => {}
    );
  }

  ngOnInit(): void {
    this.createProfileForm();
    this.createPasswordForm();
    this.user = this.userService.getCurrentUser();
    this.profileForm.patchValue(this.user);
    this.passwordForm.get("username").patchValue(this.user.username);
  }
}
