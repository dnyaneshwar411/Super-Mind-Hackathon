import { sendDataAstrology } from "@/api/server";

export async function panchangDetails(processedData) {
  try {
    const response = await Promise.all([
      sendDataAstrology("tithi-durations", "POST", processedData),
      sendDataAstrology("karana-durations", "POST", processedData),
      sendDataAstrology("yoga-durations", "POST", processedData),
      sendDataAstrology("nakshatra-durations", "POST", processedData),
    ]);

    const tithi = JSON.parse(response?.at(0)?.output ?? [])?.name;
    const karna = JSON.parse(response?.at(1)?.output ?? []);
    const yoga = JSON.parse(response?.at(2)?.output ?? []);
    const nakshatra = JSON.parse(response?.at(3)?.output ?? [])?.name;

    return ({
      tithi,
      karna,
      yoga,
      nakshatra
    })
  } catch (error) {
    return error
  }
}