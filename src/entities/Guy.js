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

        const partices = scene.add.particles('sprayParticle');
        this.sprayParticlesEmitter = partices.createEmitter({
            x: 5,
            y: 5,
            lifespan: 600,
            speed: { min: 50, max: 100 },
            angle: { min: -20, max: 20 },
            // gravityY: 300,
            scale: { start: 0.6, end: 0.3 },
            quantity: 1,
            blendMode: 'ADD',
            deathZone: { type: 'onEnter', source: {
                contains: (x, y) => {
                    var hit = scene.getPlayer().getSprite().body.hitTest(x, y);
                    if (hit) {
                        scene.getPlayer().hurt();
                    }
                    return hit;
                }
            }}
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

        // Phaser BUG only setPosition works (can't use x/y)
        this.sprayParticlesEmitter.setPosition(
            this.bodySprite.x + ((aimUp ? SPRAYUP_X_OFFEST : SPRAY_X_OFFEST) * this.direction),
            aimUp ? SPRAYUP_Y : SPRAY_Y
        );
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

        this.bugSprayImage.setFrame(aimUp ? 1 : 0);

        if (spraying) {
            this.sprayParticlesEmitter.start();
        } else {
            this.sprayParticlesEmitter.stop();
        }

        if (flip) {
            if (aimUp) {
                this.sprayParticlesEmitter.setAngle({ min: 205, max: 245 });
            } else {
                this.sprayParticlesEmitter.setAngle({ min: 160, max: 200 });
            }
        } else {
            if (aimUp) {
                this.sprayParticlesEmitter.setAngle({ min: 295, max: 335 });
            } else {
                this.sprayParticlesEmitter.setAngle({ min: -20, max: 20 });
            }
        }
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
