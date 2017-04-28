"use strict";

import Renderer from './view/Renderer.js'
import Battler from './battle/Battler.js'
import InputListener from './battle/InputListener.js'
import BattlersManager from './battle/BattlersManager.js'
import BattleScenario from './battle/BattleScenario.js'


var domReady = function(callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};

domReady(function(){
    console.log('Start')

    var inputListener = new InputListener()
    var battlersManager = new BattlersManager([
        new Battler('player', 100, 75),
        new Battler('dragon', 90, 55, false)
    ])


    var battle = new BattleScenario(battlersManager)
    var renderer = new Renderer(inputListener)

    setInterval(onTimerTick, 500); // 33 milliseconds = ~ 30 frames per sec

    function onTimerTick() {
        let input = inputListener.getInput(); //new NullInput()

        battle.tick(input)
        renderer.render(battle)
    }

    console.log('End')
})
