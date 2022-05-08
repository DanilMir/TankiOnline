using Microsoft.AspNetCore.SignalR;
using TankiOnline.Entity;
using TankiOnline.Hubs;

namespace TankiOnline.Services;

public class Game
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
                
                Tanks = Tanks.Where(tank => !bullet.IsCollideWithTank(tank)).ToList();
            }

            Bullets = Bullets.Where(bullet => !bullet.IsOutsideMap()).ToList();

            await _context.Clients.All.SendAsync("State", Tanks, Bullets);
            Thread.Sleep(7);
        }
    }
}