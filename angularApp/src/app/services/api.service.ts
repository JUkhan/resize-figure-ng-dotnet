import { Figure } from './types';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  readonly baseUrl = 'https://localhost:7017/figure/';
  constructor(private httpClient: HttpClient) {}

  getFigures(): Observable<Figure[]> {
    return this.httpClient.get(this.baseUrl) as Observable<Figure[]>;
  }
  updateFigure(figure: Figure): Observable<Figure> {
    return this.httpClient.put(this.baseUrl, figure) as Observable<Figure>;
  }
}
