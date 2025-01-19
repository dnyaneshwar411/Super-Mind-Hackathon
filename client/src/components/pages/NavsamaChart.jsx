'use client';
import { Card } from "@/components/ui/card";

export default function NavamsaChart({ data }) {

  const planetColors = {
    Sun: '#FFA500',
    Moon: '#808080',
    Mars: '#FF0000',
    Mercury: '#008000',
    Jupiter: '#FFD700',
    Venus: '#800080',
    Saturn: '#0000FF',
    Rahu: '#000000',
    Ketu: '#8B4513',
    Uranus: '#FFD700',
    Neptune: '#0000FF',
    Pluto: '#808080',
    Ascendant: '#008000'
  }

  const planetAbbr = {
    Sun: 'Su',
    Moon: 'Mo',
    Mars: 'Ma',
    Mercury: 'Me',
    Jupiter: 'Ju',
    Venus: 'Ve',
    Saturn: 'Sa',
    Rahu: 'Ra',
    Ketu: 'Ke',
    Uranus: 'Ur',
    Neptune: 'Ne',
    Pluto: 'Pl',
    Ascendant: 'Asc'
  }

  const getHousePosition = (sign) => {
    const housePositions = {
      1: { x: 200, y: 67 },
      2: { x: 333, y: 67 },
      3: { x: 333, y: 200 },
      4: { x: 333, y: 333 },
      5: { x: 200, y: 333 },
      6: { x: 67, y: 333 },
      7: { x: 67, y: 200 },
      8: { x: 67, y: 67 },
      9: { x: 200, y: 133 },
      10: { x: 200, y: 200 },
      11: { x: 200, y: 267 },
      12: { x: 267, y: 200 }
    }
    return housePositions[sign]
  }

  const newData = []

  for (const key in data) {
    newData.push(data[key])
  }

  const planetsBySign = newData?.reduce((acc, planet) => {
    const sign = planet.current_sign
    if (!acc[sign]) acc[sign] = []
    acc[sign].push(planet)
    return acc
  }, {})

  const calculatePlanetPosition = (basePosition, index, totalPlanets) => {
    const spacing = 30;
    const rowLimit = 3;

    const row = Math.floor(index / rowLimit)
    const col = index % rowLimit

    const totalRows = Math.ceil(totalPlanets / rowLimit)
    const planetsInLastRow = totalPlanets % rowLimit || rowLimit

    const startX = basePosition.x - ((Math.min(totalPlanets, rowLimit) - 1) * spacing) / 2
    const startY = basePosition.y - ((totalRows - 1) * spacing) / 2

    return {
      x: startX + (col * spacing),
      y: startY + (row * spacing)
    }
  }

  // return <></>

  return (
    <Card className="p-4 bg-[#FEFBF6] max-w-2xl mx-auto">
      <div className="aspect-square w-full relative">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* Main square */}
          <rect x="0" y="0" width="400" height="400" fill="none" stroke="black" strokeWidth="2" />

          {/* Diagonal lines */}
          <line x1="0" y1="0" x2="400" y2="400" stroke="black" strokeWidth="2" />
          <line x1="400" y1="0" x2="0" y2="400" stroke="black" strokeWidth="2" />

          {/* Middle square lines */}
          <line x1="133" y1="133" x2="267" y2="133" stroke="black" strokeWidth="2" />
          <line x1="133" y1="267" x2="267" y2="267" stroke="black" strokeWidth="2" />
          <line x1="133" y1="133" x2="133" y2="267" stroke="black" strokeWidth="2" />
          <line x1="267" y1="133" x2="267" y2="267" stroke="black" strokeWidth="2" />

          {/* House numbers */}
          <text x="200" y="30" textAnchor="middle" fontSize="16">1</text>
          <text x="370" y="30" textAnchor="middle" fontSize="16">2</text>
          <text x="370" y="200" textAnchor="middle" fontSize="16">3</text>
          <text x="370" y="370" textAnchor="middle" fontSize="16">4</text>
          <text x="200" y="370" textAnchor="middle" fontSize="16">5</text>
          <text x="30" y="370" textAnchor="middle" fontSize="16">6</text>
          <text x="30" y="200" textAnchor="middle" fontSize="16">7</text>
          <text x="30" y="30" textAnchor="middle" fontSize="16">8</text>
          <text x="200" y="100" textAnchor="middle" fontSize="16">9</text>
          <text x="200" y="200" textAnchor="middle" fontSize="16">10</text>
          <text x="200" y="300" textAnchor="middle" fontSize="16">11</text>
          <text x="300" y="200" textAnchor="middle" fontSize="16">12</text>

          {/* Planets */}
          {Object.entries(planetsBySign).map(([sign, planets]) => {
            const basePosition = getHousePosition(parseInt(sign))

            return planets.map((planet, index) => {
              const position = calculatePlanetPosition(basePosition, index, planets.length)

              return (
                <g key={planet.name}>
                  {/* Optional: Add background circle for better readability */}
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r="12"
                    fill="#FEFBF6"
                    stroke="none"
                  />
                  <text
                    x={position.x}
                    y={position.y}
                    fill={planetColors[planet.name]}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="14"
                    fontWeight={planet.isRetro === 'true' ? 'bold' : 'normal'}
                  >
                    {planetAbbr[planet.name]}
                  </text>
                </g>
              )
            })
          })}
        </svg>
      </div>
    </Card>
  )
}
