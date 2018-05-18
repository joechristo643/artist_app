//pagination functions

// show current page contents
function showPage(detail, pno) {
    // document.getElementsByClassName("artists").forEach(element => {
    //     element.style.display="none";
    // });
    if (detail == "artistset") {
        var el = document.getElementsByClassName("artists");
        var len = el.length;
        for (var i = 0; i < len; i++) {
            el[i].style.display = "none";

        }
    } else if (detail == "albumset") {
        var el = document.getElementsByClassName("albums");
        var len = el.length;
        for (var i = 0; i < len; i++) {
            el[i].style.display = "none";

        }
    }

    (document.getElementById(detail + pno)) ? document.getElementById(detail + pno).style.display = "block": '';
}

//update pageno status

function updatePageno(val, pno) {

    var status = "";
    if (val == "album") {
        var album_per_page_show = (album_per_page > album_len) ? album_len : album_per_page;
        var index = (pno - 1) * album_per_page_show;
        // document.getElementById("albums").innerHTML = "";
        var lindex = 0;
        if (album_len - index < album_per_page_show) {
            lindex = album_len;
        } else {
            lindex = pno * album_per_page_show;
        }
        status = "showing " + ((pno - 1) * album_per_page_show + 1) + " - " + lindex + " of " + getNumberofPages(0);
    } else if (val == "artist") {

        var artist_per_page_show = (artist_per_page > artist_len) ? artist_len : artist_per_page;
        var index = (pno - 1) * artist_per_page_show;
        // document.getElementById("albums").innerHTML = "";
        var lindex = 0;
        if (artist_len - index < artist_per_page_show) {
            lindex = artist_len;
        } else {
            lindex = pno * artist_per_page_show;
        }
        status = "showing " + ((pno - 1) * artist_per_page_show + 1) + " - " + lindex + " of " + getNumberofPages(1);
    }

    if (status) {
        var pagestat = document.getElementById("pagestatus");
        pagestat.innerHTML = "";
        pagestat.appendChild(document.createTextNode(status));
        document.getElementById("pagination").insertBefore(pagestat, document.getElementById("pagination").childNodes[4]);
    }
}


// pagination navigation functions

function nextPage() {

    var val = (document.getElementById("alb-container")) ? 0 : 1;

    if (curr_page < getNumberofPages(val)) {
        curr_page++;
        if (document.getElementById("alb-container")) {
            showPage("albumset", curr_page);
            updatePageno("album", curr_page);
        } else {
            showPage("artistset", curr_page);
            updatePageno("artist", curr_page);

        }

    }

}

function prevPage() {
    if (curr_page > 1) {
        curr_page--;
        if (document.getElementById("alb-container")) {
            showPage("albumset", curr_page);
            updatePageno("album", curr_page);
        } else {
            showPage("artistset", curr_page);
            updatePageno("artist", curr_page);

        }
    }

}

function firstPage() {
    if (curr_page != 1) {

        if (document.getElementById("alb-container")) {
            showPage("albumset", 1);
            updatePageno("album", 1);
        } else {
            showPage("artistset", 1);
            updatePageno("artist", 1);
        }
        curr_page = 1;

    }
}

function lastPage() {
    if (document.getElementById("alb-container")) {
        if (curr_page != getNumberofPages(0)) {
            showPage("albumset", getNumberofPages(0));
            updatePageno("album", getNumberofPages(0));
            curr_page = getNumberofPages(0);
        }
    } else {

        if (curr_page != getNumberofPages(1)) {
            showPage("artistset", getNumberofPages(1));
            updatePageno("artist", getNumberofPages(1));
            curr_page = getNumberofPages(1);
        }

    }


}

// get total pages
function getNumberofPages(isArt) {

    return (isArt) ? Math.ceil(artist_len / artist_per_page) : Math.ceil(album_len / album_per_page);
}