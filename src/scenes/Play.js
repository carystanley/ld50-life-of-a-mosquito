
class Play extends Phaser.Scene {
    constructor (config) {
        super({ key: 'play' });
    }

    create (config) {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
    }

    update (time, delta) {

    }
}

export default Play;
