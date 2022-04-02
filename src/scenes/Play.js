import Guy from '../entities/Guy';

class Play extends Phaser.Scene {
    constructor () {
        super({ key: 'play' });
        this.guys = [];
    }

    create () {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.guys.push(new Guy(this, 100));
    }

    update (time, delta) {
        this.guys.forEach((guy) => {
            guy.update(time, delta)
        });
    }
}

export default Play;
