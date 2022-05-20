namespace figurApi.Services;
public interface IFigureService
{
  Task<IEnumerable<Figure>> GetFigures();
  Task<Figure> UpdateFigure(Figure figure);
}