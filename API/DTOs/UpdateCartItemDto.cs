using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpdateCartItemDto
{
    [Range(1, 100)]
    public int Quantity { get; set; }
}