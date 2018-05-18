// onclick to view tracks

function viewTracks(e)
{
    var albname = e.target.previousSibling.innerText;
    var albid=e.target.dataset.albumid;
    var albrel=e.target.dataset.albumrel;

    getTracks(albname,albid,albrel);
}

// request to get tracks
function getTracks(albumname,albumid,albumrelease) {
    var url = "http://www.theaudiodb.com/api/v1/json/1/track.php";
    document.getElementById("loader").style.display="block";

    var getAlbumRequest = $.ajax({
        type: "GET",
        async: true,
        url: url,
        cache: false,
        data: {
            m: albumid
        },
        dataType: "json"
    });
    getAlbumRequest.done(function (data) {
        document.getElementById("loader").style.display="none";
        renderTracks(data,albumname,albumrelease);

    });
    getAlbumRequest.fail(function (jxhr, status) {
        document.getElementById("loader").style.display="none";
        if (jxhr.status != 410){
            document.getElementById("modal-text").innerHTML = "";
            var span = document.createElement("span");
            span.appendChild(document.createTextNode("Tracks could not be fetched"));
            span.classList.add("no-track");
            document.getElementById("modal-text").appendChild(span);
        }
    });
}

// show all tracks in an album

function renderTracks(trackdata,albumname,albrelyear)
{
    if(trackdata)
    {
    document.getElementById("modal").style.display="block";
    document.getElementById("albname").innerText=albumname;
    document.getElementById("relyear").innerText=albrelyear;
    document.getElementById("modal-text").innerHTML="";
    var index=0;
    var len=trackdata.track.length;
    for(index;index<len;index++)
    {
        var tdata=trackdata.track[index];
        var tdiv=document.createElement("div");
        tdiv.classList.add("tracks");
        tdiv.id="track"+index;
        var tspan=document.createElement("span");
        tspan.appendChild(document.createTextNode(tdata.strTrack));
        var durspan=document.createElement("span");
        var dur=Math.floor((tdata.intDuration*0.001)/60);
        (dur>1)?durspan.appendChild(document.createTextNode(dur+" mins")):durspan.appendChild(document.createTextNode(dur+" min"))
        tdiv.appendChild(tspan);
        tdiv.appendChild(durspan);
        document.getElementById("modal-text").appendChild(tdiv);



    }
    }
    else{
        document.getElementById("modal-text").innerHTML = "";
        var span = document.createElement("span");
        span.appendChild(document.createTextNode("No tracks found"));
        span.classList.add("no-track");
        document.getElementById("modal-text").appendChild(span);

    }
    


}

// close modal

document.getElementById("close").addEventListener("click",function(){
    document.getElementById("modal").style.display="none";
});

// close modal on clicking outside

window.onclick=function(e){
    (e.target==modal)? document.getElementById("modal").style.display="none":'';
}