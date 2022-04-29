using System.Drawing;
using Microsoft.AspNetCore.SignalR;
using TankiOnline.Entity;
using TankiOnline.Services;

namespace TankiOnline.Hubs;

public class GameHub : Hub
{

    private Game _game;
    public GameHub(Game game)
    {
        _game = game;
    }
    
    public override async Task OnConnectedAsync()
    {
        Console.WriteLine("asdasdadsa");
        
        _game.Tanks.Add(new Tank()
        {
            Id = Context.ConnectionId
            // ?
        });
        await TanksState();
        await base.OnConnectedAsync();
    }
    
    public override async Task OnDisconnectedAsync(Exception exception)
    {
        _game.Tanks.Remove(_game.Tanks.First(x => x.Id == Context.ConnectionId));
        await base.OnDisconnectedAsync(exception);
    }
    
    public async Task SendAction(string curAction)
    {
        Console.WriteLine(curAction);
        await TanksState();
        // await Clients.All.SendAsync("ReceiveMessage", user, message);
    }

    public async Task TanksState()
    {
        await Clients.All.SendAsync("TanksState", _game.Tanks);
    }
}