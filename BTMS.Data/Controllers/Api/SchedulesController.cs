using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BTMS.DataLib.Models;
using BTMS.Data.ViewModels;

namespace BTMS.Data.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchedulesController : ControllerBase
    {
        private readonly BusDbContext _context;

        public SchedulesController(BusDbContext context)
        {
            _context = context;
        }

        // GET: api/Schedules
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetSchedules()
        {
            return await _context.Schedules.ToListAsync();
        }
        
        /*
         * Custom to get schedule  viewmodel
         * *********************************************
         * */
        [HttpGet("VM")]
        public async Task<ActionResult<IEnumerable<ScheduleViewModel>>> GetScheduleVMs()
        {
            return await _context.Schedules
                .Include(x=> x.BusRoute)
                .Include(x=> x.Bus).ThenInclude(y=> y.Company)
                .OrderByDescending(s => s.JourneyDate).ThenByDescending(s => s.DepartureTime)
                .Select(s => new ScheduleViewModel {  
                    ScheduleId= s.ScheduleId,
                    JourneyDate= s.JourneyDate,
                    DepartureTime = s.JourneyDate.Date.Add(s.DepartureTime),
                    MinTimeToReportBeforeDeparture = s.MinTimeToReportBeforeDeparture,
                    BusRoute= s.BusRoute.From +"-" + s.BusRoute.To,
                    Bus = s.Bus.Company.CompanyName + "/" +s.Bus.BusModel,
                     BusId= s.BusId,
                     FareAmount= s.FareAmount,
                     BusRouteId= s.BusRouteId
                })
                .ToListAsync();
        }
        /*
         * Custom to get schedule  viewmodel
         * *********************************************
         * */
        [HttpGet("VM/Company/{id}")]
        public async Task<ActionResult<IEnumerable<ScheduleViewModel>>> GetScheduleVMsofCompany( int id /*company id*/)
        {
            return await _context.Schedules
                .Include(x => x.BusRoute)
                .Include(x => x.Bus).ThenInclude(y => y.Company)
                
                .OrderByDescending(s => s.JourneyDate).ThenByDescending(s => s.DepartureTime)
                .Select(s => new ScheduleViewModel
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
                })
                .ToListAsync();
        }
        /*
        * Custom to get schedule  viewmodel of specific date
        * *********************************************
        * */
        [HttpGet("VM/{date}")]
        public async Task<ActionResult<IEnumerable<ScheduleViewModel>>> GetScheduleVMs(DateTime date)
        {
            return await _context.Schedules
                .Include(x => x.BusRoute)
                .Include(x => x.Bus).ThenInclude(y => y.Company)
                .Where(s => s.JourneyDate.Date == date.Date)
                .OrderByDescending(s => s.JourneyDate).ThenByDescending(s => s.DepartureTime)
                .Select(s => new ScheduleViewModel
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
                })
                .ToListAsync();
        }
        // GET: api/Schedules/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Schedule>> GetSchedule(int id)
        {
            var schedule = await _context.Schedules.FindAsync(id);

            if (schedule == null)
            {
                return NotFound();
            }

            return schedule;
        }

        // PUT: api/Schedules/5
       
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSchedule(int id, Schedule schedule)
        {
            if (id != schedule.ScheduleId)
            {
                return BadRequest();
            }

            _context.Entry(schedule).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScheduleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Schedules
        [HttpPost]
        public async Task<ActionResult<Schedule>> PostSchedule(Schedule schedule)
        {
            _context.Schedules.Add(schedule);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSchedule", new { id = schedule.ScheduleId }, schedule);
        }
        // POST: api/Schedules
        /*
        * Custom to insert schedule  viewmodel
        * *********************************************
        * */
        [HttpPost("VM")]
        public async Task<ActionResult<Schedule>> PostScheduleViewModel(ScheduleViewModel schedule)
        {
            var model = new Schedule
            {
                
                JourneyDate = schedule.JourneyDate,
                DepartureTime = schedule.DepartureTime.Subtract(schedule.DepartureTime.Date),
                MinTimeToReportBeforeDeparture = schedule.MinTimeToReportBeforeDeparture,
                FareAmount = schedule.FareAmount,
                BusId = schedule.BusId,
                BusRouteId = schedule.BusRouteId
            };
            _context.Schedules.Add(model);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSchedule", new { id = model.ScheduleId }, model);
        }
        // DELETE: api/Schedules/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Schedule>> DeleteSchedule(int id)
        {
            var schedule = await _context.Schedules.FindAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }

            _context.Schedules.Remove(schedule);
            await _context.SaveChangesAsync();

            return schedule;
        }

        private bool ScheduleExists(int id)
        {
            return _context.Schedules.Any(e => e.ScheduleId == id);
        }
    }
}
