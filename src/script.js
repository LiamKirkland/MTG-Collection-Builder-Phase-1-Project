const scryURL = "https://api.scryfall.com/cards/"
const dbURL = ""

const getByID = (id) => document.getElementById(id)
const createEle = (tag) => document.createElement(tag)

const searchForm = getByID("searchForm")
const addBtn = getByID("addBtn")
const resultsUL = getByID("search-results")
const searchImg = getByID("search-card-img")
const collContainer = getByID("card-list")

searchForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const formData = Object.fromEntries(new FormData(searchForm))
  getCards(formData.query)
})

addBtn.addEventListener('click', e => {
  const commentBox = getByID('commentBox').value
  const foil = getByID('foil').checked
  const art = getByID('art').checked
  const condition = getByID('conSelector').value

  const card = {
    comment: commentBox,
    print: foil,
    artSize: art,
    cardCondition: condition
  }

  for(const key in searchImg.dataset) {
    card[key] = searchImg.dataset[key]
  }
  const newCard = createEle('img')
  newCard.src = searchImg.src
  for(const key in card) {
    newCard.dataset[key] = card[key]
  }

  collContainer.appendChild(newCard)
})

function getCards(query) {
  fetch(`${scryURL}search?q=${query.replace(/ /g, "+")}`)
    .then((res) => res.json())
    .then((queryRes) => {
      const cards = queryRes.data
      resultsUL.replaceChildren()

      cards.slice(0, 10).forEach((card, i) => {
        console.log(card)
        const cardLi = createEle("li")

        let oracleText = card.oracle_text
          .replace(/\n/g, ", ")
          .replace(/\.,/g, ".")

        if (card.flavor_name && card.flavor_name !== card.name) {
          cardLi.textContent = card.flavor_name
          oracleText = oracleText.replaceAll(card.name, card.flavor_name)
          const attributes = {
            "data-flavor-name": card.flavor_name,
            "data-name": card.name,
            "data-imgurl": card.image_uris.normal,
            "data-set": card.set_name,
            "data-artist": card.artist,
            "data-flavor-text": card.flavor_text,
            "data-oracle-text": oracleText,
            "data-type-line": card.type_line,
          }

          Object.entries(attributes).forEach(([tag, value]) => {
            cardLi.setAttribute(tag, value)
          })
        } else {
          cardLi.textContent = card.name
          const attributes = {
            "data-name": card.name,
            "data-imgurl": card.image_uris.normal,
            "data-set": card.set_name,
            "data-artist": card.artist,
            "data-flavor-text": card.flavor_text,
            "data-oracle-text": oracleText,
            "data-type-line": card.type_line,
          }

          Object.entries(attributes).forEach(([tag, value]) => {
            cardLi.setAttribute(tag, value)
          })
        }

        cardLi.id = "result" + i
        cardLi.addEventListener("click", (e) => {
          displaySearchResult(e.target)
        })
        resultsUL.appendChild(cardLi)
      })
    })
}

function displaySearchResult(resultLi) {
  const card = { ...resultLi.dataset }
  const pArr = getByID("search-info-container").querySelectorAll("p")
  searchImg.src = card.imgurl
  for(const key in resultLi.dataset) {
    searchImg.dataset[key] = resultLi.dataset[key]
  }

  if (card.flavorName) {
    getByID("search-card-name").textContent =
      `${card.flavorName} (${card.name})`
  } else {
    getByID("search-card-name").textContent = card.name
  }

  pArr[0].textContent = card.typeLine
  pArr[1].textContent = card.artist
  pArr[2].textContent = card.set
  pArr[3].textContent = card.oracleText
  pArr[4].textContent = card.flavorText

  for (const p of pArr) {
    if (p.textContent == "undefined" || p.textContent == "") {
      p.textContent = "None."
    }
  }
}
