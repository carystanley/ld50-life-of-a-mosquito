import Guy from '../entities/Guy';

class Play extends Phaser.Scene {
    constructor () {
        super({ key: 'play' });
        this.guys = [];
    }

    create () {
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        this.setupHUD();

        this.guys.push(new Guy(this, 100));

        this.startGame();
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
    }

    startGame () {
        this.timerLabel.visible = true;
        this.timerText.visible = true;
        this.levelLabel.visible = true;
    }

    update (time, delta) {
        this.guys.forEach((guy) => {
            guy.update(time, delta)
        });
    }
}

export default Play;
