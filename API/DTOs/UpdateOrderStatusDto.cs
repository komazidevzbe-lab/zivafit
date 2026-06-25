using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpdateOrderStatusDto
{
    [Required]
    public string OrderStatus { get; set; } = string.Empty;
}