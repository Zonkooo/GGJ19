var Vec2 = planck.Vec2;

var preloadCount = 0;
var preloadTotal = 0;

var imgPlayer = new Image();

var stage;
var world;

var box;
var boxShape;

var scale = 50;
var boxw = 1;
var boxh = 2;

function startGame()
{
	stage = new createjs.Stage("gameCanvas");
	var text = new createjs.Text("Loading...");
	text.x = stage.canvas.width/2; text.y = stage.canvas.height/2;
	text.textAlign = "center"; text.textBaseline = "middle";
	stage.addChild(text);
	stage.update();

	preloadAssets();
}

function preloadAssets()
{
	launchGame();
	//imgPlayer.onload = preloadUpdate;
	//imgPlayer.src = "media/junglechar.png";

	//createjs.Sound.addEventListener("fileload", preloadUpdate);
	//createjs.Sound.registerSound("media/receive.wav", "jump", 4);
}

function preloadUpdate()
{
	preloadCount++;
	if(preloadCount === preloadTotal)
		launchGame();
}

function launchGame()
{
	stage.removeChildAt(0); //loading text

	world = planck.World();

	var walls = world.createBody({
		type: 'static',
		position: Vec2(.1, .1),
	});

	var wallFD = {
		density: 0.0,
		restitution: 0.1,
	};
	walls.createFixture(planck.Edge(Vec2(0, 0), Vec2(10, 0)), wallFD);
	walls.createFixture(planck.Edge(Vec2(0, 0), Vec2(0, 10)), wallFD);
	walls.createFixture(planck.Edge(Vec2(0, 10), Vec2(10, 10)), wallFD);
	walls.createFixture(planck.Edge(Vec2(10, 0), Vec2(10, 10)), wallFD);

	var wsh = new createjs.Shape();
	//wsh.graphics.setStrokeStyle(3);
	wsh.graphics.beginStroke("green");
	wsh.graphics.moveTo(.1*scale, .1*scale);
	wsh.graphics.lineTo(.1*scale,10.1*scale);
	wsh.graphics.lineTo(10.1*scale,10.1*scale);
	wsh.graphics.lineTo(10.1*scale,.1*scale);
	wsh.graphics.lineTo(.1*scale,.1*scale);
	wsh.graphics.endStroke();
	stage.addChild(wsh);

	var boxFD = {
		density: 1.0,
		friction: 0.3,
	};
	box = world.createDynamicBody(Vec2(2, 2));
	box.createFixture(planck.Box(boxw, boxh), boxFD);

	boxShape = new createjs.Shape();

	var mouseGround = world.createBody();
	var mouseJoint;
	boxShape.on("mousedown", function(evt) {
		var clickx = evt.stageX/scale;
		var clicky = evt.stageY/scale;
		mouseJoint = planck.MouseJoint({maxForce: 1000}, mouseGround, box, Vec2(clickx, clicky));
		world.createJoint(mouseJoint);
	});
	boxShape.on("pressup", function(evt) {
		world.destroyJoint(mouseJoint);
		mouseJoint = null;
	});
	stage.on("stagemousemove", function(evt) {
		var clickx = evt.stageX/scale;
		var clicky = evt.stageY/scale;
		point = { x: clickx, y: clicky };
		if(mouseJoint) mouseJoint.setTarget(point);
	});
	stage.addChild(boxShape);

	//var objBg = new createjs.Bitmap(imgBg);
	//stage.addChild(objBg);

	createjs.Ticker.framerate = 30;
	createjs.Ticker.addEventListener("tick", update);
}

function update(event)
{
	world.step(1 / 30);

	// var line = new createjs.Shape();
	// line.graphics.setStrokeStyle(3);
	// line.graphics.beginStroke("red");
	// line.graphics.moveTo(10, 10);
	// line.graphics.lineTo(10, 50);
	// line.graphics.endStroke();
	//
	// stage.addChild(line);


	//draw stuff
	var fixt = box.getFixtureList();
	var centerx = box.c_position.c.x;
	var centery = box.c_position.c.y;
	boxShape.graphics.beginFill("red").drawRect(0, 0, 2*boxw*scale, 2*boxh*scale);
	boxShape.regX = boxw*scale;
	boxShape.regY = boxh*scale;
	boxShape.x = centerx*scale;
	boxShape.y = centery*scale;
	boxShape.rotation = box.getAngle()*(180/Math.PI);

	for (var body = world.getBodyList(); body; body = body.getNext()) {
		for (var fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
			// draw or update fixture
		}
	}

	stage.update();
}
