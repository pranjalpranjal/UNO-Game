let MEDIA_RECORDER = undefined;
let video_recoding = document.getElementById("id_recorded_video");
let chunks;
let VIDEO_COUNT = 1;
let BLOB_DATA_RECEIVED_COUNTER = 0;

function start_recording() {
    $('#id_start_btn').prop('disabled', true);
    $('#id_stop_btn').prop('disabled', false);
    $('#id_pause_btn').prop('disabled', false);
    let canvas = document.querySelector("canvas");

    let stream = canvas.captureStream();

    STREAM.then((mediaStream)=>{
        stream.addTrack(mediaStream.getAudioTracks()[0]);
        MEDIA_RECORDER = new MediaRecorder(stream);
        chunks = [];
        MEDIA_RECORDER.start(10000); // 10 seconds in ms, means ondataavailable event is called in every 10 secondsalert("Recoding Started for Video: " + VIDEO_COUNT);
        console.log(MEDIA_RECORDER.state);
    });

    MEDIA_RECORDER = new MediaRecorder(stream);
    chunks = [];
    MEDIA_RECORDER.start(10000); // 10 seconds in ms, means ondataavailable event is called in every 10 secondsalert("Recoding Started for Video: " + VIDEO_COUNT);
    console.log(MEDIA_RECORDER.state);


    MEDIA_RECORDER.ondataavailable = (ev) => {
        console.log("Called");
        chunks.push(ev.data);
        BLOB_DATA_RECEIVED_COUNTER += 1;
        if(BLOB_DATA_RECEIVED_COUNTER === 180){ // for 30 minutes
            BLOB_DATA_RECEIVED_COUNTER = 0;
            MEDIA_RECORDER.stop();
            MEDIA_RECORDER.start(10000);
        }
    };

    MEDIA_RECORDER.onstop = (ev) => {
        let blob = new Blob(chunks, {'type': 'video/webm'});
        alert("Recording is ready to be Downloaded");
        chunks = [];
        let videoURL = window.URL.createObjectURL(blob);
        // let innerHTML = "download_link_" + VIDEO_COUNT;
        let d = new Date;
        let file_name = VIDEO_COUNT + "_UnoGame_Recording_" + d.getDate() + "_" + d.getMonth() + "_" + d.getFullYear();
        $('#id_download_links').append(`<li><a id="${videoURL}" href="${videoURL}" download="${file_name}">${file_name}</a></li>`);
        VIDEO_COUNT += 1;

        // video_recoding.src = videoURL;
        // video_recoding.srcObject = blob;
    };

}

function pause_recording(){
    $('#id_pause_btn').prop('disabled', true);
    $('#id_resume_btn').prop('disabled', false);
    if(MEDIA_RECORDER === undefined){
        alert("No Recording being recorded...");
    }
    else if(MEDIA_RECORDER.state === "recording"){
        MEDIA_RECORDER.pause();
        alert("Recoding Paused");
        console.log(MEDIA_RECORDER.state);
    }
    else if(MEDIA_RECORDER.state === "paused"){
        alert("Recording is already paused...");
    }
    else if(MEDIA_RECORDER.state === "inactive"){
        alert("Video was stopped already.");
    }
}

function resume_recording(){
    $('#id_pause_btn').prop('disabled', false);
    $('#id_resume_btn').prop('disabled', true);
    if(MEDIA_RECORDER === undefined){
        alert("No recording being recorded...");
    }
    else if(MEDIA_RECORDER.state === "recording"){
        alert("Video is already in progress...");
    }
    else if(MEDIA_RECORDER.state === "inactive"){
        alert("Video was stopped already.");
    }
    else if(MEDIA_RECORDER.state === "paused"){
        MEDIA_RECORDER.resume();
        alert("Recoding Resumed");
        console.log(MEDIA_RECORDER.state);
    }
}

function stop_recording() {
    $('#id_start_btn').prop('disabled', false);
    $('#id_pause_btn').prop('disabled', true);
    $('#id_resume_btn').prop('disabled', true);
    $('#id_stop_btn').prop('disabled', true);
    if(MEDIA_RECORDER === undefined){
        alert("No Recording being recorded...");
        return;
    }
    if(MEDIA_RECORDER.state !== "inactive"){
        MEDIA_RECORDER.stop();
        alert("Recoding Stopped for " + VIDEO_COUNT);
        console.log(MEDIA_RECORDER.state);
    }
    $('id_start_btn').prop('disabled', false);
    $('id_stop_btn').prop('disabled', true);
}

