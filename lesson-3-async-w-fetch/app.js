/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        /*
        $.ajax({
          url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
          headers: {
            Authorization: 'Client-ID 36834d1bb0deeb99b847fd4d6fbd16129adfc918ea1c86d4228ea81eba98e9f5'}
        }).done(addImage); */
        
        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
          {
            headers: {Authorization: 'Client-ID 36834d1bb0deeb99b847fd4d6fbd16129adfc918ea1c86d4228ea81eba98e9f5'}
          }).then(response => response.json())
          .then(addImage)
          .catch(e => requestError(e, 'image'));
        
        /*
        $.ajax({
          url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=e6a9801dab184d89a4d77b94ff44048c`
        }).done(addArticles); */
        
        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=e6a9801dab184d89a4d77b94ff44048c`)
        .then(response => response.json())
        .then(addArticles)
        .catch(e => requestError(e, 'article'));
    });
    
    function addImage(data) {
      let htmlContent = '';
      if(data && data.results && data.results[0]) {
        const firstImage = data.results[0];
        htmlContent = `<figure>
          <img src="${firstImage.urls.regular}" alt="${searchedForText}">
          <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`;
      } else {
        htmlContent = '<div class="error-no-image">No images available</div>';
      }
      responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }
    
    function addArticles(data) {
      let htmlContent = '';
      if(data.response && data.response.docs && data.response.docs.length > 1) {
        htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
            <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
            <p>${article.snippet}</p>
          </li>`).join('') + '</ul>';
      } else {
        htmlContent = '<div class="error-no-articles">No articles available</div>';
      }
      responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }
    
    function requestError(e, part) {
      console.log(e);
      responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning error-${part}">Oh no! There was an error making a request for the ${part}.</p>`);
    }
})();
