import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { PagintedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { AlertifyService } from './alertify.service';
import { Message } from '../_models/message';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, alertify: AlertifyService) {}

    getUsers(page?, itemsPerPage?, userParams?, likesParam?): Observable<PagintedResult<User[]>> {
      // tslint:disable-next-line: no-debugger
      debugger;
      const paginatedResult: PagintedResult<User[]> = new PagintedResult<User[]>();
      let params = new HttpParams();
      if ( page != null && itemsPerPage != null) {
       params = params.append('pageNumber', page);
       params = params.append('PageSize', itemsPerPage);
      }
      if (userParams != null) {
        params = params.append('minAge',  userParams.minAge );
        params = params.append('maxAge',  userParams.maxAge );
        params = params.append('gender',  userParams.gender );
        params = params.append('orderBy', userParams.orderBy);
      }

      // tslint:disable-next-line: triple-equals
      if (likesParam == 'Likers') {
        params = params.append('likers', 'true');
      }

      // tslint:disable-next-line: triple-equals
      if (likesParam == 'Likees') {
         params = params.append('likees', 'true');
      }
      return this.http.get<User[]>(this.baseUrl + 'users', { observe: 'response', params})
      .pipe(
        map(response => {
            paginatedResult.result = response.body;
            if (response.headers.get('Pagination') != null) {
              paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
            }
            return paginatedResult;
        })
      );
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'Users/' + id, user);
  }
  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
  }
  deletePhoto(userId: number, id: number) {
         return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
  }

  sendLike(id: number, recipientId: number) {
     return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
  }
  getMessages(id: number, page?, itemsPerPage?, messageContainer?) {
    const paginatedResult: PagintedResult<Message[]> = new PagintedResult<Message[]>();
    let params = new HttpParams();

    params = params.append('MessageContainer', messageContainer);

    if ( page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('PageSize', itemsPerPage);
     }
    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', {observe: 'response', params})
     .pipe(
       map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('pagination'));
        }
        return paginatedResult;
       })
     );
  }



  getMessageThread(id: number, recipientId: number) {
   return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId);
  }

  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + 'users/' + id + '/messages', message);
  }
  deleteMessage(id: number, userId: number) {
     return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
  }
  markAsRead(userId: number, messageId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read', {})
    .subscribe();
  }
}
