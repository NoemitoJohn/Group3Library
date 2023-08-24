const API = 'https://openlibrary.org';

let books = null;

const booksContainer = document.querySelector(".trending")
const bookInfoContainer = document.querySelector(".book")

const searchInput = document.querySelector("#searchInput")
const searchBtn = document.querySelector("#searchBtn")


searchBtn.addEventListener('click', search)

function search(){
    
    const req = new XMLHttpRequest();

    const inputValue = searchInput.value.toLowerCase();
    const keywords = inputValue.split(" ");

    const SEARCH_API = 'https://openlibrary.org/search.json?title='
    
    let query = "";
    
    for (const keyword in keywords) {
        
        query += keywords[keyword] + "+";
    
    }
    
    query = query.slice(0, query.length - 1)
    
    const searchValue = SEARCH_API + query;
    
    req.onreadystatechange = function() {
        
        if (this.readyState == 4 && this.status == 200) {
            
            bookInfoContainer.innerHTML = "";
            booksContainer.innerHTML = "";
            
            const reqJSON = JSON.parse(req.responseText)
            console.log(reqJSON)

            const numResult = reqJSON.numFound;
            
            for (let i = 0; i < numResult; i++) {
                displayBook(reqJSON.docs[i])
                
            }

        }
    };

    req.open('GET', searchValue);
    req.send();

}

function trendingBooks(){

    const req = new XMLHttpRequest();
    
    const MAX_BOOKS_DISPLAY = 100; // MAX is  100

    req.onreadystatechange = function() {
       

        if(this.status == 0){
           booksContainer.innerHTML = "Please Wait" // loading
        }
        
        if (books != null) {
            displayTrendingBooks(books[i])
            return;
        }

        if (this.readyState == 4 && this.status == 200) {
            
            booksContainer.innerHTML = "" // reset body html

            const reqJSON = JSON.parse(req.responseText)
            books = reqJSON.works;
            
            for (let i = 0; i < MAX_BOOKS_DISPLAY; i++) {
                console.log(books[i])
                displayBook(books[i])
            }        
       }
    };

    req.open('GET', API + '/trending/now.json');
    req.send();
}

trendingBooks() // HOME PAGE
                
function displayBook(books){
    
    
    const bookContainer = document.createElement('div')
    bookContainer.textContent = "Title:"
    
    bookContainer.setAttribute('id', API + books.key + '.json'); 
    bookContainer.setAttribute('class', 'bookContainer'); 
    
    const title =  document.createElement('button'); // title container
    title.setAttribute('class', 'title')
    
    title.addEventListener('click', titleClicked) // title clicked 
    
    title.innerHTML = books.title;
    
    const authorContainer = document.createElement('div'); //author container 
    authorContainer.textContent = "By"

    const authors = books.author_name;
    
    for (const author in authors) {  
        
        const authorBtn=  document.createElement('button');
        authorBtn.setAttribute('class', 'author_btn')
        authorBtn.innerHTML = authors[author];
        authorContainer.appendChild(authorBtn);

    }
    const pubContainer = document.createElement('div'); // Published container
    
    if(books.first_publish_year){
        pubContainer.textContent = `Published in ${books.first_publish_year}` 
    }

    const langs = books.language;
    
    const langContainer = document.createElement('div'); //Language container
    langContainer.textContent = "Language: "
    
    for (const lang in langs) {
        langContainer.textContent += ` '${langs[lang]}' `
    }
    
    bookContainer.appendChild(title) 
    bookContainer.appendChild(authorContainer)
    bookContainer.appendChild(pubContainer)
    bookContainer.appendChild(langContainer)
    booksContainer.appendChild(bookContainer);

}


function titleClicked(event){
    
    const bookURL = event.target.parentNode.id;

    const req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        
        if (this.readyState == 4 && this.status == 200) {
            bookInfoContainer.innerHTML = "";
            const reqJSON = JSON.parse(req.responseText)
            displayBookInfo(reqJSON);
        }
    };

    req.open('GET', bookURL);
    req.send();
}


function displayBookInfo(book)
{
    console.log(book)
    const bookContainer = document.createElement('div') // container 
    
    if (book.covers){
        const coverImg = document.createElement('img');
        coverImg.setAttribute('src', `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`);
        bookContainer.appendChild(coverImg)    
    }
    const title = document.createElement('h3')
    title.innerHTML = book.title;
    bookContainer.appendChild(title) 
    
    if(book.description)
    {
        const description = document.createElement('div')
        description.innerHTML = "<strong>Description</strong>: " + book.description.value;
        bookContainer.appendChild(description);
    }
    const authorContainer = document.createElement('div'); 
    const authors = book.authors
    
    for (const author in authors) {  
        
        const authorBtn=  document.createElement('button');
        authorBtn.setAttribute('class', 'author_btn')
        authorBtn.innerHTML = authors[author];
        authorContainer.appendChild(authorBtn);

    }
    const pubContainer = document.createElement('div'); // Published container
    
    
    pubContainer.innerHTML = "<strong>Published:</strong> " + book.created.value;

    
    // bookContainer.appendChild(authorContainer)
    bookContainer.appendChild(pubContainer)
    bookInfoContainer.appendChild(bookContainer);
}