using TankiOnline.Entity;

namespace TankiOnline.Services;

public class Game : IGame
{
    public int Height { get; set; }
    public int Width { get; set; }
    
    public List<Tank> Tanks { get; set; }

    public Game()
    {
        Tanks = new List<Tank>();
    }
}