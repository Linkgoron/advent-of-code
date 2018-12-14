using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace csharpsolution
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var parser = new Regex("<[^>]+>");
            var data = await File.ReadAllLinesAsync("data.txt");
            var parsed = data.Select(x => x.Trim()).Select(x => parser.Matches(x))
                .Select(x => new Particle
                {
                    Start = ParsePoint(x[0]),
                    Location = ParsePoint(x[0]),
                    Velocity = ParsePoint(x[1]),
                    StartVelocity = ParsePoint(x[1]),
                    Acceleration = ParsePoint(x[2]),
                    StartAcceleration = ParsePoint(x[2]),
                    IsActive = true
                }).ToList();

            int maxSteps = 10000;
            for (int m = 0; m < maxSteps; m++)
            {
                bool hasHit = false;
                var relevant = parsed.Where(x => x.IsActive).ToList();
                if (m % 1000 == 0) Console.WriteLine($"{m},{m / (decimal)maxSteps * 100},{relevant.Count}");
                var hits = relevant.Select(x => new
                {
                    x = x,
                    Location = x.Location
                }).ToLookup(x => x.Location, x => x);

                foreach (var current in hits.Where(x => x.Count() > 1))
                {
                    if (!hasHit) Console.WriteLine(m);
                    hasHit = true;
                    foreach (var item in current)
                    {
                        item.x.IsActive = false;
                    }
                }
                foreach (var item in relevant)
                {
                    item.ChangeToNextPlace();
                }

            }

            var lastRelevant = parsed.Where(x => x.IsActive).ToList();
            Console.WriteLine("done", lastRelevant.Count);
            Console.ReadLine();
        }


        static Point ParsePoint(Match match)
        {
            var pointData = match.Value.Replace("<", "").Replace(">", "");
            var data = pointData.Split(',').Select(int.Parse).ToList();
            return new Point()
            {
                X = data[0],
                Y = data[1],
                Z = data[2],
            };
        }
    }
}
