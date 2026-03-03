import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { User } from "../models/user.interface";
import { Observable } from "rxjs";

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<User[]>(environment.apiEndpoint + "/users").pipe(
      map((users: any) => users.data)
    );
  }

  getById(id: string): Observable<any> {
    return this.http.get<User>(environment.apiEndpoint + "/user/" + id).pipe(
      map((user: any) => user.data)
    );
  }
  getCurrentUser(): User {
    if (localStorage.getItem("currentUser")) {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      return user;
    }
  }

  create(user: User): Observable<any> {
    return this.http.post(environment.apiEndpoint + "/users", user);
  }

  update(user: User): Observable<any> {
    // eslint-disable-next-line no-underscore-dangle
    return this.http.put<User>(environment.apiEndpoint + "/user/" + user._id, user).pipe(
      map((mappedUser: any) => mappedUser.data)
    );
  }

  changePassword(id: string, password: any): Observable<any> {
    return this.http.put(environment.apiEndpoint + "/user/changepassword/" + id, { password }).pipe(map((res: any) => res.data));
  }

  delete(id: string): Observable<any> {
    return this.http.delete(environment.apiEndpoint + "/user/" + id);
  }
}
