//var ServiceUrl = 'http://pollman.kodofisi.com/api/';
var ServiceUrl = 'http://localhost:2024/';

function Deflate(comressedData) {
    try {
        var textReader = new TextReader(new Utf8Translator(new Inflator(new Base64Reader(comressedData))));
        var textData = textReader.readToEnd();
        textData = textData.replace(/\n/g, ' ').replace(/\r/g, ' ');
        var data = JSON.parse(textData);
        textData = null;
        textReader = null;
        return data;
    } catch (e) {
        console.error("Data decompress or callback controller-method access error " + e);
        return {};
    }
}

var weekday = new Array(7);
weekday[0] = "Pazar";
weekday[1] = "Pazartesi";
weekday[2] = "Sali";
weekday[3] = "Carsamba";
weekday[4] = "Persembe";
weekday[5] = "Cuma";
weekday[6] = "Cumartesi";


Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};
Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
    ].join('');
};


function DateFromYmd(str) {
    if (!/^(\d){8}$/.test(str)) return "invalid date";
    var y = str.substr(0, 4),
        m = str.substr(4, 2),
        d = str.substr(6, 2);

    var date = new Date(y, parseInt(m) - 1, d);
    return date;
}

function PrintCanvas(canvasId) {
    var dataUrl = document.getElementById(canvasId).toDataURL();
    var windowContent = '<!DOCTYPE html>';
    windowContent += '<html>'
    windowContent += '<head><title>Graph</title></head>';
    windowContent += '<body>'
    windowContent += '<img src="' + dataUrl + '">';
    windowContent += '</body>';
    windowContent += '</html>';
    var printWin = window.open('', '', 'width=600,height=260');
    printWin.document.open();
    printWin.document.write(windowContent);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
}
function toSeoUrl(url) {
    var encodedUrl = url.toString().toLowerCase();
    encodedUrl = encodedUrl.split(/\&+/).join("-and-")
    encodedUrl = encodedUrl.split(/[^a-z0-9]/).join("-");
    encodedUrl = encodedUrl.split(/-+/).join("-");
    encodedUrl = encodedUrl.trim('-');
    return encodedUrl;
}

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";path=/";
}

function setCookieExDays(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}