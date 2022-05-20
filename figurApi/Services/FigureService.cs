using System.Text.Json;

namespace figurApi.Services;
public class FigureService : IFigureService
{
  private readonly ILogger<FigureService> _logger;
  private readonly string _filepath = @"./data/figure.json";

  public FigureService(ILogger<FigureService> logger)
  {
    _logger = logger;
  }
  public async Task<IEnumerable<Figure>> GetFigures()
  {
    try
    {
      using FileStream stream = System.IO.File.OpenRead(_filepath);
      var res = await JsonSerializer.DeserializeAsync<List<Figure>>(stream);
      return res ?? new List<Figure>();
    }
    catch (Exception ex)
    {
      _logger.LogError(ex.Message);
      return new List<Figure>();
    }

  }

  public async Task<Figure> UpdateFigure(Figure figure)
  {
    try
    {
      var figures = await GetFigures();
      using FileStream createStream = System.IO.File.Create(_filepath);
      await JsonSerializer.SerializeAsync(createStream, figures.Select(f => f.Id == figure.Id ? figure : f));
      await createStream.DisposeAsync();
      return figure;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex.Message);
      return new Figure();
    }

  }

}