using TankiOnline.Entity;

namespace TankiOnline.Services;

public class Game : IGame
{
    public static int Height { get; set; } = 600;
    public static int Width { get; set; } = 600;
    
    public List<Tank> Tanks { get; set; }

    public Game()
    {
        Tanks = new List<Tank>();
    }
}