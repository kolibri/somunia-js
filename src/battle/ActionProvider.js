export default class ActionProvider {
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
            if (provider.supports(battler)) {
                return provider.waitingFor(battler)
            }
        }

        return false
    }
}
