function Furniture(img, x, y, rotation=0, isRound=false) {
    x = x+offset;
    y = y+offset;
    this.img = img;
    // this.img = new createjs.Shape();
    // this.img.graphics.beginFill("red").rect(0, 0, img.image.width, img.image.height);
    this.img.regX = img.image.width/2;
    this.img.regY = img.image.height/2;
    this.img.x = x;
    this.img.y = y;
    this.img.rotation = rotation;

    stage.addChild(this.img);


    var boxFD = {
        density: 1.0,
        friction: 0.5,
        restitution: 0.5,
    };
    this.box = world.createDynamicBody(Vec2(x/scale, y/scale));
    if(!isRound)
        this.box.createFixture(planck.Box(img.image.width / (2 * scale), img.image.height / (2 * scale)), boxFD);
    else
        this.box.createFixture(planck.Circle(img.image.width / (2 * scale)), boxFD);
    this.box.setTransform(this.box.getPosition(), rotation*(Math.PI/180));

    let frictionstr = (img.image.width*img.image.height/2000);
    world.createJoint(planck.FrictionJoint({collideConnected : true, maxForce: frictionstr, maxTorque: frictionstr}, this.box, walls));

    var self = this;
    this.img.on("mousedown", function(evt) {
        mouseJoint = planck.MouseJoint({maxForce: 300}, mouseGround, self.box, Vec2(evt.stageX / scale, evt.stageY / scale));
        world.createJoint(mouseJoint);
    });
    this.img.on("pressup", function(evt) {
        world.destroyJoint(mouseJoint);
        mouseJoint = null;
    });

    this.update = function(){
        this.img.x = this.box.getPosition().x*scale;
        this.img.y = this.box.getPosition().y*scale;
        this.img.rotation = this.box.getAngle()*(180/Math.PI);
    }
}