window.onload=function(){

        //INITIALIZATION
    var canvas = document.getElementById('Canvas');
    var height = canvas.height;
    var width = canvas.width;
    var ctx = canvas.getContext('2d');

    //INPUT VARIABLE
    var mouseClickX = 0;
    var mouseClickY = 0;
    var mouseReleaseX = 0;
    var mouseReleaseY = 0;
    var mousePositionX = 0;
    var mousePositionY = 0;
    var keypress = [];
    //GAME MECHANISM VAR
    var gamestate = 0;
    /*0. main menu
     *1. initial shop
     *2. play
     *3. in shop
     *4. losing
     *5. credit
     */
    var score=0;
    var alienDestroyed;
    var shield;
    var materialamount;
    var bulletamount;
    var initialized = 0;
    var stage = 1;
    var stageTime = 0;
    var nextStage = 1;
    var inshop = 0;
    var innebulae = 0;
    var delayKnalpot = 0;
    var intensity,biru,hijau,merah;
    var inertia=0;
    /*
    stage 0 = free space
    stage 1 = normal space
    stage 2 = asteroid field
    stage 3 = nebulae
    stage 4 = ufo base
    */
    var currentShop;
    var endShop;
    var iterator=0;
    var asteroidCounter=fgObjCounterReset("asteroid");
    var materialCounter=fgObjCounterReset("material");
    var shipspeed = 0;
    var bgObj = [];
    var fgObj = [];
    var alienObj = [];
    var friendlyBullet = [];
    var enemyBullet = [];
    var ship = new Object();
    var currentSecond=0;
    var endSecond=0;
    var sync;
    ship.height = height/10;
    ship.width = ship.height*3/4;
    ship.x = width/2;
    ship.y = height - 2 - ship.height;
    ship.shoot = function(){
        if(bulletamount>0){
            friendlyBullet.push(spawnBullet(this.x-this.width/4,this.y-this.height/10+Math.round(Math.random()*4)));
            friendlyBullet.push(spawnBullet(this.x+this.width/4,this.y-this.height/10+Math.round(Math.random()*4)));
            bulletamount--;
        }
    }

    var music = new Object();
    //48.301904
    //6.037738
    music.bartime=6.037738;
    music.hellspawnh=new Audio('hellspawnh.mp3');
    music.hellspawnh2=new Audio('hellspawnh.mp3');
    music.hellspawnb=new Audio('hellspawnb.mp3');
    music.hellspawnb2=new Audio('hellspawnb.mp3');
    music.drum=new Audio('drum.mp3');
    music.drum2=new Audio('drum.mp3');
    music.nnxt=new Audio('nnxt.mp3');
    music.nnxt2=new Audio('nnxt.mp3');
    music.turn;
    music.control=function(){
        if(gamestate<1 || gamestate>3){
            this.hellspawnb.muted=true;
            this.hellspawnh.muted=true;
            this.drum.muted=true;
            this.nnxt.muted=false;
        this.hellspawnb2.muted=this.hellspawnb.muted;
        this.hellspawnh2.muted=this.hellspawnh.muted;
        this.drum2.muted=this.drum.muted;
        this.nnxt2.muted=this.nnxt.muted;
        }
        else if(gamestate==1 || gamestate==3){
            this.hellspawnb.muted=true;
            this.hellspawnh.muted=true;
            this.drum.muted=true;
            this.nnxt.muted=false;
        this.hellspawnb2.muted=this.hellspawnb.muted;
        this.hellspawnh2.muted=this.hellspawnh.muted;
        this.drum2.muted=this.drum.muted;
        this.nnxt2.muted=this.nnxt.muted;
        }
        else if(gamestate==2){
            if(stage==1 || stage==2){
                this.hellspawnb.muted=true;
                this.hellspawnh.muted=false;
                this.drum.muted=true;
                this.nnxt.muted=false;
        this.hellspawnb2.muted=this.hellspawnb.muted;
        this.hellspawnh2.muted=this.hellspawnh.muted;
        this.drum2.muted=this.drum.muted;
        this.nnxt2.muted=this.nnxt.muted;
            }
            if(stage==3 || stage==4){
                this.hellspawnb.muted=false;
                this.hellspawnh.muted=false;
                this.drum.muted=false;
                this.nnxt.muted=false;
        this.hellspawnb2.muted=this.hellspawnb.muted;
        this.hellspawnh2.muted=this.hellspawnh.muted;
        this.drum2.muted=this.drum.muted;
        this.nnxt2.muted=this.nnxt.muted;
            }
            /*       
            stage 0 = free space
            stage 1 = normal space
            stage 2 = asteroid field
            stage 3 = nebulae
            stage 4 = ufo base
            */
        }
    }
    music.fade=function(){
        if(this.hellspawnb2.volume>1 || this.hellspawnh2.volume>1 || this.drum2.volume>1 || this.nnxt2.volume>1){
            this.hellspawnb2.volume=1;
            this.hellspawnh2.volume=1;
            this.drum2.volume=1;
            this.nnxt2.volume=1;
        }
        if(this.hellspawnb.volume>1 || this.hellspawnh.volume>1 || this.drum.volume>1 || this.nnxt.volume>1){
            this.hellspawnb.volume=1;
            this.hellspawnh.volume=1;
            this.drum.volume=1;
            this.nnxt.volume=1;
        }
        if(this.turn==1){
            if(this.hellspawnb.volume<0.9){
                this.hellspawnb.volume=1;
                this.hellspawnh.volume=1;
                this.drum.volume=1;
                this.nnxt.volume=1;
            }
            if(this.hellspawnb2.volume>0.1){
                this.hellspawnb2.volume=0;
                this.hellspawnh2.volume=0;
                this.drum2.volume=0;
                this.nnxt2.volume=0;
            }
        }
        if(this.turn==2){
            if(this.hellspawnb2.volume<0.9){
                this.hellspawnb2.volume=1;
                this.hellspawnh2.volume=1;
                this.drum2.volume=1;
                this.nnxt2.volume=1;
            }
            if(this.hellspawnb.volume>0.1){
                this.hellspawnb.volume=0;
                this.hellspawnh.volume=0;
                this.drum.volume=0;
                this.nnxt.volume=0;
            }
        }
    }
    music.calculate=function(){
        if(this.hellspawnb.currentTime>=this.hellspawnb.duration/8*5 && this.turn==1){ 
            this.hellspawnb2.currentTime=this.hellspawnb.currentTime-this.hellspawnh.duration/2+0.094339658203125;
            this.hellspawnh2.currentTime=this.hellspawnb.currentTime-this.hellspawnh.duration/2+0.094339658203125;
            this.drum2.currentTime=this.hellspawnb.currentTime-this.hellspawnh.duration/2+0.094339658203125;
            this.nnxt2.currentTime=this.hellspawnb.currentTime-this.hellspawnh.duration/2+0.094339658203125;
            this.turn=2;
        }
        if(this.hellspawnb2.currentTime>=this.hellspawnb2.duration/8*5 && this.turn==2){ 
            this.hellspawnb.currentTime=this.hellspawnb2.currentTime-this.hellspawnh2.duration/2+0.094339658203125;
            this.hellspawnh.currentTime=this.hellspawnb2.currentTime-this.hellspawnh2.duration/2+0.094339658203125;
            this.drum.currentTime=this.hellspawnb2.currentTime-this.hellspawnh2.duration/2+0.094339658203125;
            this.nnxt.currentTime=this.hellspawnb2.currentTime-this.hellspawnh2.duration/2+0.094339658203125;
            this.turn=1;
        }
        if(this.hellspawnb2.currentTime>this.hellspawnb2.duration-this.hellspawnb2.duration/8){
            this.hellspawnb2.currentTime=0;
            this.hellspawnh2.currentTime=0;
            this.drum2.currentTime=0;
            this.nnxt2.currentTime=0;
            this.hellspawnb2.play();
            this.hellspawnh2.play();
            this.drum2.play();
            this.nnxt2.play();

        }
        if(this.hellspawnb.currentTime>this.hellspawnb.duration-this.hellspawnb.duration/8){
            this.hellspawnb.currentTime=0;
            this.hellspawnh.currentTime=0;
            this.drum.currentTime=0;
            this.nnxt.currentTime=0;
            this.hellspawnb.play();
            this.hellspawnh.play();
            this.drum.play();
            this.nnxt.play();
        }
    }
    music.play=function(){
        this.turn=1;
        this.hellspawnb.play();
        this.hellspawnh.play();
        this.drum.play();
        this.nnxt.play();
        this.hellspawnb2.play();
        this.hellspawnh2.play();
        this.drum2.play();
        this.nnxt2.play();
        this.hellspawnb.volume=0.9;
        this.hellspawnh.volume=0.9;
        this.drum.volume=0.9;
        this.nnxt.volume=0.9;
        this.hellspawnb2.volume=0;
        this.hellspawnh2.volume=0;
        this.drum2.volume=0;
        this.nnxt2.volume=0;
        setInterval(function(){
            music.calculate();
            music.fade();
            music.control();
            /*AUDIO DEBUG
            document.getElementById('music1').getElementsByTagName('input')[0].value=music.hellspawnb.currentTime;
            document.getElementById('music1').getElementsByTagName('input')[1].value=music.hellspawnb.volume;
            document.getElementById('music2').getElementsByTagName('input')[0].value=music.hellspawnb2.currentTime;
            document.getElementById('music2').getElementsByTagName('input')[1].value=music.hellspawnb2.volume;
            */
        },1);
    }

    //DEBUGGING VAR
    var speedfactor = 50;
    var fgDepth = 2;
    var bgDepth = 50;

    //Appearance
    var nebulaeColor = [255,255,255];
    var nebulaeDepth = 0.5;
    //EVENT LISTENER    

    window.addEventListener("mousedown", mousedn, true); 
    window.addEventListener("mouseup", mouseup, true); 
    window.addEventListener("mousemove", mousemv, true); 
    window.addEventListener("keydown", keydown, true); 
    window.addEventListener("keyup", keyup, true);

    //start game
    music.play();
    setInterval(function(){
        game();
    },10);



    var mouseisdown = false;
    function mousedn(e){
        mouseIsDown = 1;
        mouseClickX = e.pageX - canvas.offsetLeft;
        mouseClickY = e.pageY - canvas.offsetTop;
    }
    function mouseup(e){
        mouseisdown = false;
        mouseReleaseX = e.pageX - canvas.offsetLeft;
        mouseReleaseY = e.pageY - canvas.offsetTop;
    }

    function mousemv(e){
        mousePositionX = e.pageX - canvas.offsetLeft;
        mousePositionY = e.pageY - canvas.offsetTop;
    }


    function keydown(e){
        if(e.keyCode==32 && keypress[32]==false && inshop==0){
            ship.shoot();
        }
        keypress[e.keyCode]=true;
    }
    function keyup(e){
        keypress[e.keyCode]=false;
    }
    function detectKey(){
        inert();
        ship.x+=0.5*inertia;
        if((ship.x-ship.width/2)<0){
            ship.x=0+ship.width/2;
        }
        if((ship.x+ship.width/2)>width){
            ship.x=width-ship.width/2;
        }

    }
    function inert(){    
        if(keypress[65]||keypress[37] && !(keypress[68]||keypress[39])){
            if((ship.x-ship.width/2)>0 && inertia>-10){
                inertia-=1;
            }
            else{
                if(inertia<0)
                    inertia++;
            }
        }
        else if(keypress[68]||keypress[39] && !(keypress[65]||keypress[37])){
            if((ship.x+ship.width/2)<width && inertia<10){
                inertia+=1;
            }
            else{
                if(inertia>0)
                    inertia--;
            }

        }
        else{
            if(inertia<0)
                inertia++;
            if(inertia>0)
                inertia--;
        }
    }


    //fungsi utama
    function game(){
        //Fungsi untuk menjembatani antar gamestate
        ctx.clearRect(0,0,width,height);
        if(gamestate==0){
            mainmenu();
        }
        if(gamestate>0 && gamestate<4){
            play();
        }
        if(gamestate==4){
            loseScreen();
        }
        if(gamestate==5){
            creditmenu();
        }
        //Looping fungsi game
        //Loop agar bisa kembali ke gamestate di atas
    }


    function mainmenu(){
        //Refresh screen
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,width,height);
        ctx.fillStyle = "white";

        //Print title
        title();

        //Membuat object button launch
        buttonPosX=width/2;
        buttonPosY=height/16*9;
        buttonW=200;
        buttonH=100;
        button(buttonPosX,buttonPosY,buttonW,buttonH,3,2,"Launch",40);
        //Deteksi mousehover button launch
        //Ketika mousehover button launch, button ditutupi overlay putih (efek menyala)
        if(mouseHover(buttonPosX-buttonW/2,buttonPosX+buttonW/2,buttonPosY-buttonH/2,buttonPosY+buttonH/2)){
            ctx.save();
            ctx.beginPath();
            ctx.globalAlpha=0.9;
            ctx.translate(buttonPosX,buttonPosY);
            ctx.fillRect(-100,-50,200,100);
            ctx.restore();
        }
        //Deteksi click button launch
        //Ketika dilakukan click, ubah gamestate menjadi 1
        if(clickButton(buttonPosX-buttonW/2,buttonPosX+buttonW/2,buttonPosY-buttonH/2,buttonPosY+buttonH/2)){
            initialized=0;
            bgObj = [];
            fgObj = [];
            alienObj = [];
            friendlyBullet = [];
            enemyBullet = [];
            stage=1;
            nextStage=1;
            materialamount=20;
            bulletamount=0;
            score=0;
            shield=0;
            ship.x = width/2;
            ship.y = height - 2 - ship.height;
            sync=(new Date).getTime()+10;
            shipspeed=100;
            inshop=0;
            alienDestroyed=1;
            gamestate=1;
        }


        //CREDITBUTTON
        creditPosY=height/4*3;
        button(buttonPosX,creditPosY,buttonW,buttonH,3,2,"Credit",40);

        if(mouseHover(buttonPosX-buttonW/2,buttonPosX+buttonW/2,creditPosY-buttonH/2,creditPosY+buttonH/2)){
            ctx.save();
            ctx.beginPath();
            ctx.globalAlpha=0.9;
            ctx.translate(buttonPosX,creditPosY);
            ctx.fillRect(-100,-50,200,100);
            ctx.restore();
        }
        if(clickButton(buttonPosX-buttonW/2,buttonPosX+buttonW/2,creditPosY-buttonH/2,creditPosY+buttonH/2)){
            gamestate=5;
        }


        //Loop jika gamestate masih 0
        //Keluar jika else
    }

    function play(){
        //Refresh Screen
        ctx.clearRect(0,0,width,height);
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,width,height);
        ctx.fillStyle = "white";
        //Unit waktu
        //dan
        //Spawn Star
        if(iterator>bgDepth/shipspeed)
            iterator=0;
        if(iterator==0)
            bgObj.push(spawnBgObj("star"));    


        checkCollide();

        detectKey();
        //Gamestate
        if(gamestate==1){
            //Shop pertama kali sebelum bermain

            if(initialized==1 && inshop==0){
                //Menyalakan state inshop.
                //Mengatur waktu kapan shop dihentikan.
                //(new Date).getTime() => Mengambil waktu pada saat ini dalam wujud millisecond.
                //endShop adalah currentShop (waktu pada saat ini) ditambah 20 second (20*1000 millisecond)
                inshop=1;
                currentShop = (new Date).getTime();
                endShop = currentShop + 20*1000;
            }
            if(initialized==1 && currentShop>endShop){
                //Ketika waktu habis (currentShop lebih besar / sama dengan endShop) maka shop dimatikan (inshop=0)
                //Mengembalikan nilai gamestate ke 2
                inshop=0;
                gamestate=2;
            }
            if(initialized==1 && inshop==1){
                //Ketika inshop
                //currentShop (waktu pada saat ini) selalu diupdate.
                currentShop = (new Date).getTime();
            }
        }
        if(gamestate==2){
            if(iterator==0)
                score+=0.25;
            //Game pada state bermain
            if(inshop==1)       //Error Handling, kalo masih ada di state inshop, dimatikan
                inshop=0;
            //Melakukan penghitungan dan spawning object foreground
            //Melakukan penghitungan pergantian stage
            if(initialized){
                calculateSpawn();
            }

            //Stage
            if(stage == 3){
                if(innebulae==0)
                    startnebulae();
            }
            else{
                if(innebulae==1)
                    endnebulae();
            }
            if(stage == 4){
                if(alienObj.length==0 && alienDestroyed==0){
                    alienObj.push(spawnAlienObj());
                    stageTime = 0;
                }
            }
            if(alienObj.length==0 && alienDestroyed==1){
                stageRandomizer();
            }
        }
        if(gamestate==3){
            //Sama dengan gamestate 1 dengan perbedaan:
            //  -Waktu countdown shop dirandom
            //  -Tidak ada deteksi "if initialization is finished"
            if(inshop == 1 && currentShop>endShop){
                inshop=0;
                gamestate=2;
            }
            if(inshop==0 && fgObj.length==0 && alienObj.length==0){
                inshop=1;
                currentShop = (new Date).getTime();
                endShop = currentShop + (10+Math.round(Math.random()*10))*1000;
            }
            if(inshop==1){
                currentShop = (new Date).getTime();
            }
        }
        //Menambahkan iterator
        //Diletakkan di bawah gamestate karena beberapa proses penghitungan pada gamestate membutuhkan iterator==0
        currentSecond = (new Date).getTime();

        iterator++;

        //Memproses object pada background
        //Memanggil trashCollector untuk array background
        processBackground();  
        trashCollector(bgObj);
        processBullet();

        //Memproses object pada foreground
        //Memanggil trashCollector untuk array foreground
        if(fgObj.length>0){
            processForeground();
            trashCollector(fgObj);
        }
        if(friendlyBullet.length>0)
            bulletCollector(friendlyBullet);
        if(enemyBullet.length>0)
            bulletCollector(enemyBullet);
        if(alienObj.length>0){
            processUFO();
        }

        //Render game hanya setelah initialization selesai.
        if(initialized){
            render();
        }
        else{
            //Ketika belum selesai, loading screen
            ctx.save();
            ctx.translate(width/2,0);
            for(var i=0;i<2;i++){

            }


            ctx.fillStyle="white";
            ctx.scale(3,3);
            ctx.font="15px Myriad Pro";
            ctx.textAlign = "center";
            ctx.fillText("Launching", 0, 0+height/12);
            ctx.fillText("Please Wait", 0, 26+height/12);
            ctx.restore();
        }

        //Looping fungsi play
        //Menjalankan gameplay ketika gamestate != 0 (main menu) && gamestate != 4 (kalah)

        while(initialized && (new Date).getTime()<sync){
        }
        if(initialized){
            sync = sync+20;
        }
    }



    function render(){
        renderBackground();
        renderForeground();
        renderShip();
        renderUFO();
        renderBullet();
        if(innebulae){
            renderNebulae();
        }
        showscore();
        showlocation();
        showmaterialamount();
        if(inshop)
            renderShop();


        //debugging
        /**/
    }

    function renderBackground(){
        //untuk setiap background object yang ada dalam canvas, render.
        ctx.save();
        ctx.lineWidth=2;
        for(var i=0;i<bgObj.length;i++){
            if(bgObj[i].type=="star"){
                if(bgObj[i].y+bgObj[i].height>0 && bgObj[i].y-bgObj[i].height<height)
                    renderStar(bgObj[i]);            
            }
        }
        ctx.restore();
    }

    function renderForeground(){
        //Untuk foreground object yang ada di dalam screen, render. Yang ada di luar screen, tampilkan indicator. 
        for(var i=0;i<fgObj.length;i++){
            if(fgObj[i].y+fgObj[i].height>0 && fgObj[i].y-fgObj[i].height<height){
                if(fgObj[i].type==0)
                    renderAsteroid(fgObj[i]);
                if(fgObj[i].type==1)
                    renderMaterial(fgObj[i]);
            }
            else{
                showIndicator(fgObj[i]);
            }
        }
    }

    function renderShop(){
        //belum jadi

        var boxw=width-20;
        var boxh=height-270;


        ctx.save();

        ctx.strokeStyle="white";
        ctx.translate(width/2,height/8);
        ctx.fillStyle="rgba(0,0,0,0.8)";
        ctx.strokeRect(-boxw/2,0,boxw,boxh);
        ctx.fillRect(-boxw/2,0,boxw,boxh);
        ctx.textAlign = "center";
        ctx.font="15px Myriad Pro";
        ctx.fillStyle="white";
        ctx.fillText("asteroid incoming in", 0, 30);
        ctx.font="30px Myriad Pro";
        ctx.fillText(Math.floor((endShop-currentShop)/1000+1), 0, 60);

        ctx.restore();

        ctx.save();
        ctx.translate(width/2,0)
        buttonPosX=-width/4+8;
        buttonPosY=height/80*42;
        buttonW=170;
        buttonH=150;
        ctx.textAlign="center";
        ctx.font="18px Myriad Pro";
        ctx.fillText("Craft Ammo",buttonPosX,buttonPosY+20);
        ctx.fillText("Generate Shield",-buttonPosX,buttonPosY+20);
        button(buttonPosX,buttonPosY,buttonW,buttonH,3,2,"",40);
        button(-buttonPosX,buttonPosY,buttonW,buttonH,3,2,"",40);
        //Deteksi mousehover button launch
        //Ketika mousehover button launch, button ditutupi overlay putih (efek menyala)
        if(mouseHover(buttonPosX-buttonW/2+width/2,buttonPosX+buttonW/2+width/2,buttonPosY-buttonH/2,buttonPosY+buttonH/2)){
            if(materialamount>=1){
                ctx.save();
                ctx.fillStyle="white";
                ctx.beginPath();
                ctx.globalAlpha=0.8;
                ctx.translate(buttonPosX,buttonPosY);
                ctx.fillRect(-buttonW/2,-buttonH/2,buttonW,buttonH);
                ctx.restore();
                ctx.fillStyle="black";
            }
            else{
                ctx.fillStyle="red";
            }
            ctx.fillText("1 material",buttonPosX,buttonPosY-20);
        }
        if(mouseHover(-buttonPosX-buttonW/2+width/2,-buttonPosX+buttonW/2+width/2,buttonPosY-buttonH/2,buttonPosY+buttonH/2)){
            if(materialamount>=4){
                ctx.save();
                ctx.fillStyle="white";
                ctx.beginPath();
                ctx.globalAlpha=0.8;
                ctx.translate(-buttonPosX,buttonPosY);
                ctx.fillRect(-buttonW/2,-buttonH/2,buttonW,buttonH);
                ctx.restore();
                ctx.fillStyle="black";
            }
            else{
                ctx.fillStyle="red";
            }
            ctx.fillText("4 material",-buttonPosX,buttonPosY-20);
        }
        if(clickButton(buttonPosX-buttonW/2+width/2,buttonPosX+buttonW/2+width/2,buttonPosY-buttonH/2,buttonPosY+buttonH/2)){
            if(materialamount>=1){
                bulletamount++;
                materialamount-=1;
            }
        }
        if(clickButton(-buttonPosX-buttonW/2+width/2,-buttonPosX+buttonW/2+width/2,buttonPosY-buttonH/2,buttonPosY+buttonH/2)){
            if(materialamount>=4){
                shield++;
                materialamount-=4;
            }

        }
        //Deteksi click button launch
        //Ketika dilakukan click, ubah gamestate menjadi 1
        if(clickButton(buttonPosX-buttonW/2,buttonPosX+buttonW/2,buttonPosY-buttonH/2,buttonPosY+buttonH/2)){
        }
        ctx.restore();



    }

    function renderNebulae(){
        //var range = height-height/2;

        /*
        ctx.save();
        //Nebulae radial gradient

        ctx.translate(width/2,height);
        ctx.strokeStyle="red";
        ctx.lineWidth=50;
        for(var i=height/2; i<=height+30 || i<=width; i+=7){
            ctx.beginPath();
            ctx.arc(0, 0, i, 0, Math.PI, true);
            ctx.globalAlpha= 0.1 + 0.7*((i-height/2)/range);
            ctx.stroke();
        }
        ctx.restore();*/

        //
        if(flicker(900)){
            if(flicker(500)){
               nebulaeDepth+=0.01;
            }
            else{
               nebulaeDepth-=0.01;
            }
        }

        if(nebulaeDepth>1){
            nebulaeDepth = 1;
        }
        else if(nebulaeDepth<0){
            nebulaeDepth = 0;
        }

        ctx.save();
        ctx.fillStyle= "rgb("+nebulaeColor[0]+","+nebulaeColor[1]+","+nebulaeColor[2]+")";
        ctx.globalAlpha = nebulaeDepth;
        ctx.fillRect(0,0,width,height);
        ctx.restore();

        if(flicker(990)){
            ctx.save();
            ctx.fillStyle="white";
            ctx.beginPath();
            ctx.globalAlpha= Math.random();
            ctx.fillRect(0,0,width,height);
            ctx.restore();
        }
    }

    function renderStar(object){
        var scale = 3;
        ctx.save();
        ctx.beginPath();
        ctx.translate(object.x,object.y);
        ctx.moveTo(0,0);
        var f = Math.random()*0.8;
        ctx.globalAlpha=1-f;
        ctx.lineTo(0,2);
        ctx.strokeStyle="white";
        ctx.stroke();
        ctx.translate(-object.x,-object.y);
        ctx.restore();
    }

    function renderAsteroid(asteroid){
        ctx.save();
        ctx.beginPath();
        ctx.translate(asteroid.x,asteroid.y);
        ctx.fillStyle="Gray";
        ctx.fillRect(-asteroid.width/2,-asteroid.height/2,asteroid.width,asteroid.height);
        ctx.restore();
    }

    function renderMaterial(material){
        ctx.save();
        ctx.beginPath();
        ctx.translate(material.x,material.y);;
        ctx.strokeStyle="DeepSkyBlue";
        ctx.arc(0,0,material.width/2,0,Math.PI*2,true);
        ctx.stroke();
        ctx.restore();
    }

    function renderShip(){
        var bulletColor;
        var bulletNum;
        ctx.translate(ship.x,ship.y);

        //BOX
        ctx.beginPath();
        ctx.strokeStyle="white";
        ctx.strokeRect(-ship.width/2,-ship.height/2,ship.width,ship.height);

        drawShield();
        drawBullet();
        drawSpaceShip();



        ctx.translate(-ship.x,-ship.y);
    }

    function renderUFO(){
        for(var i = 0; i<alienObj.length; i++){
            var index = i;
            //bounding box
            ctx.save();

            ctx.strokeStyle="red";
            ctx.translate(alienObj[index].x,alienObj[index].y);
            ctx.strokeRect(-alienObj[index].width/2,-alienObj[index].height/2,alienObj[index].width,alienObj[index].height);
            ctx.scale(0.2,0.2);
            drawUFO();
            ctx.restore();

        }
    }

    function renderBullet(){
        for(var i = 0; i<enemyBullet.length; i++){
            var index = i;
            //bounding box
            ctx.save();

            ctx.fillStyle="red";
            ctx.translate(enemyBullet[index].x,enemyBullet[index].y);
            ctx.fillRect(-enemyBullet[index].width/2,-enemyBullet[index].height/2,enemyBullet[index].width,enemyBullet[index].height);

            ctx.restore();
        }
        for(var i = 0; i<friendlyBullet.length; i++){
            var index = i;
            //bounding box
            ctx.save();

            ctx.fillStyle="blue";
            ctx.translate(friendlyBullet[index].x,friendlyBullet[index].y);
            ctx.fillRect(-friendlyBullet[index].width/2,-friendlyBullet[index].height/2,friendlyBullet[index].width,friendlyBullet[index].height);

            ctx.restore();
        }
    }

    function drawShield(){
        ctx.save();
        ctx.strokeStyle="deepskyblue";
        for(var i = 0; i<shield;i++){
            var index = i;
            ctx.beginPath();
            ctx.globalAlpha=0.1+index*0.1;
            ctx.arc(0,0,ship.width-5+(shield-index),0,Math.PI*2,true);
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawBullet(){
        ctx.save();
        if(bulletamount==0){
            bulletColor="red";
            bulletNum = "empty";
        }
        else{
            bulletColor="white";
            bulletNum = bulletamount;
        }
        ctx.font="12px myriad pro";
        ctx.beginPath();
        ctx.lineWidth=1;
        ctx.strokeStyle = bulletColor;
        ctx.fillStyle = bulletColor;
        ctx.lineWidth=4;
        ctx.moveTo(-ship.width/2,-ship.height/2-4);
        ctx.lineTo(-ship.width/2,-ship.height/2-7);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth=2;
        ctx.moveTo(-ship.width/2,-ship.height/2-5);
        ctx.lineTo(-ship.width/2+10,-ship.height/2-15);
        ctx.lineTo(-ship.width/2+10+ship.width,-ship.height/2-15)
        ctx.stroke();
        ctx.fillText("bullet: "+bulletNum,-ship.width/2+12,-ship.height/2-20)
        ctx.restore();
    }

    function drawSpaceShip(){
        var atasbawah=-22.5;//-22,5 kudune
        var kanankiri=0;
        var scale=0.2;


        //ctx.beginPath();
        //ctx.moveTo(width/2,0);
        //ctx.lineTo(width/2, height);
        //ctx.moveTo(0,height/2);
        //ctx.lineTo(width, height/2);
        //ctx.stroke();

        //fungsi buat nulis koordinat mouse
        //ctx.strokeStyle="black";
        //pesawat
        ctx.save();
        ctx.scale(scale,scale);


        //variable hubbody untuk penghubung sayap depan dengan badan
        var hubbody0 = [-55,-65];
        var hubbody1 = [-23,-29];
        var hubbody2 = [-27,45];
        var hubbody3 = [-60,5];

        //HUBBODY
        //kiri
        ctx.beginPath();
        ctx.moveTo(hubbody0[0],hubbody0[1]);
        ctx.lineTo(hubbody1[0],hubbody1[1]);
        ctx.lineTo(hubbody2[0],hubbody2[1]);
        ctx.lineTo(hubbody3[0],hubbody3[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(145,49,2)";
        ctx.fill();

        //kiri
        ctx.beginPath();
        ctx.moveTo(-hubbody0[0],hubbody0[1]);
        ctx.lineTo(-hubbody1[0],hubbody1[1]);
        ctx.lineTo(-hubbody2[0],hubbody2[1]);
        ctx.lineTo(-hubbody3[0],hubbody3[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(145,49,2)";
        ctx.fill();


        //variable hubwings untuk penghubung sayap depan dengan sayap belakang
        var hubwings0 = [-62,70];
        var hubwings1 = [-62,140];
        var hubwings2 = [-122,49];
        var hubwings3 = [-122,0];

        //HUBWINGS
        //kiri
        ctx.beginPath();
        ctx.moveTo(hubwings0[0],hubwings0[1]);
        ctx.lineTo(hubwings1[0],hubwings1[1]);
        ctx.lineTo(hubwings2[0],hubwings2[1]);
        ctx.lineTo(hubwings3[0],hubwings3[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(145,49,2)";
        ctx.fill();

        //kanan
        ctx.beginPath();
        ctx.moveTo(-hubwings0[0],hubwings0[1]);
        ctx.lineTo(-hubwings1[0],hubwings1[1]);
        ctx.lineTo(-hubwings2[0],hubwings2[1]);
        ctx.lineTo(-hubwings3[0],hubwings3[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(145,49,2)";
        ctx.fill();


        //variable body
        var body0 = [0,-160];
        var body1 = [-25,-120];
        var body2 = [-40,40];
        var body3 = [-15,130];
        var body4 = [0,135];

        //BODY
        ctx.beginPath();
        ctx.moveTo(body0[0],body0[1]);
        //kiri
        ctx.lineTo(body1[0],body1[1]);
        ctx.lineTo(body2[0],body2[1]);
        ctx.lineTo(body3[0],body3[1]);
        ctx.lineTo(body4[0],body4[1]);
        //kanan
        ctx.lineTo(-body4[0],body4[1]);
        ctx.lineTo(-body3[0],body3[1]);
        ctx.lineTo(-body2[0],body2[1]);
        ctx.lineTo(-body1[0],body1[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(39,43,46)";
        ctx.fill();


        //ACCESSORIS
        //variable accwings depan wings front
        var accwing0 = [-105,-130];
        var accwing1 = [-97,-200];
        var accwing2 = [-45,-150];
        var accwing3 = [accwing0[0]+(accwing2[0]-accwing1[0]),accwing0[1]+(accwing2[1]-accwing1[1])];

        //ACCWINGS
        //kiri
        ctx.beginPath();
        ctx.moveTo(accwing0[0],accwing0[1]);
        ctx.lineTo(accwing1[0],accwing1[1]);
        ctx.lineTo(accwing2[0],accwing2[1]);
        ctx.lineTo(accwing3[0],accwing3[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(172,57,2)";
        ctx.fill();

        //kanan
        ctx.beginPath();
        ctx.moveTo(-accwing0[0],accwing0[1]);
        ctx.lineTo(-accwing1[0],accwing1[1]);
        ctx.lineTo(-accwing2[0],accwing2[1]);
        ctx.lineTo(-accwing3[0],accwing3[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(172,57,2)";
        ctx.fill();


        //variable wings front
        var wingF0 = [-40,-130];
        var wingF1 = [-110,-200];
        var wingF2 = [-140,-5];
        var wingF3 = [wingF2[0]+90,wingF2[1]+100];

        //WINGS FRONT
        //kiri
        ctx.beginPath();
        ctx.moveTo(wingF0[0],wingF0[1]);
        ctx.lineTo(wingF1[0],wingF1[1]);
        ctx.lineTo(wingF2[0],wingF2[1]);
        ctx.lineTo(wingF3[0],wingF3[1]);  
        ctx.closePath();
        ctx.fillStyle = "rgb(46,49,52)";
        ctx.fill();

        //kanan
        ctx.beginPath();
        ctx.moveTo(-wingF0[0],wingF0[1]);
        ctx.lineTo(-wingF1[0],wingF1[1]);
        ctx.lineTo(-wingF2[0],wingF2[1]);
        ctx.lineTo(-wingF3[0],wingF3[1]);  
        ctx.closePath();
        ctx.fillStyle = "rgb(46,49,52)";
        ctx.fill();


        //variable rocket
        var rocket0 = [-102,130];
        var rocket1 = [-102,175];//175
        var rocket3 = [-62,175];//175
        var rocket2 = [(rocket1[0]+rocket3[0])/2 , (rocket1[1]+rocket3[1])/2 + 10];
        var rocket4 = [-62,130];

        //api
        ctx.save();
        if(delayKnalpot==0){
            intensity = Math.random()/5;
            biru=255-Math.floor(Math.random()*50);
            hijau=255-Math.floor(Math.random()*50);
            merah=255-Math.floor(Math.random()*10);
        }

        delayKnalpot++;
        delayKnalpot=delayKnalpot%10;
        ctx.globalAlpha=intensity;
        ctx.fillStyle="rgb(100,"+hijau+","+biru+")";

        for(var i = 1; i<20;i++){
            ctx.beginPath();
            ctx.arc(-82,rocket1[1],i,0,2*Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(82,rocket1[1],i,0,2*Math.PI);
            ctx.fill();
        }
        ctx.restore();  

        //ROCKET
        //kiri
        ctx.beginPath();
        ctx.moveTo(rocket0[0],rocket0[1]);
        ctx.lineTo(rocket1[0],rocket1[1]);
        ctx.quadraticCurveTo(rocket2[0],rocket2[1],rocket3[0],rocket3[1]);
        ctx.lineTo(rocket4[0],rocket4[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(177,175,182)";
        ctx.fill();

        //kanan
        ctx.beginPath();
        ctx.moveTo(-rocket0[0],rocket0[1]);
        ctx.lineTo(-rocket1[0],rocket1[1]);
        ctx.quadraticCurveTo(-rocket2[0],rocket2[1],-rocket3[0],rocket3[1]);
        ctx.lineTo(-rocket4[0],rocket4[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(177,175,182)";
        ctx.fill();


        //variable exhaust
        var exhaust0 = [-120,100];
        var exhaust1 = [-79,100];
        var exhaust2 = [-53,140];
        var exhaust3 = [-53,170];
        var exhaust4 = [-110,170];

        //EXHAUST
        //kiri
        ctx.beginPath();
        ctx.moveTo(exhaust0[0],exhaust0[1]);
        ctx.lineTo(exhaust1[0],exhaust1[1]);
        ctx.lineTo(exhaust2[0],exhaust2[1]);
        ctx.lineTo(exhaust3[0],exhaust3[1]);
        ctx.lineTo(exhaust4[0],exhaust4[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(66,70,74)";
        ctx.fill();

        //kanan
        ctx.beginPath();
        ctx.moveTo(-exhaust0[0],exhaust0[1]);
        ctx.lineTo(-exhaust1[0],exhaust1[1]);
        ctx.lineTo(-exhaust2[0],exhaust2[1]);
        ctx.lineTo(-exhaust3[0],exhaust3[1]);
        ctx.lineTo(-exhaust4[0],exhaust4[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(66,70,74)";
        ctx.fill();


        //variable wings back
        var wingB0 = [-150,-10];
        var wingB1 = [-130,110];
        var wingB2 = [-20,190];

        //WINGS BACK
        //kiri
        ctx.beginPath();
        ctx.moveTo(wingB0[0],wingB0[1]);
        ctx.lineTo(wingB1[0],wingB1[1]);
        ctx.lineTo(wingB2[0],wingB2[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(46,49,52)";
        ctx.fill();

        //kanan
        ctx.beginPath();
        ctx.moveTo(-wingB0[0],wingB0[1]);
        ctx.lineTo(-wingB1[0],wingB1[1]);
        ctx.lineTo(-wingB2[0],wingB2[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(46,49,52)";
        ctx.fill();


        //ACCESSORIS
        //variable edgewings atas sayap depan pinggir dalam
        var edgewings0 = [-40,-130];
        var edgewings1 = [-42,-90];
        var edgewings2 = [-60,-65];
        var edgewings3 = [-64,0];
        var edgewings4 = [-47,35];
        var edgewings5 = [-50,95];
        var edgewings6 = [-58,86];
        var edgewings7 = [-55,38];
        var edgewings8 = [-74,0];
        var edgewings9 = [-69,-70];
        var edgewings10 = [-49,-95];
        var edgewings11 = [-48,-138];

        //EDGEWINGS
        //kiri
        ctx.beginPath();
        ctx.moveTo(edgewings0[0],edgewings0[1]);
        ctx.lineTo(edgewings1[0],edgewings1[1]);
        ctx.lineTo(edgewings2[0],edgewings2[1]);
        ctx.lineTo(edgewings3[0],edgewings3[1]);
        ctx.lineTo(edgewings4[0],edgewings4[1]);
        ctx.lineTo(edgewings5[0],edgewings5[1]);
        ctx.lineTo(edgewings6[0],edgewings6[1]);
        ctx.lineTo(edgewings7[0],edgewings7[1]);
        ctx.lineTo(edgewings8[0],edgewings8[1]);
        ctx.lineTo(edgewings9[0],edgewings9[1]);
        ctx.lineTo(edgewings10[0],edgewings10[1]);
        ctx.lineTo(edgewings11[0],edgewings11[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(218,73,3)";
        ctx.fill();

        //kanan
        ctx.beginPath();
        ctx.moveTo(-edgewings0[0],edgewings0[1]);
        ctx.lineTo(-edgewings1[0],edgewings1[1]);
        ctx.lineTo(-edgewings2[0],edgewings2[1]);
        ctx.lineTo(-edgewings3[0],edgewings3[1]);
        ctx.lineTo(-edgewings4[0],edgewings4[1]);
        ctx.lineTo(-edgewings5[0],edgewings5[1]);
        ctx.lineTo(-edgewings6[0],edgewings6[1]);
        ctx.lineTo(-edgewings7[0],edgewings7[1]);
        ctx.lineTo(-edgewings8[0],edgewings8[1]);
        ctx.lineTo(-edgewings9[0],edgewings9[1]);
        ctx.lineTo(-edgewings10[0],edgewings10[1]);
        ctx.lineTo(-edgewings11[0],edgewings11[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(218,73,3)";
        ctx.fill();


        //variable linewings bagian sayap depan pinggir luar
        var linewings0 = [wingF2[0],wingF2[1]];
        var linewings1 = [-75,-165];
        var linewings2 = [-110,-200];

        //LINEWINGS
        //kiri
        ctx.beginPath();
        ctx.moveTo(linewings0[0],linewings0[1]);
        ctx.lineTo(linewings1[0],linewings1[1]);
        ctx.lineTo(linewings2[0],linewings2[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(90,96,101)";
        ctx.fill();

        //kanan
        ctx.beginPath();
        ctx.moveTo(-linewings0[0],linewings0[1]);
        ctx.lineTo(-linewings1[0],linewings1[1]);
        ctx.lineTo(-linewings2[0],linewings2[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(90,96,101)";
        ctx.fill();


        //variable accwingsB bagian sayap belakang
        var accwingsB0 = [31,182];
        var accwingsB1 = [65,133];
        var accwingsB2 = [80,125];
        var accwingsB3 = [150,-10];
        var accwingsB4 = [20,190];

        //ACCWINGSB
        //kanan
        ctx.beginPath();
        ctx.moveTo(accwingsB0[0],accwingsB0[1]);
        ctx.lineTo(accwingsB1[0],accwingsB1[1]);
        ctx.lineTo(accwingsB2[0],accwingsB2[1]);
        ctx.lineTo(accwingsB3[0],accwingsB3[1]);
        ctx.lineTo(accwingsB4[0],accwingsB4[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(218,73,3)";
        ctx.fill();

        //kiri
        ctx.beginPath();
        ctx.moveTo(-accwingsB0[0],accwingsB0[1]);
        ctx.lineTo(-accwingsB1[0],accwingsB1[1]);
        ctx.lineTo(-accwingsB2[0],accwingsB2[1]);
        ctx.lineTo(-accwingsB3[0],accwingsB3[1]);
        ctx.lineTo(-accwingsB4[0],accwingsB4[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(218,73,3)";
        ctx.fill();


        //variable linebody bagian belakang pinggir badan
        var linebody0 = [-5,-45];
        var linebody1 = [-5,125];
        var linebody2 = [-37,17];
        var linebody3 = [-37,0];
        var linebody4 = [-11,82];
        var linebody5 = [linebody4[0],-45];

        //LINEBODY
        //kiri
        ctx.beginPath();
        ctx.moveTo(linebody0[0],linebody0[1]);
        ctx.lineTo(linebody1[0],linebody1[1]);
        ctx.lineTo(linebody2[0],linebody2[1]);
        ctx.lineTo(linebody3[0],linebody3[1]);
        ctx.lineTo(linebody4[0],linebody4[1]);
        ctx.lineTo(linebody5[0],linebody5[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(218,73,3)";
        ctx.fill();

        //kanan
        ctx.beginPath();
        ctx.moveTo(-linebody0[0],linebody0[1]);
        ctx.lineTo(-linebody1[0],linebody1[1]);
        ctx.lineTo(-linebody2[0],linebody2[1]);
        ctx.lineTo(-linebody3[0],linebody3[1]);
        ctx.lineTo(-linebody4[0],linebody4[1]);
        ctx.lineTo(-linebody5[0],linebody5[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(218,73,3)";
        ctx.fill();


        //variable midwindow bagian tengah badan 
        var midwindow0 = [-5,-90];
        var midwindow1 = [-midwindow0[0],midwindow0[1]];
        var midwindow2 = [0,-85];
        var midwindow3 = [25,-50];
        var midwindow4 = [-25,-50];
        var midwindow5 = [0,-25];

        //MIDWINDOW
        ctx.beginPath();
        ctx.moveTo(midwindow0[0],midwindow0[1]);
        ctx.quadraticCurveTo(midwindow2[0],midwindow2[1],midwindow1[0],midwindow1[1]);
        ctx.lineTo(midwindow3[0],midwindow3[1]);
        ctx.quadraticCurveTo(midwindow5[0],midwindow5[1],midwindow4[0],midwindow4[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(200,66,2)";
        ctx.fill();


        //variable accbody bagian depan pinggir badan
        var accbody0 = [-3,-146];
        var accbody1 = [accbody0[0],-100];
        var accbody2 = [-26,-55];
        var accbody3 = [-20,-117];

        //ACCBODY
        //kiri
        ctx.beginPath();
        ctx.moveTo(accbody0[0],accbody0[1]);
        ctx.lineTo(accbody1[0],accbody1[1]);
        ctx.lineTo(accbody2[0],accbody2[1]);
        ctx.lineTo(accbody3[0],accbody3[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(200,66,2)";
        ctx.fill();

        //kanan
        ctx.beginPath();
        ctx.moveTo(-accbody0[0],accbody0[1]);
        ctx.lineTo(-accbody1[0],accbody1[1]);
        ctx.lineTo(-accbody2[0],accbody2[1]);
        ctx.lineTo(-accbody3[0],accbody3[1]);
        ctx.closePath();
        ctx.fillStyle = "rgb(200,66,2)";
        ctx.fill();




        ctx.restore();

        ctx.save();
        //ctx.fillStyle="black";
        //ctx.fillText((mX-(width/2)) + "," + (mY-(height/2)),5,10);
        ctx.restore();
    }

    function drawUFO(){
        ctx.beginPath();
        ctx.moveTo(width/2,0);
        ctx.lineTo(width/2, height);
        ctx.moveTo(0,height/2);
        ctx.lineTo(width, height/2);
        ctx.stroke();

        //fungsi buat nulis koordinat mouse
        ctx.strokeStyle="black";
        ctx.save();


        ctx.lineWidth=4;



        //variable CakarBelakang
        var CakarL0 = [0,-88];
        var CakarL1 = [-64,-92];
        var CakarL2 = [-64,-150];
        var CakarL3 = [-116,-129];
        var CakarL4 = [-140,-56];
        var CakarL5 = [-101,-138];
        var CakarL6 = [-54,-70];
        var CakarL7 = [-0,-58];

        ctx.fillStyle= "rgb(33,33,33)";
        ctx.strokeStyle= "red";
        //Cakar
        ctx.beginPath();
        ctx.moveTo(CakarL0[0],CakarL0[1]);
        ctx.quadraticCurveTo(CakarL1[0],CakarL1[1],CakarL2[0],CakarL2[1]);
        ctx.quadraticCurveTo(CakarL3[0],CakarL3[1],CakarL4[0],CakarL4[1]);
        ctx.quadraticCurveTo(CakarL5[0],CakarL5[1],CakarL6[0],CakarL6[1]);
        ctx.lineTo(CakarL7[0],CakarL7[1]);
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-CakarL0[0],CakarL0[1]);
        ctx.quadraticCurveTo(-CakarL1[0],CakarL1[1],-CakarL2[0],CakarL2[1]);
        ctx.quadraticCurveTo(-CakarL3[0],CakarL3[1],-CakarL4[0],CakarL4[1]);
        ctx.bezierCurveTo(-CakarL5[0],CakarL5[1],-CakarL6[0],CakarL6[1], -CakarL7[0],CakarL7[1]);
        ctx.stroke();
        ctx.fill();

        //variable CakarTengah
        var CakarT0 = [0,-48];
        var CakarT1 = [-80,-12];
        var CakarT2 = [-74,-80];
        var CakarT3 = [-140,-69];
        var CakarT4 = [-150,44];
        var CakarT5 = [-117,-80];
        var CakarT6 = [-54,04];
        var CakarT7 = [0,-10];

        ctx.fillStyle= "rgb(33,33,33)";
        ctx.strokeStyle= "red";
        //Cakar
        ctx.beginPath();
        ctx.moveTo(CakarT0[0],CakarT0[1]);
        ctx.quadraticCurveTo(CakarT1[0],CakarT1[1],CakarT2[0],CakarT2[1]);
        ctx.quadraticCurveTo(CakarT3[0],CakarT3[1],CakarT4[0],CakarT4[1]);
        ctx.quadraticCurveTo(CakarT5[0],CakarT5[1],CakarT6[0],CakarT6[1]);
        ctx.lineTo(CakarT7[0],CakarT7[1])
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-CakarT0[0],CakarT0[1]);
        ctx.quadraticCurveTo(-CakarT1[0],CakarT1[1],-CakarT2[0],CakarT2[1]);
        ctx.quadraticCurveTo(-CakarT3[0],CakarT3[1],-CakarT4[0],CakarT4[1]);
        ctx.quadraticCurveTo(-CakarT5[0],CakarT5[1],-CakarT6[0],CakarT6[1]);
        ctx.lineTo(-CakarT7[0],CakarT7[1])
        ctx.stroke();
        ctx.fill();

        //variable CakarBawah
        var CakarB0 = [0,2];
        var CakarB1 = [-80,58];
        var CakarB2 = [-84,-10];
        var CakarB3 = [-150,10];
        var CakarB4 = [-155,124];
        var CakarB5 = [-107,0];
        var CakarB6 = [-54,74];
        var CakarB7 = [0,30];

        ctx.fillStyle= "rgb(33,33,33)";
        ctx.strokeStyle= "red";
        //Cakar
        ctx.beginPath();
        ctx.moveTo(CakarB0[0],CakarB0[1]);
        ctx.quadraticCurveTo(CakarB1[0],CakarB1[1],CakarB2[0],CakarB2[1]);
        ctx.quadraticCurveTo(CakarB3[0],CakarB3[1],CakarB4[0],CakarB4[1]);
        ctx.quadraticCurveTo(CakarB5[0],CakarB5[1],CakarB6[0],CakarB6[1]);
        ctx.lineTo(CakarB7[0],CakarB7[1])
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-CakarB0[0],CakarB0[1]);
        ctx.quadraticCurveTo(-CakarB1[0],CakarB1[1],-CakarB2[0],CakarB2[1]);
        ctx.quadraticCurveTo(-CakarB3[0],CakarB3[1],-CakarB4[0],CakarB4[1]);
        ctx.quadraticCurveTo(-CakarB5[0],CakarB5[1],-CakarB6[0],CakarB6[1]);
        ctx.lineTo(-CakarB7[0],CakarB7[1])
        ctx.stroke();
        ctx.fill();

        //variable BODY ATAS
        var bodyD0 = [0,80];
        var bodyD1 = [-7,70];
        var bodyD2 = [bodyD1[0],100];
        var bodyD3 = [bodyD2[0]-5,bodyD2[1]];
        var bodyD4 = [bodyD3[0],bodyD1[1]];
        var bodyD5 = [-30,90];
        var bodyD6 = [-34,133];
        var bodyD7 = [-20,150];
        var bodyD8 = [-50,102];
        var bodyD9 = [-40,30];
        var bodyD10 = [-32,-10];
        var bodyD11 = [-60,-20];
        var bodyD12 = [-72,-30];
        var bodyD13 = [-0,-150];
        //BODYATAS
        ctx.beginPath();
        ctx.moveTo(bodyD0[0],bodyD0[1]);
        ctx.lineTo(bodyD1[0],bodyD1[1]);
        ctx.lineTo(bodyD2[0],bodyD2[1]);
        ctx.quadraticCurveTo(bodyD3[0],bodyD3[1],bodyD4[0],bodyD4[1]);
        ctx.lineTo(bodyD5[0],bodyD5[1]);
        ctx.quadraticCurveTo(bodyD6[0],bodyD6[1],bodyD7[0],bodyD7[1]);
        ctx.quadraticCurveTo(bodyD8[0],bodyD8[1],bodyD9[0],bodyD9[1]);
        ctx.quadraticCurveTo(bodyD10[0],bodyD10[1],bodyD11[0],bodyD11[1]);
        ctx.quadraticCurveTo(bodyD12[0],bodyD12[1],bodyD13[0],bodyD13[1]);
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-bodyD0[0],bodyD0[1]);
        ctx.lineTo(-bodyD1[0],bodyD1[1]);
        ctx.lineTo(-bodyD2[0],bodyD2[1]);
        ctx.quadraticCurveTo(-bodyD3[0],bodyD3[1],-bodyD4[0],bodyD4[1]);
        ctx.lineTo(-bodyD5[0],bodyD5[1]);
        ctx.quadraticCurveTo(-bodyD6[0],bodyD6[1],-bodyD7[0],bodyD7[1]);
        ctx.quadraticCurveTo(-bodyD8[0],bodyD8[1],-bodyD9[0],bodyD9[1]);
        ctx.quadraticCurveTo(-bodyD10[0],bodyD10[1],-bodyD11[0],bodyD11[1]);
        ctx.quadraticCurveTo(-bodyD12[0],bodyD12[1],-bodyD13[0],bodyD13[1]);
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle="red";
        //EYES
        var Eye1A = [-3,15];
        var Eye1B = [-17,9];
        var Eye1C = [-18,7];

        for(var i = 0; i<3; i++){
            var yoffset = i*10;
            ctx.beginPath()
            ctx.moveTo(Eye1A[0],Eye1A[1]+yoffset);
            ctx.quadraticCurveTo(Eye1B[0],Eye1B[1]+yoffset,Eye1C[0],Eye1C[1]+yoffset);
            ctx.quadraticCurveTo(Eye1B[0]-40,Eye1B[1]-40+yoffset,Eye1A[0],Eye1A[1]+yoffset);
            ctx.fill();

            ctx.beginPath()
            ctx.moveTo(-Eye1A[0],Eye1A[1]+yoffset);
            ctx.quadraticCurveTo(-Eye1B[0],Eye1B[1]+yoffset,-Eye1C[0],Eye1C[1]+yoffset);
            ctx.quadraticCurveTo(-Eye1B[0]+40,Eye1B[1]-40+yoffset,-Eye1A[0],Eye1A[1]+yoffset);
            ctx.fill();

        }

        ctx.restore();
        /*
        ctx.save();
        ctx.fillStyle="black";
        ctx.fillText((mX-(width/2)) + "," + (mY-(height/2)),5,10);
        ctx.restore();*/
    }




















































    //MAIN MENU FUNCTIONS
    function title(){
        ctx.save();
        ctx.translate(width/2,height/5);
        ctx.scale(4,3);
        ctx.font="15px Myriad Pro";
        ctx.textAlign = "center";
        ctx.strokeStyle="white";
        if(flicker(20)){
            if(flicker(990))
                ctx.strokeStyle="deepskyblue";
            else if(flicker(995))
                ctx.strokeStyle="orange";
            ctx.fillText("Alone", 0, 0);
            ctx.strokeText("Alone", 0, 0);
        }
        ctx.strokeStyle="white";
        flickerRandom=Math.floor(Math.random()*1000);
        if(flicker(20)){
            if(flicker(990))
                ctx.strokeStyle="deepskyblue";
            else if(flicker(995))
                ctx.strokeStyle="orange";
            ctx.fillText("and", 0,13);
            ctx.strokeText("and", 0,13);
        }
        ctx.strokeStyle="white";
        flickerRandom=Math.floor(Math.random()*1000);
        if(flicker(20)){
            if(flicker(990))
                ctx.strokeStyle="deepskyblue";
            else if(flicker(995))
                ctx.strokeStyle="orange";
            ctx.fillText("Blind", 0, 26);
            ctx.strokeText("Blind", 0, 26);
        }
        ctx.restore();
    }

    function flicker(chance){
        var flickerRandom;
        flickerRandom=Math.floor(Math.random()*1000);
        chance=chance%1000;
        return flickerRandom>chance;
    }

    function button(posX,posY,w,h,lWidth,fontStrokeWidth,text,fontsize){
        ctx.save();
        ctx.strokeStyle="white";
        ctx.lineWidth=lWidth;
        ctx.translate(posX,posY);
        ctx.strokeRect(-w/2,-h/2,w,h);
        ctx.font=fontsize+"px Myriad Pro";
        ctx.lineWidth=fontStrokeWidth;
        ctx.textAlign = "center";
        ctx.strokeText(text,0,fontsize/3);
        ctx.restore();
    }

    //FOREGROUND FUNCTIONS
    function spawnFgObj(type){
        var fgObj = new Object();
        if(type==0){ // asteroid
            fgObj.x=Math.random()*width;
            fgObj.y=-300-(200*(shipspeed-0.5))-Math.random()*800;
            fgObj.width=50;
            fgObj.height=50;
            fgObj.type=type;
        }
        if(type==1){ // material
            fgObj.x=Math.random()*width;
            fgObj.y=-300-(200*(shipspeed-0.5))-Math.random()*800;
            fgObj.width=10;
            fgObj.height=10;
            fgObj.type=type;
        }
        return fgObj;
    }

    function spawnBullet(posx, posy){
        var bulletObj = new Object();
        bulletObj.x=posx;
        bulletObj.y=posy;
        bulletObj.width=5;
        bulletObj.height=5;
        return bulletObj;
    }

    function spawnAlienObj(){
        var alien = new Object();
            alien.health = Math.round(Math.random()*2)+1;
            alien.width=50+(5*alien.health);
            alien.height=50+(5*alien.health);
            alien.x=Math.random()*width;
            alien.y=-100

            alien.move = function(){   
                if(this.y<100)
                    this.y+=3;
                if(this.x > ship.x)
                {
                    this.x-=1;
                }
                else if(this.x < ship.x)
                {
                    this.x+=1;
                }
            };

            alien.attack = function(){
                if(flicker(950)){
                    var jarak = Math.abs(this.x - ship.x);
                    var area = 50;
                    if(jarak < area)
                    {
                        //shoot the target, ojo kyo senna
                        //panggil fungsi spawnBullet => tembak senna
                        enemyBullet.push(spawnBullet(this.x,this.y+(this.height/2)+2));
                    }
                }
            }

        return alien;
    }

    function calculateSpawn(){
        if(iterator%10===0){
            asteroidCounter--;
            materialCounter--;
        }

        if(asteroidCounter <= 0){
            fgObj.push(spawnFgObj(0));
            if(stage==2){
                asteroidCounter=fgObjCounterReset("asteroid")*2/shipspeed/width*150;
            }
            else{
                asteroidCounter=fgObjCounterReset("asteroid")*2/shipspeed/width*350;
            }
        }
        if(materialCounter <= 0){
            fgObj.push(spawnFgObj(1));
            materialCounter=fgObjCounterReset("material")*2/shipspeed/width*450;
        }
    }

    function processForeground(){
        for(var i=0; i<fgObj.length;i++){
            fgObj[i].y+=10*(1/fgDepth+shipspeed/speedfactor);
        }
    }

    function processBullet(){
        for(var i=0; i<enemyBullet.length;i++){
            enemyBullet[i].y+=15;
        }
        for(var i=0; i<friendlyBullet.length;i++){
            friendlyBullet[i].y-=15;
        }
    }

    function processUFO(){
        for(var i=0; i<alienObj.length;i++){
            var index=i;
            alienObj[index].move();
            alienObj[index].attack();
        }
    }

    function checkCollide(){
        for(i=0;i<fgObj.length;i++)
        {
            var index = i;
            var col = collision(ship, fgObj[index]); 
            if(col!=false)
            {
                if(fgObj[index].type==1){
                    materialamount++;
                }
                else if(fgObj[index].type==0){
                    if(shield>0){
                        shield--;
                    }
                    else{
                        initialized=0;
                        gamestate=4;
                    }
                }
                fgObj.splice(index,1);
                i--;


                //for testing only
                 /*
                teks = "Senna NOOBs";
                ctx.fillStyle = "#FFFFFF"; 
                ctx.font = "14pt Calibri";
                ctx.fillText(teks, width/2, height/2);
                ctx.fillText(col.x, 100, 110);
                ctx.fillText(col.y, 100, 160);
                 */
            }
        }

        for(i=0;i<enemyBullet.length;i++)
        {
            var index = i;
            var col = collision(ship, enemyBullet[index]); 
            if(col!=false)
            {

                if(shield>0){
                    shield--;
                }
                else{
                    gamestate=4;
                }
                enemyBullet.splice(index,1);


                //for testing only
                 /*
                teks = "Senna NOOBs";
                ctx.fillStyle = "#FFFFFF"; 
                ctx.font = "14pt Calibri";
                ctx.fillText(teks, width/2, height/2);
                ctx.fillText(col.x, 100, 110);
                ctx.fillText(col.y, 100, 160);
                 */
            }
        }
        if(friendlyBullet.length>0 && fgObj.length>0){
            for(i=0;i<friendlyBullet.length;i++)
            {
                var index = i;
                for(var j=0; j<fgObj.length;j++){
                    var jndex = j
                    var col = collision(friendlyBullet[index], fgObj[jndex]); 

                    if(col!=false)
                    {
                        if(fgObj[jndex].type==0){     
                            fgObj.splice(jndex,1);
                            friendlyBullet.splice(index,1);

                            if(j>0)
                                j--;
                            else
                                break;

                            if(i>0)
                                i--;
                            else
                                break;

                            index=i;
                            jndex=j;
                            materialamount++;
                        }
                        //for testing only
                         /*
                        teks = "Senna NOOBs";
                        ctx.fillStyle = "#FFFFFF"; 
                        ctx.font = "14pt Calibri";
                        ctx.fillText(teks, width/2, height/2);
                        ctx.fillText(col.x, 100, 110);
                        ctx.fillText(col.y, 100, 160);
                         */
                    }
                }
            }
        }

        for(i=0;i<friendlyBullet.length;i++)
        {
            if(alienObj.length>0){
                var index = i;
                var col = collision(friendlyBullet[index], alienObj[0]); 

                if(col!=false)
                {    
                    alienObj.splice(0,1);
                    friendlyBullet.splice(index,1);
                    materialamount+=10;
                    alienDestroyed=1;
                    //for testing only
                     /*
                    teks = "Senna NOOBs";
                    ctx.fillStyle = "#FFFFFF"; 
                    ctx.font = "14pt Calibri";
                    ctx.fillText(teks, width/2, height/2);
                    ctx.fillText(col.x, 100, 110);
                    ctx.fillText(col.y, 100, 160);
                     */
                }
            }
        }

    }


    //HUD
    function showlocation(){
        var visible = true;
        if(stage==3){
            if(flicker(950)){
                visible = false;
            }    
        }
        if(visible){
            ctx.save();
            ctx.textAlign="center";
            ctx.font="15px Myriad Pro";
            var text = "";
            if(stage==1 || gamestate==3 || gamestate==1){
                text += "Uncharted Space";
            }
            else if(stage==2){
                text += "Asteroid Field";
            }
            else if(stage==3){
                ctx.fillStyle="red";
                text += "Warning! Nebulae is disrupting the radar.";
            }
            else if(stage==4){
                text += "UFO Territory";
            }
            ctx.fillText(text,width/2,height-7);
            ctx.restore();
        }
    }

    function showmaterialamount(){
        var visible = true;
        if(stage==3){
            if(flicker(950)){
                visible = false;
            }    
        }
        if(visible){
            ctx.save();
            ctx.font="15px Myriad Pro";
            ctx.textAlign="left";
            ctx.fillText("Material",3,height-20);
            ctx.fillText(materialamount,3,height-7);
            ctx.restore();
        }
    }

    function showscore(){
        var visible = true;
        if(stage==3){
            if(flicker(950)){
                visible = false;
            }    
        }
        if(visible){
            ctx.save();
            ctx.font="15px Myriad Pro";
            ctx.textAlign="right";
            ctx.fillText("Score",width-3,height-20);
            ctx.fillText(Math.round(score),width-3,height-7);
            ctx.restore();
        }
    }

    function showIndicator(obj){
            ctx.save();
            if(obj.type==0){
                ctx.fillStyle="orange";
                if(stage==3){
                    if(flicker(950)){
                        ctx.fillStyle="deepskyblue";
                    }
                }
            }
            else if(obj.type==1){
                ctx.fillStyle="deepskyblue";
                if(stage==3){
                    if(flicker(950)){
                        ctx.fillStyle="orange";
                    }
                }
            }
            ctx.beginPath();
            ctx.globalAlpha=1+(obj.y/10000);
            if(stage==3){
                if(flicker(800)){
                    ctx.globalAlpha=0;
                }
            }
            ctx.translate(obj.x,5);
            ctx.moveTo(0,0);
            ctx.lineTo(10,15);
            ctx.lineTo(-10,15);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.beginPath();
            ctx.fillRect(-10,20,20,-obj.y/50);

            ctx.restore();
    }

    //ENVIRONMENTAL
    function stageRandomizer(){
        if(iterator==0){
            stageTime--;
        }
        if(stageTime<=0){

            if(nextStage==0){
                gamestate=3;
            }
            else{
                if(nextStage==4){
                    alienDestroyed=0;
                }
                shipspeed += 0.2;
                stage = nextStage;
            }
            var chance = Math.round(Math.random()*100+shipspeed-1);
            if(chance<25){
                nextStage=0;
            }
            else if(chance<65){
                nextStage=1;
                stageTime=20+Math.floor(Math.random()*33);
            }
            else if(chance<90){
                nextStage=2;
                stageTime=20+Math.floor(Math.random()*33);
            }
            else if(chance<98){
                nextStage=3;
                stageTime=45+Math.floor(Math.random()*60);
            }
            else{
                nextStage=4;
                stageTime=15+Math.floor(Math.random()*60);
            }
        }
    }

    function processBackground(){
        for(var i=0; i<bgObj.length;i++){
            bgObj[i].y+=10*shipspeed/bgDepth;
        }
    }

    function trashCollector(array){
        if((array[0].y-array[0].height)>height){
            array.shift();
            if(initialized==0){
                initialized=1;
                shipspeed = 1;
            }
        }  
    }

    function bulletCollector(array){
        if((array[0].y-array[0].height)>height || (array[0].y+array[0].height)<0){
            array.shift();
        }  
    }

    function spawnBgObj(type){
        var bgObj = new Object();
        if(type=="star"){
            bgObj.x=Math.random()*width;
            bgObj.y=-7+Math.random()*5;
            bgObj.width=1;
            bgObj.height=1;
            bgObj.type=type;
        }
        return bgObj;
    }

    function startnebulae(){
        //Lightning
        ctx.save();
        ctx.fillStyle="white";
        ctx.beginPath();
        ctx.fillRect(0,0,width,height);
        ctx.restore();

        //Initialize nebulae
        var red = Math.round(Math.random()*255);
        var green = Math.round(Math.random()*255);
        var blue = Math.round(Math.random()*255);
        nebulaeColor[0] = red;
        nebulaeColor[1] = green;
        nebulaeColor[2] = blue;
        innebulae=1;
    }

    function endnebulae(){
        ctx.save();
        ctx.fillStyle="white";
        ctx.beginPath();
        ctx.fillRect(0,0,width,height);
        ctx.restore();
        innebulae=0;
    }

    function initializeBg(){
        //proses
        //star
        if(iterator>bgDepth*5/shipspeed)
            iterator=0;
        if(iterator==0)
            bgObj.push(spawnBgObj("star"));


        iterator++;
        processBackground();
        if(bgObj[0].y>height)
            initialized=1;
        if(initialized==1)
            setTimeout(play,10);

    }
    //MISC FUNCTIONS
    //jare alan ngebug
    function clickButton(xLeft,xRight,yUp,yDown){
        if(xLeft>xRight || yUp>yDown)
            return false;
        if (mouseClickX>xLeft&&mouseClickX<xRight && mouseClickY>yUp && mouseClickY<yDown ){
            if(mouseReleaseX>xLeft&&mouseReleaseX<xRight && mouseReleaseY>yUp && mouseReleaseY<yDown){
                mouseClickX = -1;
                mouseClickY = -1
                return true;
            }
        }
        return false;
    }

    function mouseHover(xLeft,xRight,yUp,yDown){
        if(xLeft>xRight || yUp>yDown)
            return false;
        if (mousePositionX>xLeft&&mousePositionX<xRight && mousePositionY>yUp && mousePositionY<yDown ){
            return true;
        }
        return false;
    }

    function fgObjCounterReset(name){
        switch(name){
            case 'asteroid': return 3+Math.round(Math.random()*3); break;
            case 'material': return 3+Math.round(Math.random()*20); break;
        }
    }


    //CREDIT
    function creditmenu(){
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,width,height);
        ctx.fillStyle = "white";
        credit();

        //Membuat object button mainmenu
        buttonPosX=width/2;
        buttonPosY=height/16*12;
        buttonW=200;
        buttonH=100;
        button(buttonPosX,buttonPosY,buttonW,buttonH,3,2,"Main menu",40);
        //Deteksi mousehover button mainmenu
        //Ketika mousehover button mainmenu, button ditutupi overlay putih (efek menyala)
        if(mouseHover(buttonPosX-buttonW/2,buttonPosX+buttonW/2,buttonPosY-buttonH/2,buttonPosY+buttonH/2)){
            ctx.save();
            ctx.beginPath();
            ctx.globalAlpha=0.9;
            ctx.translate(buttonPosX,buttonPosY);
            ctx.fillRect(-100,-50,200,100);
            ctx.restore();
        }
        //Deteksi click button mainmenu
        //Ketika dilakukan click, ubah gamestate menjadi 1
        if(clickButton(buttonPosX-buttonW/2,buttonPosX+buttonW/2,buttonPosY-buttonH/2,buttonPosY+buttonH/2)){
            gamestate=0;
        }
    }

    function credit(){
        ctx.save();
        ctx.translate(width/2-130,height/3);
        ctx.scale(2,2);
        ctx.font="10px Myriad Pro";
        ctx.textAlign = "left";
        ctx.strokeStyle="white";
        if(flicker(20)){
            if(flicker(990))
                ctx.strokeStyle="deepskyblue";
            else if(flicker(995))
                ctx.strokeStyle="orange";
            ctx.fillText("Made By:", 0, 0);
        }
        if(flicker(20)){
            if(flicker(990))
                ctx.strokeStyle="deepskyblue";
            else if(flicker(995))
                ctx.strokeStyle="orange";
            ctx.fillText("71130011-Senna Christanto", 0, 13);
        }
        ctx.strokeStyle="white";
        flickerRandom=Math.floor(Math.random()*1000);
        if(flicker(20)){
            if(flicker(990))
                ctx.strokeStyle="deepskyblue";
            else if(flicker(995))
                ctx.strokeStyle="orange";
            ctx.fillText("71130012-Alan Darmasaputra", 0,26);
        }
        ctx.strokeStyle="white";
        flickerRandom=Math.floor(Math.random()*1000);
        if(flicker(20)){
            if(flicker(990))
                ctx.strokeStyle="deepskyblue";
            else if(flicker(995))
                ctx.strokeStyle="orange";
            ctx.fillText("71130013-Aditya Yuga Pradhana", 0,39);
        }
        ctx.strokeStyle="white";
        flickerRandom=Math.floor(Math.random()*1000);
        if(flicker(20)){
            if(flicker(990))
                ctx.strokeStyle="deepskyblue";
            else if(flicker(995))
                ctx.strokeStyle="orange";
            ctx.fillText("71130028-Rico Manurung", 0,52);
        }
        ctx.strokeStyle="white";
        flickerRandom=Math.floor(Math.random()*1000);
        if(flicker(20)){
            if(flicker(990))
                ctx.strokeStyle="deepskyblue";
            else if(flicker(995))
                ctx.strokeStyle="orange";
            ctx.fillText("71130036-Dea Alverina", 0,65);
        }
        ctx.strokeStyle="white";
        flickerRandom=Math.floor(Math.random()*1000);
        if(flicker(20)){
            if(flicker(990))
                ctx.strokeStyle="deepskyblue";
            else if(flicker(995))
                ctx.strokeStyle="orange";
            ctx.fillText("71130045-Hiroshi Junio Chandra", 0,78);
        }
        ctx.restore();
    }

    //
    function loseScreen(){
        bgObj = [];
        fgObj = [];
        alienObj = [];
        friendlyBullet = [];
        enemyBullet = [];
        //Refresh screen
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,width,height);
        ctx.fillStyle = "white";

        //Print title
        ctx.textAlign="center"
        ctx.translate(width/2,height/4);
        ctx.scale(2,2);
        if(flicker(20)){
            if(flicker(990))
                ctx.strokeStyle="deepskyblue";
            else if(flicker(995))
                ctx.strokeStyle="orange";
            ctx.fillText("Connection to ship Lost", 0, 0);
        }
        if(flicker(950)){
            if(flicker(990))
                ctx.strokeStyle="deepskyblue";
            else if(flicker(995))
                ctx.strokeStyle="orange";
            ctx.fillText("Attempting to reconnect to ship...", 0, 13);
        }
        if(flicker(20)){
            if(flicker(400))
                ctx.strokeStyle="deepskyblue";
            else if(flicker(995))
                ctx.strokeStyle="orange";
            ctx.fillText("Your Score", 0, 56);
        }
        if(flicker(20)){;
            if(flicker(400))
                ctx.strokeStyle="deepskyblue";
            else if(flicker(995))
                ctx.strokeStyle="orange";
            ctx.fillText(Math.round(score), 0, 76);
        }
        ctx.restore();

        //Membuat object button launch
        buttonPosX=width/2;
        buttonPosY=height/4*3;
        buttonW=200;
        buttonH=100;
        button(buttonPosX,buttonPosY,buttonW,buttonH,3,2,"Main Menu",40);
        //Deteksi mousehover button launch
        //Ketika mousehover button launch, button ditutupi overlay putih (efek menyala)
        if(mouseHover(buttonPosX-buttonW/2,buttonPosX+buttonW/2,buttonPosY-buttonH/2,buttonPosY+buttonH/2)){
            ctx.save();
            ctx.beginPath();
            ctx.globalAlpha=0.9;
            ctx.translate(buttonPosX,buttonPosY);
            ctx.fillRect(-100,-50,200,100);
            ctx.restore();
        }
        //Deteksi click button launch
        //Ketika dilakukan click, ubah gamestate menjadi 1
        if(clickButton(buttonPosX-buttonW/2,buttonPosX+buttonW/2,buttonPosY-buttonH/2,buttonPosY+buttonH/2)){
            gamestate=0;
        }
    }

    //cek collision ship with fbObj, done 
    //if true, return collision objek with koordinate
    //else return false
    function collision(obj1, obj2){
        var X1 = (obj1.x);
        var X2 = (obj2.x);

        var Y1 = (obj1.y);
        var Y2 = (obj2.y);

        var jarakx = (Math.abs(X1 - X2));
        var jaraky = (Math.abs(Y1 - Y2));

        var halfExtentsX = (obj1.width/2) + (obj2.width/2);
        var halfExtentsY = (obj1.height/2) + (obj2.height/2);

        var distX = jarakx - halfExtentsX;
        var distY = jaraky - halfExtentsY;

        var dist = Math.sqrt(distX * distX + distY * distY);

        if((distX) < 0 && (distY) < 0)
        { 
            //done  
            if(X1 > X2)
            {
                var colX = obj1.x-(0.5*distX);
            }
            else
            {
                var colX = obj2.x-(0.5*distX); 
            }

            if(Y1 > Y2)
            {
                var colY = obj1.y-(0.5*distX);
            }
            else
            {
                var colY = obj2.y-(0.5*distY); 
            }

            var collision = {
              x: colX,
              y: colY,      
            };

            return collision;

        }
        else
        {
            //done
            return false;
        }
    }


    
}
