import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
const tweetInput = document.getElementById('tweet-input')

document.addEventListener('click',function(e){
    if(e.target.id === 'tweet-btn'){
        handleClickTweetBtn()
    }else if(e.target.dataset.like){
        handleClickLike(e.target.dataset.like)
    }else if(e.target.dataset.retweet){
        handleClickRetweet(e.target.dataset.retweet)
    }else if(e.target.dataset.reply){
        handleClickReplies(e.target.dataset.reply)
    }else if(e.target.dataset.replybutton){
        handleClickNewReply(e.target.dataset.replybutton)
    }else if(e.target.dataset.delete){
       handleClickDeletePost(e.target.dataset.delete)
    }else if(e.target.dataset.replydelete){
       handleClickDeleteReply(e.target.dataset.replydelete, e.target.dataset.index)
    }
})


let tweetsStorage = []
    if (localStorage.getItem('tweetsStorage')) {
        tweetsStorage = JSON.parse(localStorage.getItem('tweetsStorage'))
    } else {
        tweetsStorage = tweetsData;
    }

function saveToLocalStorage() {
    localStorage.setItem('tweetsStorage', JSON.stringify(tweetsStorage))
    }



function handleClickDeleteReply(tweetId,index){
    const filterReply = tweetsStorage.filter(tweet=>{
        return tweet.uuid === tweetId
    })[0]
    
    filterReply.replies.splice(index,1)

    render()
    saveToLocalStorage()    
}

function handleClickDeletePost(tweetId){
    
    const index = tweetsStorage.findIndex(tweet => tweet.uuid === tweetId)
    tweetsStorage.splice(index,1)
    render()
    saveToLocalStorage()
}

function handleClickNewReply(tweetId){
    const filterRepliesObj=tweetsStorage.filter(tweet=>{
        return tweet.uuid === tweetId
    })[0]
    const inputValue = document.getElementById(`tweet-input-reply-${tweetId}`)
    filterRepliesObj.replies.push({
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        tweetText: `${inputValue.value}`
    })
    render()
    saveToLocalStorage()
}


function handleClickReplies(tweetId){
    const filterCommentObj=tweetsStorage.filter(tweet=>{
        return tweet.uuid === tweetId
    })[0]
    
    filterCommentObj.isClicked = !filterCommentObj.isClicked
    render()
    saveToLocalStorage()
}


function handleClickLike(tweetId){
    const filterLikeObj=tweetsStorage.filter(tweet=>{
        return tweet.uuid === tweetId
    })[0]
    
    if(filterLikeObj.isLiked){
        filterLikeObj.likes--
    }else{
        filterLikeObj.likes++
    }
    
    filterLikeObj.isLiked = !filterLikeObj.isLiked
    render()
    saveToLocalStorage()
    
}

function handleClickRetweet(tweetId){
    const filterRetweetObj=tweetsStorage.filter(tweet=>{
        return tweet.uuid === tweetId
    })[0]
    
    if(filterRetweetObj.isRetweeted){
        filterRetweetObj.retweets--
    }else{
        filterRetweetObj.retweets++
    }
    
    filterRetweetObj.isRetweeted = !filterRetweetObj.isRetweeted
    render()
    saveToLocalStorage()
    
}

function handleClickTweetBtn(){
    if(tweetInput.value){
        tweetsStorage.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            isClicked: false,
            uuid: uuidv4()
        })
        tweetInput.value=''
    }
    
    render()
    saveToLocalStorage()
}




function getFeedHtml(){
    let feedHtml = ''
    tweetsStorage.forEach(tweet=>{
        
        let handleLike =''
        let handleRetweet=''
        let handleComment =''
        let tweetRepliesHtml = ''
        let isHidden = 'hidden'
        
        
        if(tweet.isLiked){
            handleLike='liked'
        }
        
        if(tweet.isClicked){
            handleComment='comment'
            isHidden = ''
        }
        
        if(tweet.isRetweeted){
            handleRetweet='retweeted'
        }
        
        
            
            tweet.replies.forEach((reply,index) =>{
                tweetRepliesHtml+=`<div class="tweet-reply">
                    <div class="tweet-inner">
                    
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        <i class="fa-solid fa-trash" data-replydelete='${tweet.uuid}' data-index='${index}'></i>
                        </div>
                </div>`
            })
            
            tweetRepliesHtml +=`<div class="tweet-input-reply-container">
            <div class="tweet-inner-reply">
                <img src="images/scrimbalogo.png" class="profile-pic">    
                <textarea placeholder="Tweet your reply" id="tweet-input-reply-${tweet.uuid}"></textarea>
            </div>
            <button data-replybutton="${tweet.uuid}" id="tweet-btn-reply">Reply</button>
        </div>`
            
       
        
        feedHtml +=`<div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots ${handleComment}" data-reply='${tweet.uuid}'></i>
                               ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${handleLike}" data-like='${tweet.uuid}'></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${handleRetweet}" data-retweet='${tweet.uuid}'></i>
                                ${tweet.retweets}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-trash" data-delete='${tweet.uuid}'></i>
                            </span>
                        </div>   
                    </div>            
                </div>
            </div>
            
            <div class="${isHidden}" id="replies-${tweet.uuid}">
                ${tweetRepliesHtml}
            </div>   
            
            `
    })    
    return feedHtml
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()
