

function getCookie(){
    if (document.cookie !== undefined)
        return document.cookie
}

function getCookieValue(cookie, key){
    if (cookie != undefined){
        var b = cookie.match('(^|[^;]+)\\s*' + key + '\\s*=\\s*([^;]+)');
        return b ? b.pop() : undefined;
    }
}

function removeTrailingSlash(s){
    return s.replace(/\/+$/, "");
}

function getQuestion(titleSlug, csrf, successFn){
    jQuery.ajax({
        type: "POST",
        url: "https://leetcode.com/graphql",
        beforeSend: function(request) {
            request.setRequestHeader("x-csrftoken", csrf);
        },
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            "operationName":"questionData",
            "variables": { 
                "titleSlug": titleSlug
            },
            "query": "query questionData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n title\n  content\n }\n}\n"
        }),
        success: successFn,
        dataType: 'json'
    });
}

function showQuestion(title, content, ele, evt){
    $(ele).qtip({
        overwrite: false,
        content: {
            text: '<div class="question-popup"><h4 class="title">' + title + '</h4><hr> '+ content + '</div>'
        },
        show: {
            solo: true,
            ready: true
        },
        hide: {
            delay: 500,
            fixed: true
        },
        position: {
            my: 'top left',
            target: 'mouse',
            viewport: $(window),
            adjust: {
                y: +25,
                mouse: false,
                scroll: false
            }
        },
        style: {
            classes: 'qtip-light',
            tip: {
                corner: false,
                width: 600,
                height: 400
            }
        }
    }, evt);
}

function onEnterLink(evt, element){
            problemPart = element.href.substr("https://leetcode.com/problems/".length);
            problemPart = removeTrailingSlash(problemPart);
            parts = problemPart.split('/')
            titleSlug = undefined;
            onlyExactUrls = true;
            
            if(onlyExactUrls){
                if(parts.length === 1){
                    titleSlug = parts[0];
                }
            } else {
                titleSlug = parts[0];
            }

            csrfToken = getCookieValue(getCookie(), 'csrftoken');
            if(csrfToken !== undefined){
                getQuestion(titleSlug, csrfToken, function(res){
                    if(res.data && res.data.question){
                        showQuestion(res.data.question.title, res.data.question.content, element, evt);
                    }
                })
            }
            
}


jQuery(function($){
    $('body').on('mouseenter', 'a', function(e) {
        if (this.href.startsWith("https://leetcode.com/problems/") ) {
            onEnterLink(e, this)
        }
    })
});