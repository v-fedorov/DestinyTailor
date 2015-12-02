# Destiny Tailor

Destiny Tailor is a site designed to help fellow guardian's get the most out of their hard earned gear. By using Bungie's API, Destiny Tailor is able to evaluate your equipped gear, and with a bit of number crunching, provide you with a list of available "stat profiles".

A "stat profile" is the term we use for a specific combinations of stats on your gear, e.g. choosing intellect over strength, which was introduced with Destiny year 2 items. This can proove really useful if, like us, you enjoy swapping your item stats to get the most out of them for the right situation, i.e. raiding, trials, or just a bit of casual striking.

## Releases

### 0.2 - Mobile

- **0.2.x**
 - Fixed issue with filtering stat profiles.
- **0.2.1**
 - Greatly improved visibility of inventory.
 - Inventory can now be toggled.
- **0.2.0**
 - Significant improvements to mobile viewing.
   - Much easier to see characters
   - Items are now fully visible.
 - Clearer character selection.

### 0.1 - Initial release

- Searching
  - Quickly search Bungie for your character on either XBox or PSN.
- Stat profiles
  - New; character stat profile evaluation.
  - Clearly see all available stat profiles, and their intellect, discipline and strength yields.
  - See how stat profiles can be achieved by selecting them!

## Contributing - Getting started

Currently only available locally, Destiny Tailor is built in Node.js running Express as the backend server. Getting started locally is easy, here's what you'll need.

#### Prerequisites
* Node.js installed
* An API key from [Bungie.net](https://www.bungie.net/en/User/API)

#### Setup
1. `clone` the repository to a local directoy
2. Install all the dependencies using `npm i`
3. Create a local `.env` file in the root, adding your API (format `API_KEY={key}`)
4. Start the site locally with `npm start`; default address [http://localhost:3000/](http://localhost:3000/)

## About the project

This is very much a "discovery" project; after realising it was possible via the Bungie API, I've decided to step outside of my comfort realms of .NET, and have a proper go with Node.js and Angular. All feedback is appreciated; both positive or ~~negative~~ *constructive*, so please feel free to contact me here, or on PSN via @GeekyEggo.