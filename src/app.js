var itemsLayer;
var catS0;
var xSpeed = 0; //カートの移動速度iei

var detectedX;　 //現在タッチしているX座標
var savedX;　 //前回タッチしていたX座標
var touching = false;　 //タッチ状況管理用flag
var cloud;  //雲

var gameScene = cc.Scene.extend({
  onEnter: function() {
    this._super();
    gameLayer = new game();
    gameLayer.init();
    this.addChild(gameLayer);
  }
});

var game = cc.Layer.extend({
  init: function() {
    this._super();
    //グラデーション背景
    //  var backgroundLayer = cc.LayerGradient.create(cc.color(0,0,0,255), cc.color(0x46,0x82,0xB4,255));

    //森の背景
    var background = new cc.Sprite(res.background_png);
    var size = cc.director.getWinSize();
    background.setPosition(cc.p(size.width / 2.0, size.height / 2.0));
    var backgroundLayer = cc.Layer.create();
    backgroundLayer.addChild(background);
    this.addChild(backgroundLayer);

    //アイテムがおちてくるレイヤー
    itemsLayer = cc.Layer.create();
    this.addChild(itemsLayer);

    //雲
    this.schedule(this.addCloud, 0.5);

    //ショッピングカートを操作するレイヤー
    topLayer = cc.Layer.create();
    this.addChild(topLayer);
    catS0 = cc.Sprite.create(res.catS0_png);
    topLayer.addChild(catS0, 0);
    catS0.setPosition(240, 24);
    this.schedule(this.addItem, 1);
    //タッチイベントのリスナー追加
    cc.eventManager.addListener(touchListener, this);
    //カートの移動のため　Update関数を1/60秒ごと実行させる　
    this.scheduleUpdate();

  },
  addItem: function() {
    var item = new Item();
    itemsLayer.addChild(item, 1);
  },
  removeItem: function(item) {
    itemsLayer.removeChild(item);
  },

  //雲
    addCloud: function(/*event*/) {
        var cloud = new Cloud();
        this.addChild(cloud);
    },
    removeCloud: function(cloud) {
        this.removeChild(cloud);
    },


  //カートの移動のため　Update関数を1/60秒ごと実行させる関数
  update: function(dt) {
    if (touching) {
      //現在タッチしているX座標と前回の座標の差分をとる
      var deltaX = savedX - detectedX;
      //差分でカートが右にいくか左にいくかを判断する
      if (deltaX > 0) {
        xSpeed = -2;
      }
      if (deltaX < 0) {
        xSpeed = 2;
      }
      //saveXに今回のX座標を代入し、onTouchMovedイベントで
      //detectedX変数が更新されても対応できるようにする
      savedX = detectedX;
      if (xSpeed > 0) {
        catS0.setFlippedX(true);
      }
      if (xSpeed < 0) {
        catS0.setFlippedX(false);
      }
      catS0.setPosition(catS0.getPosition().x + xSpeed, catS0.getPosition().y);
    }
  }


});

var Item = cc.Sprite.extend({
  ctor: function() {
    this._super();
    //ランダムに爆弾と果物を生成する
    if (Math.random() < 0.5) {
      this.initWithFile(res.bug_png);
      this.isBomb = true;
    } else {
      this.initWithFile(res.apple_png);
      this.isBomb = false;
    }
    //this.initWithFile(res.bug_png);
  },
  //アイテムが生成された後、描画されるときに実行
  onEnter: function() {
    this._super();
    //ランダムな位置に
    this.setPosition(Math.random() * 400 + 40, 350);
    //ランダムな座標に移動させる
    var moveAction = cc.MoveTo.create(8, new cc.Point(Math.random() * 400 + 40, -50));
    this.runAction(moveAction);
    this.scheduleUpdate();
  },
  update: function(dt) {
    //果物の処理　座標をチェックしてカートの接近したら
    if (this.getPosition().y < 35 && this.getPosition().y > 30 &&
      Math.abs(this.getPosition().x - catS0.getPosition().x) < 10 && !this.isBomb) {
      gameLayer.removeItem(this);
      console.log("FRUIT");
    }
    //爆弾の処理　座標をチェックしてカートの接近したら　フルーツより爆弾に当たりやすくしている
    if (this.getPosition().y < 35 && Math.abs(this.getPosition().x - catS0.getPosition().x) < 25 &&
      this.isBomb) {
      gameLayer.removeItem(this);
      console.log("BOMB");
    }
    //地面に落ちたアイテムは消去
    if (this.getPosition().y < -30) {
      gameLayer.removeItem(this)
      //1秒たったら削除する課題がある アニメーション    cc.delayTimeが答え
    }
  }
});

//雲クラス
var Cloud = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.initWithFile(res.game_cloudS);
    },
    onEnter: function() {
        this._super();
        this.setPosition(600, 280);
        var moveAction = cc.MoveTo.create(2.5, new cc.Point( -3500, -50));
        this.runAction(moveAction);
        this.scheduleUpdate();
    },
  /*  //画面の外にでた雲を消去する処理
            if (this.getPosition().x < -50) {
                gameLayer.removeCloud(this)
            }*/
});

//バーチャルアナログパッド用のタッチリスナーの実装
var touchListener = cc.EventListener.create({
  event: cc.EventListener.TOUCH_ONE_BY_ONE,
  swallowTouches: true,
  onTouchBegan: function(touch, event) {
    touching = true;
    //現在タッチ中のX座標を保持する変数へ代入
    detectedX = touch.getLocation().x;
    //前回タッチしていたX座標として代入
    savedX = detectedX;
    return true;
  },
  onTouchMoved: function(touch, event) {
    //現在タッチ中のX座標を保持する変数へ代入
    detectedX = touch.getLocation().x;
  },
  onTouchEnded: function(touch, event) {
    //タッチflagをOFF
    touching = false;
  }
})
