using figurApi.Services;
using Microsoft.AspNetCore.Mvc;


namespace figurApi.Controllers;

[ApiController]
[Route("[controller]")]
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
