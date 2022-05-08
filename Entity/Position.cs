namespace TankiOnline.Entity;

public class Position
{
    public float X { get; set; }
    public float Y { get; set; }

    public Position(int x, int y)
    {
        X = x;
        Y = y;
    }

    public Position() : this(0, 0) { }
}