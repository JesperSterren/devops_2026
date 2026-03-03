import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { map, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { Observable, throwError } from "rxjs";

@Injectable()
export class ContactService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any[]>(environment.apiEndpoint + "/contacts").pipe(
      map((res: any) => res.data),
      catchError(this.handleErrorObservable)
    );
  }

  getById(id: string): Observable<any> {
    return this.http.get(environment.apiEndpoint + "/contact/" + id).pipe(
      map((res: any) => res.data),
      catchError(this.handleErrorObservable)
    );
  }

  create(contact: any): Observable<any> {
    return this.http.post(environment.apiEndpoint + "/contacts", contact).pipe(
      map((res: any) => res.data),
      catchError(this.handleErrorObservable)
    );
  }

  update(contact: any): Observable<any> {
    // eslint-disable-next-line no-underscore-dangle
    return this.http.put(environment.apiEndpoint + "/contact/" + contact._id, contact).pipe(
      map((res: any) => res.data),
      catchError(this.handleErrorObservable)
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete(environment.apiEndpoint + "/contact/" + id).pipe(
      map((res: any) => res.data),
      catchError(this.handleErrorObservable)
    );
  }
  private handleErrorObservable(error: HttpErrorResponse): any {
    return throwError(error);
  }
}
