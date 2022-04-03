import CoolDowns from '../utils/CoolDowns';

const accelerationX = 400;
const accelerationY = 400;

const PARTICLE_OFFSET_X = 16;
const PARTICLE_OFFSET_Y = 3;

const MUMBLE_CHANCE = 3;

class Mosquito {
    constructor (scene, x, y) {
        this.scene = scene;
        this.direction = 1;
        this.cooldowns = new CoolDowns();

        this.sprite = scene.physics.add.sprite(x, y, 'mosquito');
        this.sprite.play('mosquito-fly');

        this.sprite.setDrag(10, 10)
            .setMaxVelocity(100, 100)
            .setSize(16, 10)
            .setOffset(9, 5)
            .setCollideWorldBounds(true);
        this.sprite.depth = 10;

        const particles = scene.add.particles('bloodParticle');
        particles.depth = 15;
        this.bloodParticlesEmitter = particles.createEmitter({
            x: 0,
            y: 0,
            lifespan: 500,
            speed: { min: 10, max: 20 },
            gravityY: 100,
            scale: { start: 0.6, end: 0.3 },
            quantity: 0.5,
        });
        this.bloodParticlesEmitter.stop();

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keys = scene.input.keyboard.addKeys('W,S,A,D');
    }

    update (time, delta) {
        const { cursors, keys, sprite } = this;

        this.cooldowns.update(delta);

        if (cursors.left.isDown || keys.A.isDown) {
            sprite.setAccelerationX(-accelerationX);
            sprite.setFlipX(false);
            this.direction = -1;
        } else if (cursors.right.isDown || keys.D.isDown) {
            sprite.setAccelerationX(accelerationX);
            sprite.setFlipX(true);
            this.direction = 1;
        } else {
            sprite.setAccelerationX(0);
        }

        if (cursors.up.isDown || keys.W.isDown) {
            sprite.setAccelerationY(-accelerationY);
        } else if (cursors.down.isDown || keys.S.isDown) {
            sprite.setAccelerationY(accelerationY);
        } else {
            sprite.setAccelerationY(0);
        }

        // Phaser BUG only setPosition works (can't use x/y)
        if (!this.bleed) {
            this.bloodParticlesEmitter.setPosition(
                this.sprite.x + (PARTICLE_OFFSET_X  * this.direction),
                this.sprite.y + PARTICLE_OFFSET_Y
            );
        }
    }

    drink() {
        if (!this.cooldowns.has('drink')) {
            this.scene.sound.play('slurp');
            this.cooldowns.set('drink', 500);
            this.scene.updateLife(1.5);
            this.showBlood();

            if (Phaser.Math.Between(1, MUMBLE_CHANCE) === 1) {
                this.scene.time.addEvent({
                    delay: Phaser.Math.Between(400, 600),
                    callback: () => {
                        this.scene.sound.play('mumble' + Phaser.Math.Between(1, 3));
                    }
                })
            }
        }
    }

    hurt() {
        if (!this.cooldowns.has('hurt')) {
            this.cooldowns.set('hurt', 100);
            this.scene.updateLife(-1);
        }
    }

    getSprite() {
        return this.sprite;
    }

    showBlood() {
        this.bloodParticlesEmitter.start();
        this.bleed = true;
        this.bloodTimer = this.scene.time.addEvent({
            delay: Phaser.Math.Between(200, 400),
            callback: () => {
                this.bleed = false;
                this.bloodParticlesEmitter.stop();
            }
        });
    }

}

export default Mosquito;
