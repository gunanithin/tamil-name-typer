import { GoogleGenerativeAI } from '@google/generative-ai';

export const commonNamesDictionary = {
  // Common Tamil Names Dictionary
  "கார்த்திக்": "Karthik",
  "முருகன்": "Murugan",
  "மலர்": "Malar",
  "கவிதா": "Kavitha",
  "ரமேஷ்": "Ramesh",
  "சுரேஷ்": "Suresh",
  "பிரியா": "Priya",
  "விஜய்": "Vijay",
  "அஜித்": "Ajith",
  "லட்சுமி": "Lakshmi",
  "சரவணன்": "Saravanan",
  "அனுஷா": "Anusha",
  "பாலாஜி": "Balaji",
  "சத்யா": "Sathya",
  "தினேஷ்": "Dinesh",
  "கணேஷ்": "Ganesh",
  "கௌதம்": "Gowtham",
  "ஹரி": "Hari",
  "ஹேமா": "Hema",
  "இந்திரா": "Indira",
  "ஜானகி": "Janaki",
  "கமலா": "Kamala",
  "கண்ணன்": "Kannan",
  "மீனா": "Meena",
  "மோகன்": "Mohan",
  "நந்தினி": "Nandhini",
  "பத்மா": "Padma",
  "பூஜா": "Pooja",
  "ராஜா": "Raja",
  "ரேவதி": "Revathi",
  "சங்கர்": "Shankar",
  "சிவா": "Siva",
  "வித்யா": "Vidhya",
  "ராமன்": "Raman",
  "அருண்": "Arun",
  "குமார்": "Kumar",
  "சுவாமி": "Swami",
  "பாரதி": "Bharathi",
  "ஜெயந்தி": "Jayanthi",
  "கீதா": "Geetha",
  "சந்திரா": "Chandra",
  "பாஸ்கர்": "Bhaskar",
  "பிரகாஷ்": "Prakash",
  "மணி": "Mani",
  "சுப்பு": "Subbu",
  "முத்து": "Muthu",
  "கஸ்தூரி": "Kasthuri",
  "வேலு": "Velu",
  "சாந்தி": "Shanthi",
  "ரவி": "Ravi",
  "ராதிகா": "Radhika",
  "குணாநிதி": "Gunanithi",
  "குரு": "Guru",
  "குணா": "Guna"
};

// Simplified Phonetic Fallback mapping
export const transliterateTamilToEnglish = async (tamilText, apiKey = '') => {
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      const prompt = `You are a strict transliteration assistant. Transliterate the following Tamil name to English accurately, recognizing common Indian names like Gopi, Gunanithi, Karthik etc. Do not translate the meaning. Return ONLY the English name, nothing else. Name: ${tamilText}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      return text.replace(/^["']|["']$/g, '');
    } catch (e) {
      console.error("Gemini API Error:", e);
      throw new Error(`AI Transliteration failed: ${e.message}`);
    }
  }

  // First, check if the exact word exists in the dictionary
  if (commonNamesDictionary[tamilText.trim()]) {
    return commonNamesDictionary[tamilText.trim()];
  }

  // Fallback: A basic transliteration mapping (can be expanded)
  // This is a simplified version and might not be 100% grammatically perfect for all edge cases
  // but provides a readable English spelling.
  
  let text = tamilText;

  // 1. Map independent vowels
  const indVowels = {
    'அ': 'a', 'ஆ': 'aa', 'இ': 'i', 'ஈ': 'ee', 'உ': 'u', 'ஊ': 'oo',
    'எ': 'e', 'ஏ': 'e', 'ஐ': 'ai', 'ஒ': 'o', 'ஓ': 'o', 'ஔ': 'au'
  };
  
  // 2. Map consonants (with implicit 'a' sound)
  const consonants = {
    'க': 'ka', 'ங': 'nga', 'ச': 'sa', 'ஞ': 'nya', 'ட': 'ta', 'ண': 'na',
    'த': 'tha', 'ந': 'na', 'ப': 'pa', 'ம': 'ma', 'ய': 'ya', 'ர': 'ra',
    'ல': 'la', 'வ': 'va', 'ழ': 'zha', 'ள': 'la', 'ற': 'ra', 'ன': 'na',
    'ஷ': 'sha', 'ஸ': 'sa', 'ஹ': 'ha', 'ஜ': 'ja'
  };
  
  // 3. Map vowel markers (dependent vowels)
  const vowelMarkers = {
    'ா': 'aa', 'ி': 'i', 'ீ': 'ee', 'ு': 'u', 'ூ': 'oo',
    'ெ': 'e', 'ே': 'e', 'ை': 'ai', 'ொ': 'o', 'ோ': 'o', 'ௌ': 'au'
  };

  // Pure consonants (no implicit 'a') mapping for "்" (pulli)
  const pureConsonants = {
    'க்': 'k', 'ங்': 'ng', 'ச்': 's', 'ஞ்': 'nj', 'ட்': 't', 'ண்': 'n',
    'த்': 'th', 'ந்': 'n', 'ப்': 'p', 'ம்': 'm', 'ய்': 'y', 'ர்': 'r',
    'ல்': 'l', 'வ்': 'v', 'ழ்': 'zh', 'ள்': 'l', 'ற்': 'r', 'ன்': 'n',
    'ஷ்': 'sh', 'ஸ்': 's', 'ஹ்': 'h', 'ஜ்': 'j'
  };

  // Replace pure consonants first (e.g. க்)
  for (const [tamil, english] of Object.entries(pureConsonants)) {
    text = text.replaceAll(tamil, english);
  }

  // Handle dependent vowels. If a consonant is followed by a dependent vowel marker,
  // we should replace the consonant + marker combination.
  // Actually a simpler way for fallback is to just replace the consonant 'a' ending 
  // with the respective vowel ending. 
  // For simplicity in this regex, we'll replace the full consonant and then fix the vowel markers.
  
  for (const [consonant, englishBase] of Object.entries(consonants)) {
    for (const [marker, englishVowel] of Object.entries(vowelMarkers)) {
       text = text.replaceAll(consonant + marker, englishBase.slice(0, -1) + englishVowel);
    }
    // Also replace standalone consonant with 'a' sound
    text = text.replaceAll(consonant, englishBase);
  }

  // Replace independent vowels
  for (const [tamil, english] of Object.entries(indVowels)) {
    text = text.replaceAll(tamil, english);
  }

  // Capitalize first letter of each word
  return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};
