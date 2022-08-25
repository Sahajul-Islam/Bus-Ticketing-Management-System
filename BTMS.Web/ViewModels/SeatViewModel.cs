using BTMS.DataLib.Models;
using System;

namespace BTMS.Web.ViewModels
{
    public class SeatViewModel
    {

        public int SeatSerial { get; set; }
        public string SeatNumber { get; set; }
        public bool Status { get; set; }
        public string Bus { get; set; }
        public string BusRoute { get; set; }
        public decimal Fare { get; set; }
        public DateTime ScheduleTime { get; set; }

    }
}
