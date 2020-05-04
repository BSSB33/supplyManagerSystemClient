import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ForbiddenComponent } from '../forbidden/forbidden.component';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  constructor(
    public loadingService: LoadingService,
  ) { }

  ngOnInit(): void {
    this.loadingService.setLoading(false);
  }
  
  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }

}