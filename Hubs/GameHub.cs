using Microsoft.AspNetCore.SignalR;

namespace TankiOnline.Hubs;

public class GameHub : Hub
{
    public async Task SendAction(string curAction)
    {
        Console.WriteLine(curAction);
        // await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}