import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination, PagintedResult } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'unread';

  constructor(private userService: UserService, private authService: AuthService,
              private route: ActivatedRoute, private alertify: AlertifyService) { }

  ngOnInit() {
  this.route.data.subscribe(date => {
    this.messages = date['messages'].result;
    this.pagination = date['messages'].pagination;
  })
  }

  loadMessages() {
    this.userService.getMessages(this.authService.decodedToken.nameid,
       this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer)
           .subscribe((res: PagintedResult<Message[]>) => {
             this.messages = res.result;
             this.pagination = res.pagination;
           }, error => {
             this.alertify.error(error);
           });
  }
  deleteMessage(id: number) {
    this.alertify.confirm('Are you sure to delete this message!', () => {
      this.userService.deleteMessage(id, this.authService.decodedToken.nameid).subscribe(() => {
        this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
        this.alertify.success('Message has been deleted');
      }, error => {
        this.alertify.error('Failed to delete message');
      });
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
}
