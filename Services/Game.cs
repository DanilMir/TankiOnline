using Microsoft.AspNetCore.SignalR;
using TankiOnline.Entity;
using TankiOnline.Hubs;

namespace TankiOnline.Services;

public class Game : IGame
{
    public static int Height { get; set; } = 600;
    public static int Width { get; set; } = 600;
    
    public List<Tank> Tanks { get; set; }
    public List<Bullet> Bullets { get; set; }

    private IHubContext<GameHub> _context;
    
    public Game(IHubContext<GameHub> context)
    {
        Tanks = new List<Tank>();
        Bullets = new List<Bullet>();
        _context = context;

        var thread = new Thread(Update);
        thread.Start();
    }

    public async void Update()
    {
        while (true)
        {
            foreach (var bullet in Bullets)
            {
                bullet.Move();
            }

            
            // Console.WriteLine("State");
            await _context.Clients.All.SendAsync("BulletsState", this.Bullets);
            await _context.Clients.All.SendAsync("TanksState", this.Tanks);
            // await _context.Clients.All.SendAsync("State", this.Tanks, this.Bullets);
            Thread.Sleep(16);
        }
    }
}