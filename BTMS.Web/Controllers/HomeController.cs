using Microsoft.AspNetCore.Mvc;

namespace BTMS.Web.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
