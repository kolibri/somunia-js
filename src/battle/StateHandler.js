export default class StateHandler {
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
