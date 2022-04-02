const HEAD_Y = 57;
const BODY_Y = 77;

const SPRAYCAN_Y = 73;
const SPRAYCAN_X_OFFEST = 16;

const SPRAY_Y = 64;
const SPRAY_X_OFFEST = 42;

const SPRAYUP_Y = 46;
const SPRAYUP_X_OFFEST = 30;

const WORLD_BOUNDS_MARGIN = 30;

class Guy {
    constructor (scene, x, direction = 1, level = 1) {
        this.scene = scene;
        this.level = level;
        this.speed = 10;
        this.direction = direction;
        this.angry = false;
        this.blind = false;
        this.aimUp = false;
        this.spraying = false;

        this.headSprite = scene.physics.add.sprite(x, HEAD_Y, 'guyHead');
        this.headSprite.setDrag(10, 10)
            .setSize(28, 30)
            .setOffset(6, 4);

        this.bodySprite = scene.physics.add.sprite(x, BODY_Y, 'guyBody');
        this.bodySprite.play('guyBody-run');

        this.bugSprayImage = scene.add.image(0, SPRAYCAN_Y, 'bugspray');

        this.sprayImage = scene.add.image(0, SPRAY_Y, 'spray');
        this.sprayImage.visible = false;
        this.sprayUpImage = scene.add.image(0, SPRAYUP_Y, 'spray');
        this.sprayUpImage.visible = false;

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
        this.bugSprayImage.x = this.bodySprite.x + (SPRAYCAN_X_OFFEST * this.direction);
        this.sprayImage.x = this.bodySprite.x + (SPRAY_X_OFFEST * this.direction);
        this.sprayUpImage.x = this.bodySprite.x + (SPRAYUP_X_OFFEST * this.direction);
    }

    levelUp() {
        this.level++;
        this.speed = 5 * this.level;
        this.updateSprite();
    }

    think() {
        this.aimUp = Phaser.Math.Between(0, 1) === 0;
        this.spraying = Phaser.Math.Between(0, 1) === 0;
        this.updateSprite();
    }

    updateSprite() {
        const { aimUp, spraying } = this;
        this.bodySprite.setVelocityX(this.speed * this.direction);
        const flip = this.direction !== 1;
        this.bodySprite.setFlipX(flip);
        this.headSprite.setFlipX(flip);
        this.bugSprayImage.setFlipX(flip);
        this.sprayImage.setFlipX(flip);
        this.sprayUpImage.rotation = -3.14/4 * this.direction;
        this.sprayUpImage.setFlipX(flip);

        this.sprayImage.visible = !aimUp && spraying;
        this.sprayUpImage.visible = aimUp && spraying;
        this.bugSprayImage.setFrame(aimUp ? 1 : 0);

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
