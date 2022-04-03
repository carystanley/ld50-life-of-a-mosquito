const HEAD_Y = 57;
const BODY_Y = 77;

const SPRAYCAN_Y = 73;
const SPRAYCAN_X_OFFEST = 16;

const SPRAY_Y = 66;
const SPRAY_X_OFFEST = 20;
const SPRAYUP_Y = 64;
const SPRAYUP_X_OFFEST = 12;


const WORLD_BOUNDS_MARGIN = 30;

const FACE_NORMAL = 0;
const FACE_ANGRY = 1;
const FACE_BLINDED = 2;

class Guy {
    constructor (scene, x, direction = 1, level = 1) {
        this.scene = scene;
        this.level = level;
        this.speed = 10;
        this.thinkDelay = 1500;
        this.direction = direction;
        this.angry = false;
        this.blind = false;
        this.aimUp = false;
        this.spraying = false;
        this.canSpray = false;
        this.isAngry = false;

        this.headSprite = scene.physics.add.sprite(x, HEAD_Y, 'guyHead');
        this.headSprite.setDrag(10, 10)
            .setSize(28, 30)
            .setOffset(6, 4);

        this.bodySprite = scene.physics.add.sprite(x, BODY_Y, 'guyBody');
        this.bodySprite.play('guyBody-run');

        this.bugSprayImage = scene.add.image(0, SPRAYCAN_Y, 'bugspray');
        this.bugSprayImage.visible = this.canSpray;

        const partices = scene.add.particles('sprayParticle');
        this.sprayParticlesEmitter = partices.createEmitter({
            x: 5,
            y: 5,
            lifespan: 300,
            speed: { min: 100, max: 200 },
            angle: { min: -20, max: 20 },
            // gravityY: 300,
            scale: { start: 0.6, end: 0.3 },
            quantity: 1,
            blendMode: 'ADD',
            deathZone: { type: 'onEnter', source: {
                contains: (x, y) => {
                    // Hacky becuase Phaser does not handle paricle collisions
                    var hit = scene.getPlayer().getSprite().body.hitTest(x, y);
                    if (hit) {
                        scene.getPlayer().hurt();
                    }

                    scene.guys.forEach((guy) => {
                        if ((guy !== this) && guy.getHead().body.hitTest(x, y)) {
                            guy.onSprayed();
                        }
                    });
                    return hit;
                }
            }}
        });

        this.updateSprite();
        this.updateThinking(this.thinkDelay);
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
        this.canSpray = this.level > 1;
        this.isAngry = this.level > 2;
        this.speed = Math.min(this.speed + 3, 1000);
        this.thinkDelay = Math.max(this.thinkDelay - 50, 300);
        this.updateThinking(this.thinkDelay);
        this.updateSprite();
    }

    think() {
        const { x: playerX, y: playerY } = this.scene.getPlayer().getSprite();

        if (this.blinded) {
            this.spraying = false;
            this.blinded = Math.max(0, this.blinded - 1);
            return;
        }

        if (!this.canSpray) {
            return;
        }

        if (Math.sign(playerX - this.getHead().x) !== this.direction) {
            this.direction *= -1;
            this.spraying = false;
            this.updateSprite();
            return;
        }

        const mosquitoIsUp = playerY < 45;
        if (mosquitoIsUp !== this.aimUp) {
            this.aimUp = mosquitoIsUp;
            this.spraying = false;
            this.updateSprite();
            return;
        }

        if (!this.spraying) {
            this.spraying = true;
        }

        this.updateSprite();
    }

    updateSprite() {
        let { aimUp, spraying, speed } = this;

        if (this.blinded) {
            speed *= 2;
        }

        this.bodySprite.setVelocityX(speed * this.direction);
        const flip = this.direction !== 1;
        this.bodySprite.setFlipX(flip);
        this.headSprite.setFlipX(flip);
        this.bugSprayImage.setFlipX(flip);

        this.bugSprayImage.visible = this.canSpray;
        this.bugSprayImage.setFrame(aimUp ? 1 : 0);

        this.headSprite.setFrame(
            this.blinded ? FACE_BLINDED :
                (this.isAngry ? FACE_ANGRY : FACE_NORMAL)
        );

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

    onSprayed() {
        if (!this.blinded) {
            this.blinded = Phaser.Math.Between(2, 4);
            this.scene.sound.play('scream');
            this.updateSprite();
        }
    }

    getHead() {
        return this.headSprite;
    }
}

export default Guy;
