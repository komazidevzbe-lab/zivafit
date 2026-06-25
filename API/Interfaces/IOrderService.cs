using API.DTOs;

namespace API.Interfaces;

public interface IOrderService
{
    Task<OrderDto> CreateOrderFromCartAsync(int userId, CreateOrderDto dto);

    Task<IReadOnlyList<OrderDto>> GetUserOrdersAsync(int userId);
    Task<OrderDto?> GetUserOrderByIdAsync(int userId, int orderId);

    Task<IReadOnlyList<OrderDto>> GetAdminOrdersAsync(OrderParamsDto orderParams);
    Task<OrderDto?> GetAdminOrderByIdAsync(int orderId);
    Task<OrderDto?> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusDto dto);
}