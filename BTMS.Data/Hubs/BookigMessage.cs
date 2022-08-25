using System.Threading.Tasks;

namespace BTMS.Data.Hubs
{
    public class BookingMessage
    {
        public int ScheduleId { get; set; }
        public int[] Seats { get; set; }
        public string Message { get; set; }
    }
   
}
