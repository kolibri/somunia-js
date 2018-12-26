import ActionAttackInput from '../battle/input/ActionAttackInput.js'

export default class Renderer {
    constructor(inputListener) {
        this.inputListener = inputListener
    }

    render(battle) {
        let battleElement = document.querySelector('#battle')
        battleElement.innerHTML = ''
        this.renderInfo(battle, battleElement)
        this.renderUi(battle, battleElement)
    }

    renderInfo(battle, battleElement) {
        battleElement.appendChild(document.createTextNode(
            `Battlers: \n` +
            battle.battlersManager
                .battlers
                .filter(battler => battler.isPlayer == true)
                .map(function(battler){
                    return `${ battler.name }: ${ battler.currenthp }/${ battler.maxhp }\n`
                })
                .join("") + 

            `\nEncounters: \n` +
            battle.battlersManager
                .battlers
                .filter(battler => battler.isPlayer != true)
                .map(function(battler){
                    return `${ battler.name }: ${ battler.currenthp }/${ battler.maxhp }\n`
                })
        ))
    }

    renderUi(battle, battleElement) {
        if (battle.stateHandler.isWaiting(battle.battlersManager.next())) {
            battleElement.appendChild(document.createTextNode(
                [
                    '##' + battle.battlersManager.next().name + '\n',
                    'Choose action: \n',
                    '(A)ttack\n',
                    '(D)efense\n'
                ].join("\n")
            ))

            let attackButtons = []
            for(let battler of battle.battlersManager.battlers) {
                let inputListener = this.inputListener
                let button = document.createElement('button')
                button.appendChild(document.createTextNode(battler.name))
                button.addEventListener('click', function(){
                    console.log('click')
                    let a=0
                    inputListener.setInput(new ActionAttackInput(battler))
                })
                battleElement.appendChild(button)
            }
        }

    }
}
