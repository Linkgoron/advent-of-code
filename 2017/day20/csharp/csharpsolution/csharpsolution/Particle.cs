using System;
using System.Linq;

namespace csharpsolution
{
    public class Particle
    {
        public Point Start { get; set; }
        public Point StartVelocity { get; set; }
        public Point StartAcceleration { get; set; }

        public Point Location { get; set; }
        public Point Velocity { get; set; }
        public Point Acceleration { get; set; }
        public bool IsActive { get; set; }

        public void ChangeToNextPlace()
        {
            this.Velocity = this.Velocity + this.Acceleration;
            this.Location = this.Location + Velocity;
        }


    }

    public class Solution
    {
        public double[] Solutions { get; set; } = new double[0];
        public bool HasInfinity { get; set; } = false;
        public bool NoSolution => !Solutions.Any() && !HasInfinity;
        public bool isGoodFor(int other) => HasInfinity ? true : IntegerSolutions.Contains(other);
        public int[] IntegerSolutions => Solutions.Where(x => Math.Abs(Math.Round(x) - x) < 0.1).Select(x => (int)Math.Round(x)).ToArray();


    }

    public struct Point
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }

        public static bool operator ==(Point p, Point o)
        {
            if (p.X != o.X) return false;
            if (p.Y != o.Y) return false;
            return (p.Z == o.Z);
        }

        public static bool operator !=(Point p, Point o)
        {
            return !(p == o);
        }

        public static Point operator -(Point p, Point o)
        {
            return new Point
            {
                X = p.X - o.X,
                Y = p.Y - o.Y,
                Z = p.Z - o.Z
            };
        }

        public static Point operator +(Point p, Point o)
        {
            return new Point
            {
                X = p.X + o.X,
                Y = p.Y + o.Y,
                Z = p.Z + o.Z
            };
        }

        public override bool Equals(object obj)
        {
            if (!(obj is Point))
            {
                return false;
            }

            var point = (Point)obj;
            return X == point.X &&
                   Y == point.Y &&
                   Z == point.Z;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(X, Y, Z);
        }
    }
}