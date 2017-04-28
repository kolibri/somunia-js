import Attack from './action/Attack.js'

export default class AutoActionProvider {
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

