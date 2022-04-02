class Mosquito {
    constructor (scene, x, y) {
        this.scene = scene;
        this.direction = 1;
        this.sprite = scene.physics.add.sprite(x, y, 'mosquito');
        this.sprite.play('mosquito-fly');
    }

    update () {
        this.sprite.setFlipX(this.direction !== -1);
    }
}

export default Mosquito;
