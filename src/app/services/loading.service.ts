import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  
  private loading = true;

  constructor() { }

  toggleLoading(){
    this.loading = !this.loading;
  }

  setLoading(isLoading: boolean){
    this.loading = isLoading;
  }

  getLoading(){
    return this.loading;
  }
}
