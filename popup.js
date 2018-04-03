$(function() {
    chrome.storage.sync.get(['azat'], function(text) {
        //alert(text.azat);
        $('#expression').val(text.azat);
        calculate();
    });

    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };
});

var translate = {
    data: {
        lat: ['ч', 'я', 'ю', 'ш', 'щ',
            
            'ә', 'і', 'ң', 'ғ', 'ү', 'ұ', 'қ', 'ө', 'һ', 'й',
            'ц', 'у', 'к', 'е', 'н', 'г', 'з', 'х',
            'ъ', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д',
            'ж', 'э', 'с', 'м', 'и', 'т', 'ь', 'б', 
            ' ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
            '.', ',', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+'
        ],

        kyr: ['ch', 'ia', 'iý', 'sh', 'sh',
            
            'á', 'і', 'ń', 'ǵ', 'ú', 'u', 'q', 'ó', 'һ', 'i',
            'ts', 'ý', 'k', 'e', 'n', 'g', 'z', 'h',
            'ъ', 'f', 'y', 'v', 'a', 'p', 'r', 'o', 'l', 'd',
            'j', 'э', 's', 'm', 'ı', 't', 'ь', 'b', 
            ' ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
            '.', ',', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+'
        ],
    },

    kyrToLat: function(param) {
        var myText = param['text'];
        myText = myText.trim();
        console.log(myText);

        var finalText = '';

        for (var i = 0; i < myText.length; i++) {
            for (var j = 0; j < translate.data.lat.length; j++) {
                if (myText[i] == myText[i].toUpperCase()) {
                    if (myText[i].toLowerCase() == translate.data.lat[j]) {
                        finalText += translate.data.kyr[j].toUpperCase();
                    }
                } else {
                    if (myText[i] == translate.data.lat[j]) {
                        finalText += translate.data.kyr[j];
                    }
                }
            }
        }

        var params = param;
        translate.setText(params, finalText);
        return finalText;
    },

    checkLang: function(param) {
        var kyrilica = false;
        var text = param['text'].substring(0, 1);
        var params = param;

        for (var i = 0; i < translate.data.lat.length - 13; i++) {
            if (text.toUpperCase() == translate.data.lat[i].toUpperCase()) {
                kyrilica = true;
            }
        }

        if (kyrilica) {
            return translate.kyrToLat(params);
        } else {
            return translate.latToKyr(params);
        }
    },

    setText: function(param, text) {
        param['out'].innerText = text;
    },

    latToKyr: function(param) {
        var myText = param['text'];

        var temp = myText;
        
        translate.data.kyr.forEach(function(item, index){
            temp = temp.replaceAll( item, translate.data.lat[index] );
            temp = temp.replaceAll( item.toUpperCase(), translate.data.lat[index].toUpperCase() );
        });

        var params = param;
        translate.setText(params, temp);
        return temp;
    },
};

function calculate(e) {
    var result = document.getElementById("result");
    var editText = document.getElementById("expression").value.trim();
    translate.checkLang({
        text: editText,
        out: result
    });
    chrome.storage.sync.set({ 'azat': editText }, function() {});
}

function translatePage(e) {

    function modifyDOM() {

        var translateMin = {
            data: {
                lat: ['ч', 'я', 'ю', 'ш', 'щ',
                    
                    'ә', 'і', 'ң', 'ғ', 'ү', 'ұ', 'қ', 'ө', 'һ', 'й',
                    'ц', 'у', 'к', 'е', 'н', 'г', 'з', 'х',
                    'ъ', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д',
                    'ж', 'э', 'с', 'м', 'и', 'т', 'ь', 'б', 
                    ' ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
                    '.', ',', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+'
                ],

                kyr: ['ch', 'ia', 'iý', 'sh', 'sh',
                    
                    'á', 'і', 'ń', 'ǵ', 'ú', 'u', 'q', 'ó', 'һ', 'i',
                    'ts', 'ý', 'k', 'e', 'n', 'g', 'z', 'h',
                    'ъ', 'f', 'y', 'v', 'a', 'p', 'r', 'o', 'l', 'd',
                    'j', 'э', 's', 'm', 'ı', 't', 'ь', 'b', 
                    ' ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
                    '.', ',', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+'
                ],
            },

            kyrToLat: function(param) {
                var myText = param['text'];
                myText = myText.trim();
                console.log(myText);

                var finalText = '';

                for (var i = 0; i < myText.length; i++) {
                    for (var j = 0; j < translateMin.data.lat.length; j++) {
                        if (myText[i] == myText[i].toUpperCase()) {
                            if (myText[i].toLowerCase() == translateMin.data.lat[j]) {
                                finalText += translateMin.data.kyr[j].toUpperCase();
                            }
                        } else {
                            if (myText[i] == translateMin.data.lat[j]) {
                                finalText += translateMin.data.kyr[j];
                            }
                        }
                    }
                }

                var params = param;
                translateMin.setText(params, finalText);
                return finalText;
            },

            checkLang: function(param) {
                console.log( 'checkLang' );
                var kyrilica = false;
                var text = param['text'].substring(0, 1);
                var params = param;

                for (var i = 0; i < translateMin.data.lat.length - 13; i++) {
                    if (text.toUpperCase() == translateMin.data.lat[i].toUpperCase()) {
                        kyrilica = true;
                    }
                }

                if (kyrilica) {
                    return translateMin.kyrToLat(params);
                } else {
                    return translateMin.latToKyr(params);
                }
            },

            setText: function(param, text) {
                try{
                    param['out'].innerText = text;    
                }catch(e){}
                
            },

            latToKyr: function(param) {              
                String.prototype.replaceAll = function(search, replacement) {
                    var target = this;
                    return target.split(search).join(replacement);
                };
                var myText = param['text'];

                var temp = myText;
                
                translateMin.data.kyr.forEach(function(item, index){
                    temp = temp.replaceAll( item, translateMin.data.lat[index] );
                    temp = temp.replaceAll( item.toUpperCase(), translateMin.data.lat[index].toUpperCase() );
                });

                var params = param;
                translateMin.setText(params, temp);
                return temp;
            },
        };


        let elementsForTranslate = [];
        let typeOfElem = 'div, p, a, button, font, br, strong, li, span, h1, h2, h3, h4, a';




        let divs = document.body.querySelectorAll(typeOfElem);
        for (var i = divs.length - 1; i >= 0; i--) {
            if (divs[i].innerHTML.trim()[0] != '<' && divs[i].innerHTML.trim().length > 0) {
                elementsForTranslate.push(divs[i])
            }
        }

        elementsForTranslate.forEach(function(item, index) {
            item.classList.add('translate-kyr');
            var myText = item.innerHTML;
            item.innerHTML = translateMin.checkLang({ text: item.innerHTML });
        });

        let iframes = document.body.querySelectorAll('iframe');
        let iFrameDivs = iframes[0].contentDocument.body;
        iFrameDivs = iFrameDivs.querySelectorAll(typeOfElem);

        for (var i = iFrameDivs.length - 1; i >= 0; i--) {
            if (iFrameDivs[i].innerHTML.trim()[0] != '<' && iFrameDivs[i].innerHTML.trim().length > 0) {
                elementsForTranslate.push(iFrameDivs[i])
            }
        }

        console.log( 'elementsForTranslate: ', elementsForTranslate );

        elementsForTranslate.forEach(function(item, index) {
            item.classList.add('translate-kyr');
            var myText = item.innerHTML;
            item.innerHTML = translateMin.checkLang({ text: item.innerHTML });
        });

        return document.body.innerHTML;
    }

    //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript({
        code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
    }, (results) => {
        //Here we have just the innerHTML and not DOM structure
        console.log('Popup script:');
        console.log(results[0]);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var expr = document.getElementById('expression');
    expr.addEventListener('keyup', calculate);

    document.getElementById('translate-page').addEventListener('click', translatePage);
});