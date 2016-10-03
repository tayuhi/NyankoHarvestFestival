//thirdScene.js
//nextScene.js
var gameArray = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17];
var pickedTiles = [];
var scoreText;
var missText;
var moves = 0;
var miss = 0;
var console_label;



var ThirdLayer = cc.Layer.extend({

    ctor: function() {
        this._super();
        var size = cc.director.getWinSize();

        //音楽再生エンジン
        audioEngine = cc.audioEngine;
        if (!audioEngine.isMusicPlaying()) {
            //audioEngine.playMusic("res/bgm_main.mp3", true);
            //audioEngine.playMusic(res.soup, true);
        }



    //画像
    var sprite = cc.Sprite.create(res.title_bg);
    sprite.setPosition(size.width / 2, size.height / 2);
    sprite.setScale(1,0.9);
    this.addChild(sprite, 0);

    var sprite = cc.Sprite.create(res.title_J);
    sprite.setPosition(size.width / 2, size.height / 1.4);
    sprite.setScale(1,0.9);
    this.addChild(sprite, 0);



    var sprite = cc.Sprite.create(res.title_ranking_1_J);
    sprite.setPosition(size.width / 1.4, size.height / 6);
    sprite.setScale(0.9);
    this.addChild(sprite, 0);



    for (i = 0; i < 1; i++) {
    var tile = new MemoryTile();
    tile.pictureValue = gameArray[i];
    this.addChild(tile, 0);
    //タイルを格子状に配置する計算式
    tile.setPosition(160 + i % 6 * 74, 50 - Math.floor(i / 6) * 74);

    }

    for (i = 0; i < 1; i++) {
    var tile2 = new MemoryTile2();
    tile2.pictureValue = gameArray[i];
    this.addChild(tile2, 0);
    //タイルを格子状に配置する計算式
    tile2.setPosition(440 + i % 6 * 74, 150 - Math.floor(i / 6) * 74);

    }
        /*//画像
        var sprite = cc.Sprite.create(res.kage);
        sprite.setPosition(size.width / 1.3, size.height / 7);
        sprite.setScale(0.8);
        this.addChild(sprite, 0);
*/
      /*  var label = cc.LabelTTF.create("倉庫番", "Arial", 76);

        label.setPosition(size.width / 2, size.height * 1 / 6);
        this.addChild(label, 1);*/



        // タップイベントリスナーを登録する
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);

        return true;
    },
    onTouchBegan: function(touch, event) {
        return true;
    },
    onTouchMoved: function(touch, event) {},
    onTouchEnded: function(touch, event) {


        //bgmの再生をとめる
        if (audioEngine.isMusicPlaying()) {
            audioEngine.stopMusic();
audioEngine.playEffect(res.warai);
        }

    },

});

var MemoryTile = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.initWithFile(res.title_start_1_E);
        cc.eventManager.addListener(listener.clone(), this);

    }

});

var MemoryTile2 = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.initWithFile(res.help_1);
        cc.eventManager.addListener(listener2.clone(), this);

    }

});

//listnerの宣言
var listener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan: function(touch, event) {
        if (pickedTiles.length < 2) {
            var target = event.getCurrentTarget();
            var location = target.convertToNodeSpace(touch.getLocation());
            var targetSize = target.getContentSize();
            var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
            if (cc.rectContainsPoint(targetRectangle, location)) {
                target.initWithFile("res/title_start_2_E.png");
                pickedTiles.push(target);
                if (pickedTiles.length == 2) {

                    checkTiles();
                }
            }
        }
    }

});

//listnerの宣言
var listener2 = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan: function(touch, event) {
        if (pickedTiles.length < 2) {
            var target = event.getCurrentTarget();
            var location = target.convertToNodeSpace(touch.getLocation());
            var targetSize = target.getContentSize();
            var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
            if (cc.rectContainsPoint(targetRectangle, location)) {
                target.initWithFile("res/help_2.png");
                pickedTiles.push(target);
                if (pickedTiles.length == 2) {

                    checkTiles2();
                }
            }
        }
    }

});

function checkTiles() {
cc.director.runScene(new gameScene());


}

function checkTiles2() {
cc.director.runScene(new hintScene1());


}

var FirstScene = cc.Scene.extend({
    onEnter: function() {
        this._super();

        // 背景レイヤーをその場で作る
        var backgroundLayer = new cc.LayerColor(new cc.Color(150, 0, 0, 250));
        this.addChild(backgroundLayer);

        //ラベルとタップイベント取得
        var layer3 = new ThirdLayer();
        this.addChild(layer3);

    }
});
