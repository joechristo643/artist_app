//declarations
var artist_per_page = 4
var album_per_page = 4;
var old_page_status = "";
var old_curr_page = 0;

var curr_page = 1;
var artist_len = "";
var album_len = "";



//add click events for buttons in header
document.getElementById("search-button").addEventListener("click", checkArtist);
document.getElementById("back-button").addEventListener("click", returnToArtist);

//on return to artist screen
function returnToArtist() {
    document.getElementById("sel-container").innerHTML = "";
    document.getElementById("art-container").style.display = "block";
    document.getElementById("artist-name").style.display = "block";
    document.getElementById("search-button").style.display = "block";
    document.getElementById("back-button").style.display = "none";
    if (document.getElementById("pagination").style.display == "none") {
        document.getElementById("pagination").style.display = "flex";
        document.getElementById("pagination").style.justifyContent = "center";
        document.getElementById("pagination").style.alignItems = "center";
    }
    if (old_page_status) {
        document.getElementById("pagestatus").innerText = old_page_status;

    }
    if (curr_page) {
        curr_page = old_curr_page;

    }

    if (getNumberofPages(1) == 1) {
        document.getElementById("pagination").style.display = "none";
    }
}

//check if valid artist
function checkArtist() {
    var val = document.getElementById("artist-name").value;
    // (val) ? searchArtist(val): alert("enter an artist name");


    if (val) {
        searchArtist(val)
    } else {
        document.getElementById("art-container").innerHTML = "";
        var span = document.createElement("span");
        span.appendChild(document.createTextNode("Enter an artist name"));
        span.classList.add("no-artist");
        document.getElementById("art-container").appendChild(span);
    }
    document.getElementById("artist-name").value = "";
}
//for keypress enter
function checkEnter(event) {
    (event.code === "Enter") ? checkArtist(): '';
}
//request to get artists

function searchArtist(val) {
    var url = "http://www.theaudiodb.com/api/v1/json/1/search.php";
    //set loader
    document.getElementById("loader").style.display = "block";
    document.getElementById("art-container").innerHTML = "";
    var getArtistRequest = $.ajax({
        type: "GET",
        async: true,
        url: url,
        cache: false,
        data: {
            s: val
        },
        dataType: "json"
    });
    getArtistRequest.done(function(data) {

        //remove loader
        document.getElementById("loader").style.display = "none";
        renderArtist(data, 1);

    });
    getArtistRequest.fail(function(jxhr, status) {
        document.getElementById("loader").style.display = "none";
        if (jxhr.status != 410) {

            document.getElementById("pagination").style.display = "none";

            if (document.getElementsByClassName("no-artist").length) {
                document.getElementsByClassName("no-artist")[0].innerText = "Artists could not be fetched"
            } else {
                document.getElementById("art-container").innerHTML = "";
                var span = document.createElement("span");
                span.appendChild(document.createTextNode("Artists could not be fetched"));
                span.classList.add("no-artist");
                document.getElementById("art-container").appendChild(span);
            }
        }
    });
    //for testing with mock data
    // artist_obj = mock_data;
    // renderArtist(artist_obj, 1);
}

//to render artist lists

function renderArtist(data, page) {
    if (data.artists) {
        document.getElementById("art-container").innerHTML = "";
        var len = data.artists.length;
        artist_len = len;
        var setno = 1;
        curr_page = 1;
        page = (page > getNumberofPages(1)) ? getNumberofPages(1) : page;
        page = (page < 1) ? 1 : page;

        var artist_per_page_show = (artist_per_page > len) ? len : artist_per_page;

        var totpages = getNumberofPages(1);
        if (totpages > 1) {
            document.getElementById("pagination").style.display = "flex";
            document.getElementById("pagination").style.justifyContent = "center";
            document.getElementById("pagination").style.alignItems = "center";


        } else {
            document.getElementById("pagination").style.display = "none";

        }

        var index = (page - 1) * artist_per_page_show;

        var ul = "";
        for (index; index < len; index++) {
            if (index % artist_per_page == 0) {
                ul = document.createElement("ul");
                ul.classList.add("artists");
                ul.id = "artistset" + setno;
                setno++;
            }
            var adata = data.artists[index];
            var li = document.createElement("li");
            li.classList.add("artistrow");
            li.id = "artist" + index;
            var adiv = document.createElement("div");
            adiv.classList.add("artistdiv");
            var aimg = document.createElement("img");
            aimg.classList.add("artist-img");
            if (adata) {
                (adata.strArtistThumb) ? aimg.src = adata.strArtistThumb: aimg.src = "assets/img/default-artist.png";

            }
            var adet = document.createElement("div");
            adet.classList.add("artist-detail");
            var nspan = document.createElement("span");
            nspan.classList.add("artist-name");
            nspan.appendChild(document.createTextNode(adata.strArtist));
            var detspan = document.createElement("span");
            detspan.classList.add("other-detail");
            detspan.appendChild(document.createTextNode("View Albums"));
            (adata.strWebsite) ? detspan.dataset.website = adata.strWebsite: detspan.dataset.website = "";

            detspan.addEventListener("click", viewAlbums);
            adet.appendChild(nspan);
            adet.appendChild(detspan);
            adiv.appendChild(aimg);
            adiv.appendChild(adet);
            li.appendChild(adiv);
            ul.appendChild(li);

            if (index % artist_per_page == 0 || index == len) {

                (ul) ? document.getElementById("art-container").appendChild(ul): '';
            }

        }
        showPage("artistset", 1);
        updatePageno("artist", 1);

    } else {

        document.getElementById("art-container").innerHTML = "";
        var span = document.createElement("span");
        span.appendChild(document.createTextNode("No artists found"));
        span.classList.add("no-artist");
        document.getElementById("art-container").appendChild(span);
    }
}