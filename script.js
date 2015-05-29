
var debug = function(mesg) {
    console.log(mesg)
}

if (appendMessage == undefined) {
    function appendMessage(msg) {
        debug(msg)
    }
}

/**
 * callback on success for loading media
 * @param {Object} e A non-null media object
 */
function onMediaDiscovered(how, mediaSession) {
    console.log("new media session ID:" + mediaSession.mediaSessionId);
    appendMessage("new media session ID:" + mediaSession.mediaSessionId + ' (' + how + ')');
    currentMediaSession = mediaSession;

    mediaSession.addUpdateListener(onMediaStatusUpdate);
    mediaCurrentTime = currentMediaSession.currentTime;
    playpauseresume.innerHTML = 'Pause';
    //document.getElementById("casticon").src = 'images/cast_icon_active.png';
}

/**
 * callback on media loading error
 * @param {Object} e A non-null media object
 */
function onMediaError(e) {
    console.log("media error");
    appendMessage("media error");
    //document.getElementById("casticon").src = 'images/cast_icon_warning.png';
}

/**
 * callback for media status event
 * @param {Object} e A non-null media object
 */
function onMediaStatusUpdate(isAlive) {
    debug('onMediaStatusUpdate')
    //if( progressFlag ) {
    //    document.getElementById("progress").value = parseInt(100 * currentMediaSession.currentTime / currentMediaSession.media.duration);
    //}
    //document.getElementById("playerstate").innerHTML = currentMediaSession.playerState;
}



function initializeCastApi() {
/*
    var p = getQueryParams();

    if( p['auto'] == 'page_scoped' ) {
        autoJoinPolicy = chrome.cast.AutoJoinPolicy.PAGE_SCOPED;
    }
    else if( p['auto'] == 'origin_scoped' ) {
        autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;
    }
    else {
    }*/
        autoJoinPolicy = chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED;


    var appId = '206F7C7D';

    //appId = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    //appId = 'FAA1F6C0'
        //chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    var sessionRequest = new chrome.cast.SessionRequest(appId);
    var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
        sessionListener,
        receiverListener,
        autoJoinPolicy);

    chrome.cast.initialize(apiConfig, onInitSuccess, onError);
};

/**
 * initialization success callback
 */
function onInitSuccess() {
    appendMessage("init success");
    //launchApp()
}

/**
 * initialization error callback
 */
function onError() {
    console.log("error");
    appendMessage("error");
}

/**
 * session listener during initialization
 */
function sessionListener(e) {
    console.log('New session ID: ' + e.sessionId);
    appendMessage('New session ID:' + e.sessionId);
    session = e;
    if (session.media.length != 0) {
        appendMessage(
            'Found ' + session.media.length + ' existing media sessions.');
        onMediaDiscovered('onRequestSessionSuccess_', session.media[0]);
    }
    session.addMediaListener(
        onMediaDiscovered.bind(this, 'addMediaListener'));
    session.addUpdateListener(sessionUpdateListener.bind(this));
}

/**
 * session update listener
 */
function sessionUpdateListener(isAlive) {
    var message = isAlive ? 'Session Updated' : 'Session Removed';
    message += ': ' + session.sessionId;
    appendMessage(message);
    if (!isAlive) {
        session = null;
    }
};

/**
 * receiver listener during initialization
 */
function receiverListener(e) {
    if( e === 'available' ) {
        appendMessage("receiver found");
    }
    else {
        appendMessage("receiver list empty");
    }
}

/**
 * callback on success for requestSession call
 * @param {Object} e A non-null new session.
 */
function onRequestSessionSuccess(e) {
    console.log("session success: " + e.sessionId);
    appendMessage("session success: " + e.sessionId);
    session = e;
//    document.getElementById("casticon").src = 'images/cast_icon_active.png';
}

/**
 * callback on launch error
 */
function onLaunchError() {
    console.log("launch error");
    appendMessage("launch error");
}

/**
 * launch app and request session
 */
function launchApp() {
    console.log("launching app...");
    appendMessage("launching app...");
    chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
}


$(document).ready(function () {
    debug('loading')


    if (!chrome.cast || !chrome.cast.isAvailable) {
        debug('ChromeCast not ready/absent')
        setTimeout(initializeCastApi, 1000);
    }


    $('#launchButton').click(function() {
        debug('Launch button')
        launchApp();
    })


})



