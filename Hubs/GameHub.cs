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
        var tank = new Tank()
        {
            Id = Context.ConnectionId,
            Position = new Position(200, 200)
        };
        _game.Tanks.Add(tank);
        Console.WriteLine($"Created: tank: {tank.Id}");

        await TanksState();
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        _game.Tanks.Remove(_game.Tanks.First(x => x.Id == Context.ConnectionId));
        Console.WriteLine($"Removed: tank: {Context.ConnectionId}");
        await TanksState();
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendAction(string curAction)
    {
        Console.WriteLine(curAction);

        var tank = _game.Tanks.FirstOrDefault(x => x.Id == Context.ConnectionId);
        tank?.Action(curAction);

        await TanksState();
        ;
    }

    public async Task TanksState()
    {
        await Clients.All.SendAsync("TanksState", _game.Tanks);
    }
}