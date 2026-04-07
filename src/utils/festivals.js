// Simple festival mapping for typical dates (approximate for lunar calendars, hardcoded for demo)
// Format: MM-DD
const FESTIVALS = {
  '01-14': { name: 'Makar Sankranti / Pongal', message: 'Festive day! Enjoy the sweets, maybe swap your heavy gym day for some active recovery or a walk in the sun.' },
  '01-26': { name: 'Republic Day', message: 'Happy Republic Day! A great day for a strong, empowering workout.' },
  '03-14': { name: 'Holi', message: 'Happy Holi! Your workout today: dodging water balloons and dancing! Rest from the weights.' },
  '04-14': { name: 'Baisakhi', message: 'Happy Baisakhi! Enjoy the harvest festival. Balance the feast with a light evening walk.' },
  '08-15': { name: 'Independence Day', message: 'Happy Independence Day! Stay active, stay free!' },
  '09-17': { name: 'Ganesh Chaturthi', message: 'Ganpati Bappa Morya! Enjoy the modaks, just hit your protein goal and grab a quick home workout.' },
  '10-12': { name: 'Dussehra', message: 'Happy Dussehra! Celebrate the victory of good over evil. Conquer your PRs today!' },
  '11-01': { name: 'Diwali', message: 'Happy Diwali! Focus on family and festivities. Treat today as a rest day, enjoy the sweets guilt-free within limits.' },
  '12-25': { name: 'Christmas', message: 'Merry Christmas! Enjoy the feast. Try a brisk morning walk before the festivities.' },
};

export function getActiveFestival() {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const key = `${month}-${day}`;
  
  // For demo, if today isn't a festival, randomly return Diwali 5% of the time,
  // or we can just strictly follow the date. The prompt says "On festival days".
  // To allow testing, you can uncomment this:
  // return { name: 'Diwali', message: 'Happy Diwali! Treat today as a rest day.' };
  
  return FESTIVALS[key] || null;
}
