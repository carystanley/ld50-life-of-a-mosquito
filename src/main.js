import Boot from './scenes/Boot.js';
import Preloader from './scenes/Preloader.js';
import Play from './scenes/Play.js';

var config = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 360,
        height: 90,
        zoom: Phaser.Scale.MAX_ZOOM
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: [
        Boot,
        Preloader,
        Play
    ],
    pixelArt: true,
    autoFocus: true,
    fps: {
        // min: 10,
        target: 60
    }
};

var game = new Phaser.Game(config);
