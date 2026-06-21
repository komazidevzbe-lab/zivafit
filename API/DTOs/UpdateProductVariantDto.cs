using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpdateProductVariantDto
{
    [Required]
    public string Size { get; set; } = string.Empty;

    [Required]
    public string Colour { get; set; } = string.Empty;

    [Required]
    public string Sku { get; set; } = string.Empty;

    [Range(0, 100000)]
    public int StockQuantity { get; set; }

    public bool IsActive { get; set; } = true;
}