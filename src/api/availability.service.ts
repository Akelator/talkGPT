import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvailabilityService {
  private _writing$ = new BehaviorSubject<boolean>(false);
  writting$ = this._writing$.asObservable();

  private _speaking$ = new BehaviorSubject<boolean>(false);
  speaking$ = this._speaking$.asObservable();

  set writting(value: boolean) {
    this._writing$.next(value);
  }

  set speaking(value: boolean) {
    this._speaking$.next(value);
  }
}
