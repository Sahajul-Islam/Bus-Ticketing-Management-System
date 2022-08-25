using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;
using System.Threading.Tasks;

namespace BTMS.Data.Hubs
{
    public class BookingNotifyHub:Hub
    {
        public override async Task OnConnectedAsync()
        {
            Debug.WriteLine(Context.ConnectionId);
            await base.OnConnectedAsync();
        }
        public async Task BookingNotify(BookingMessage message)
        {
            await Clients.All.SendAsync("seatBooked", message);
        }
    }
}
