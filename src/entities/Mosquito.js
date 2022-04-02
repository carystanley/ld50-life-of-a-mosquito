import CoolDowns from '../utils/CoolDowns';

const accelerationX = 400;
const accelerationY = 400;

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

        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keys = scene.input.keyboard.addKeys('W,S,A,D');
    }

    update (time, delta) {
        const { cursors, keys, sprite } = this;

        this.cooldowns.update(delta);

        if (cursors.left.isDown || keys.A.isDown) {
            sprite.setAccelerationX(-accelerationX);
            sprite.setFlipX(false);
        } else if (cursors.right.isDown || keys.D.isDown) {
            sprite.setAccelerationX(accelerationX);
            sprite.setFlipX(true);
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
    }

    drink() {
        if (!this.cooldowns.has('drink')) {
            this.cooldowns.set('drink', 1000);
            this.scene.updateLife(3);
        }
    }
}

export default Mosquito;
