import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ForbiddenComponent } from '../forbidden/forbidden.component';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  constructor(public dialog: MatDialog) { }

  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }

  openDialog() {
    this.dialog.open(ForbiddenComponent);
  }

  getStatusString(statusEnum: string | String) {
    switch (statusEnum) {
      case 'UNDER_PRODUCTION':
        return "Under Production";
      case 'UNDER_ASSEMBLY':
        return "Under Assembly";
      case 'IN_STOCK':
        return "In Stock";
      case 'UNDER_SHIPPING':
        return "Under Shipping";
      case 'SUCCESSFULLY_COMPLETED':
        return "Successfully Completed";
      case 'CLOSED':
        return "Closed";
      case 'ISSUE':
        return "Issue";
      case 'NEW':
        return "New";
      case 'OFFER':
        return "Offer";
    }
  }

  getRoleString(roleEnum: string | String) {
    switch (roleEnum) {
      case 'ROLE_ADMIN':
        return "Admin";
      case 'ROLE_DIRECTOR':
        return "Director";
      case 'ROLE_MANAGER':
        return "Manager";
    }
  }

  getHistoryTypeString(historyTypeEnum: string | String) {
    switch (historyTypeEnum) {
      case 'PHONE_CALL':
        return "Phone Call";
      case 'EMAIL_SENT':
        return "Email Sent";
      case 'STATUS_MODIFIED':
        return "Status Modified";
      case 'MADE_AN_OFFER':
        return "Made An Offer";
      case 'DISCUSSION':
        return "Discussion";
      case 'STARTED_SHIPPING':
        return "Started Shipping";
      case 'PAID':
        return "Paid";
      case 'ORDER':
        return "Ordered";
      case 'OFFER':
        return "Offer Given";
      case 'NOTE':
        return "Note Added";
      case 'SHIPPED':
        return "Shipped";
    }
  }


}