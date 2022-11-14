import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {

  private messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>("Initial message")
  broadcastMessage$ = this.messageSubject.asObservable()
  
  constructor() { }

  sendMessage(message: string){
    this.messageSubject.next(message);
  }
}