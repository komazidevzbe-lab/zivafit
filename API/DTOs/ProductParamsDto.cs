namespace API.DTOs;

public class ProductParamsDto
{
    public string? Category { get; set; }
    public string? Search { get; set; }
    public string? Sort { get; set; }

    public bool? IsNew { get; set; }
    public bool? IsBestSeller { get; set; }
    public bool? IsFeatured { get; set; }
}