const scryURL = "https://api.scryfall.com/cards/"
const dbURL = ""

const getByID = id => document.getElementById(id)
const createEle = tag => document.createElement(tag)

const searchForm = getByID("searchForm")
const resultsUL = getByID("search-results")

function getCards(query) {
  fetch(`${scryURL}search?q=${query.replace(/ /g, "+")}`)
  .then(res => res.json())
  .then(console.log)
}