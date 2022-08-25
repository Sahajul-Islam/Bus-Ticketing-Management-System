namespace BTMS.Data.Models.ViewModels
{
    public class BookingMessageViewModel
    {
        public int ScheduleId { get; set; }
        public int[] Seats { get; set; }
        public string TrackingCode { get; set; }    
        public string Message { get; set; }
    }
}
