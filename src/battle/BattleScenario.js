import ActionProvider from './ActionProvider.js'
import AutoActionProvider from './AutoActionProvider.js'
import SelectActionProvider from './SelectActionProvider.js'
import StateHandler from './StateHandler.js'
import StateHandler from './StateHandler.js'
import InputHandler from './InputHandler.js'

export default class BattleScenario {
    constructor(battlersManager) {
        this.battlersManager = battlersManager
        //this.stateHandler = stateHandler

        let actionProvider = new ActionProvider([
            new AutoActionProvider(battlersManager),
            new SelectActionProvider()
        ])

        this.stateHandler = new StateHandler(actionProvider)
        this.inputHandler = new InputHandler()
        let a = 0
    }

    tick(input) {
        if (this.stateHandler.isWaiting(this.battlersManager.next())) {
            this.inputHandler.handle(input, this.battlersManager.next())
        } else {
            this.stateHandler.handleEvent(this.battlersManager.next(), input)
        }

    }
}
