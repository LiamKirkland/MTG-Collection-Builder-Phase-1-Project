const scryURL = "https://api.scryfall.com/cards/"
const dbURL = ""

const getByID = (id) => document.getElementById(id)
const createEle = (tag) => document.createElement(tag)

const searchForm = getByID("searchForm")
const resultsUL = getByID("search-results")
const searchImg = getByID("search-card-img")
const collContainer = getByID("card-list")
const addForm = getByID("addForm")

searchForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const formData = Object.fromEntries(new FormData(searchForm))
  getCards(formData.query)
  addForm.reset()
})

addForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const newCard = createEle("img")
  newCard.src = searchImg.src

  if (!searchImg.dataset.name) {
    alert("Use the search to find a card to add!")
    return
  }

  const formData = Object.fromEntries(new FormData(addForm))
  const card = {
    comment: formData.comment || "",
    print: "foil" in formData,
    artSize: "art" in formData,
    cardCondition: formData.condition,
    ...searchImg.dataset,
  }
  
  for (const key in card) {
    newCard.dataset[key] = card[key]
  }

  newCard.addEventListener("click", (e) => {
    displayCardInfo(e.target, "collection")
  })
  
  collContainer.appendChild(newCard)
  addForm.reset()
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
          displayCardInfo(e.target, "search")
          addForm.reset()
        })
        resultsUL.appendChild(cardLi)
      })
    })
}

function displayCardInfo(cardLi, mode) {
  const card = { ...cardLi.dataset }
  const pArr = []
  if (mode == "search") {
    pArr.push(...getByID("search-info-container").querySelectorAll("p"))
    searchImg.src = card.imgurl

    if (card.flavorName) {
      getByID("search-card-name").textContent =
        `${card.flavorName} (${card.name})`
    } else {
      getByID("search-card-name").textContent = card.name
    }

    for (const key in cardLi.dataset) {
      searchImg.dataset[key] = cardLi.dataset[key]
    }
  }
  if (mode == "collection") {
    pArr.push(...getByID("collection-info-container").querySelectorAll("p"))
    getByID("collection-card-img").src = card.imgurl

    if (card.flavorName) {
      getByID("collection-card-name").textContent =
        `${card.flavorName} (${card.name})`
    } else {
      getByID("collection-card-name").textContent = card.name
    }
    console.log(card)
    pArr[5].textContent = card.print == "true" ? "Yes" : "No"
    pArr[6].textContent = card.artSize == "true" ? "Yes" : "No"
    pArr[7].textContent = card.comment
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
