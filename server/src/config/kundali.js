const DEGREE_IN_ZODIAC = 30; // Each zodiac sign occupies 30 degrees

// Orbital Elements for all planets
const orbitalElements = {
  sun: { perihelion: 0, eccentricity: 0.0167, semiMajorAxis: 1.000001018 },
  moon: { perihelion: 0, eccentricity: 0.0549, semiMajorAxis: 0.0025702 },
  mercury: { perihelion: 0.3075, eccentricity: 0.2056, semiMajorAxis: 0.387 },
  venus: { perihelion: 0.7184, eccentricity: 0.0067, semiMajorAxis: 0.723 },
  earth: { perihelion: 0, eccentricity: 0.0167, semiMajorAxis: 1 },
  mars: { perihelion: 1.381, eccentricity: 0.0934, semiMajorAxis: 1.524 },
  jupiter: { perihelion: 1.295, eccentricity: 0.0489, semiMajorAxis: 5.203 },
  saturn: { perihelion: 1.352, eccentricity: 0.0565, semiMajorAxis: 9.537 },
  uranus: { perihelion: 1.699, eccentricity: 0.0461, semiMajorAxis: 19.191 },
  neptune: { perihelion: 1.463, eccentricity: 0.0097, semiMajorAxis: 30.070 },
  pluto: { perihelion: 1.126, eccentricity: 0.2488, semiMajorAxis: 39.482 }, // Including Pluto
};

// Mapping zodiac signs
const ZODIAC_SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

// Helper function to convert a degree to a zodiac sign
function getZodiacSign(degree) {
  const index = Math.floor(Math.abs(degree) / DEGREE_IN_ZODIAC);
  return ZODIAC_SIGNS[index];
}

function toJulianDate(birthDate) {
  const { day, month, year, hour, minute } = birthDate;

  // Adjust for 0-based indexing (January = 1, February = 2, etc.)
  const adjustedMonth = month;
  const adjustedYear = year;

  // Julian Day Calculation
  const a = Math.floor((14 - adjustedMonth) / 12);
  const y = adjustedYear + 4800 - a;
  const m = adjustedMonth + 12 * a - 3;

  const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const fractionOfDay = (hour - 12) / 24 + minute / 1440; // Normalize the time part

  return jd + fractionOfDay; // Julian date with time component
}

// Function to calculate the position of the planet using simplified principles
function planetaryPosition(julianDate, planet) {
  const elements = orbitalElements[planet];
  if (!elements) {
    throw new Error(`Orbital elements for ${planet} not found.`);
  }

  // Mean anomaly calculation (simplified)
  const n = (julianDate - 2451545.0) / 36525.0;
  const meanAnomaly = (357.529 + 35999.050 * n) % 360; // in degrees

  // Eccentric anomaly calculation using an iterative method (simplified version)
  let E = meanAnomaly + elements.eccentricity * Math.sin(meanAnomaly * Math.PI / 180);
  let previousE = 0;
  while (Math.abs(E - previousE) > 1e-6) {
    previousE = E;
    E = meanAnomaly + elements.eccentricity * Math.sin(E * Math.PI / 180);
  }

  // True anomaly calculation
  const trueAnomaly = meanAnomaly + (elements.eccentricity * Math.sin(meanAnomaly * Math.PI / 180));

  // Calculate the planet's position in its orbit
  const planetPosition = (trueAnomaly + elements.perihelion) % 360;

  // Ensure the position is always within the range of 0 to 360 degrees
  return (planetPosition + 360) % 360; // This ensures the planet position is wrapped correctly
}

// Function to calculate the ascendant based on the latitude, longitude, and birth time
function calculateAscendant(latitude, longitude, julianDate, hour, minute) {
  const localSiderealTime = (longitude / 15) + (hour + minute / 60) / 24; // Approximation
  const ascendantDegree = (localSiderealTime * 360 / 24) + latitude / 2; // Rough estimation
  return getZodiacSign(ascendantDegree % 360);
}

// Function to calculate houses based on the ascendant
function calculateHouses(ascendantSign) {
  const houses = [];
  let currentDegree = 0; // Start from the Ascendant

  for (let i = 0; i < 12; i++) {
    const houseDegree = (currentDegree + (i * 30)) % 360; // 30 degrees per house
    houses.push({
      house: i + 1,
      sign: getZodiacSign(houseDegree),
      degree: houseDegree
    });
    currentDegree = houseDegree;
  }

  return houses;
}

// Function to assign planets to houses
function assignPlanetsToHouses(planets, houses) {
  const planetAssignments = [];

  planets.forEach(planet => {
    const planetPosition = planetaryPosition(planet.julianDate, planet.name);
    const planetSign = getZodiacSign(planetPosition);

    // Find the house where the planet belongs
    let planetHouse = null;
    houses.forEach(house => {
      const houseEndDegree = house.degree + 30;

      // Wrap around if necessary
      if (house.degree <= planetPosition && planetPosition < houseEndDegree) {
        planetHouse = house.house;
      }

      // For cases where the house crosses the 360-degree boundary
      if (house.degree + 30 > 360) {
        if (planetPosition >= house.degree || planetPosition < (houseEndDegree % 360)) {
          planetHouse = house.house;
        }
      }
    });

    planetAssignments.push({
      planet: planet.name.charAt(0).toUpperCase() + planet.name.slice(1),
      position: planetPosition,
      zodiacSign: planetSign,
      house: planetHouse
    });
  });

  return planetAssignments;
}

// Main function to generate the Kundali (Birth Chart)
export async function generateKundali({ dateOfBirth, timeOfBirth, latitude, longitude }) {
  const [day, month, year] = dateOfBirth.split('/');
  const [hour, minute] = timeOfBirth.split(':');

  const birthDate = {
    day: parseInt(day),
    month: parseInt(month),
    year: parseInt(year),
    hour: parseInt(hour),
    minute: parseInt(minute)
  };

  const julianDate = toJulianDate(birthDate);

  // Create planets array with all planets
  const planets = Object.keys(orbitalElements).map(planet => ({
    name: planet,
    julianDate
  }));

  // Calculate Ascendant and Houses
  const ascendant = calculateAscendant(latitude, longitude, julianDate, parseInt(hour), parseInt(minute));
  const houses = calculateHouses(ascendant);

  // Assign planets to houses
  const planetsInHouses = assignPlanetsToHouses(planets, houses);

  return { planetsInHouses, ascendant };
}

// Generate Horoscope (Basic Example)
export function generateHoroscope(kundali) {
  const mainPlanet = kundali[0]; // Example: Use the first planet for simplicity
  console.log(mainPlanet)
  const horoscope = `You are under the sign of ${mainPlanet.zodiacSign}, and your main planet is the ${mainPlanet.planet}. Your future looks bright with exciting opportunities in career.`;
  return horoscope;
}
