import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
export interface SockPair {
  id: number;
  firstName: string;
  lastName: string;
  missing: string;
  color: string;
  value: number;
  age: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  static colors = ['black', 'white', 'red', 'blue', 'turquoise', 'white', 'orange', 'red', 'violet', 'pink', 'brown', 'green'];
  static firstNames = [
    'Bob', 'George', 'Timmy', 'Loki', 'Hedda', 'Charles', 'Tom', 'Nate', 'Roger', 'Eric', 'Vanity', 'Prudence',
    'Patty', 'Ratty', 'Matty', 'Tatty', 'Catty', 'Kimmy', 'Zippy', 'Zappy', 'Foo', 'Franklin', 'Gerard', 'Howard',
    'Pippy', 'Pip', 'Pappy', 'Happy', 'Peter', 'Priscilla', 'Portia', 'Xanthippe', 'Yorkie', 'Betty', 'Humphrey'
  ];
  static lastNames = ['Sockems', 'Soxy', 'Socko', 'Yarny', 'Plaid', 'Polka-Dot', 'Stripey', 'Lambswool', 'Cotton'];
  static missing = [null, null, null, null, null, null, null, null, null, null, 'left', 'right'];

  private _data: SockPair[] = [];
  private _data$: BehaviorSubject<SockPair[]> = new BehaviorSubject([]);

  static randEl(items: any[]) {
    return items[Math.floor(Math.random() * items.length)];
  }
  static randNum(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  static randInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }


  constructor() {
    for (let id = 1; id < 1234; id++ ) {
      const firstName = DataService.randEl(DataService.firstNames);
      const lastName = DataService.randEl(DataService.lastNames);
      const missing = DataService.randEl(DataService.missing);
      const color = DataService.randEl(DataService.colors);
      const value = DataService.randNum(.01, 100.01);
      const age = DataService.randInt(0, 100);
      this.add({firstName, lastName, missing, value, age, color, id});
    }
  }

  get data$(): Observable<SockPair[]> {
    return this._data$.asObservable();
  }

  add(pair: SockPair) {
    this._data.push(pair);
    this._data$.next(this._data);
  }
}
