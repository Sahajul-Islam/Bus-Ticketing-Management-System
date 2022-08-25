using BTMS.Data.Models.Identity;
using BTMS.Data.Models.ViewModels.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BTMS.Data.Controllers.Identity
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IConfiguration config;
       
        public AccountController(UserManager<ApplicationUser> userManager, IConfiguration config)
        {
            this.userManager = userManager;
            this.config = config;
            
        }
        [Route("Login")]
        [HttpPost]
        public async Task<ActionResult> Login(LoginViewModel model)
        {

            //Thread.Sleep(2000);
            var user = await userManager.FindByNameAsync(model.Username.ToUpper());

            if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
            {
                var roles = await userManager.GetRolesAsync(user);
               
                var signingKey =
                  Encoding.UTF8.GetBytes(config["Jwt:SigningKey"]);
                var expiryDuration = int.Parse(config["Jwt:ExpiryInMinutes"]);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Issuer = null,              // Not required as no third-party is involved
                    Audience = null,            // Not required as no third-party is involved
                    IssuedAt = DateTime.UtcNow,
                    NotBefore = DateTime.UtcNow,
                    Expires = DateTime.UtcNow.AddMinutes(expiryDuration),
                    Subject = new ClaimsIdentity(new List<Claim> {
                        new Claim("username",user.UserName),
                        new Claim("role", string.Join(",", roles.ToArray())),
                        new Claim("expires", DateTime.UtcNow.AddMinutes(expiryDuration).ToString("yyyy-MM-ddTHH:mm:ss")),
                        new Claim("companyId", user.CompanyId.HasValue ? user.CompanyId.Value.ToString() : String.Empty)
                    }
                    ),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(signingKey), SecurityAlgorithms.HmacSha256Signature)
                };
                var jwtTokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = jwtTokenHandler.CreateJwtSecurityToken(tokenDescriptor);
                var token = jwtTokenHandler.WriteToken(jwtToken);
                return Ok(
                  new
                  {
                      token,
                      expiration = jwtToken.ValidTo,
                      refreshToken = user.Id

                  });
            }
            return BadRequest();
        }
        [Route("register")]
        [HttpPost]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            var user = new ApplicationUser
            {
                Email = model.Email,
                UserName = model.Username,
                SecurityStamp = Guid.NewGuid().ToString(),
                CompanyId = model.CompanyId
            };
            var result = await userManager.CreateAsync(user, model.Password);
            
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, "Agent");
            }
            return Ok(new { Username = user.UserName });
        }
        [Route("customer/register")]
        [HttpPost]
        public async Task<ActionResult> RegisterCustomer(RegisterViewModel model)
        {
            var user = new ApplicationUser
            {
                Email = model.Email,
                UserName = model.Username,
                SecurityStamp = Guid.NewGuid().ToString(),
                CompanyId = model.CompanyId,
            };
            var result = await userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, "Agent");
                
            }
            return Ok(new { Username = user.UserName });
        }
        [Route("list")]
        [HttpGet]
        public  ActionResult<IEnumerator<AppUserViewModel>> GetUserList()
        {
            var users = userManager.Users.Select(c => new AppUserViewModel()
            {
               Id=c.Id,
               UserName = c.UserName,
                Role = string.Join(",", userManager.GetRolesAsync(c).Result.ToArray())
            }).ToList();
            
            return Ok(users);

        }
    }
}
