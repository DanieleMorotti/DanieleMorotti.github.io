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
  <a href="#limitations">Limitations</a> •
  <a href="#notes">Notes</a>
</p>

---

## Features

🎬 **Track Productions** - Add movies or TV shows you're excited about and follow their production progress before release.

📰 **Personalized News Feed** - Get curated news cards about your tracked shows, powered by **Google's Gemini AI**.

📁 **Archive System** - Save read news for later by archiving them to a dedicated section.

📱 **PWA Support** - Install the app on your device for a native-like experience.

⏰ **Scheduled Updates** - Set a preferred time for automatic news searches, or launch manually with a button. ***NOTE: the app must be open to launch the search.***

## How It Works

ShowScout AI uses the **Gemini family of LLMs** to intelligently search and filter entertainment news based on your tracked shows.

### Scheduling

In **Settings**, you can set a time when the app should run the news check.

- If the app is **open** at that time, it will run **automatically**.
- If the app is **closed**, the next time you open it:
  - If the **scheduled** time has already passed, the app will run immediately.

### Gemini Models

To use the app, you must provide your own **API key** in Settings.

You can get a **free** API key from Google AI Studio by following [this official guide](https://ai.google.dev/gemini-api/docs/api-key).

The app provides different Gemini models. If the search fails when using the most recent ones, try the 2.5 versions (this may be due to free API restrictions on the latest models).

### PWA

The web app is also a Progressive Web App and can be installed for a better experience. It obviously **requires** an internet connection to run the search.

Results and **settings** are **saved** in the app's local storage.

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

Or build the files, which will be created in the `dist` directory:

```bash
npm run build
```

## Limitations

⚠️ **Background Execution** - If you leave the app while a search is running, it will likely be stopped by the OS due to PWA restrictions on background processes.

🖥️ **Client-Side Architecture** - Currently, all search logic runs on the client. Moving this to a server would improve reliability and allow true background updates. This is left for future improvements.

🔔 **Notifications** - We tested push notifications, but they are unreliable with PWAs. Given that background execution is limited, notifications would rarely trigger correctly and were therefore not implemented.

## Notes

News relevance depends on the titles you add and the model's interpretation of available sources.

The model may **misinterpret** a title when multiple shows share the same name. In such cases, **specify** additional context in the watchlist, for example, "Avatar series" or "Avatar Netflix" to get news about the TV series instead of the movie.