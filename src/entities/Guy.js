const HEAD_Y = 57;
const BODY_Y = 77;

class Guy {
    constructor (scene, x, direction = 1) {
        this.speed = 100;
        this.direction = direction;

        this.headSprite = scene.physics.add.sprite(x, HEAD_Y, 'guyHead');

        this.bodySprite = scene.physics.add.sprite(x, BODY_Y, 'guyBody');
        this.bodySprite.play('guyBody-run');
        this.updateSprite();
    }

    update () {
        /* Handle Bounds */
        if (this.bodySprite.x > 340) {
            this.direction = -1;
            this.updateSprite();
        } else if (this.bodySprite.x < 20) {
            this.direction = 1;
            this.updateSprite();
        }

        /* Keep Head on */
        this.headSprite.x = this.bodySprite.x;
    }

    updateSprite() {
        this.bodySprite.setVelocityX(this.speed * this.direction);
        const flip = this.direction !== 1;
        this.bodySprite.setFlipX(flip);
        this.headSprite.setFlipX(flip);
    }
}

export default Guy;
