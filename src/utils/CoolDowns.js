import CoolDown from './CoolDown';

export default class CoolDowns {
    constructor() {
        this.coolDowns = {};
    }

    update(delta) {
        for (let key in this.coolDowns) {
            const cd = this.coolDowns[key];
            cd.update(delta);
            if (cd.isComplete()) {
                delete this.coolDowns[key];
            }
        }
    }

    set(key, t) {
        const cd = this.coolDowns[key];
        if (cd) {
            cd.set(t);
        } else {
            this.coolDowns[key] = new CoolDown(t);
        }
    }

    has(key) {
        return !!this.coolDowns[key];
    }

    unset(key) {
        delete this.coolDowns[key];
    }

    hasSet(key, t) {
        const has = this.has(key);
        this.set(key, t)
        return has;
    }
}
