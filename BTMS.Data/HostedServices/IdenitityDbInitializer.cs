using BTMS.Data.Models.Identity;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace BTMS.Data.HostedServices
{
    public class IdentityDbInitializer
    {
        //private readonly ApplicationDbContext db;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        public IdentityDbInitializer(/*ApplicationDbContext db,*/ UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            //this.db = db;
            this.userManager = userManager;
            this.roleManager = roleManager;
        }
        public async Task SeedAsync()
        {


            await CreateRoleAsync(new IdentityRole { Name = "Admin", NormalizedName = "ADMIN" });
            await CreateRoleAsync(new IdentityRole { Name = "Agent", NormalizedName = "AGENT" });
            await CreateRoleAsync(new IdentityRole { Name = "Customer", NormalizedName = "CUSTOMER" });

            var hasher = new PasswordHasher<ApplicationUser>();
            var user = new ApplicationUser { UserName = "admin", NormalizedUserName = "ADMIN", CompanyId=null };
            user.PasswordHash = hasher.HashPassword(user, "@Open1234");
            await CreateUserAsync(user, "Admin");


            user = new ApplicationUser { UserName = "wada50", NormalizedUserName = "WADA50",CompanyId=1  };
            user.PasswordHash = hasher.HashPassword(user, "@Open1234");
            await CreateUserAsync(user, "Agent");

        }
        private async Task CreateRoleAsync(IdentityRole role)
        {
            var exits = await roleManager.RoleExistsAsync(role.Name);
            if (!exits)
                await roleManager.CreateAsync(role);
        }
        private async Task CreateUserAsync(ApplicationUser user, string role)
        {
            var exists = await userManager.FindByNameAsync(user.UserName);
            if (exists == null)
            {
                await userManager.CreateAsync(user);
                await userManager.AddToRoleAsync(user, role);
            }

        }
    }
}
