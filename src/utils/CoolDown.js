export default class CoolDown {
    constructor(t) {
        this.timeReamining = t;
    }

    update(deltaTime) {
        this.timeReamining -= deltaTime;
    }

    set(t) {
        this.timeReamining = t;
    }

    isComplete() {
        return this.timeReamining <= 0;
    }

    getTimeRemaining() {
        return this.timeReamining;
    }
}
