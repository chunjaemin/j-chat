//wave를 만들어주는 코드임, canvas라는 id를 가진 canvas 태그 안에 wave를 넣어줌
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

//물결의 꼭지점을 매개변수로 받음(많을 수록 꼭지점이 많아짐)
function draw(dot) {
    //id가 canvas인 것을 찝는 코드, canvas태그의 id를 변경하고 싶다면 하단의 getElementById를 바꿀 것
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
            pointArray[i] = new Point(defX,canvas.height/4 ,0.01,1.2 +0.3*i,3)
        } else {
            pointArray[i] = new Point(defX,canvas.height/4 + 25*i ,0.008,0.5 + 1*i,0.7)
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