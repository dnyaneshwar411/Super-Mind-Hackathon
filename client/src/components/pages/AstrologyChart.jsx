'use client';

// import { Card, CardHeader, CardBody, CardFooter } from '@shadcn/ui';
import { useEffect, useState } from 'react';
import { Card, CardFooter, CardHeader } from '../ui/card';

const ZodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Helper function to get zodiac symbol
const getZodiacSymbol = (sign) => {
  const symbols = {
    Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
    Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
  };
  return symbols[sign] || '';
};

// Helper function to convert position to degree
const getDegreeLabel = (position) => {
  const degrees = Math.floor(position % 30); // Get position in current sign
  const minutes = Math.floor((position % 1) * 60); // Convert fraction of degree to minutes
  return `${degrees}° ${minutes}'`;
};

const planetData = [
  { planet: "Sun", position: 323.3576207624, zodiacSign: "Aquarius", house: 5 },
  { planet: "Moon", position: 323.334827625819, zodiacSign: "Aquarius", house: 5 },
  { planet: "Mercury", position: 323.552408105331, zodiacSign: "Aquarius", house: 5 },
  { planet: "Venus", position: 324.08198755208, zodiacSign: "Aquarius", house: 5 },
  { planet: "Earth", position: 323.3576207624, zodiacSign: "Aquarius", house: 5 },
  { planet: "Mars", position: 324.692855485549, zodiacSign: "Aquarius", house: 5 },
  { planet: "Jupiter", position: 324.633407699628, zodiacSign: "Aquarius", house: 5 },
  { planet: "Saturn", position: 324.68587293947, zodiacSign: "Aquarius", house: 5 },
  { planet: "Uranus", position: 325.039078400738, zodiacSign: "Aquarius", house: 5 },
  { planet: "Neptune", position: 324.824797515176, zodiacSign: "Aquarius", house: 5 },
  { planet: "Pluto", position: 324.345131573911, zodiacSign: "Aquarius", house: 5 }
];

const AstrologyChart = ({ }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setChartData(planetData);
  }, [planetData]);

  return (
    <div className="flex flex-wrap justify-center gap-6 p-8">
      {chartData.map((planet, index) => (
        <Card key={index} className="w-80">
          <CardHeader className="text-center font-bold text-lg">
            {planet.planet}
          </CardHeader>
          <div className="text-center">
            <div className="text-xl">
              {getZodiacSymbol(planet.zodiacSign)} {planet.zodiacSign}
            </div>
            <div className="mt-2 text-sm">
              Position: {getDegreeLabel(planet.position)}
            </div>
          </div>
          <CardFooter className="text-center text-sm text-gray-500">
            House: {planet.house}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default AstrologyChart;