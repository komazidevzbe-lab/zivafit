using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, UserDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName ?? string.Empty))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email ?? string.Empty));
    }
}