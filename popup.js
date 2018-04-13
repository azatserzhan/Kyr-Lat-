$(function() {
    chrome.storage.sync.get(['azat'], function(text) {
        $('#expression').val(text.azat);
        calculate();
    });

    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };

    var action = {
        start: function() {
            this.hover();
            this.copyTextToBuffer();
        },

        hover: function() {
            $('.hover-btn').hover(function() {
                $('.hover-text:eq(' + $(this).attr('key') + ')').css('visibility', 'visible');
                $('.hover-text:eq(0)').text('Көшіру');
            });
            $('.hover-btn').mouseleave(function() {
                $('.hover-text:eq(' + $(this).attr('key') + ')').css('visibility', 'hidden');
            });
        },

        copyTextToBuffer: function() {
            function fallbackCopyTextToClipboard(text) {
                var textArea = document.createElement("textarea");
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    var successful = document.execCommand('copy');
                    var msg = successful ? 'successful' : 'unsuccessful';
                    console.log('Fallback: Copying text command was ' + msg);
                } catch (err) {
                    console.error('Fallback: Oops, unable to copy', err);
                }

                document.body.removeChild(textArea);
            }

            function copyTextToClipboard(text) {
                if (!navigator.clipboard) {
                    fallbackCopyTextToClipboard(text);
                    return;
                }
                navigator.clipboard.writeText(text).then(function() {
                    console.log('Async: Copying to clipboard was successful!');
                }, function(err) {
                    console.error('Async: Could not copy text: ', err);
                });
            }

            var copyBobBtn = document.querySelector('#copy-text');

            copyBobBtn.addEventListener('click', function(event) {
                copyTextToClipboard( $('#result').text() );
                $('.hover-text:eq(0)').text( 'Көшірілді' );
            });
        },
    };
    action.start();
});

var translate = {
    data: {
        lat: ['ч', 'я', 'ю', 'ш', 'щ',

            'ә', 'і', 'ң', 'ғ', 'ү', 'ұ', 'қ', 'ө', 'һ', 'й',
            'ц', 'у', 'к', 'е', 'н', 'г', 'з', 'х',
            'ъ', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д',
            'ж', 'э', 'с', 'м', 'и', 'т', 'ь', 'б'
        ],

        kyr: ['ch', 'ia', 'iý', 'sh', 'sh',

            'á', 'і', 'ń', 'ǵ', 'ú', 'u', 'q', 'ó', 'һ', 'i',
            'ts', 'ý', 'k', 'e', 'n', 'g', 'z', 'h',
            '', 'f', 'y', 'v', 'a', 'p', 'r', 'o', 'l', 'd',
            'j', 'e', 's', 'm', 'ı', 't', '', 'b'
        ],
    },

    kyrToLat: function(param) {
        var myText = param['text'];
        var temp = myText;

        translate.data.lat.forEach(function(item, index) {
            if (item != '') {
                temp = temp.replaceAll(item, translate.data.kyr[index]);
                temp = temp.replaceAll(item.toUpperCase(), translate.data.kyr[index].toUpperCase());
            }
        });

        var params = param;
        translate.setText(params, temp);
        return temp;
    },

    checkLang: function(param) {
        var kyrilica = false;
        var text = param['text'];
        text = text.trim();
        var params = param;
        var kyrLength = 0;
        var latLength = 0;

        for (var i = 0; i < translate.data.lat.length; i++) {
            for(var j=0; j<text.length; j++){
                if( text[j] == translate.data.lat[i]){
                    latLength++;
                }
                if( text[j] == translate.data.kyr[i]){
                    kyrLength++;
                }
            }
        }

        if (kyrLength<=latLength) {
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

        translate.data.kyr.forEach(function(item, index) {
            if (item != '') {
                temp = temp.replaceAll(item, translate.data.lat[index]);
                temp = temp.replaceAll(item.toUpperCase(), translate.data.lat[index].toUpperCase());
            }
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
                    'ж', 'э', 'с', 'м', 'и', 'т', 'ь', 'б'
                ],

                kyr: ['ch', 'ia', 'iý', 'sh', 'sh',

                    'á', 'і', 'ń', 'ǵ', 'ú', 'u', 'q', 'ó', 'һ', 'i',
                    'ts', 'ý', 'k', 'e', 'n', 'g', 'z', 'h',
                    '', 'f', 'y', 'v', 'a', 'p', 'r', 'o', 'l', 'd',
                    'j', 'e', 's', 'm', 'ı', 't', '', 'b'
                ],
            },

            kyrToLat: function(param) {
                String.prototype.replaceAll = function(search, replacement) {
                    var target = this;
                    return target.split(search).join(replacement);
                };
                var myText = param['text'];
                var temp = myText;

                translateMin.data.lat.forEach(function(item, index) {
                    if (item != '') {
                        temp = temp.replaceAll(item, translateMin.data.kyr[index]);
                        temp = temp.replaceAll(item.toUpperCase(), translateMin.data.kyr[index].toUpperCase());
                    }
                });

                var params = param;
                translateMin.setText(params, temp);
                return temp;
            },

            checkLang: function(param) {
                var kyrilica = false;
                var text = param['text'];
                text = text.trim();
                var params = param;
                var kyrLength = 0;
                var latLength = 0;

                for (var i = 0; i < translateMin.data.lat.length - 13; i++) {
                    for(var j=0; j<text.length; j++){
                        if( text[j] == translateMin.data.lat[i]){
                            latLength++;
                        }
                        if( text[j] == translateMin.data.kyr[i]){
                            kyrLength++;
                        }
                    }
                }

                if (kyrLength<=latLength) {
                    return translateMin.kyrToLat(params);
                } else {
                    return translateMin.latToKyr(params);
                }
            },

            setText: function(param, text) {
                try {
                    param['out'].innerHTML = text;
                    console.log('HTML')
                } catch (e) {}

            },

            latToKyr: function(param) {
                String.prototype.replaceAll = function(search, replacement) {
                    var target = this;
                    return target.split(search).join(replacement);
                };
                var myText = param['text'];
                var temp = myText;

                translateMin.data.kyr.forEach(function(item, index) {
                    if (item != '') {
                        temp = temp.replaceAll(item, translateMin.data.lat[index]);
                        temp = temp.replaceAll(item.toUpperCase(), translateMin.data.lat[index].toUpperCase());
                    }
                });

                var params = param;
                translateMin.setText(params, temp);
                return temp;
            },
        };


        let elementsForTranslate = [];
        let typeOfElem = 'div, a, p, button, font, br, strong, li, span, h1, h2, h3, h4, a, header, strong, blockquote, br, b, em';

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
        console.log(results[0]);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var expr = document.getElementById('expression');
    expr.addEventListener('keyup', calculate);

    document.getElementById('translate-page').addEventListener('click', translatePage);
});