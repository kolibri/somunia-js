var KEYCODE_ENTER = 13;     //useful keycode
var KEYCODE_SPACE = 32;     //useful keycode
var KEYCODE_UP = 38;        //useful keycode
var KEYCODE_DOWN = 40;        //useful keycode
var KEYCODE_LEFT = 37;      //useful keycode
var KEYCODE_RIGHT = 39;     //useful keycode

var stage, w, h, loader;
var player, npc;

document.onkeydown = handleKeyDown;

function init() {
//        examples.showDistractor();
    stage = new createjs.Stage("testCanvas");
    // grab canvas width and height for later calculations:
    w = stage.canvas.width;
    h = stage.canvas.height;
    manifest = [{src: "functional-sprite.png", id: "spriteSheet"}];
    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest, true, "img/");
}
function handleComplete() {
//       examples.hideDistractor();
    var spriteSheet = new createjs.SpriteSheet({
            framerate: 30,
            "images": [loader.getResult("spriteSheet")],
            "frames": {"regX": 0, "height": 50, "count": 9, "regY": 0, "width": 50},
            "animations": {
                "stand": 0,
                "run": [3, 4],
                "ground": 8,
                "npc": 7
            }
        });
    player = new createjs.Sprite(spriteSheet, "stand");
    player.x = 25 + 50 * 10;
    player.y = 25 + 50 * 5;
    stage.addChild(player);

    npc = new createjs.Sprite(spriteSheet, "npc");
    npc.x = 25 + 50 * 2;
    npc.y = 25 + 50 * 2;
    stage.addChild(npc);

    
//        stage.addEventListener("stagemousedown", handleJumpStart);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);
}
/*    function handleJumpStart() {
    player.gotoAndPlay("jump");
}
*/
function tick(event) {
//var deltaS = event.delta / 1000;
//var position = player.x + 150 * deltaS;
//var playerW = player.getBounds().width * player.scaleX;
//player.x = (position >= w + playerW) ? -playerW : position;
//ground.x = (ground.x - deltaS * 150) % ground.tileW;
    stage.update(event);
}

function handleKeyDown(e) {
    //cross browser issues exist
    if (!e) {
        var e = window.event;
    }
    //console.log(e.keyCode);
    /*
    switch (e.keyCode) {
        case KEYCODE_LEFT:

            lfHeld = true;
            return false;
        case KEYCODE_RIGHT:
            rtHeld = true;
            return false;
        case KEYCODE_UP:
            fwdHeld = true;
            return false;
        case KEYCODE_DOWN:
            fwdHeld = true;
            return false;
        case KEYCODE_ENTER:
            if (canvas.onclick == handleClick) {
                handleClick();
            }
            return false;
    }*/
}
/*
    Stage
        - Layer[]
        - draw(event)
    Event
        GoXEvent
        InterActAvent
        DialogEvent
        PauseStartEvent
        PauseEndEvent
        (MenuEvent)
        (HelpEvent)
    Layer
        - draw(event)
    Controllers:
        GoX
        Interact
        PauseStart
        PauseEnd
        Help
        Menu

    update(){
        MapLayer
            - tiles
            -> draw(event)
        PlayerLayer
            - spriteSheet
            -> draw(event)
    }

    keyDown(){
        case KEY_ARROW_X:
            game.update(Gox)
        case KEY_ENTER:
            game.update(Interact)
        case KEY_P:
            game.update(PauseStart);
        case KEY_O:
            game.update(PauseEnd);
        case KEY_H:
            game.update(Help);
        case KEY_M;
            stage.draw(Menu);
    }

    State {
        handle(controller)
        render()
    }

    PauseState {
        handle(controller) {
            if (controller != pauseEndController) {
                game.leaveState()
            }
        }
        render() { renderPauseStage }
    }

    MapStandState {
        handle(controller) {
            if (controller == InterController) {
                // handle, if something to interact
                //stage.draw(InterActEvent)
            }
            if (controller == GoX) {
                game.gotoState(MapWalkingState)
            }
            if (controller == Menu) {
                game.gotoState(MenuState)
            }
            if (controller == Help) {
                game.gotoState(HelpState)
            }
        }

        render() { renderMapStage }
    }

    MapWalkingState {
        handle(controller) {
        }
        render() { 
            renderMapStage
            // when animation is finished
            game.leaveState()
         }
    }

    MapDialogState {
        handle(controller) {
            if (controller == Dialog) {
                //handle dialog. at last
            game.leaveState()
            }
        }
        render() { renderMapDialogStage }
    }



    Game {
        - stateStack
        - addState(state) {
            stateStack[] = state
        }
        - leaveState() {
            array_pop(stateStack)
        }

        - update(controller) {
            stateStack[stateStack.length -1].handle(controller);
        }
        - stateStack[stateStack.length -1].render()
        
        - Map
        - state: [mapStand, mapWalking, mapDialog, pause]
        - 
    }
*/



/*

    function init() {
        // get a reference to the canvas we'll be working with:
        var canvas = document.getElementById("testCanvas");
        // create a stage object to work with the canvas. This is the top level node in the display list:
        var stage = new createjs.Stage(canvas);
        // Create a new Text object:
        var text = new createjs.Text("Hello World!", "36px Arial", "#777");
        text.textAlign = "center";
        // add the text as a child of the stage. This means it will be drawn any time the stage is updated
        // and that its transformations will be relative to the stage coordinates:
        stage.addChild(text);
        // position the text on screen, relative to the stage coordinates:
        text.x = canvas.width / 2;
        text.y = 180;
        // call update on the stage to make it render the current display list to the canvas:
        stage.update();
    }*/
/*
function init() {
    var stage = new createjs.Stage("demoCanvas");
    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);
    stage.update();
}
*/
