class Preloader extends Phaser.Scene {
    constructor () {
        super({ key: 'preloader' });
    }

    preload () {
        this.load.setPath('assets');

        this.load.image('background', 'background.png');
        this.load.spritesheet('guyBody', 'guy-body.png', { frameWidth: 38, frameHeight: 20 });
        this.load.spritesheet('guyHead', 'guy-head.png', { frameWidth: 38, frameHeight: 38 });

        let progress = this.add.graphics();

        this.load.on('progress', function (value) {
            progress.clear();
            progress.fillStyle(0xdff9fb, 1);
            progress.fillRect(0, (220 / 2) - 30, 256 * value, 60);
        });

        this.load.on('complete', function () {
            progress.destroy();
        });
    }

    create () {
        this.scene.start('play');
    }
}

export default Preloader;