using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class InitiatePayFastPaymentDto
{
    [Range(1, int.MaxValue)]
    public int OrderId { get; set; }
}