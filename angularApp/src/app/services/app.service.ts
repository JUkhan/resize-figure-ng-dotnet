import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { StateController } from 'ajwahjs';
import { tap, map, debounceTime, switchMap } from 'rxjs';
import { AppState, Figure } from './types';

@Injectable({
  providedIn: 'root',
})
export class AppService extends StateController<AppState> {
  constructor(private api: ApiService) {
    super({
      data: [],
    });
  }
  updateFigure = this.effect<Figure>((rect$) =>
    rect$.pipe(
      debounceTime(200),
      switchMap((figure) => this.api.updateFigure(figure)),
      tap((figure) => console.log('update-figure:', figure)),
      map((figure) => ({
        data: this.state.data.map((r) => (r.id === figure.id ? figure : r)),
      }))
    )
  );
  getFigures() {
    this.api.getFigures().subscribe((figures) => this.emit({ data: figures }));
  }
}
