const quoteList = document.querySelector('#quote-list')
const quoteForm = document.querySelector('#new-quote-form')

function renderQuote(quote) {
  const li = document.createElement('li')
  li.classList.add('quote-card')

  const blockquote = document.createElement('blockquote')
  blockquote.classList.add('blockquote')

  const p = document.createElement('p')
  p.classList.add('mb-0')
  p.innerText = quote.quote

  const footer = document.createElement('footer')
  footer.classList.add('blockquote-footer')
  footer.innerText = quote.author

  const br = document.createElement('br')

  const likeButton = document.createElement('button')
  likeButton.classList.add('btn-success')
  likeButton.innerText = `Likes: ${quote.likes.length}`

  const deleteButton = document.createElement('button')
  deleteButton.classList.add('btn-danger')
  deleteButton.innerText = 'Delete'

  blockquote.appendChild(p)
  blockquote.appendChild(footer)
  blockquote.appendChild(br)
  blockquote.appendChild(likeButton)
  blockquote.appendChild(deleteButton)

  li.appendChild(blockquote)

  quoteList.appendChild(li)

  likeButton.addEventListener('click', (e) => {
    e.preventDefault()
    fetch('http://localhost:3000/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quoteId: quote.id
      })
    })
    .then(res => res.json())
    .then(like => {
      quote.likes.push(like)
      likeButton.innerText = `Likes: ${quote.likes.length}`
    })
  })

  deleteButton.addEventListener('click', (e) => {
    e.preventDefault()
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
      method: 'DELETE'
    })
    .then(res => {
      li.remove()
    })
  })
}

function renderQuotes() {
  fetch('http://localhost:3000/quotes?_embed=likes')
    .then(res => res.json())
    .then(quotes => {
      quoteList.innerHTML = ''
      quotes.forEach(quote => {
        renderQuote(quote)
      })
    })
}

function addQuote(quote, author) {
  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quote,
      author,
      likes: []
    })
  })
  .then(res => res.json())
  .then(quote => {
    renderQuote(quote)
  })
}

quoteForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const quoteInput = document.querySelector('#new-quote')
  const authorInput = document.querySelector('#author')
  const quote = quoteInput.value
  const author = authorInput.value
  addQuote(quote, author)
  quoteInput.value = ''
  authorInput.value = ''
})

renderQuotes()
