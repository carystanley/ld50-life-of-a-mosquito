class Preloader extends Phaser.Scene {
    constructor () {
        super({ key: 'preloader' });
    }

    preload () {
        this.load.setPath('assets');

        this.load.image('background', 'background.png');
        this.load.spritesheet('guyBody', 'guy-body.png', { frameWidth: 38, frameHeight: 20 });
        this.load.spritesheet('guyHead', 'guy-head.png', { frameWidth: 38, frameHeight: 38 });

        this.load.bitmapFont('boxy_bold_8', 'fonts/boxy_bold_8.png', 'fonts/boxy_bold_8.xml');

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
        this.setupAnimations([
            { key: 'guyBody-run', image: 'guyBody', start: 0, end: 3, frameRate: 10, repeat: -1 },
        ]);

        this.scene.start('play');
    }

    setupAnimations(animations) {
        animations.forEach(({ key, image, start, end, frameRate, repeat }) => {
            this.anims.create({
                key,
                frames: this.anims.generateFrameNumbers(image, { start, end }),
                frameRate,
                repeat
            });
        })
    }
}

export default Preloader;
