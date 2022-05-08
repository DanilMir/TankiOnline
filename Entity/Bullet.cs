using System.Drawing;

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
        switch (this.directionRotate) {
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
}