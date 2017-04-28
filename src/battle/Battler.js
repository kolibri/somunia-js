import Cooldown from './action/Cooldown.js'

export default class Battler {
    constructor(name, maxhp, currenthp, isPlayer = true) {
        this.name = name
        this.maxhp = maxhp
        this.currenthp = currenthp
        this.state = new Cooldown(this, 2)
        this.isPlayer = isPlayer
    }
}
