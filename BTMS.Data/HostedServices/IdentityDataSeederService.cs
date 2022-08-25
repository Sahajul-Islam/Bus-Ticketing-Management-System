using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace BTMS.Data.HostedServices
{
    
    public class IdentityDataSeederService : IHostedService
    {
        private readonly IServiceProvider serviceProvider;
        public IdentityDataSeederService(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;
        }

       
        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using var scope = serviceProvider.CreateScope();
            var seeder = scope.ServiceProvider.GetRequiredService<IdentityDbInitializer>();
            await seeder.SeedAsync();
        }

        

        public async Task StopAsync(CancellationToken cancellationToken)
        {
           await Task.CompletedTask;
        }
    }
}
