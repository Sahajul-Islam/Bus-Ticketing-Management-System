using BTMS.DataLib.Models;
using BTMS.Web.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace BTMS.Web.Controllers
{
    public class BusRoutesController : Controller
    {
        private readonly BusDbContext db;
        public BusRoutesController(BusDbContext db) { this.db = db; }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Search(FilterViewModel data)
        {
            var r= db.BusRoutes.Where(r=> r.From.ToLower() == data.From.ToLower());
            List<SearchViewModel> result = new List<SearchViewModel>();
            foreach(var xy in r)
            {
                //var ss= db.Schedules.Where(s => s.JourneyDate.Date == data.Date).ToList();
               var ss= db.Schedules
                .Include(x => x.BusRoute)
                .Include(x => x.Bus).ThenInclude(y => y.Company)
                .Where(x=> x.BusRouteId == xy.BusRouteId && x.JourneyDate.Date == data.Date)
                .OrderByDescending(s => s.JourneyDate).ThenByDescending(s => s.DepartureTime)
                .Select(s => new SearchViewModel
                {
                    ScheduleId = s.ScheduleId,
                    JourneyDate = s.JourneyDate,
                    DepartureTime = s.JourneyDate.Date.Add(s.DepartureTime),
                    MinTimeToReportBeforeDeparture = s.MinTimeToReportBeforeDeparture,
                    BusRoute = s.BusRoute.From + "-" + s.BusRoute.To,
                    Bus = s.Bus.Company.CompanyName + "/" + s.Bus.BusModel,
                    BusId = s.BusId,
                    FareAmount = s.FareAmount,
                    BusRouteId = s.BusRouteId
                }).ToList();
                if (ss.Count > 0)
                {
                    result.AddRange(ss);
                }


            }
            return View(result);
        }
        public IActionResult Book (int id)
        {
            var schedule =  db
                .Schedules
                .Include(x => x.Bus)
                .Include(x => x.BusRoute)
                .FirstOrDefault(x => x.ScheduleId == id);
            var company =  db.Companies.First(c => c.CompanyId == schedule.Bus.CompanyId);
            var seats = Enumerable.Range(1, schedule.Bus.Capacity);
            List<SeatViewModel> result = new List<SeatViewModel>();
            int c = schedule.Bus.Capacity;

            foreach (var i in seats)
            {
                var m = new SeatViewModel
                {
                    Bus = company.CompanyName + "[" + schedule.Bus.BusType + "]",
                    BusRoute = schedule.BusRoute.From + "-" + schedule.BusRoute.To,
                    ScheduleTime = schedule.JourneyDate.Date.Add(schedule.DepartureTime),
                    Fare = schedule.FareAmount,
                    SeatSerial = i,
                    SeatNumber = i.ToString()
                };
                var b = db.Bookings.FirstOrDefault(x => x.SeatNumber == i);

                if (b == null)
                {
                    m.Status = false;

                }
                else
                {
                    m.Status = true;
                }
                result.Add(m);
            }
            result.Insert(2, new SeatViewModel { SeatSerial = 0, Status = false });
            result.Insert(7, new SeatViewModel { SeatSerial = 0, Status = false });
            if (c >= 10)
                result.Insert(12, new SeatViewModel { SeatSerial = 0, Status = false });
            if (c >= 16)
                result.Insert(17, new SeatViewModel { SeatSerial = 0, Status = false });
            if (c >= 20)
                result.Insert(22, new SeatViewModel { SeatSerial = 0, Status = false });

            return View(result);
        }
    }
}
