class Point {
    constructor(x,y,speed,index,max) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.cur = index;
        this.max = max;
    }

    update() {
        this.cur += this.speed;
        this.y = this.y + Math.sin(this.cur)*this.max
    }
}

function draw(dot) {
    const canvas = document.getElementById('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const ctx = canvas.getContext('2d') 
    ctx.scale(2, 2);
    const pointArray = new Array(5)

    const increase = canvas.width/(dot-1)
    for (let i=0; i<dot; i++) {
        const defX = increase*i/2
        if (i==0 || i== dot-1) {
            pointArray[i] = new Point(defX,canvas.height/4 ,0.05,1.2 +0.3*i,3)
        } else {
            pointArray[i] = new Point(defX,canvas.height/4 + 25*i ,0.02,0.5 + 0.9*i,1.5)
        }
    }
    ctx.fillStyle = "rgb(255, 165, 0)"

    function animation () {
        //애니메이션 넣어주면 됨
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.beginPath();
        let prevX = pointArray[0].x
        let prevY = pointArray[0].y 

        ctx.moveTo(prevX,prevY)
        for (let i=1; i<dot-1; i++) {
            pointArray[i].update()
            let cx = (prevX + pointArray[i].x)/2
            let cy = (prevY + pointArray[i].y)/2
            ctx.quadraticCurveTo(prevX, prevY, cx, cy)
            prevX = pointArray[i].x
            prevY = pointArray[i].y
        }
        ctx.quadraticCurveTo(prevX, prevY, pointArray[dot-1].x , pointArray[dot-1].y)
        ctx.lineTo(pointArray[dot-1].x,0)
        ctx.lineTo(0,0)
        ctx.fill();
        requestAnimationFrame(animation)
    }
    animation();
}

export default {
    draw,
}