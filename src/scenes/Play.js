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
        this.guys = [];
        this.life = LIFE_MAX;
        this.level = 1;
    }

    create () {
        const { width, height } = this.game.config;
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.physics.world.setBounds(
            WORLD_BOUNDS_MARGIN,
            WORLD_BOUNDS_MARGIN,
            width - WORLD_BOUNDS_MARGIN * 2,
            height - WORLD_BOUNDS_MARGIN * 2
        );

        this.setupHUD();

        this.headsGroup = this.add.group();

        this.player = new Mosquito(this, 40, 40);
        this.addGuy();

        this.physics.add.overlap(this.player.sprite, this.headsGroup, () => {
            this.player.drink();
        });

        this.startTime = undefined;
    }

    update (time, delta) {
        if (!this.startTime) {
            this.startGame(time);
        }

        this.guys.forEach((guy) => {
            guy.update(time, delta)
        });
        this.player.update(time, delta);
        this.updateLife(-HEALTHLOSS_RATE * delta);
        this.timerText.setText(formatTime((time - this.startTime) / 1000));
    }

    startGame (time) {
        this.startTime = time;
        this.timerLabel.visible = true;
        this.timerText.visible = true;
        this.levelLabel.visible = true;

        this.levelupTimer = this.time.addEvent({
            delay: LEVELUP_SECOUNDS * 1000,
            callback: () => { this.updateLevel(); },
            loop: true
        })
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
            // GAMEOVER
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

        const TIMER_X = 290;
        const TIMER_Y = 4;
        this.timerLabel = this.add.bitmapText(TIMER_X, TIMER_Y, 'boxy_bold_8');
        this.timerLabel.setText('Time');
        this.timerLabel.visible = false;
        this.hud.add(this.timerLabel);
        this.timerText = this.add.bitmapText(TIMER_X + 40, TIMER_Y, 'boxy_bold_8');
        this.timerText.setText(formatTime(0));
        this.timerText.visible = false;
        this.hud.add(this.timerText);

        const LEVEL_X = 4;
        const LEVEL_Y = 80;
        this.levelLabel = this.add.bitmapText(LEVEL_X, LEVEL_Y, 'boxy_bold_8');
        this.levelLabel.setText(`Level ${this.level}`);
        this.levelLabel.visible = false;

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
}

export default Play;
