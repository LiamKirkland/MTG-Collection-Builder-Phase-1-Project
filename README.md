# SparkBinder
As a user, I want the ability to search for MTG cards via [Scryfall's API](https://scryfall.com/docs/api). Then I want to give additional info (like print type, art style, conndition, and a comment) before adding it to my collection. I would like this collection to persist across sessions as a way to track and manage my collection

### Project Setup
- Pull the app down from GitHub
  - `git clone git@github.com:LiamKirkland/MTG-Collection-Builder-Phase-1-Project.git`
- Ensure you have a json-server installed
  - This can be done by running `npm install -g json-server`
- Have the json-server watch the `db.json` file to ensure the collection features work as expected
  - Run `json-server --watch db.json` in the project directory to do this
- Run `open index.html` in the project directory to open it in your default browser

### Core Features
- *Search Functionality*
  - Search results should return the first 10 cards found by Scryfall's query
  - Clicking on a result will display the card's information
  - Card attributes are stored within the HTML Element to reduce API calls
  - From the card display, users can add custom attributes then add the card to the collection
- *Collection Management*
  - Cards in the user's collection will appear at the bottom as images
  - Clicking one of the cards will display it next to the collection, with both the card's standard attributes and the user's custom attributes
  - User can choose to Update or Delete the card from this view if they wish
- *Collection Persistence*
  - SparkBinder uses a local DB to store the user's collection to allow for persistence across sessions
  - Adding a card to the collection adds it to the DB
  - Updating a card saves the updates to its respective DB entry
  - Deleting a card removes it entirely from the DB
 
### User Notes
- The Search and Random features both use Scryfall's public API
  - These features have a rate-limit of 2 queries per second
  - Spamming these may result in the API blocking calls momentarily (indicated by a 429 error in your console)
      - If this happens, wait a minute then try again
- The application assumes your json-server will use port 3000
  - If for some reason your json-server is on a different port, try closing any other local servers you may be running then reopen the json-server
  - Alternatively, you can change the `dbURL` variable in `script.js` to match the port of your json-server
