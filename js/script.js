// get DOM [html page]  elements
const searchBtn = document.querySelector('#searchBtn');
const searchInp = document.querySelector('#searchInp') ;


// add eventlistener to searchBtn click
searchBtn.addEventListener('click', () => {
    const searchword = searchInp.value;
    const newSearch = new Search(searchword);
    newSearch.getResult().then(results => {
        console.log(results);
    }).catch(error => {
        console.log(error);
    })
});


class Search {
    constructor(searchword) {
        this.searchWord = searchword
    }
    getResult() {
        const url = 'https://pixabay.com/api/?key=12000491-41fc68d8c365df909e022ceb6' + '&q=' + this.searchWord;
        return new Promise((resolve, reject) => {
            fetch(url).then(response => {
                if (response.status === 200) {
                    response.json().then(data => {
                        this.results = [];
                        data.hits.forEach(result => {
                            const newResult = new ImageResult(
                                result.id,
                                result.largeImageURL,
                                result.previewURL,
                                result.user,
                                result.tags
                            )
                            this.results.push(newResult);
                        });
                        resolve(this.results);
                    }).catch(error => {
                        reject(error);
                    })
                } else {
                    reject(response.status);
                }
            }).catch(error => {
                reject(error);
            })
        })
    }
}

class ImageResult{
    constructor(id, largImageUrl, smallImageUrl, user, tags) {
        this.Id = id;
        this.largImageUrl = largImageUrl;
        this.smallImageUrl = smallImageUrl;
        this.user = user;
        this.tags = tags;
    }
}