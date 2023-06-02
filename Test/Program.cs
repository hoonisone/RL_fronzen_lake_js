using System;
using System.Collections.Generic;
using System.Linq;
using NSGA2;

namespace Test
{
    class Program
    {
        static void Main()
        {
            GA ga = new GA(populationSize: 10);
            NSGA2.Environment env = NSGA2.EnvironmentFactory.Get();
            env.Evaluate(ga.population);

            for (int i = 0; i < 100; i++)
            {
                ga.FastNonDominatedSort(); // objectives의 fitness들을 고려하여 좋은 순서로 정렬
                ga.CrowdingDistance(ga.fronts[0]); // 밀집도 계산
                ga.NextGeneration(); // 새로운 population 생성
                env.Evaluate(ga.population); // 환경에 대해 각 individual 평가
            }

            Dictionary<string, bool> printFlags = new Dictionary<string, bool>()
            {
                {"rank", true},
                {"crowdingDistance", true},
                {"objectives", true},
                {"genes", true},
            };
            ga.Print(printFlags);

        }
    }
}