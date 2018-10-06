// How sites organizes articles in xml nodes
var articleIdMatchers = {
    vg: ['article-content'],
    dagbladet: ['article.preview', 'preview', 'article'],
    adressa: ['polarisStories'],
    nettavisen: ['df-article'],
    aftenposten: ['df-article']
};

var contentKeyWords = {
    pluss: ['pluss', 'amagasinet'],
    kjendis: ['rampely', 'kjendis', 'side2.no'],
    mote: ['mote', 'y.mag'],
    sport: ['sport, fotball, gullkampen, trening']
}

function fadeOutAndRemove(el, speed) {
    var seconds = speed / 1000;
    el.style.transition = "opacity "+seconds+"s ease";

    el.style.opacity = 0;
    setTimeout(function() {
        el.parentNode.removeChild(el);
    }, speed);
}

function shouldArticleBeRemoved(node, forbidden) {
    if(!node || !node.innerHTML) {
        return false;      
    }

    var foundMatch = false;
    for (var i = 0; i < forbidden.length; i++) {
        if(node.innerHTML.toLowerCase().indexOf(forbidden[i].trim().toLowerCase()) !== -1) {
            // console.log('Removing ' + node.textContent + ' due to' + forbidden[i]);
            foundMatch = true;
            break;
        }
    }
    return foundMatch;
}

function getArticlesFromDocument() {
    var siteTitle = document.title;

    var articleClassIDs = [];
    for (var site in articleIdMatchers) {
        if (siteTitle.toLocaleLowerCase().indexOf(site) !== -1) {
            articleClassIDs = articleIdMatchers[site];
            break;
        }
    }

    if (articleClassIDs.length === 0) {
        // Don't filter sites that are not on the list..
        return [];
    }

    var foundArticles = []
    for (var i = 0; i < articleClassIDs.length; i++) {
        foundArticles.push(document.getElementsByClassName(articleClassIDs[i]));
    }

    return foundArticles;
}

function filterPage(forbiddenContentKeyWords) {
    var articlesGroups = getArticlesFromDocument();
    var inspected = 0;
    for (var i = 0; i < articlesGroups.length; i++) {
        var articles = articlesGroups[i];

        for(var j = 0; j < articles.length; j++ ) {
            article = articles[j];
        
            inspected++;
            if (shouldArticleBeRemoved(article, forbiddenContentKeyWords)) {
                fadeOutAndRemove(article, 2000);
                // No fade alternative: article.remove();
                removed++;
            }
        }
    }

    if (removed > 0) {
        console.log('Inspected: ' + inspected + ' articles, removed: ' + removed + ' of them due to fjas');
        chrome.extension.sendMessage({removed: removed});
    }
}

var removed = 0;
chrome.extension.sendMessage({removed: removed});

chrome.storage.sync.get({
    userWords: 'fjas',
    pluss: true,
    kjendis: true,
    mote: true,
    sport: false,
}, function(userOptions) {
    var forbiddenContentKeyWords = userOptions.userWords.split(',');

    if (userOptions.pluss) {
        for(var key in contentKeyWords.pluss) {
            forbiddenContentKeyWords.push(contentKeyWords.pluss[key]);
        }
    }
    if (userOptions.kjendis) {
        for(var key in contentKeyWords.kjendis) {
            forbiddenContentKeyWords.push(contentKeyWords.kjendis[key]);
        }
    }
    if (userOptions.mote) {
        for(var key in contentKeyWords.mote) {
            forbiddenContentKeyWords.push(contentKeyWords.mote[key]);
        }
    }
    if (userOptions.sport) {
        for(var key in contentKeyWords.sport) {
            forbiddenContentKeyWords.push(contentKeyWords.sport[key]);
        }
    }

    filterPage(forbiddenContentKeyWords);

    // Re-filter after a few seconds since some sites do lazy loading of articles
    setTimeout(function() { 
        filterPage(forbiddenContentKeyWords);
    }, 3000);
});
