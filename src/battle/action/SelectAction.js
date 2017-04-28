export default class SelectAction {
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
