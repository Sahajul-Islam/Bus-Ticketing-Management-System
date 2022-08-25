using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BTMS.DataLib.Models;
using BTMS.Data.Models.ViewModels;
using BTMS.Data.Models.ViewModels.Input;
using BTMS.Data.Utilities;
using Microsoft.AspNetCore.SignalR;
using BTMS.Data.Hubs;

namespace BTMS.Data.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly BusDbContext _context;
        private readonly IHubContext<BookingNotifyHub> _hubContext;
        public BookingsController(BusDbContext context, IHubContext<BookingNotifyHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // GET: api/Bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
        {
            return await _context.Bookings.ToListAsync();
        }

        // GET: api/Bookings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);

            if (booking == null)
            {
                return NotFound();
            }

            return booking;
        }
        /*
      * Custom to get pending booking
      * *********************************************
      * */
        [HttpGet]
        [Route("Pending")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingsPending()
        {
            return await _context.Bookings.Where(x => x.BookingStatus == false).ToListAsync();
        }
        /*
          * Custom to get pending booking
          * *********************************************
          * */
        [HttpGet]
        [Route("VM/Pending/{id}")]
        public async Task<ActionResult<IEnumerable<BookingViewModel>>> GetBookingVMsPending(int id /* company id */)
        {
            var data = await _context.Bookings
                .Include(x => x.Schedule)
                .ThenInclude(x => x.Bus)
                .Where(x => x.BookingStatus == false && x.Schedule.Bus.CompanyId == 1).ToListAsync();
            List<BookingViewModel> result = new List<BookingViewModel>();
            foreach (var booking in data)
            {
                var company = await _context.Companies.FirstAsync(x => x.CompanyId == booking.Schedule.Bus.CompanyId);
                result.Add(new BookingViewModel
                {
                    BookingId = booking.BookingId,
                    Customer = booking.Customer,
                    Phone = booking.Phone,
                    BookingCode = booking.BookingCode,
                    BookingStatus = booking.BookingStatus,
                    BookingDate = booking.BookingDate,
                    SeatNumber = booking.SeatNumber,
                    ScheduleId = booking.ScheduleId,
                    Bus = booking.Schedule.Bus.BusModel + " [" + booking.Schedule.Bus.BusType + "]",
                    Email = booking.Email,
                    isConfirmed = booking.isConfirmed,
                    isPaid = booking.isPaid,
                    TransactionId = booking.TransactionId,
                    Company = company.CompanyName
                });
            }
            return result;
        }
        // PUT: api/Bookings/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBooking(int id, Booking booking)
        {
            if (id != booking.BookingId)
            {
                return BadRequest();
            }

            _context.Entry(booking).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingExists(id))
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
        /*
        * Custom to save booking transaction id
        * *********************************************
        * */
        [HttpPut("Trx")]
        public async Task<IActionResult> PutBookingTransactionId(TransactionIdInputModel data)
        {


            var booking =await _context.Bookings.FirstOrDefaultAsync(x => x.BookingId == data.BookingId);
            if (booking == null) return NotFound();
            booking.TransactionId = data.TransactionId;
            booking.isConfirmed = true;
            booking.isPaid = true;
            booking.BookingStatus = true;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }
        /*
        * Custom to save booking
        * *********************************************
        * */
        [HttpPost]
        [Route("Book")]
        public async Task<ActionResult<BookingMessageViewModel>> PostBooking(BookingInputModel booking)
        {
            var date = DateTime.Now;
            string code = Util.RandomString(10);
            List<Booking> bookings = new List<Booking>();
            foreach(var i in booking.SeatNumbers)
            {
                Booking b = new Booking { Customer=booking.Customer, Phone=booking.Phone, Email=booking.Email, ScheduleId=booking.ScheduleId, BookingCode=code, BookingDate=date, SeatNumber=i };
                bookings.Add(b);
                _context.Bookings.Add(b);
            }
            await _context.SaveChangesAsync();
            await this._hubContext.Clients.All.SendAsync("seatBooked", new BookingMessage {ScheduleId= booking.ScheduleId, Seats=booking.SeatNumbers, Message="Some customer booked seats" });
            return new BookingMessageViewModel {  ScheduleId=booking.ScheduleId, Seats= bookings.Select(x=> x.SeatNumber).ToArray(), TrackingCode=code, Message="Seates Booked"};
        }
        // POST: api/Bookings
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Booking>> PostBooking(Booking booking)
        {
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBooking", new { id = booking.BookingId }, booking);
        }

        // DELETE: api/Bookings/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Booking>> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return booking;
        }
        /*
        * Custom to get seat model
        * *********************************************
        * */
        [HttpGet]
        [Route("Seats/{id}")]
        public async Task<ActionResult<IEnumerable<SeatViewModel>>> GetSeats(int id)
        {
            var schedule = await _context
                .Schedules
                .Include(x => x.Bus)
                .Include(x=> x.BusRoute)
                .FirstOrDefaultAsync(x => x.ScheduleId == id);
            var company = await _context.Companies.FirstAsync(c => c.CompanyId == schedule.Bus.CompanyId);
            var seats =Enumerable.Range(1, schedule.Bus.Capacity);
            List<SeatViewModel> result = new List<SeatViewModel>();
            int c=schedule.Bus.Capacity;
           
            foreach(var i in seats)
            {
               var m=  new SeatViewModel { Bus=company.CompanyName+"["+schedule.Bus.BusType+"]", 
                   BusRoute=schedule.BusRoute.From+"-"+schedule.BusRoute.To, 
                   ScheduleTime=schedule.JourneyDate.Date.Add(schedule.DepartureTime),
                   Fare=schedule.FareAmount,  
                   SeatSerial = i, 
                   SeatNumber = i.ToString() 
               };
               var b= _context.Bookings.FirstOrDefault(x => x.SeatNumber == i);

                if(b== null)
                {
                    m.Status = BookingStatus.Free;
                    
                }
                else
                {
                    m.Status = BookingStatus.Booked;
                }
                result.Add(m);
            }
            result.Insert(2, new SeatViewModel { SeatSerial=0, Status = BookingStatus.Free });
            result.Insert(7, new SeatViewModel { SeatSerial = 0, Status = BookingStatus.Free });
            if(c>= 10)
             result.Insert(12, new SeatViewModel { SeatSerial = 0, Status = BookingStatus.Free });
            if (c >= 16)
                result.Insert(17, new SeatViewModel { SeatSerial = 0, Status = BookingStatus.Free });
            if (c >= 20)
                result.Insert(22, new SeatViewModel { SeatSerial = 0, Status = BookingStatus.Free });
           
            return result;
        }
        /*
       * Custom to get Booking Summary
       * *********************************************
       * */
        [HttpGet]
        [Route("Summary/{id}")]
        public async Task<ActionResult<BookingSummaryViewModel>> GetBookingSummary(int id /* Schedule id*/)
        {
            var schedule = await _context
               .Schedules
               .Include(x => x.Bus)
               .Include(x => x.BusRoute)
               .FirstOrDefaultAsync(x => x.ScheduleId == id);
            var company = await _context.Companies.FirstAsync(x => x.CompanyId == schedule.Bus.CompanyId);
            var bookings = await _context.Bookings.Where(x => x.ScheduleId == id).ToListAsync();
            return new BookingSummaryViewModel
            {
                ScheduleId = schedule.ScheduleId,
                ScheduleTime = schedule.JourneyDate.Add(schedule.DepartureTime),
                Bus = schedule.Bus.BusModel + " [" + schedule.Bus.BusType + "]",
                Company = company.CompanyName,
                Capacity = schedule.Bus.Capacity,
                TotalBooked = bookings.Count()
            };
        }
        [HttpGet]
        [Route("Date/{date}")]
        public async Task<ActionResult<IEnumerable<BookingSummaryViewModel>>> GetBookingSummaryOfDate(DateTime date)
        {
            var schedules = await _context
               .Schedules
               .Include(x => x.Bus)
               .Include(x => x.BusRoute)
               .Where(x => x.JourneyDate.Date == date.Date)
               .ToListAsync();


            List<BookingSummaryViewModel> result = new List<BookingSummaryViewModel>();
            foreach (var schedule in schedules)
            {
                var company = await _context.Companies.FirstAsync(x => x.CompanyId == schedule.Bus.CompanyId);
                var bookings = await _context.Bookings.Where(x => x.ScheduleId == schedule.ScheduleId).ToListAsync();
                result.Add(new BookingSummaryViewModel
                {
                    ScheduleId = schedule.ScheduleId,
                    ScheduleTime = schedule.JourneyDate.Add(schedule.DepartureTime),
                    Bus = schedule.Bus.BusModel + " [" + schedule.Bus.BusType + "]",
                    Company = company.CompanyName,
                    Capacity = schedule.Bus.Capacity,
                    TotalBooked = bookings.Count()
                });

            }
            return result;
        }
        private bool BookingExists(int id)
        {
            return _context.Bookings.Any(e => e.BookingId == id);
        }
    }
}
