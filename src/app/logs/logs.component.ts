import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  messages: string[] = [];

  clear() {
    this.messageService.clear();
  }

  constructor(
    public messageService: MessageService,
    public loadingService: LoadingService,
    ) { }

  ngOnInit(): void {
    this.messages = this.messageService.messages;
  }

}
