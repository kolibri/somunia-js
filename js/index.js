"use strict";

function init() {
    console.log('Start')

    var battle = new BattleScenario(new BattlersManager([
        new Battler('foo', 100, 75),
        new Battler('bar', 90, 55, false)
        ]))

    for (let i = 0; i < 10; i++) {
        console.log(`\nFrame: ${i}`)

        battle.tick()
    }

    console.log('End')
}

class BattleScenario {
    constructor(battlersManager) {
        this.battlersManager = battlersManager
        this.stateHandler = new StateHandler(battlersManager)
    }

    tick() {
        for (let battler of this.battlersManager.battlers) {
            console.log('tick')
            console.log(battler)

            this.stateHandler.handle(battler)
        }
    }
}

class Battler {
    constructor(name, maxhp, currenthp, isPlayer=true) {
        this.name = name
        this.maxhp = maxhp
        this.currenthp = currenthp
        this.state = new Cooldown(2)
        this.isPlayer = true
    }
}


class Action {
    constructor(delay) {
        this.countdown = delay
    }

    followedBy() {
        return false
    }
}

class Cooldown extends Action {}

class Attack extends Action {
    constructor(delay, target) {
        super(delay)
        this.target = target
    }

    followedBy() {
        return new Cooldown(1)
    }
}

class Defense extends Action {
    followedBy() {
        return new Cooldown(1)
    }
}


class StateHandler {
    constructor(battlersManager) {
        this.battlersManager = battlersManager
    }

    handle(battler) {
        let a=0
        battler.state.countdown = battler.state.countdown - 1
        if (0 < battler.state.countdown) {
            return
        }

        if (battler.state.followedBy()) {
            battler.state = battler.state.followedBy()
            return 
        }


        let enemies = this.battlersManager.enemiesOf(battler)
        battler.state = new Attack(2, enemies[Math.floor(Math.random()*enemies.length)])
    }
}


class BattlersManager {
    constructor(battlers) {
        this.battlers = battlers
    }

    enemiesOf(referanceBattler) { return this.battlers.filter(battler => battler.isPlayer != referanceBattler) }
    friendsOf(referanceBattler) { return this.battlers.filter(battler => battler.isPlayer == referanceBattler) }
}
