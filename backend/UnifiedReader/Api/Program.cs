using InfraLib.HostConfiguration;

namespace Api;

public class Program
{
    public static void Main(string[] args)
    {
        HostFactory.CreateHostBuilder<Startup>(args).Build().Run();
    }
}