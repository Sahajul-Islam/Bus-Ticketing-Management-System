using System;

namespace BTMS.Data.Models.ViewModels
{
    public class BookingSummaryViewModel
    {
        public int ScheduleId { get; set; }
        public DateTime ScheduleTime { get; set; }
        public string Company { get; set; }
        public string Bus { get; set; }
        public int Capacity { get; set; }
        public int TotalBooked { get; set; }
    }
}
