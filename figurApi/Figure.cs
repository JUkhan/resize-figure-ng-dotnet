using System.Text.Json.Serialization;

namespace figurApi;

public class Figure
{
  [JsonPropertyName("id")]
  public int Id { get; set; }
  [JsonPropertyName("x")]
  public int X { get; set; }
  [JsonPropertyName("y")]
  public int Y { get; set; }
  [JsonPropertyName("width")]
  public int Width { get; set; }
  [JsonPropertyName("height")]
  public int Height { get; set; }
  [JsonPropertyName("color")]
  public string? Color { get; set; }
}