# resize-figure-ng-dotnet
resize figure with angular and asp.net core api

### `figureApi` for reading and updating a json file. Here is swagger link of this Api: https://localhost:7017/swagger/index.html. This api has a single `FigureController`.

### FigureController
```cs
public class FigureController : ControllerBase
{

  private readonly ILogger<FigureController> _logger;
  private readonly IFigureService _figureService;

  public FigureController(ILogger<FigureController> logger, IFigureService figureService)
  {
    _logger = logger;
    _figureService = figureService;
  }

  [HttpGet(Name = "GetFigures")]
  public Task<IEnumerable<Figure>> Get() => _figureService.GetFigures();

  [HttpPut(Name = "UpdateFigure")]
  public Task<Figure> Put([FromBody] Figure figure) => _figureService.UpdateFigure(figure);

}

```
### `angularApp` consumes `figureApi` for initially loading figure data and later updating figures' position and size. Here is D3 for rendering figures inside `canvas.component` and necessary logic for figures dragging and resizing.

### api.service
```ts
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
```
There is another `app.service` for app state management having debouncing update method. This service notifies `canvas.component` whenever necessary state changes.

### app.service
```ts
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
      tap((figure) => console.log('updated-figure:', figure)),
      map((figure) => ({
        data: this.state.data.map((r) => (r.id === figure.id ? figure : r)),
      }))
    )
  );
  
  getFigures() {
    this.api.getFigures().subscribe((figures) => this.emit({ data: figures }));
  }
}
```

### Launching Apps

`figureApi`: dotnet run

`angularApp`: npm i 

 npm start
