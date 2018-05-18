//onclick to view albums of an artist

function viewAlbums(e) {
    var aname = e.target.previousSibling.innerText;
    var simg = e.target.parentNode.previousSibling.src;
    var web = e.target.dataset.website;
    renderSelectedArtist(aname, simg, web);
    getAlbums(aname);
    document.getElementById("art-container").style.display = "none";
    document.getElementById("artist-name").style.display = "none";
    document.getElementById("search-button").style.display = "none";
    document.getElementById("back-button").style.display = "block";
    old_page_status = document.getElementById("pagestatus").innerText;
    old_curr_page = curr_page;
    if (document.getElementById("pagination").style.display == "flex") {
        document.getElementById("pagination").style.display = "none";

    }

}

// render selected artist contents
function renderSelectedArtist(artname, artimg, web) {

    document.getElementById("sel-container").innerHTML = "";
    var aseldiv = document.createElement("div");
    aseldiv.classList.add("artistdiv-select");
    var selimg = document.createElement("img");
    selimg.classList.add("artist-img-select");
    selimg.src = artimg;
    var aseldet = document.createElement("div");
    aseldet.classList.add("artist-detail-select");
    var aselname = document.createElement("span");
    aselname.classList.add("artist-name-select");
    aselname.appendChild(document.createTextNode(artname));
    var fdet = document.createElement("div");
    fdet.classList.add("follow-detail");
    var fspan1 = document.createElement("span");
    fspan1.appendChild(document.createTextNode("Website:"));
    var fspan2 = document.createElement("span");
    (web) ? fspan2.appendChild(document.createTextNode(web)): fspan2.appendChild(document.createTextNode("Not Available"));
    fdet.appendChild(fspan1);
    fdet.appendChild(fspan2);
    aseldet.appendChild(aselname);
    aseldet.appendChild(fdet);
    aseldiv.appendChild(selimg);
    aseldiv.appendChild(aseldet);

    var albheader = document.createElement("span");
    albheader.classList.add("htext")
    albheader.appendChild(document.createTextNode("Albums"));

    var albcont = document.createElement("div");
    albcont.id = "alb-container";

    var pcont = document.getElementById("sel-container");
    pcont.appendChild(aseldiv);
    pcont.appendChild(albheader);
    pcont.appendChild(albcont);


}

// request to get albums


function getAlbums(artistname) {
    var url = "http://www.theaudiodb.com/api/v1/json/1/searchalbum.php";
    document.getElementById("loader").style.display = "block";


    var getAlbumRequest = $.ajax({
        type: "GET",
        async: true,
        url: url,
        cache: false,
        data: {
            s: artistname
        },
        dataType: "json"
    });
    getAlbumRequest.done(function(data) {

        renderAlbum(data, 1);

        document.getElementById("loader").style.display = "none";


    });
    getAlbumRequest.fail(function(jxhr, status) {
        document.getElementById("loader").style.display = "none";

        if (jxhr.status != 410) {
            document.getElementById("pagination").style.display = "none";
            if (document.getElementsByClassName("no-album").length) {
                document.getElementsByClassName("no-album")[0].innerText = "Albums could not be fetched"
            } else {
                document.getElementById("alb-container").innerHTML = "";
                var span = document.createElement("span");
                span.appendChild(document.createTextNode("Albums could not be fetched"));
                span.classList.add("no-album");
                document.getElementById("alb-container").appendChild(span);
            }
        }
    });
}


//render album list for a particular artist

function renderAlbum(data, page) {
    if (data.album) {
        document.getElementById("alb-container").innerHTML = "";
        var len = data.album.length;
        curr_page = 1;
        var setno = 1;
        album_len = len;
        page = (page > getNumberofPages(0)) ? getNumberofPages(0) : page;
        page = (page < 1) ? 1 : page;

        var album_per_page_show = (album_per_page > len) ? len : album_per_page;

        var totpages = getNumberofPages(0);
        if (totpages > 1) {
            document.getElementById("pagination").style.display = "flex";
            document.getElementById("pagination").style.justifyContent = "center";
            document.getElementById("pagination").style.alignItems = "center";
        } else {
            document.getElementById("pagination").style.display = "none";

        }

        var index = (page - 1) * album_per_page_show;
        for (index; index < len; index++) {

            if (index % album_per_page == 0) {
                ul = document.createElement("ul");
                ul.classList.add("albums");
                ul.id = "albumset" + setno;
                setno++;
            }

            var adata = data.album[index];
            var li = document.createElement("li");
            li.classList.add("albumrow");
            li.id = "album" + index;
            var adiv = document.createElement("div");
            adiv.classList.add("albumdiv");
            var aimg = document.createElement("img");
            aimg.classList.add("album-img");
            (adata.strAlbumThumb) ? aimg.src = adata.strAlbumThumb: aimg.src = "assets/img/default-album.png";
            var adet = document.createElement("div");
            adet.classList.add("album-detail");
            var nspan = document.createElement("span");
            nspan.classList.add("album-name");
            nspan.appendChild(document.createTextNode(adata.strAlbum));
            var detspan = document.createElement("span");
            detspan.classList.add("other-detail-album");
            detspan.appendChild(document.createTextNode("View Tracks"));
            detspan.dataset.albumid = adata.idAlbum;
            detspan.dataset.albumrel = adata.intYearReleased;
            detspan.addEventListener("click", viewTracks);
            adet.appendChild(nspan);
            adet.appendChild(detspan);
            adiv.appendChild(aimg);
            adiv.appendChild(adet);
            li.appendChild(adiv);
            ul.appendChild(li);

            if (index % album_per_page == 0 || index == len) {

                (ul) ? document.getElementById("alb-container").appendChild(ul): '';
            }


        }
        showPage("albumset", 1);
        updatePageno("album", 1);

    } else {

        document.getElementById("alb-container").innerHTML = "";
        var span = document.createElement("span");
        span.appendChild(document.createTextNode("No albums found"));
        span.classList.add("no-album");
        document.getElementById("alb-container").appendChild(span);
    }
}