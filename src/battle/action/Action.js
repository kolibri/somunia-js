import SelectAction from './SelectAction.js'

export default class Action {
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
