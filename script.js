const container = document.getElementById('videos-container');

const BASE_URL = 'https://www.googleapis.com/youtube/v3/';
const API_KEY = 'AIzaSyDi7u5hjpv0nRJbHRPdWxgtcu7030ntGsg';

async function getData(query){
    const url = `${BASE_URL}search?key=${API_KEY}&q=${query}&type=videos&maxResults=20`;
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    console.log("GetData function", data.items);

    getVideoData(data.items);
}

async function getVideoData(data){
    const videoArray = [];
    for(let i in data){
        const videoId = data[i].id.videoId;
        videoArray.push(await fetchVideoDetails(videoId));
    }
    console.log("getVideoData function", videoArray);
    renderVideos(videoArray);
}

async function fetchVideoDetails(videoId){
    const url = `${BASE_URL}videos?part=snippet,statistics,contentDetails&type=videos&id=${videoId}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.items[0];
}

function renderVideos(data){
    container.innerHTML = '';
    data.forEach(video => {
        const thumbnail = video.snippet.thumbnails.high.url;
        const channelTitle = video.snippet.channelTitle;
        const videoTitle = video.snippet.localized.title;
        let views = Number(video.statistics.viewCount);
        let val = '';
        if(views >= 1000000){
            const temp = views / 1000000;
            views = temp.toFixed(1);
            val = 'M'
        }
        else if(views > 1000){
            const temp = views / 1000;
            views = temp.toFixed(1);
            val = 'k'
        }
        container.innerHTML += 
            `<div class="video" onclick="openVideo('${video.id}')">
                <div class="thumbnail">
                    <img src="${thumbnail}" alt="">
                </div>
                <div class="details">
                    <div class="channel-img">
                        <img src="resources/User-Avatar.svg" alt="" srcset="">
                    </div>
                    <div class="description">
                        <div class="title">${videoTitle}</div>
                        <div class="bottom-details">
                            <div class="channel-name">${channelTitle}</div>
                            <div class="other-details">
                                <span class="views">${views}${val} Views</span>
                                <span class="time">1 week ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
    })
}

function openVideo(videoId){
    localStorage.setItem('videoId', videoId);
    window.open('videoDetails.html');
}

function search(){
    const data = document.getElementById('searchBar').values;
    getData(data);
}

getData('');

