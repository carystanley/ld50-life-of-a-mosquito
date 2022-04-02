const HEAD_Y = 57;
const BODY_Y = 77;
const SPRAY_Y = 73;
const SPRAY_X_OFFEST = 16;

const WORLD_BOUNDS_MARGIN = 30;

class Guy {
    constructor (scene, x, direction = 1, level = 1) {
        this.scene = scene;
        this.level = level;
        this.speed = 10;
        this.direction = direction;
        this.angry = false;
        this.blind = false;

        this.headSprite = scene.physics.add.sprite(x, HEAD_Y, 'guyHead');
        this.headSprite.setDrag(10, 10)
            .setSize(28, 30)
            .setOffset(6, 4);

        this.bodySprite = scene.physics.add.sprite(x, BODY_Y, 'guyBody');
        this.bodySprite.play('guyBody-run');

        this.bugSprayImage = this.scene.add.image(0, SPRAY_Y, 'bugspray');

        this.updateSprite();
        this.updateThinking(1500);
    }

    update () {
        const { width: gameWidth } = this.scene.game.config;
        /* Handle Bounds */
        if (this.bodySprite.x > gameWidth - WORLD_BOUNDS_MARGIN) {
            this.direction = -1;
            this.updateSprite();
        } else if (this.bodySprite.x < WORLD_BOUNDS_MARGIN) {
            this.direction = 1;
            this.updateSprite();
        }

        /* Keep Head on */
        this.headSprite.x = this.bodySprite.x;
        this.bugSprayImage.x = this.bodySprite.x + (SPRAY_X_OFFEST * this.direction);
    }

    levelUp() {
        this.level++;
        this.speed = 5 * this.level;
        this.updateSprite();
    }

    think() {

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

    getHead() {
        return this.headSprite;
    }
}

export default Guy;
