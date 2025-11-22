using Microsoft.Extensions.DependencyInjection;

namespace Dal;

public static class DalStartUp
{
    public static IServiceCollection AddDal(this IServiceCollection services)
    {
        return services;
    }
}
