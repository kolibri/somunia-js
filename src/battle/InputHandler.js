import ActionAttackInput from './input/ActionAttackInput.js'
import ActionDefenseInput from './input/ActionDefenseInput.js'
import Attack from './action/Attack.js'
import Defense from './action/Defense.js'

export default class InputHandler {
    handle(input, battler) {
        if (input instanceof ActionAttackInput) {
            battler.state = new Attack(battler, 2, battler.state.endRound(), input.target)
        } else if (input instanceof ActionDefenseInput) {
            battler.state = new Defense()
        }
    }
}
