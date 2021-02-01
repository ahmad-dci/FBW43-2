// get DOM [html page]  elements
const searchBtn = document.querySelector('#searchBtn');
const searchInp = document.querySelector('#searchInp');
const resultDiv = document.querySelector('#resultDiv');
const bigImg =document.querySelector('#bigImg');
const colorSelect = document.querySelector('#colorSelect');

// 6, 13, 14, 33, 35 39

// add eventlistener to searchBtn click
searchBtn.addEventListener('click', () => {
    const searchword = searchInp.value;
    const searchColor = colorSelect.value;
    const newSearch = new Search(searchword, searchColor);
    newSearch.getResult().then(results => {
        console.log(results);
        resultDiv.innerText = '';
        results.forEach(element => {
            
            resultDiv.append(element.renderHtml());
        });
    }).catch(error => {
        console.log(error);
    })
});

function showModal(largImage) {
    bigImg.src = largImage;
    $('#imgModal').modal('show');
}

class Search {
    constructor(searchword, searchcolor) {
        this.searchWord = searchword;
        this.searchColor = searchcolor;
    }
    getResult() {
        const url = 'https://pixabay.com/api/?key=12000491-41fc68d8c365df909e022ceb6' + '&q=' + this.searchWord
        + (this.searchColor? '&colors=' + this.searchColor : '')
        ;
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
    renderHtml() {
        const containerDiv = document.createElement('div');
        containerDiv.className = 'col-lg-3 col-md-6 col-sm-12';
        containerDiv.style.height = '350px';
        const htmlText = `
        <div class="card p-3" style="width: 18rem;">
            <img class="card-img-top" height="150" src="${this.smallImageUrl}" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">${this.user}</h5>
              <p class="card-text" style="min-height:70px">${this.tags}</p>
              <a href="#" class="btn btn-primary" onclick="showModal('${this.largImageUrl}')">preview</a>
            </div>
          </div>
    `;
    containerDiv.innerHTML = htmlText;
    return containerDiv ;
    }
}