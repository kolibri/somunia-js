import NullInput from './input/NullInput.js'

export default class InputListener {
    constructor() {
        this.input = new NullInput()
    }

    setInput(input) {
        this.input = input
    }

    getInput() {
        let input = this.input;
        this.input = new NullInput()

        return input
    }
}
