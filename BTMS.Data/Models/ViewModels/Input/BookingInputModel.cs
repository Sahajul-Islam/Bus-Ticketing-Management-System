using System.ComponentModel.DataAnnotations;

namespace BTMS.Data.Models.ViewModels.Input
{
    public class BookingInputModel
    {
        [Required, StringLength(50)]
        public string Customer { get; set; }
        [Required, StringLength(20)]
        public string Phone { get; set; }
        [StringLength(50)]
        public string Email { get; set; }
        public int[] SeatNumbers { get; set; }
        public int ScheduleId { get; set; }
    }
}
