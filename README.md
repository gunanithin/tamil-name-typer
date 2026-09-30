# Tamil Name Typer

Tamil Name Typer is a smart, voice-activated web application that accurately transliterates spoken Tamil names into their common English spellings. 

## 🎯 Why This App?

Standard phonetic transliteration libraries often fail when converting Tamil names to English because Tamil has a simplified alphabet where a single letter can represent multiple sounds (e.g., the letter 'க' can sound like 'K' or 'G'). 

For example:
- A standard dictionary approach will incorrectly transliterate "கோபி" as **Kopi** and "குணாநிதி" as **Kunaanithi**.
- This app understands context and correctly transliterates them to **Gopi** and **Gunanithi**.

## 🚀 Use Case

This tool is designed for anyone who needs to quickly and accurately capture spoken Tamil names and copy them into English formats without worrying about manual spelling corrections. It's particularly useful for:
- Data entry and customer service agents.
- Filling out English forms based on verbal Tamil input.
- Anyone who wants a seamless, hands-free way to type out culturally accurate Indian name spellings.

## 🛠️ How It Works

1. **Speech Recognition:** The app uses the browser's native Web Speech API to listen to your voice in Tamil.
2. **AI Transliteration:** It securely sends the Tamil text to Google's **Gemini AI** (`gemini-flash-latest`), which intelligently applies contextual phonetic rules to generate the most natural English spelling.
3. **Seamless UX:** Just tap the mic, speak, and click to copy the result to your clipboard.

## ⚙️ Setup & Deployment

1. Clone the repository and run `npm install`.
2. Create a `.env` file in the root directory and add your Google Gemini API Key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
3. Run `npm run dev` to start the local development server.
4. To deploy to **Vercel**, import the project and ensure you add the `VITE_GEMINI_API_KEY` to the Vercel Environment Variables before building.

## 🎨 Tech Stack
- **Frontend:** React + Vite
- **Styling:** Vanilla CSS (Glassmorphism design)
- **AI Integration:** Google Generative AI SDK (`@google/generative-ai`)
