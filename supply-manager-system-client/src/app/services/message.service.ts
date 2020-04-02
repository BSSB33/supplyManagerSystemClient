import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ForbiddenComponent } from '../forbidden/forbidden.component';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  constructor(public dialog: MatDialog){}

  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }

  openDialog() {
    this.dialog.open(ForbiddenComponent);
    console.log("called!");
  }
}