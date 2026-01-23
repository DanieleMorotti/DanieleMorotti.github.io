<h1 align="center">
  <img src="./public/showscout_icon_512.png" alt="ShowScout AI icon" width="90" height="90" style="vertical-align: middle;" />
  &nbsp;ShowScout AI
</h1>


<p align="center">
  A web app (PWA) to stay updated on production news for upcoming movies and TV series.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#installation">Installation</a> •
  <a href="#notes">Notes</a>
</p>

---

## Features

🎬 **Track Productions** — Add movies or TV shows you're excited about and follow their production progress before release.

📰 **Personalized News Feed** — Get curated news cards about your tracked shows, powered by **Google's Gemini AI**.

📁 **Archive System** — Save read news for later by archiving them to a dedicated section.

📱 **PWA Support** — Install the app on your device for a native-like experience.

⏰ **Scheduled Updates** — Set a preferred time for automatic news searches, or launch manually with a button. ***NOTE: the app must be open to launch the search***


## How It Works

ShowScout AI uses the **Gemini family of LLMs** to intelligently search and filter entertainment news based on your tracked shows.

### Scheduling
In **Settings**, you can set a time when the app should run the news check.

- If the app is **open** at that time, it will run **automatically**.
- If the app is **closed**, then the next time you open it:
  - if the **scheduled** time has already passed, the app will run immediately.

### Gemini models

To use the app, you must provide your own **API key** in Settings.

You can get a **free** API key from Google AI Studio, following [this official guide](https://ai.google.dev/gemini-api/docs/api-key).

The app provides different Gemini models, if the search fails when using the most recent ones, try the 2.5 versions (it may be due to free API restrictions on latest models).

### PWA

The webapp is also a Progressive Web App, therefore it may be installed for a better experience. It obviously **needs** an internet connection to run the search.

But it **saves** the found results and the **settings** in the local storage of the app.

## Installation

> Make sure you have [Node.js](https://nodejs.org/) installed.

**Run all commands from the project root.**

Clone the repository and install dependencies:
```bash
npm install
```

Then you can launch a local test:
```bash
npm run dev
```

or build the files, that will be created in the `dist` directory:

```bash
npm run build
```

## Notes

News relevance depends on the titles you add and the model’s interpretation of available sources.

The model may **misinterpret** a title when multiple shows share the same name. In such cases, **specify** for example "[name] series" or "[name] Netflix" in the watchlist to avoid confusion.(e.g. "Avatar series" or "Avatar Netflix" to get the latest news on the second season instead of the movie).