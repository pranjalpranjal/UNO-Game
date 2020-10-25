class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        this.load.image("table", `${generatePath("images", "table.jpg")}`);
        this.load.image("starfield_1", `${generatePath("images", "starfield_1.png")}`);
        this.load.image("starfield_2", `${generatePath("images", "starfield_2.jpg")}`);

        this.load.spritesheet("unoLogo", `${generatePath("spritesheets", "uno.png")}`, {
            frameWidth: 419,
            frameHeight: 369
        });

        this.load.spritesheet("cardBack", `${generatePath("images", "back.png")}`, {
            frameWidth: 93,
            frameHeight: 140
        });

        this.load.spritesheet("cardFront", `${generatePath("images", "outl.png")}`, {
            frameWidth: 93,
            frameHeight: 140
        });

        this.load.spritesheet("uno", `${generatePath("spritesheets", "uno_game.jpeg")}`, {
            frameWidth: 57,
            frameHeight: 86
        });

        this.load.spritesheet("oppHand", `${generatePath("images", "opp_hand.jpg")}`, {
            frameWidth: 260,
            frameHeight: 146
        });

        this.load.spritesheet("noButton", `${generatePath("spritesheets", "no_button.png")}`, {
            frameWidth: 149,
            frameHeight: 149
        });

        this.load.spritesheet("yesButton", `${generatePath("spritesheets", "yes_button.png")}`, {
            frameWidth: 148,
            frameHeight: 148
        });

        this.load.spritesheet("turnIndicator", `${generatePath("spritesheets", "turn_indicator.png")}`, {
            frameWidth: 16,
            frameHeight: 16
        });

        // this.load.spritesheet("turnIndicator", `${generatePath("spritesheets", "bird.jpg")}`, {
        //     frameWidth: 750,
        //     frameHeight: 800
        // });


        // this.load.spritesheet("turnIndicator", `${generatePath("spritesheets", "turn_indicator_2.png")}`, {
        //     frameWidth: 73,
        //     frameHeight: 73
        // });

        this.load.spritesheet("unoButton", `${generatePath("spritesheets", "uno_button.png")}`, {
            frameWidth: 300,
            frameHeight: 119
        });

        this.load.spritesheet("challengeButton", `${generatePath("spritesheets", "challenge_button.png")}`, {
            frameWidth: 73,
            frameHeight: 73
        });

        this.load.spritesheet("crossButton", `${generatePath("spritesheets", "cross_button.png")}`, {
            frameWidth: 73,
            frameHeight: 73
        });

        this.load.spritesheet("exitButton", `${generatePath("spritesheets", "exit_button.png")}`, {
            frameWidth: 73,
            frameHeight: 73
        });


        this.load.spritesheet("playButton", `${generatePath("spritesheets", "play_button.png")}`, {
            frameWidth: 562,
            frameHeight: 221
        });

        this.load.image("chooseAColor", `${generatePath("spritesheets", "choose_color_rounded.png")}`);

        this.load.spritesheet("chooseBlueButton", `${generatePath("spritesheets", "choose_blue_button.png")}`, {
            frameWidth: 130,
            frameHeight: 130
        });

        this.load.spritesheet("chooseYellowButton", `${generatePath("spritesheets", "choose_yellow_button.png")}`, {
            frameWidth: 130,
            frameHeight: 130
        });

        this.load.spritesheet("chooseGreenButton", `${generatePath("spritesheets", "choose_green_button.png")}`, {
            frameWidth: 130,
            frameHeight: 130
        });

        this.load.spritesheet("chooseRedButton", `${generatePath("spritesheets", "choose_red_button.png")}`, {
            frameWidth: 130,
            frameHeight: 130
        });

        this.load.spritesheet('fullscreen', `${generatePath("spritesheets", "fullscreen-white.png")}`, {
            frameWidth: 64,
            frameHeight: 64
        });

        this.load.bitmapFont("pixelFont", `${generatePath("font", "font.png")}`, `${generatePath("font", "font.xml")}`);

        this.load.video('wormhole', `${generatePath("video", "wormhole.mp4")}`, 'loadeddata', false, true);
    }

    create() {
        let _this = this;

        _this.starfield2 = _this.add.tileSprite(0, 0, game.config.width, game.config.height, "starfield_2");
        _this.starfield2.setOrigin(0,0);

        // let text = _this.add.text(320, 128, 'Please set your\nphone to landscape', { font: '48px Courier', fill: '#00ff00', align: 'center' }).setOrigin(0.5);
        //
        // checkOriention(_this.scale.orientation, text);
        //
        // _this.scale.on('orientationchange', checkOriention, _this);
        // var vid = this.add.video(100, 100, 'wormhole');
        //
        // vid.play(true);

        let FKey = _this.input.keyboard.addKey('F');

        FKey.on('down', function () {
            if (_this.scale.isFullscreen) {
                button.setFrame(0);
                _this.scale.stopFullscreen();
            }
            else {
                button.setFrame(1);
                _this.scale.startFullscreen();
            }
        }, _this);

        let button = _this.add.image(game.config.width-16, 16, 'fullscreen', 0).setOrigin(1, 0).setScale(0.5).setInteractive();

        button.on('pointerup', function () {
            if (_this.scale.isFullscreen) {
                button.setFrame(0);
                _this.scale.stopFullscreen();
            }
            else {
                button.setFrame(1);
                _this.scale.startFullscreen();
            }
        }, _this);


        _this.unoLogo = _this.physics.add.sprite(game.config.width/2, 180, "unoLogo");
        _this.unoLogo.setScale(0.8);
        this.tweens.add({
            targets: _this.unoLogo,
            scale: 0.5,
            duration: 2000,
            ease: 'Linear',
            yoyo: true,
            loop: -1
        });

        if(me === gameRoomAdmin) {
            _this.playButton = _this.physics.add.sprite(game.config.width/2, game.config.height/2 + 100, "playButton");
            _this.playButton.setScale(0.3);
            _this.playButton.setInteractive();

            _this.playButton.on("pointerover", function (pointer) {
                _this.playButton.play("playButtonOver");
            });

            _this.playButton.on("pointerout", function (pointer) {
                _this.playButton.play("playButtonOut");
            });

            _this.playButton.on("pointerdown", function (pointer) {
                Game.changeSceneRequest(socket, 2);
            });
        }
        else { // This will be changed.
            // _this.scene.start("playGame");
            _this.add.text(game.config.width/2 - 140, game.config.height/2 + 70, "Wait for admin to start the game....");
        }

        _this.joinedX = game.config.width / 2;
        _this.joinedY = game.config.height / 2 + 130;

        /*******************************
            WEBSOCKET CONNECTION
         *******************************/


        // Fetching Endpoint
        let loc = window.location;
        let wsStart = 'ws://';
        if(loc.protocol === 'https:') {
            // To make it Production Ready
            wsStart = 'wss://'
        }
        let endpoint = wsStart + loc.host + loc.pathname;
        // Making WebSocket Object
        // let socket = new ReconnectingWebSocket(endpoint);
        socket = new WebSocket(endpoint);

        const my_peer = new Peer(undefined, { // making available a Peer Object from peerjs library to work on the root path
            host: '/',
            port: '8001'
            // host: 'pirateksh-e2ac36bc.localhost.run',
            // port: ''
        });

        const get_my_peer_id = new Promise(resolve => {
            my_peer.on('open', (uid) => {
                    resolve({"unique_peer_id": uid});
            });
        });

        const open_socket = new Promise(resolve => {
            socket.addEventListener("open", (e) => {
                resolve({"open_socket_state": socket.readyState});
            });
        });

        Promise.all([get_my_peer_id, open_socket]).then(result => {
             console.log("open");
             MY_UNIQUE_PEER_ID = result[0].unique_peer_id;
             let data = {
                 "status": "user_new",
                 "message": "New user entered the room.",
                 "data": {
                     "new_user_username" : me,
                     "unique_peer_id": result[0].unique_peer_id,
                     "game_room_unique_id": gameRoomUniqueId
                 }
             };
             let response = {"type": "user.new", "text": data};
             socket.send(JSON.stringify(response));
             STREAM
                 .then(stream => {
                    addVideoStream(Video, stream, me);
                 })
                 .catch((err) =>{
                     console.log("Error Occurred While Strating the Stream:", err);
                 })
        });

        let VideoGrid = document.getElementById('VideoGrid');
        let Video = document.createElement('video'); // This video Element will contain users own video

        _this.videoX = 100;
        _this.videoY = 100;
        _this.videoGroup = _this.physics.add.group();
        function addVideoStream(Video, stream, label="Some user in Room") {
            let vidElem = _this.add.video(_this.videoX, _this.videoY);
            _this.videoY += 130;
            vidElem.depth = 10;
            vidElem.loadURL("", 'loadeddata', true);
            vidElem.video.srcObject = stream;
            vidElem.setScale(0.28);
            vidElem.video.addEventListener('loadedmetadata', () => {
                vidElem.video.play();
                // _this.tweens.add({
                //     targets: vidElem,
                //     x: game.config.width,
                //     y: game.config.height,
                //     duration: 2000,
                //     yoyo: true,
                //     callbackScope: _this
                // });
            });
            // let NewVideoCont = document.createElement('div');
            // NewVideoCont.style.display = "inline-block";
            // NewVideoCont.style.boxSizing = "border-box";
            // NewVideoCont.style.width = "100px";
            // let NewVideoLabel = document.createElement('p');
            // NewVideoLabel.innerHTML = label;
            // VideoGrid.append(NewVideoCont);
            // NewVideoCont.append(NewVideoLabel);
            // NewVideoCont.id = "div_" + label;
            // NewVideoLabel.id = label;
            // Video.id = "vid_" + label;
            // NewVideoCont.append(Video);
            if(label === me){
                vidElem.video.muted = true;
            }
        }

        function connectToNewUser(other_unique_peer_id, var_new_user_username){
            if(MY_UNIQUE_PEER_ID === other_unique_peer_id){
                return ;
            }
            STREAM
                .then(stream => {
                    setTimeout(()=>{
                        const call = my_peer.call(other_unique_peer_id, stream, {metadata: {"username": me}}); // Calling the Newly Connected peer
                        const Video = document.createElement('video');
                        call.on('stream', remoteStream => { // adding the others video element to video-grid on our page.
                            if(peers[var_new_user_username] !== undefined){
                                console.log("Second Call");
                            }
                            else{
                                addVideoStream(Video, remoteStream, var_new_user_username);
                                peers[var_new_user_username] = call;
                            }
                        });
                        call.on('close', () => {
                            Video.remove();
                        });
                    }, 2000);
                })
                .catch((err)=>{
                    console.log("Error Occured While Strating the Stream:", err);
                });
        }

        STREAM
            .then((stream) => {
                my_peer.on('call', (call) => { // Someone is Calling me
                    let caller = call.metadata.username;
                    call.answer(stream); // Answer the call with an A/V stream.
                    const othersVideo = document.createElement('video');
                    call.on('stream', (remoteStream) => {
                         if(peers[caller] !== undefined){ // Already Answered Once
                         }
                         else{
                             peers[caller] = call;
                             addVideoStream(othersVideo, remoteStream, caller);
                         }
                     });
                });
            })
            .catch((err) => {
                console.log("Error Occurred While Strating the Stream:", err);
            });

        socket.addEventListener("message", function (e) {
            let backendResponse = JSON.parse(e.data);
            let status = backendResponse.status;
            let message = backendResponse.message;
            let data = backendResponse.data;
            let gameData;

            if(backendResponse.gameData) {
                gameData = JSON.parse(backendResponse.gameData);
                if(currentGame == null) {
                    currentGame = new Game(gameData);
                    console.log("Connected Players", currentGame.players);
                    for(let i = 0; i < currentGame.players.length; ++i) {
                        let player = currentGame.players[i];
                        if(i % 2) {
                            _this.add.text(_this.joinedX + 120, _this.joinedY, player, {fill: '#00ff00'});
                            _this.joinedY += 20;
                        }
                        else {
                            _this.add.text(_this.joinedX - 200, _this.joinedY, player, {fill: '#00ff00'});
                        }
                    }
                }
             }

            if(status === "user_new") {
                let unique_peer_id = data.unique_peer_id;
                let game_room_unique_id = data.game_room_unique_id;
                let new_user_username = data.new_user_username;
                console.log("New User connected: ", new_user_username);
                connectToNewUser(unique_peer_id, new_user_username);
                // currentGame.connectPlayer(new_user_username);
                if(!currentGame.players.includes(new_user_username)) {
                    currentGame.players.push(new_user_username);
                    let playerCount = currentGame.players.length - 1;
                    if(playerCount % 2) {
                        _this.add.text(_this.joinedX + 120, _this.joinedY, new_user_username, {fill: '#00ff00'});
                        _this.joinedY += 20;
                    }
                    else {
                        _this.add.text(_this.joinedX - 200, _this.joinedY, new_user_username, {fill: '#00ff00'});
                    }
                }
            }
            else if(status === "user_left_room"){
                let left_user_username = data.left_user_username;
                if (peers[left_user_username]){
                    peers[left_user_username].close();
                    delete peers[left_user_username];
                     if(document.getElementById("div_" + left_user_username)){
                        document.getElementById("div_" + left_user_username).remove();
                     }
                     if(document.getElementById("vid_" + left_user_username)){
                        document.getElementById("vid_" + left_user_username).remove();
                     }
                } else{
                    console.log("Tha hi nhi");
                }
                if(document.getElementById(left_user_username)){
                    document.getElementById(left_user_username).remove();
                }
            }
            else if(status === "broadcast_notification") {
                // let elementToAppend = `<li>${message}</li>`;
                // notificationList.append(elementToAppend);
            }
            else if(status === "change_scene") {
                let sceneNumber = data.sceneNumber;
                if(sceneNumber === 2) {
                    _this.scene.start("playGame");
                    if(me === gameRoomAdmin) {
                        Game.startGameRequest(socket);
                    }
                }
            }
        });

        socket.onerror = function (e) {
            console.log("error");
        };

        socket.onclose = function (e) {
            console.log("close");
        };

        /*******************************
            WEBSOCKET CONNECTION ENDED
         *******************************/



        this.anims.create({
			key: "yourTurnAnim", // Name of animation
			frames: this.anims.generateFrameNumbers("turnIndicator"), // Using frames from "yourTurn" spritesheet
			frameRate: 50, // play at 20 frames per second
			repeat: -1 // For infinite loop (repeat) we user -1
		});

        this.anims.create({
            key: "noButtonOut",
            frames: this.anims.generateFrameNumbers("noButton", {
                start: 0,
                end: 0
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "noButtonOver",
            frames: this.anims.generateFrameNumbers("noButton", {
                start: 1,
                end: 1
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "yesButtonOut",
            frames: this.anims.generateFrameNumbers("yesButton", {
                start: 0,
                end: 0
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "yesButtonOver",
            frames: this.anims.generateFrameNumbers("yesButton", {
                start: 1,
                end: 1
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "unoButtonOut",
            frames: this.anims.generateFrameNumbers("unoButton", {
                start: 0,
                end: 0
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "unoButtonOver",
            frames: this.anims.generateFrameNumbers("unoButton", {
                start: 1,
                end: 1
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "challengeButtonOut",
            frames: this.anims.generateFrameNumbers("challengeButton", {
                start: 0,
                end: 0
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "challengeButtonOver",
            frames: this.anims.generateFrameNumbers("challengeButton", {
                start: 1,
                end: 1
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "crossButtonOut",
            frames: this.anims.generateFrameNumbers("crossButton", {
                start: 0,
                end: 0
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "crossButtonOver",
            frames: this.anims.generateFrameNumbers("crossButton", {
                start: 1,
                end: 1
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "exitButtonOut",
            frames: this.anims.generateFrameNumbers("exitButton", {
                start: 0,
                end: 0
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "exitButtonOver",
            frames: this.anims.generateFrameNumbers("exitButton", {
                start: 1,
                end: 1
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "playButtonOut",
            frames: this.anims.generateFrameNumbers("playButton", {
                start: 0,
                end: 0
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "playButtonOver",
            frames: this.anims.generateFrameNumbers("playButton", {
                start: 1,
                end: 1
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "chooseBlueButtonOut",
            frames: this.anims.generateFrameNumbers("chooseBlueButton", {
                start: 0,
                end: 0
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "chooseBlueButtonOver",
            frames: this.anims.generateFrameNumbers("chooseBlueButton", {
                start: 1,
                end: 1
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "chooseYellowButtonOut",
            frames: this.anims.generateFrameNumbers("chooseYellowButton", {
                start: 0,
                end: 0
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "chooseYellowButtonOver",
            frames: this.anims.generateFrameNumbers("chooseYellowButton", {
                start: 1,
                end: 1
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "chooseGreenButtonOut",
            frames: this.anims.generateFrameNumbers("chooseGreenButton", {
                start: 0,
                end: 0
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "chooseGreenButtonOver",
            frames: this.anims.generateFrameNumbers("chooseGreenButton", {
                start: 1,
                end: 1
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "chooseRedButtonOut",
            frames: this.anims.generateFrameNumbers("chooseRedButton", {
                start: 0,
                end: 0
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "chooseRedButtonOver",
            frames: this.anims.generateFrameNumbers("chooseRedButton", {
                start: 1,
                end: 1
            }),
            frameRate: 20,
            repeat: 0
        });
    }
}