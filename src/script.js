const scryURL = "https://api.scryfall.com/cards/"
const dbURL = ""

const getByID = (id) => document.getElementById(id)
const createEle = (tag) => document.createElement(tag)

const searchForm = getByID("searchForm")
const resultsUL = getByID("search-results")

searchForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const formData = Object.fromEntries(new FormData(searchForm))
  getCards(formData.query)
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

        if (card.flavor_name && card.flavor_name !== card.name) {
          cardLi.textContent = card.flavor_name
          const attributes = {
            "data-flavor-name": card.flavor_name,
            "data-name": card.name,
            "data-imgurl": card.image_uris.normal,
            "data-set": card.set_name,
            "data-artist": card.artist,
            "data-flavor-text": card.flavor_text,
            "data-oracle-text": card.oracle_text.replace(/\n/g, ", "),
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
            "data-oracle-text": card.oracle_text.replace(/\n/g, ", "),
            "data-type-line": card.type_line,
          }

          Object.entries(attributes).forEach(([tag, value]) => {
            cardLi.setAttribute(tag, value)
          })
        }

        cardLi.id = "result" + i
        cardLi.addEventListener("click", (e) => {
          displayCardInfo(e.target)
        })
        resultsUL.appendChild(cardLi)
      })
    })
}

function displayCardInfo(resultLi) {
  const card = { ...resultLi.dataset }
  const pArr = getByID("search-info-container").querySelectorAll("p")

  getByID("search-card-img").src = card.imgurl
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

  for(const p of pArr) {
    if(p.textContent == "undefined" || p.textContent == "") {
      p.textContent = "None."
    }
  }
}