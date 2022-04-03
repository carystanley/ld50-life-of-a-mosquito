import Guy from '../entities/Guy';
import Mosquito from '../entities/Mosquito';

const LIFEBAR_X = 15;
const LIFEBAR_Y = 5;
const LIFEBAR_MARGIN = 1;
const LIFEBAR_HEIGHT = 5;
const LIFEBAR_WIDTH = 40;
const LIFE_MAX = 20;

const WORLD_BOUNDS_MARGIN = 10;

const LEVELUP_SECOUNDS = 5;
const HEALTHLOSS_RATE = 0.5/1000;

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const secounds = Math.floor(time % 60);
    return (minutes + ':' + (secounds + '').padStart(2, '0'));
}

class Play extends Phaser.Scene {
    constructor () {
        super({ key: 'play' });
    }

    create () {
        this.guys = [];
        this.life = LIFE_MAX;
        this.level = 1;
        this.playState = 'title';

        const { width, height } = this.game.config;
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.physics.world.setBounds(
            WORLD_BOUNDS_MARGIN,
            WORLD_BOUNDS_MARGIN,
            width - WORLD_BOUNDS_MARGIN * 2,
            height - WORLD_BOUNDS_MARGIN * 2
        );

        this.setupTitle();
        this.setupHUD();

        this.headsGroup = this.add.group();

        this.player = new Mosquito(this, 270, 40);

        this.physics.add.overlap(this.player.sprite, this.headsGroup, () => {
            this.player.drink();
        });

        this.startTime = undefined;

        this.input.keyboard.once('keydown', () => {
            this.playState = 'play';
        });
    }

    update(time, delta) {
        if (this.playState === 'play') {
            if (!this.startTime) {
                this.startGame(time);
            }

            this.guys.forEach((guy) => {
                guy.update(time, delta)
            });
            this.player.update(time, delta);
            this.updateLife(-HEALTHLOSS_RATE * delta);
            this.lastTime = time;
            this.timerText.setText(formatTime((this.lastTime - this.startTime) / 1000));
        }
    }

    startGame(time) {
        this.startTime = time;
        this.hud.visible = true;

        this.tweens.add({
            targets: this.gameTitle,
            alpha: { start: 1, to: 0 },
            duration: 1000,
            ease: 'Linear'
        });

        this.levelupTimer = this.time.addEvent({
            delay: LEVELUP_SECOUNDS * 1000,
            callback: () => { this.updateLevel(); },
            loop: true
        })
        this.addGuy();
    }

    updateLevel() {
        this.level++;
        this.levelLabel.setText(`Level ${this.level}`);
        this.guys.forEach((guy) => {
            guy.levelUp();
        });
        if ((this.level % 3) == 0) {
            this.addGuy();
        }
    }

    addGuy() {
        const randomSide = Phaser.Math.Between(0, 1);
        const newGuy = new Guy(this, randomSide ? -20 : 360 + 20);
        this.guys.push(newGuy);
        this.headsGroup.add(newGuy.getHead());
    }

    updateLife(delta) {
        this.life += delta;
        if (this.life <= 0) {
            this.life = 0;
            this.showGameOver();
        } else if (this.life > LIFE_MAX) {
            this.life = LIFE_MAX
        }
        const percent = this.life / LIFE_MAX;
        this.lifeBar.width = percent * LIFEBAR_WIDTH;
    }

    setupHUD() {
        this.hud = this.add.container(0, 0);
        this.hud.depth = 40;
        this.hud.setScrollFactor(0);
        this.hud.visible = false;

        const TIMER_X = 290;
        const TIMER_Y = 4;
        this.timerLabel = this.add.bitmapText(TIMER_X, TIMER_Y, 'boxy_bold_8');
        this.timerLabel.setText('Time');
        this.hud.add(this.timerLabel);
        this.timerText = this.add.bitmapText(TIMER_X + 40, TIMER_Y, 'boxy_bold_8');
        this.timerText.setText(formatTime(0));
        this.hud.add(this.timerText);

        const LEVEL_X = 4;
        const LEVEL_Y = 80;
        this.levelLabel = this.add.bitmapText(LEVEL_X, LEVEL_Y, 'boxy_bold_8');
        this.levelLabel.setText(`Level ${this.level}`);
        this.hud.add(this.levelLabel);

        const blood = this.add.image(3, 3, 'blood').setOrigin(0, 0);
        this.hud.add(blood);
        this.lifeContainer = this.add.rectangle(
            LIFEBAR_X - LIFEBAR_MARGIN,
            LIFEBAR_Y - LIFEBAR_MARGIN,
            LIFEBAR_WIDTH + (LIFEBAR_MARGIN * 2),
            LIFEBAR_HEIGHT + (LIFEBAR_MARGIN * 2),
            0x000000
        );
        this.lifeContainer.setOrigin(0, 0);
        this.hud.add(this.lifeContainer);
        this.lifeBar = this.add.rectangle(
            LIFEBAR_X,
            LIFEBAR_Y,
            LIFEBAR_WIDTH,
            LIFEBAR_HEIGHT,
            0xff0000
        );
        this.lifeBar.setOrigin(0, 0);
        this.hud.add(this.lifeBar);
    }

    setupTitle() {
        const { width: gameWidth } = this.game.config;
        const center = gameWidth/2;

        this.gameTitle = this.add.container(0, 0);
        this.gameTitle.depth = 40;
        this.gameTitle.setScrollFactor(0);

        this.gameTitle.add(this.add.bitmapText(center, 45, 'boxy_bold_8').setText('Life').setScale(3).setOrigin(0.5, 1));
        this.gameTitle.add(this.add.bitmapText(center, 45, 'boxy_bold_8').setText('of a Mosquito').setOrigin(0.5, 0));
    }

    showGameOver() {
        this.playState = 'gameOver';
        const listSpanTime = formatTime((this.lastTime - this.startTime) / 1000);

        const { width: gameWidth } = this.game.config;
        const center = gameWidth/2;

        this.gameOver = this.add.container(0, 0);
        this.gameOver.depth = 40;
        this.gameOver.setScrollFactor(0);

        const camera = this.cameras.main;
        const failOverlay = this.add.graphics();
        failOverlay.fillStyle(0xFF0000);
        failOverlay.fillRect(0, 0, camera.width, camera.height);
        failOverlay.depth = 30;
        failOverlay.setBlendMode(Phaser.BlendModes.MULTIPLY);
        this.gameOver.add(failOverlay);

        this.gameOver.add(this.add.bitmapText(center, 45, 'boxy_bold_8').setText('Game Over').setScale(2).setOrigin(0.5, 1));
        this.gameOver.add(this.add.bitmapText(center, 45, 'boxy_bold_8').setText(`Lifespan ${listSpanTime}`).setOrigin(0.5, 0));
        const retryText = this.add.bitmapText(center, 60, 'boxy_bold_8').setText('Press Any Key to Retry').setOrigin(0.5, 0);
        retryText.alpha = 0;
        this.gameOver.add(retryText);

        setTimeout(() => {
            retryText.alpha = 1;
            this.input.keyboard.once('keydown', () => {
                this.physics.resume();
                this.time.paused = false;
                this.scene.restart();
            });
        }, 2000);

        this.physics.pause();
        this.time.paused = true;
    }

    getPlayer() {
        return this.player;
    }
}

export default Play;
