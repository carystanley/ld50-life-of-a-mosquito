const HEAD_Y = 57;
const BODY_Y = 77;

class Guy {
    constructor (scene, x) {
        this.headSprite = scene.add.sprite(x, HEAD_Y, 'guyHead')
        this.bodySprite = scene.add.sprite(x, BODY_Y, 'guyBody')
    }

    update (time, delta) {

    }
}

export default Guy;
