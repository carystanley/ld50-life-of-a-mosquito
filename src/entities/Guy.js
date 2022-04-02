const HEAD_Y = 57;
const BODY_Y = 77;

class Guy {
    constructor (scene, x, direction = 1) {
        this.scene = scene;
        this.speed = 10;
        this.direction = direction;
        this.angry = false;
        this.blind = false;

        this.headSprite = scene.physics.add.sprite(x, HEAD_Y, 'guyHead');

        this.bodySprite = scene.physics.add.sprite(x, BODY_Y, 'guyBody');
        this.bodySprite.play('guyBody-run');
        this.updateSprite();
        this.updateThinking(1500);
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

    think () {

    }

    updateSprite() {
        this.bodySprite.setVelocityX(this.speed * this.direction);
        const flip = this.direction !== 1;
        this.bodySprite.setFlipX(flip);
        this.headSprite.setFlipX(flip);
    }

    updateThinking(delay) {
        const timerConfig = {
            delay,
            callback: this.think,
            callbackScope: this,
            loop: true
        };

        if (this.thinkTimer) {
            this.thinkTimer.reset(timerConfig);
        } else {
            this.thinkTimer = this.scene.time.addEvent(timerConfig);
        }
    }
}

export default Guy;
