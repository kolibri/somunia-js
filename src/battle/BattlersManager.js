export default class BattlersManager {
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
