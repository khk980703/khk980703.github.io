// -- JAVASCRIPT CAFE! -- //

// -- PRODUCTS -- //

let products = {
  whiteCoffee: {
    stock: 4,
    price: 4,
    wholesaleCost: 2.5,
  },

  blackCoffee: {
    stock: 7,
    price: 3.5,
    wholesaleCost: 2,
  },

  muffin: {
    stock: 5,
    price: 8.5,
    wholesaleCost: 5,
  },

  eggs: {
    stock: 1,
    price: 12.5,
    wholesaleCost: 7,
  },
}

function displayProducts() {
  document.getElementById('whiteCoffee').innerHTML =
    `White Coffee: ${products.whiteCoffee.stock}` +
    `<button class="button" onclick="restock('whiteCoffee')" style="padding: 1px">restock</button>`

  document.getElementById('blackCoffee').innerHTML =
    `Black Coffee: ${products.blackCoffee.stock}` +
    `<button class="button" onclick="restock('blackCoffee')" style="padding: 1px">restock</button>`

  document.getElementById('muffin').innerHTML =
    `Muffin: ${products.muffin.stock}` +
    `<button class="button" onclick="restock('muffin')" style="padding: 1px">restock</button>`

  document.getElementById('eggs').innerHTML =
    `Eggs : ${products.eggs.stock}` +
    `<button class="button" onclick="restock('eggs')" style="padding: 1px">restock</button>`
}

displayProducts()

// -- CUSTOMERS -- //

let customer = {
  order: [],
  money: [],
}

let minOrderSize = 1
let maxOrderSize = 5

function generateCustomerOrder() {
  // get a random size for the order in a range, 1-5
  // make a new array of the things they're ordering
  // assign the new order to the customer object
  // display the customer order
  document.getElementById('noMoney').innerHTML = ''
  document.getElementById('customEggs').innerHTML = ''
  document.getElementById('fillOrder').disabled = false

  let orderSize = getRandomInt(minOrderSize, maxOrderSize)
  let customerMoney = getRandomInt(0, 100)

  let newOrder = []

  let productNames = Object.keys(products)

  for (let i = 0; i < orderSize; i++) {
    let productIndex = getRandomInt(0, productNames.length - 1)
    let productName = productNames[productIndex]
    newOrder.push(productName)
  }

  customer.order = newOrder
  customer.money = customerMoney
  displayCustomerOrder()
  displayCustomerMoney()

  // -- Compare Money -- //

  let totalAmount = 0

  for (let i = 0; i < customer.order.length; i++) {
    let productName = customer.order[i]
    totalAmount += products[productName].price
  }

  if (totalAmount > customerMoney) {
    document.getElementById('noMoney').innerHTML =
      '*** Sorry, the amount is not enough! ***'
    document.getElementById('fillOrder').disabled = true
  }

  // -- Cooked Eggs Specification -- //
  else {
    let countEggs = 0
    newOrder.forEach((element) => (element == 'eggs' ? (countEggs += 1) : null))

    for (let i = 0; i < countEggs; i++) {
      displayEggsOrder(i)
    }
  }
}

function displayEggsOrder(i) {
  document.getElementById(
    'customEggs'
  ).innerHTML += `<p id='eggOrder${i}'>For the ${i + 1}st egg: 
    <button onclick='selectEggsType("Scrambled", ${i})'>scrambled</button>
    <button onclick='selectEggsType("Fried", ${i})'>fried</button>
    <button onclick='selectEggsType("Poached", ${i})'>poached</button><p>`
}

function selectEggsType(type, i) {
  document.getElementById(
    `eggOrder${i}`
  ).innerHTML = `<p id='eggOrder${i}'>For the ${i + 1}st egg: ${type}!</p>`
}

function displayCustomerOrder() {
  document.getElementById('customerOrder').innerHTML =
    'Customer order: ' + customer.order
}

function displayCustomerMoney() {
  document.getElementById('customerMoney').innerHTML =
    'Customer money: ' + customer.money
}

document.getElementById('customerButton').onclick = generateCustomerOrder

// -- TRANSACTIONS -- //

let cash = 0
let history = []
let productConditionArr = ['Good', 'Average', 'Bad']

function displayCash() {
  document.getElementById('cash').innerHTML = 'Cash: ' + cash
}

displayCash()

function fillOrder() {
  // make a variable to keep track of our sale total
  // loop through the customer order array
  // if we have their product in stock, sell it to them, and keep track of the sale
  // if we don't have it, alert we're out of this product
  // add the sale total to our Cash
  // clear the customer order
  // display the new totals

  document.getElementById('customEggs').innerHTML = ''

  let saleTotal = 0
  let orderArr = []
  let sold = true

  for (let i = 0; i < customer.order.length; i++) {
    let productName = customer.order[i]

    if (products[productName].stock > 0) {
      products[productName].stock--
      saleTotal += products[productName].price
      orderArr.push(productName)
      if (products[productName].stock == 0) {
        document.getElementById(productName).setAttribute('style', 'color: red')
      }
    } else {
      // -- Not enough stock and cannot sell -- //

      orderArr.forEach(
        (element) => (
          products[element].stock++,
          (saleTotal = 0),
          document.getElementById(element).setAttribute('style', 'color: black')
        )
      )
      alert('We are so sorry!')
      sold = false
      break
    }
  }

  if (sold) {
    // -- History -- //

    document.getElementById('history').innerHTML += `<p>${customer.order}</p>`

    // -- Refund -- //

    history.unshift(customer.order)

    let randomNum = getRandomInt(1, 5)

    if (randomNum == 1) {
      alert(
        `Customer wants a refund! (Condition ${
          productConditionArr[getRandomInt(0, 2)]
        })`
      )
      document.getElementById('refund').disabled = false
      document.getElementById('refund').addEventListener('click', refund)
    } else {
      document.getElementById('refund').removeEventListener('click', refund)
    }
  }

  cash += saleTotal
  customer.order = []
  customer.money = []

  displayProducts()
  displayCash()
  displayCustomerOrder()
  displayCustomerMoney()
}

document.getElementById('fillOrder').onclick = fillOrder

function refund() {
  history[0].forEach(
    (element) => (
      (cash -= products[element].price),
      products[element].stock++,
      document.getElementById(element).setAttribute('style', 'color: black')
    )
  )
  document
    .getElementById('history')
    .getElementsByTagName('p')
    [history.length - 1].remove()
  history.shift()
  alert('Successfully Refunded')

  document.getElementById('refund').disabled = true
  displayProducts()
  displayCash()
}

// -- Restock -- //

function restock(product) {
  item = products[product]
  if (cash < item.wholesaleCost) {
    alert('Not enough cash!')
  } else {
    if (item.stock === 0) {
      document.getElementById(product).setAttribute('style', 'color: black')
    }
    item.stock += 1
    cash -= item.wholesaleCost
  }

  displayProducts()
  displayCash()
}

// -- UTIL -- //

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
