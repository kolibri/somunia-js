import Action from './Action.js'
import Cooldown from './Cooldown.js'

export default class Defense extends Action {
    followedBy() {
        return new Cooldown(this.battler, 0, this.endRound())
    }
}
