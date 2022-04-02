import Guy from '../entities/Guy';

const LIFEBAR_X = 15;
const LIFEBAR_Y = 5;
const LIFEBAR_MARGIN = 1;
const LIFEBAR_HEIGHT = 5;
const LIFEBAR_WIDTH = 40;
const LIFE_MAX = 20;

class Play extends Phaser.Scene {
    constructor () {
        super({ key: 'play' });
        this.guys = [];
        this.life = LIFE_MAX;
    }

    create () {
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        this.setupHUD();

        this.guys.push(new Guy(this, 100));

        this.startGame();
    }

    update (time, delta) {
        this.guys.forEach((guy) => {
            guy.update(time, delta)
        });
        this.updateLifeBar();
    }

    startGame () {
        this.timerLabel.visible = true;
        this.timerText.visible = true;
        this.levelLabel.visible = true;
    }

    updateLifeBar() {
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
        this.timerText.setText('0:00');
        this.timerText.visible = false;
        this.hud.add(this.timerText);

        const LEVEL_X = 4;
        const LEVEL_Y = 80;
        this.levelLabel = this.add.bitmapText(LEVEL_X, LEVEL_Y, 'boxy_bold_8');
        this.levelLabel.setText('Level 1');
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
