using System.Drawing;
using System.Net.Mime;
using TankiOnline.Services;

namespace TankiOnline.Entity;

public class Tank
{
    public string Id { get; set; }
    public string Image { get; set; }
    public float Speed { get; set; } = 6;
    public int directionRotate { get; set; } = 0;
    public Position Position { get; set; }
    public Size Size { get; set; } = new Size(56, 100);


    public void Action(string action, List<Bullet> bullets)
    {
        Console.WriteLine(action);
        switch (action)
        {
            case "MoveLeft": 
                MoveLeft();
                break;
            case "MoveRight":
                MoveRight();
                break;
            case "MoveUp":
                MoveUp();
                break;
            case "MoveDown":
                MoveDown();
                break;
            case "Fire":
                Fire(bullets);
                break;
        }
    }

    private void MoveLeft()
    {
        if (this.directionRotate == 270) {
            if (this.Position.X < 0 || this.Position.X - this.Speed < 0)
                this.Position.X = 0;
            else {
                this.Position.X -= this.Speed;
            }
        }
        this.directionRotate = 270;
    }
    
    private void MoveRight()
    {
        if (this.directionRotate == 90) {
            if (this.Position.X > Game.Width - this.Size.Width || this.Position.X + this.Speed > Game.Width - this.Size.Width)
                this.Position.X = Game.Width - this.Size.Width;
            else {
                this.Position.X += this.Speed;
            }
        }
        this.directionRotate = 90;
    }
    
    private void MoveUp()
    {
        if (this.directionRotate == 0) {
            if (this.Position.Y < 0 || this.Position.Y - this.Speed < 0)
                this.Position.Y = 0;
            else {
                this.Position.Y -= this.Speed;
            }
        }
        this.directionRotate = 0;
    }
    
    private void MoveDown()
    {
        if (this.directionRotate == 180) {
            if (this.Position.Y > Game.Height - this.Size.Height || this.Position.Y + this.Speed > Game.Height - this.Size.Height)
                this.Position.Y = Game.Height - this.Size.Height;
            else {
                this.Position.Y += this.Speed;
            }
        }
        this.directionRotate = 180;
    }

    private void Fire(List<Bullet> bullets)
    {
        var bullet = new Bullet
        {
            directionRotate = this.directionRotate,
            TankId = this.Id
        };

        var position = new Position();
        
        switch (this.directionRotate) {
            case 0:
                position.X = this.Position.X;
                position.Y = this.Position.Y - (this.Size.Height / 2) - (bullet.Size.Height / 3);
                break;
            case 180:
                position.X = this.Position.X;
                position.Y = this.Position.Y + (this.Size.Height / 2) + (bullet.Size.Height / 3);
                break;

            case 90:
                position.X = this.Position.X + (this.Size.Height / 2) + (bullet.Size.Height / 3);
                position.Y = this.Position.Y;
                break;

            case 270:
                position.X = this.Position.X - (this.Size.Height / 2) - (bullet.Size.Height / 3);
                position.Y = this.Position.Y;
                break;

            default:
                position.X = this.Position.X;
                position.Y = this.Position.Y - (this.Size.Height / 2) - (bullet.Size.Height / 3);
                break;

        }

        bullet.Position = position;
        
        bullets.Add(bullet);
    }
}