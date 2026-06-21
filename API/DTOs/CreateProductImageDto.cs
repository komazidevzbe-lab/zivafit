using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class CreateProductImageDto
{
    [Required]
    public string ImageAlt { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }
    public bool IsMain { get; set; }
}