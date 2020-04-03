import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ForbiddenDialogComponent } from './forbidden-dialog/forbidden-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Supply Manager System (SMS) Client';

  constructor(
    public authService: AuthService,
    private dialog: MatDialog,
  
  ){}

  logout()
  {
    this.authService.logout();
  }

  //================================================

  openDialog() {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      data:{
        message: 'Are you sure?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        console.log("YES");
      }
      else{
        console.log("No");
      }
    });

  }

  openAlertDialog() {
    const dialogRef = this.dialog.open(ForbiddenDialogComponent,{
      data:{
        message: 'Alet Text',
        buttonText: {
          cancel: 'Ok'
        }
      },
    });
  }
}
