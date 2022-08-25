using System;

namespace BTMS.Data.Models.ViewModels
{
    public class BookingViewModel
    {
        public int BookingId { get; set; }
       
        public string Customer { get; set; }
       
        public string Phone { get; set; }
       
        public string Email { get; set; }
      
        public string BookingCode { get; set; }
       
        public int SeatNumber { get; set; }

        public DateTime BookingDate { get; set; }
        public bool BookingStatus { get; set; }
     
        public string TransactionId { get; set; }
        public bool isPaid { get; set; } = false;
        public bool isConfirmed { get; set; } 

       
        public int ScheduleId { get; set; }
        public string Bus { get; set; }
        public string Company { get; set; }
    }
}
