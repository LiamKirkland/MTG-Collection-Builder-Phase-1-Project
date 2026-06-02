const scryURL = "https://api.scryfall.com/cards/"
const dbURL = ""

const getByID = (id) => document.getElementById(id)
const createEle = (tag) => document.createElement(tag)

const searchForm = getByID("searchForm")
const resultsUL = getByID("search-results")
const searchImg = getByID("search-card-img")
const collImg = getByID("collection-card-img")
const collContainer = getByID("card-list")
const addForm = getByID("addForm")
const updateForm = getByID("updateForm")
const updateBtn = getByID("updateBtn")
const deleteBtn = getByID("deleteBtn")
const conditionSelect = updateForm.querySelector("select")
const commentTextarea = updateForm.querySelector("textarea")
const updateFoil = updateForm.querySelector("#updateFoil")
const updateArt = updateForm.querySelector("#updateArt")
const updateInputs = [conditionSelect, commentTextarea, updateFoil, updateArt]
const updatePs = () => [...updateForm.querySelectorAll("p")]

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

  newCard.id = "collection" + collContainer.childElementCount
  collContainer.appendChild(newCard)
  addForm.reset()
})

updateForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const pArr = [...updateForm.querySelectorAll("p")]
  const formData = Object.fromEntries(new FormData(updateForm))

  if (updateBtn.value == "Update" && collImg.dataset.cardId) {
    updateBtn.value = "Save"
    deleteBtn.value = "Cancel"

    updatePs().forEach((p) => (p.hidden = true))
    updateInputs.forEach((el) => (el.hidden = false))
    conditionSelect.value = getByID("collection-condition").textContent
    updateForm.querySelector("textarea").value =
      getByID("collection-comment").textContent == "None."
        ? ""
        : getByID("collection-comment").textContent
    updateFoil.checked = getByID("collection-foil").textContent === "Yes"
    updateArt.checked = getByID("collection-art").textContent === "Yes"
  } else if (updateBtn.value == "Save") {
    exitEditMode()

    const collectionCard = getByID(collImg.dataset.cardId)

    collectionCard.dataset["comment"] = formData.comment
    collectionCard.dataset["cardCondition"] = formData.condition
    collectionCard.dataset["print"] = "foil" in formData
    collectionCard.dataset["artSize"] = "art" in formData

    displayCardInfo(collectionCard, "collection")
  }
})

deleteBtn.addEventListener("click", (e) => {
  if (deleteBtn.value == "Delete") {
    if (confirm("Are you sure you want to delete this card from your collection? This action cannot be undone.")) {
      getByID(collImg.dataset.cardId).remove()
      for (const p of [...getByID("collection-text-info").querySelectorAll("p")]) {
        p.textContent = ""
      }
      getByID("collection-card-name").textContent = ""
      collImg.src = ""
      collImg.dataset.cardId = ""
    }
  }
  if (deleteBtn.value == "Cancel") {
    exitEditMode()
  }
})

document.body.addEventListener('keydown', e => {
  switch(e.key) {
    case "ArrowUp":
      cycleResults(-1)
      break;
    case "ArrowDown":
      cycleResults(1)
      break;
    case "ArrowLeft":
      cycleCollection(-1)
      break;
    case "ArrowRight":
      cycleCollection(1)
      break;
  }
})

function cycleResults(direction) {
  if (resultsUL.childElementCount > 0 && searchImg.dataset.cardId) {
    let id = +searchImg.dataset.cardId.slice(6) + direction
    if (id >= 0 && id < resultsUL.childElementCount) {
      id = "result" + id
      displayCardInfo(getByID(id), "search")
    }
  } else if (resultsUL.childElementCount > 0 && !searchImg.dataset.cardId) {
    displayCardInfo(getByID("result0"), "search")
  }
}

function cycleCollection(direction) {
  if (collContainer.childElementCount > 0 && collImg.dataset.cardId) {
    let id = +collImg.dataset.cardId.slice(10) + direction
    if (id >= 0 && id < collContainer.childElementCount) {
      id = "collection" + id
      displayCardInfo(getByID(id), "collection")
    }
  } else if (collContainer.childElementCount > 0 && !collImg.dataset.cardId) {
    displayCardInfo(getByID("collection0"), "collection")
  }
}

function exitEditMode() {
  updateBtn.value = "Update"
  deleteBtn.value = "Delete"

  updatePs().forEach((p) => (p.hidden = false))
  updateInputs.forEach((el) => (el.hidden = true))
}

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

        let attributes = {
          "data-name": card.name,
          "data-imgurl": card.image_uris.normal,
          "data-set": card.set_name,
          "data-artist": card.artist,
          "data-flavor-text": card.flavor_text,
          "data-oracle-text": oracleText,
          "data-type-line": card.type_line,
        }

        if (card.flavor_name && card.flavor_name !== card.name) {
          cardLi.textContent = card.flavor_name
          oracleText = oracleText.replaceAll(card.name, card.flavor_name)
          attributes["data-flavor-name"] = card.flavor_name

          Object.entries(attributes).forEach(([tag, value]) => {
            cardLi.setAttribute(tag, value)
          })
        } else {
          cardLi.textContent = card.name
          attributes["data-flavor-name"] = ""
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
    searchImg.setAttribute("data-card-id", cardLi.id)

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
    collImg.src = card.imgurl
    collImg.setAttribute("data-card-id", cardLi.id)

    if (card.flavorName) {
      getByID("collection-card-name").textContent =
        `${card.flavorName} (${card.name})`
    } else {
      getByID("collection-card-name").textContent = card.name
    }
    console.log(card)
    pArr[5].textContent = card.cardCondition
    pArr[6].textContent = card.print == "true" ? "Yes" : "No"
    pArr[7].textContent = card.artSize == "true" ? "Yes" : "No"
    pArr[8].textContent = card.comment
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
