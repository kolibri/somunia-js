"use strict";

function init() {
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
}

class InputListener {
    constructor() {
        this.input = new NullInput()
    }

    setInput(input) {
        this.input = input
    }

    getInput() {
        let input = this.input;
        this.input = new NullInput()

        return input
    }
}

class Renderer {
    constructor(inputListener) {
        this.inputListener = inputListener
    }

    render(battle) {
        let battleElement = document.querySelector('#battle')
        battleElement.innerHTML = ''
        battleElement.appendChild(document.createTextNode(
            `Battlers: \n` +
            battle.battlersManager
                .battlers
                .filter(battler => battler.isPlayer == true)
                .map(function(battler){
                    return `${ battler.name }: ${ battler.currenthp }/${ battler.maxhp }\n`
                })
                .join("") + 

            `\nEncounters: \n` +
            battle.battlersManager
                .battlers
                .filter(battler => battler.isPlayer != true)
                .map(function(battler){
                    return `${ battler.name }: ${ battler.currenthp }/${ battler.maxhp }\n`
                })
                .join("") + 
            (
                battle.stateHandler.isWaiting(battle.battlersManager.next()) ? 
                [
                    '##' + battle.battlersManager.next().name + '\n',
                    'Choose action: \n',
                    '(A)ttack\n',
                    '(D)efense\n'
                ].join("\n") : ''
            )
        ))


        if (battle.stateHandler.isWaiting(battle.battlersManager.next())) {

            let attackButtons = []
            for(let battler of battle.battlersManager.battlers) {
                let inputListener = this.inputListener
                let button = document.createElement('button')
                button.appendChild(document.createTextNode(battler.name))
                button.addEventListener('click', function(){
                    console.log('click')
                    let a=0
                    inputListener.setInput(new ActionAttackInput(battler))
                })
                battleElement.appendChild(button)
            }
        }

    }
}

class BattleScenario {
    constructor(battlersManager) {
        this.battlersManager = battlersManager
        //this.stateHandler = stateHandler

        let actionProvider = new ActionProvider([
            new AutoActionProvider(battlersManager),
            new SelectActionProvider()
        ])

        this.stateHandler = new StateHandler(actionProvider)
        this.inputHandler = new InputHandler()
        let a = 0
    }

    tick(input) {
        if (this.stateHandler.isWaiting(this.battlersManager.next())) {
            this.inputHandler.handle(input, this.battlersManager.next())
        } else {
            this.stateHandler.handleEvent(this.battlersManager.next(), input)
        }

    }
}

class Input {}
class NullInput {}
class ActionAttackInput {
    constructor(target) {
        this.target = target
    }
}
class ActionDefenseInput {}

class InputHandler {
    handle(input, battler) {
        if (input instanceof ActionAttackInput) {
            battler.state = new Attack(battler, 2, battler.state.endRound(), input.target)
        } else if (input instanceof ActionDefenseInput) {
            battler.state = new Defense()
        }
    }
}

class Battler {
    constructor(name, maxhp, currenthp, isPlayer = true) {
        this.name = name
        this.maxhp = maxhp
        this.currenthp = currenthp
        this.state = new Cooldown(this, 2)
        this.isPlayer = isPlayer
    }
}

class SelectAction {
    constructor(battler, round=0) {
        this.battler = battler
        this.round = round
    }

    endRound() {
        return this.round
    }

    followedBy() {
        return false
    }

    event() {}
}
class Action {
    constructor(battler, delay=1, round=0) {
        this.countdown = delay
        this.battler = battler
        this.round = round
    }

    endRound() {
        return this.round + this.countdown
    }

    followedBy() {
        return new SelectAction(this.battler, this.endRound())
    }

    event() {
        console.log(`Action event from ${ this.battler.name }`)
    }
}

class Cooldown extends Action {}

class Attack extends Action {
    constructor(battler, delay, round, target) {
        super(battler, delay, round)
        this.target = target
    }

    followedBy() {
        return new Cooldown(this.battler, 1, this.endRound())
    }

    event() {
        console.log(`Attack event from ${ this.battler.name } on ${ this.target.name }`)
    }
}

class Defense extends Action {
    followedBy() {
        return new Cooldown(this.battler, 0, this.endRound())
    }
}


class StateHandler {
    constructor(actionProvider) {
        this.actionProvider = actionProvider
    }

    handleEvent(battler, input) {
        battler.state.event()

        if (battler.state.followedBy()) {
            battler.state = battler.state.followedBy()
            return
        }

        battler.state = this.actionProvider.provideFor(battler);
    }

    isWaiting(battler) {
        return this.actionProvider.waitingFor(battler)
    }
}



class ActionProvider {
    constructor(providers) {
        this.providers = providers
    }

    provideFor(battler) {
        for (let provider of this.providers) {
            if (provider.supports(battler)) {
                return provider.provideFor(battler)
            }
        }

        console.log("this should never happen")
    }

    waitingFor(battler) {
        for (let provider of this.providers) {
            if (provider.supports(battler)) {
                return provider.waitingFor(battler)
            }
        }

        return false
    }
}

class AutoActionProvider {
    constructor(battlersManager) {
        this.battlersManager = battlersManager
    }

    supports(battler) {
        return !battler.isPlayer
    }

    provideFor(battler) {
        let enemies = this.battlersManager.enemiesOf(battler)

        return new Attack(
            battler, 
            3, 
            battler.state.endRound(), 
            enemies[Math.floor(Math.random() * enemies.length)]
        )
    }

    waitingFor(battler, input) {
        return false
    }
}


class SelectActionProvider {
    constructor() {}

    supports(battler) {
        return battler.isPlayer
    }

    provideFor(battler) {

    }

    waitingFor(battler) {
        return battler.state instanceof SelectAction
    }
}

class BattlersManager {
    constructor(battlers) {
        this.battlers = battlers
    }

    next() {
        let a=0
        return this.battlers.reduce(function(acc, val) {
            /*if (undefined === acc.state) {
                return acc
            }
            if (undefined === val.state) {
                return val
            }*/
            return acc.state.endRound() < val.state.endRound() ? acc : val
        })
    }

    enemiesOf(referenceBattler) {
        return this.battlers.filter(battler => battler.isPlayer != referenceBattler.isPlayer)
    }
    friendsOf(referenceBattler) {
        return this.battlers.filter(battler => battler.isPlayer == referenceBattler.isPlayer)
    }
}
