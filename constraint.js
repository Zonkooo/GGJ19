function DirConstraint(type, object, idp, ids)
{
    this.update = function()
    {
        switch (type) {
            case "north":
                var angle = object.box.getAngle();
                angle = (angle%(Math.PI*2));
                if(angle < 0) angle += Math.PI*2;
                angle -= Math.PI;
                var percent = Math.abs(angle/Math.PI)*100;
                document.getElementById(idp).innerHTML = percent.toFixed(0) + "%";
                document.getElementById(ids).innerHTML = percent > 95 ? "✔" : "❌";
        }
    }
}

function ProxiConstraint(ref, nbmin, distmin, check, idp, ids)
{
    this.update = function () {
        var refpos = ref.box.getPosition();
        var done = 0;
        for(var obj of check)
        {
            let dist = (Vec2.clone(obj.box.getPosition()).sub(refpos)).length();
            if(dist < distmin)
                done++;
        }
        document.getElementById(idp).innerHTML = done + "/" + nbmin;
        document.getElementById(ids).innerHTML = done >= nbmin ? "✔" : "❌";
    }
}