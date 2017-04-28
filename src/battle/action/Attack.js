import Action from './Action.js'
import Cooldown from './Cooldown.js'

export default class Attack extends Action {
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
