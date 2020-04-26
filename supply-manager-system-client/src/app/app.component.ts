import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ForbiddenDialogComponent } from './forbidden-dialog/forbidden-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Supply Manager System (SMS) Client';

  constructor(
    public authService: AuthService,
  ){}

  logout()
  {
    this.authService.logout();
  }
}
