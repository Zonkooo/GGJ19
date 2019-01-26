function Furniture(img, x, y) {
    this.img = img;

    this.box = world.createDynamicBody(Vec2(x/scale, y/scale));
    box.createFixture(planck.Box(this.img.width/(2*scale), this.img.height/), boxFD);
}