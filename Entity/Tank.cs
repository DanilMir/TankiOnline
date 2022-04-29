using System.Drawing;
using System.Net.Mime;

namespace TankiOnline.Entity;

public class Tank
{
    public string Id { get; set; }
    public string Image { get; set; }
    public float Speed { get; set; }
    public int directionRotate { get; set; }
    public Point Position { get; set; }
    public Size Size { get; set; }
}