# App Concept: Card Collection Builder

## Stories
### Feature 1 - Search Cards
User story: As a user, I want to search for Magic cards from a database by name. I want to see the first 10 (might change depending on how cramped UI looks) results of the search as they will be the most relevant.  
*Details: GET data from [scryfall](https://scryfall.com/docs/api/cards/search)'s public API.* 

### Feature 2 - View Card Details
User story: As a user, I want to view the specifics of a card from the search by clicking one of the search results.  
*Details: Either a GET from [scryfall](https://scryfall.com/docs/api/cards/id)'s API using the ID given by the above search, or store the data on the HTML elements to reduce the API calls.*

### Feature 3 - Add Card to Collection & Display User's Card Collection
User story: As a user, I want to add cards to my collection. Additionally, I would like to add custom attributes like a Comment, it's print (Standard v Foil), Art style (Standard v Full Art), and Condition (Near Mint, Lightly, Moderaretly Played, Heavily Player, Damaged). I want to view my current card collection. I wnat the collection to update everytime I add a new card from search. Clicking on a card from my collection displays it's standard card info, as well as its user-specified info.   
*Details: Add a form that accepts the custom attributes. On submit, add the card and it's attributes to the collection. Add a space at the bottom of the page to display the collection. Allow user to click individual cards to view them.*

### Feature 4 - Update or Delete Cards in Collection
User story: As a user, I would like to update the custom attributes or delete the card entirely from my collection. This should be immediately reflected in the UI if deleted.  
*Details: When a user clicks Update, change the info fields for the custom attributes to input fields. Deleting removes the card from the collection displays (then will either display placeholder info or previous card info)*

### Feature 5 - Add arrowkey nav
User story: As a user, I would like to go through the cards in my collection and the search results using the arrow keys.  
*Details: When a user presses the left or right arrow keys, the displayed card from the collection changes. Up/down arrows will be used for search results*

### Feature 6 - Make Collection Persistent
User story: As a user, I want my collection to be saved across sessions.  
*Details: Create a local DB that uses a json-server. Allow user to do full CRUD actions with it. Store custom user attributes along side the card's info here to reduce reliance on scryfall's API*
