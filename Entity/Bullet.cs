using System.Drawing;
using TankiOnline.Services;

namespace TankiOnline.Entity;

public class Bullet
{
    public string TankId { get; set; }
    public string Image { get; set; }
    public float Speed { get; set; } = 6;
    public int directionRotate { get; set; } = 0;
    public Position Position { get; set; }
    public Size Size { get; set; } = new Size(20, 40);

    public void Move()
    {
        switch (this.directionRotate)
        {
            case 0:
                this.Position.Y -= this.Speed;
                break;
            case 180:
                this.Position.Y += this.Speed;
                break;

            case 90:
                this.Position.X += this.Speed;
                break;

            case 270:
                this.Position.X -= this.Speed;
                break;

            default:
                this.Position.Y -= this.Speed;
                break;
        }
    }

    public bool IsOutsideMap()
    {
        return Position.X > Game.Width || Position.X < 0 || Position.Y > Game.Height || Position.Y < 0;
    }

    public bool IsCollideWithTank(Tank tank)
    {
        var tankWidth = tank.directionRotate == 0 || tank.directionRotate == 180 ? tank.Size.Width : tank.Size.Height;
        var tankHeight = tank.directionRotate == 0 || tank.directionRotate == 180 ? tank.Size.Height : tank.Size.Width;

        var tankX = tank.Position.X - tankWidth / 2;
        var tankY = tank.Position.Y - tankHeight / 2;

        return tank.Id != TankId && this.Position.X >= tankX / 2 && this.Position.X <= tankX + tankWidth &&
               this.Position.Y >= tankY && this.Position.Y <= tankY + tankHeight;
    }
}