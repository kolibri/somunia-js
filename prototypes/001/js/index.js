"use strict";

function init() {
    console.log('Start')

    var battlersManager = new BattlersManager([
        new Battler('foo', 100, 75),
        new Battler('bar', 90, 55, false)
    ])


    var battle = new BattleScenario(battlersManager)

    for (let i = 0; i < 10; i++) {
        console.log(`\nFrame: ${i}`)



        battle.tick()
        battle.render()
    }

    console.log('End')
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
        let a = 0
    }

    tick(input) {
        console.log('tick')
        console.log(this.battlersManager.next().name)

        if (this.stateHandler.isWaiting(this.battlersManager.next())) {
            //this.inputHandler.handle(input, this.battlersManager.next())
        }

        this.stateHandler.handleEvent(this.battlersManager.next())
    }

    render(input) {
        console.log("IsWaiting in render: " + this.stateHandler.isWaiting(this.battlersManager.next()))
        let battleElement = document.querySelector('#battle')
        battleElement.innerHTML = ''
        battleElement.appendChild(document.createTextNode(
            `Battlers: \n` +
            this.battlersManager
                .battlers
                .filter(battler => battler.isPlayer == true)
                .map(function(battler){
                    return `${ battler.name }: ${ battler.currenthp }/${ battler.maxhp }\n`
                })
                .join("") + 

            `\nEncounters: \n` +
            this.battlersManager
                .battlers
                .filter(battler => battler.isPlayer != true)
                .map(function(battler){
                    return `${ battler.name }: ${ battler.currenthp }/${ battler.maxhp }\n`
                })
                .join("") + 
            (
                this.stateHandler.isWaiting(this.battlersManager.next()) ? 
                [
                    'Choose action: \n',
                    '(A)ttack\n',
                    '(D)efense\n'
                ].join("\n") : ''
            )
        ))
    }
}

class Input {}
class ActionAttackInput {
    constructor(target) {
        this.target = target
    }
}
class ActionDefenseInput {}

class InputHandler {
    handle(input, battler) {
        if (input instanceof ActionAttackInput) {
            battler.state = new Attack(2, input.target)
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
        this.state = new Cooldown(2)
        this.isPlayer = isPlayer
    }
}


class Action {
    constructor(delay=1) {
        this.countdown = delay
    }

    followedBy() {
        return false
    }

    event(battler) {
        console.log(`Action event from ${ battler.name }`)
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

    event(battler) {
        console.log(`Attack event from ${ battler.name } on ${ this.target.name }`)
    }
}

class Defense extends Action {
    followedBy() {
        return new Cooldown(0)
    }
}


class StateHandler {
    constructor(actionProvider) {
        this.actionProvider = actionProvider
    }

    handleEvent(battler, input) {
        battler.state.event(battler)

        if (battler.state.followedBy()) {
            battler.state = battler.state.followedBy()
            return
        }

        battler.state = this.actionProvider.provideFor(battler);
    }

    isWaiting(battler) {
        this.actionProvider.waitingFor(battler)
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
            if (provider.waitingFor(battler)) {
                return true
            }

            return false
        }
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
        return new Attack(2, enemies[Math.floor(Math.random() * enemies.length)])
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
        console.log(`Select Action for ${ battler.name }`)
        console.log('Attack')
        console.log('Defense')
    }

    waitingFor(battler) {
        return !(0 < battler.state.countdown)
    }
}

class BattlersManager {
    constructor(battlers) {
        this.battlers = battlers
    }

    next() {
        return this.battlers.reduce(function(acc, val) {
            return acc.state.countdown < val.state.countdown ? acc : val
        })
    }

    enemiesOf(referenceBattler) {
        return this.battlers.filter(battler => battler.isPlayer != referenceBattler.isPlayer)
    }
    friendsOf(referenceBattler) {
        return this.battlers.filter(battler => battler.isPlayer == referenceBattler.isPlayer)
    }
}
