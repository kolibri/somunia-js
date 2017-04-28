import SelectAction from './action/SelectAction.js'

export default class SelectActionProvider {
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
