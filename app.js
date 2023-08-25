const API = 'https://openlibrary.org';


const booksContainer = document.querySelector(".trending")
const bookInfoContainer = document.querySelector(".book")

const searchInput = document.querySelector("#searchInput")
const searchBtn = document.querySelector("#searchBtn")
const trendingBooksBtn = document.querySelector("#trendingBooksBtn")

trendingBooksBtn.addEventListener('click', trendingBooks)

searchBtn.addEventListener('click', search)

function trendingBooks(){

    const req = new XMLHttpRequest();
    
    const MAX_BOOKS_DISPLAY = 100; // MAX is  100

    req.onreadystatechange = function() {
       

        if(this.status == 0){
           
            booksContainer.innerHTML = "Please Wait" // loading
            bookInfoContainer.innerHTML = "";

        }

        if (this.readyState == 4 && this.status == 200) {
            
            
            booksContainer.innerHTML = "";
            
            const responseJSON = JSON.parse(req.responseText)
            const books = responseJSON.works;
            
            for (let i = 0; i < MAX_BOOKS_DISPLAY; i++) {
               // console.log(books[i])
                displayBook(books[i])
            }        
       }
    };

    req.open('GET', API + '/trending/now.json');
    req.send();
}

trendingBooks() 

function displayBookInfo(book)
{
    //console.log(book)
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
        // {
        //  title : "book title"
        //  description: "some discription"
        // }

        const description = document.createElement('div')
        description.innerHTML = "<strong>Description</strong>: " + book.description;
        
        if(book.description.value){
            
            // {
            //  title : "book title"
            //  description: {
            //      type: "plain/text"
            //      value: "some description"
            // }


            description.innerHTML = "<strong>Description</strong>: " + book.description.value;
        }

        
        bookContainer.appendChild(description);
    }
    const authorContainer = document.createElement('div'); 
    const authors = book.authors
    //console.log(authors)
    for (const author in authors) {  
        
        const authorBtn =  document.createElement('button');
        authorBtn.setAttribute('class', 'author_btn')
        authorBtn.innerHTML = authors[author];
        authorContainer.appendChild(authorBtn);

    }

    const pubContainer = document.createElement('div'); // Published container
    
    
    pubContainer.innerHTML = "<br><strong>Published:</strong> " + new Date(book.created.value).toDateString();

    
    if(book.subjects){
        
        const subjectCotainer = document.createElement('div');
        subjectCotainer.innerHTML = "<br><strong> Subject: </strong>";
        //console.log(book.subjects);
        for (let i = 0; i < book.subjects.length; i++) {
            subjectCotainer.innerHTML += book.subjects[i] + ", ";
        }
        
        bookContainer.appendChild(subjectCotainer);
    }
    
    
    
    
    bookContainer.appendChild(pubContainer)
    
    // bookContainer.appendChild(authorContainer)
    bookInfoContainer.appendChild(bookContainer);
}
                

function displayBook(books) {
    
    
    
    const bookContainer = document.createElement('div')
    bookContainer.textContent = "Title:"
    
    bookContainer.setAttribute('id', API + books['key'] + '.json'); 
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

function search(){
    
    const req = new XMLHttpRequest();

    const inputValue = searchInput.value.toLowerCase();
    const keywords = inputValue.split(" ");

    const SEARCH_API = 'https://openlibrary.org/search.json?title='
    
    let query = "";
    
    for (const keyword in keywords) {
        
        query += keywords[keyword] + "+";
    
    }
    //harry+potter+
    
    query = query.slice(0, query.length - 1)
    //harry+potter

    const searchURL = SEARCH_API + query;
    //https://openlibrary.org/search.json?title=harry+potter
    
    req.onprogress = (e) => {
        console.log("Progress:"  + e.loaded)
    }

    req.onreadystatechange = function() {
        
        if(this.status == 0){
            booksContainer.innerHTML = "Please Wait"; // loading search
            bookInfoContainer.innerHTML = "";
        }

        if (this.readyState == 4 && this.status == 200) {
            
            booksContainer.innerHTML = "";
            
            const responseJSON = JSON.parse(req.responseText)
           // console.log(responseJSON)

            const numResult = responseJSON.docs.length;
            
            for (let i = 0; i < numResult; i++) {
                displayBook(responseJSON.docs[i])
               // console.log(responseJSON.docs[i])
            }
            

        }
    };

    req.open('GET', searchURL);
    req.send();

}


function titleClicked(event){
    
    const bookURL = event.target.parentNode.id;

    const req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        
        if (this.readyState == 4 && this.status == 200) {
            bookInfoContainer.innerHTML = "";
            const responseJSON = JSON.parse(req.responseText)
            displayBookInfo(responseJSON);
        }
    };

    req.open('GET', bookURL);
    req.send();
}


