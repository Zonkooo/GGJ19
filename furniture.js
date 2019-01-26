function Furniture(img, x, y) {
    this.img = img;
    // this.img = new createjs.Shape();
    // this.img.graphics.beginFill("red").rect(0, 0, img.image.width, img.image.height);
    this.img.regX = img.image.width/2;
    this.img.regY = img.image.height/2;
    this.img.x = x;
    this.img.y = y;

    stage.addChild(this.img);


    var boxFD = {
        density: 1.0,
        friction: 0.1,
        restitution: 0,
    };
    this.box = world.createDynamicBody(Vec2(x/scale, y/scale));
    this.box.createFixture(planck.Box(img.image.width / (2 * scale), img.image.height / (2 * scale)), boxFD);
    this.friction = planck.FrictionJoint({collideConnected : true, maxForce:100, maxTorque: 200}, this.box, walls);

    var self = this;
    this.img.on("mousedown", function(evt) {
        mouseJoint = planck.MouseJoint({maxForce: 1000}, mouseGround, self.box, Vec2(evt.stageX / scale, evt.stageY / scale));
        world.createJoint(mouseJoint);
    });
    this.img.on("pressup", function(evt) {
        world.destroyJoint(mouseJoint);
        world.createJoint(self.friction);
        mouseJoint = null;
    });

    this.update = function(){

        if(this.box.getLinearVelocity().length() < 0.5 && this.box.getAngularVelocity() < 0.1) {
            this.box.setLinearVelocity(Vec2(0, 0));
            world.destroyJoint(this.friction);
        }

        this.img.x = this.box.getPosition().x*scale;
        this.img.y = this.box.getPosition().y*scale;
        this.img.rotation = this.box.getAngle()*(180/Math.PI);
    }
}