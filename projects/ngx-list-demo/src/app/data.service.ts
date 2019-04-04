import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataService {


  private _data: any[] = [];
  private _data$: BehaviorSubject<any[]> = new BehaviorSubject([]);



  constructor(
    private client: HttpClient
  ) {

    this.client.get(`assets/d.json`)
      .toPromise()
      .then(r => {
        this._data = r as any[];
        this._data$.next(this._data);
      });


  }

  get data$(): Observable<any[]> {
    return this._data$.asObservable();
  }

  add(pair: any) {
    this._data.push(pair);
    this._data$.next(this._data);
  }
}
