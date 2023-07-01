const BASE_URL = 'https://www.googleapis.com/youtube/v3/';
const API_KEY = 'AIzaSyDi7u5hjpv0nRJbHRPdWxgtcu7030ntGsg';
const container = document.getElementById('recommend-videos-container');
const videoContainer = document.getElementById('videos-container');
const videoId = localStorage.getItem('videoId');
const commentsContainer = document.getElementById('comments');
videoContainer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

async function fetchVideoDetails_videoDetails(videoId){
    const url = `${BASE_URL}videos?part=snippet,statistics,contentDetails&type=videos&id=${videoId}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.items[0]);
    updateVideoDetails(data.items[0]);
}

function updateVideoDetails(videoData){
    const title = localStorage.getItem('videoTitle');
    const views = document.getElementById('video-views');
    const likes = document.getElementById('like-count');
    const channelName = document.getElementById('channel-name');
    const videoDescription = document.getElementById('video-description');
    const totalComments = document.getElementById('comments-count');

    videoDescription.innerHTML = videoData.snippet.description;
    channelName.innerText = videoData.snippet.channelTitle;
    title.innerText = `${videoData.snippet.title}`;
    totalComments.innerHTML = `${videoData.statistics.commentCount} Comments`;
    views.innerText = `${videoData.statistics.viewCount} Views`;

    let likeCount = Number(videoData.statistics.likeCount);
    let val = '';
    if(likeCount >= 1000000){
        const temp = likeCount / 1000000;
        likeCount = temp.toFixed(1);
        val = 'M'
    }
    else if(likeCount > 1000){
        const temp = likeCount / 1000;
        likeCount = temp.toFixed(1);
        val = 'k'
    }
    likes.innerText = `${likeCount}${val}`;
}

async function getComments(){
    const url = `${BASE_URL}commentThreads?key=${API_KEY}&videoId=${videoId}&maxResults=20&order=relevance&part=snippet`;
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    const comments = data.items;
    console.log(comments);
    renderComments(comments);
}

function renderComments(comments) {
    commentsContainer.innerHTML = "";
    comments.forEach((comment) => {
      commentsContainer.innerHTML += 
      `<div class="comment">
            <div class="dp">
                <img src="${comment.snippet.topLevelComment.snippet.authorProfileImageUrl}" alt="">
            </div>
            <div class="content">
                <div class="header">
                    <div class="name">${comment.snippet.topLevelComment.snippet.authorDisplayName}</div>
                    <div class="time">8 hours ago</div>
                </div>
                <div class="text">
                    <p>${comment.snippet.topLevelComment.snippet.textDisplay}</p>
                </div>
                <div class="stats">
                    <div class="likes">
                        <button type="button">
                            <img src="resources/videoDetails/like-icon.svg" alt="">
                        </button>
                        <div class="like-count">3</div>
                    </div>
                    <div class="dislikes">
                        <button type="button">
                            <img src="resources/videoDetails/dislike-icon.svg" alt="">
                        </button>
                    </div>
                    <button type="button" class="reply-btn">REPLY</button>
                    <button type="button" class="show-reply">Show Reply</button>
                </div>
            </div>
        </div>`;
    });
}


async function getData_videoDetails(){
    const url = `${BASE_URL}search?key=${API_KEY}&type=videos&maxResults=20`;
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    console.log("GetData function", data.items);

    getVideoData_videoDetails(data.items);
}

async function getVideoData_videoDetails(data){
    const videoArray = [];
    for(let i in data){
        const temp_videoId = data[i].id.videoId;
        videoArray.push(await fetchVideoDetails(temp_videoId));
    }
    console.log("getVideoData function", videoArray);
    renderVideos_videoDetails(videoArray);
}

function renderVideos_videoDetails(data){
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
                    <div class="title">${videoTitle}</div>
                    <div class="video-info">
                        <div class="channel-name">${channelTitle}</div>
                        <div class="stats">
                            <div class="views">${views}${val} views</div>
                            <div class="time">3 years ago</div>
                        </div>
                    </div>
                </div>
            </div>`
    })
}

async function fetchVideoDetails(temp_videoId){
    const url = `${BASE_URL}videos?part=snippet,statistics,contentDetails&type=videos&id=${temp_videoId}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.items[0];
}

function openVideo(VIDEO_ID){
    localStorage.setItem('videoId', VIDEO_ID);
    window.open('/videoDetails.html');
}

fetchVideoDetails_videoDetails(videoId);
getComments();
getData_videoDetails();