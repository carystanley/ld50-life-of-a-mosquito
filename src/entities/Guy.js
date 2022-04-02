const HEAD_Y = 57;
const BODY_Y = 77;

const SPRAYCAN_Y = 73;
const SPRAYCAN_X_OFFEST = 16;

const SPRAY_Y = 66;
const SPRAY_X_OFFEST = 20;
const SPRAYUP_Y = 64;
const SPRAYUP_X_OFFEST = 12;


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

        this.sprayParticles = scene.add.particles('sprayParticle');
        this.sprayParticles.createEmitter({
            // frame: 'blue',
            x: 0,
            y: 0,
            lifespan: 150,
            speed: { min: 200, max: 400 },
            angle: { min: -20, max: 20 },
            // gravityY: 300,
            scale: { start: 0.6, end: 0.3 },
            quantity: 1,
            blendMode: 'ADD'
        });

        this.updateSprite();
        this.updateThinking(1500);
    }

    update () {
        const { aimUp } = this;
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
        this.sprayParticles.x = this.bodySprite.x + ((aimUp ? SPRAYUP_X_OFFEST : SPRAY_X_OFFEST) * this.direction);
    }

    levelUp() {
        this.level++;
        this.speed = 5 * this.level;
        this.updateSprite();
    }

    think() {
        this.aimUp = true; // Phaser.Math.Between(0, 1) === 0;
        this.spraying = true; // Phaser.Math.Between(0, 1) === 0;
        this.updateSprite();
    }

    updateSprite() {
        const { aimUp, spraying } = this;
        this.bodySprite.setVelocityX(this.speed * this.direction);
        const flip = this.direction !== 1;
        this.bodySprite.setFlipX(flip);
        this.headSprite.setFlipX(flip);
        this.bugSprayImage.setFlipX(flip);

        this.bugSprayImage.setFrame(aimUp ? 1 : 0);
        this.sprayParticles.y = aimUp ? SPRAYUP_Y : SPRAY_Y;
        this.sprayParticles.setAngle(
            flip ?
               (aimUp ? 225 : 180) :
               (aimUp ? 315 : 0)
        );
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
