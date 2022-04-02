const HEAD_Y = 57;
const BODY_Y = 77;

class Guy {
    constructor (scene, x) {
        this.speed = 10;

        this.headSprite = scene.physics.add.sprite(x, HEAD_Y, 'guyHead');

        this.bodySprite = scene.physics.add.sprite(x, BODY_Y, 'guyBody');
        this.bodySprite.play('guyBody-run');
        this.bodySprite.setVelocityX(this.speed);
    }

    update (time, delta) {
        this.headSprite.x = this.bodySprite.x;
    }
}

export default Guy;
