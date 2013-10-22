$(document).ready(function() {
  var totalTime = 0;

  // Keep a reference to the Box2D World
  var world;
  // The scale between Box2D units and pixels
  var SCALE = 30;
  // Multiply to convert degrees to radians.
  var D2R = Math.PI / 180;
  // Multiply to convert radians to degrees.
  var R2D = 180 / Math.PI;
  // 360 degrees in radians.
  var PI2 = Math.PI * 2;
  //var interval;
  var kickedOffCrash = false;

  // Shorthand "imports"
  var b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2AABB = Box2D.Collision.b2AABB,
      b2Body = Box2D.Dynamics.b2Body,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2World = Box2D.Dynamics.b2World,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef,
      b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape;

  //Create the Box2D World with horisontal and vertical gravity (10 is close enough to 9.8)
  world = new b2World(
      new b2Vec2(0, 10) //gravity
      , true //allow sleep
  );


  //adding bodies (that corresponds to shit on fb page) to the world
  mapPageElementsToBox2D();

//Create the ground and walls
var w = $(window).width(); 
//var w1 = 800;
var h = $(window).height();
//var w = 500;
//var h1 = 500;
addBodyToWorld(0,h/2,5,h/2, true);
addBodyToWorld(w/2, h*3 , 2*w, 5, true);
addBodyToWorld(w,h/2,5,h/2, true);

//Do one animation interation and start animating
//interval = setInterval(update,1000/5);
//update();


//Method for animating
function update() {
      world.Step(
      1  //frame-rate
      , 1 //velocity iterations
      , 1 //position iterations
      );
      
      drawDOMObjects();

      //world.ClearForces();
}



  var updateClock = function(millisecs ) {
    var currentHours = Math.floor(millisecs/(60 * 60 * 1000));
    var currentMinutes = Math.floor((millisecs - (currentHours * 60 * 60 * 1000))/(60 * 1000));
    var currentSeconds = Math.floor((millisecs - (currentHours * 60 * 60 * 1000) - (currentMinutes * 60 * 1000))/1000);

     //createDOMObjects();
    //rotateObjects();
    if((currentMinutes > 1) && !kickedOffCrash){
        //update();
        setInterval(update,1000/5);
        kickedOffCrash = true;
    }


    // Pad the minutes and seconds with leading zeros, if required
    currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
    currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;


    // Compose the string for display
    return currentHours + ":" + currentMinutes + ":" + currentSeconds;
  }

  var addTimer = function () {
    if (document.getElementById('contentArea').firstChild.id != "my_div")
      $('#contentArea').prepend('<div id="my_div"><p id="my_time"><p></div>');
  }

  window.addEventListener('click', function(event) {
    setTimeout(addTimer, 1000);
  }, false);

  window.addEventListener('popstate', function(event) {
    setTimeout(addTimer, 1000);
  }, false);

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    totalTime = request.totalTime;
  });

  chrome.runtime.sendMessage({sendData: "time"}, function(response) {
    totalTime = response.totalTime;

    addTimer();
    setInterval(function() {totalTime += 1000; $('#my_time').text(updateClock(totalTime));}, 1000);
  });


/*
  function createDOMObjects() {
      //iterate all div elements and create them in the Box2D system
      $("#leftCol div").each(function (a,b) {
        var domObj = $(b);
        //var domPos = $(b).position();
        //var width = domObj.width() / 2 ;
        //var height = domObj.height() / 2
        
        //var x = (domPos.left) + width;
        //var y = (domPos.top) + height;
        //var body = createBox(x,y,width,height);
        //body.m_userData = {domObj:domObj, width:width, height:height};
        var x = 100;
        var y = 100;
        var r = 45;
        //Reset DOM object position for use with CSS3 positioning
        //domObj.css({'left':'0px', 'top':'0px'});
        var css = {'-webkit-transform':'translate(' + x + 'px,' + y + 'px) rotate(' + r  + 'deg)', 
                   '-moz-transform':'translate(' + x + 'px,' + y + 'px) rotate(' + r  + 'deg)', 
                   '-ms-transform':'translate(' + x + 'px,' + y + 'px) rotate(' + r  + 'deg)'  , 
                   '-o-transform':'translate(' + x + 'px,' + y + 'px) rotate(' + r  + 'deg)', 
                   'transform':'translate(' + x + 'px,' + y + 'px) rotate(' + r  + 'deg)'};
        domObj.css(css);
      });
  }
*/

/*
function rotateObjects(){
        var x = 100;
        var y = 100;
        var r = 45;
        //Reset DOM object position for use with CSS3 positioning
        //domObj.css({'left':'0px', 'top':'0px'});
        var css = getNewCssString(x, y, r);

        $('#pagelet_welcome_box').css(css);
        $('#_s0 fbxWelcomeBoxImg _rw img').css(css);
        $('#pagelet_reminders').css(css);
        $('#pagelet_composer').css(css);
        //$('#pagelet_home_stream').css(css);
        $('#pagelet_pinned_nav').css(css); 
        $('#pagelet_bookmark_nav').css(css);
        $('#groupsNav').css(css);
        $('#pagesNav').css(css);
        $('#rightCol').css(css);

        //first four stories in the frient stream.
        $("#pagelet_home_stream li").each(function (a,b) {
            var domObj = $(b);
            //var domPos = $(b).position();
            //var width = domObj.width() / 2 ;
            //var height = domObj.height() / 2
            
            //var x = (domPos.left) + width;
            //var y = (domPos.top) + height;
            //var body = createBox(x,y,width,height);
            //body.m_userData = {domObj:domObj, width:width, height:height};
            var x = 0;
            var y = 0;
            var r = 45;
            //Reset DOM object position for use with CSS3 positioning
            //domObj.css({'left':'0px', 'top':'0px'});
            var css = getNewCssString(x, y, r);

            domObj.css(css);
        });  
}
*/

function mapPageElementsToBox2D(){

    //createBox2DObjects(htmlDivName)
    //createBox2DObjects($('#pagelet_welcome_box'), 0, 0, 180, 40);
    //createBox2DObjects($('#_s0 fbxWelcomeBoxImg _rw img'), 0,0, 40 ,40);
    //createBox2DObjects($('#pagelet_reminders'), w - 244, 0, 244, 87);
    createBox2DObjects($('#pagelet_welcome_box'));
    //createBox2DObjects($('#_s0 fbxWelcomeBoxImg _rw img'));
    createBox2DObjects($('#pagelet_reminders'));

    createBox2DObjects($('#pagelet_composer'));
    createBox2DObjects($('#pagelet_pinned_nav')); 
    createBox2DObjects($('#pagelet_bookmark_nav'));
    createBox2DObjects($('#groupsNav'));
    createBox2DObjects($('#pagesNav'));
    createBox2DObjects($('#rightCol'));
    createBox2DObjects($('#pagelet_ticker'));
    createBox2DObjects($('.fbChatSidebarBody'));
    //createBox2DObjects($('#u_0_23'));



    //first four stories in the frient stream.
    var i = 0;
    $("#pagelet_home_stream li").each(function (a,b) {
        if(i<4){
           createBox2DObjects($(b));
           i = i+1;
        }
    });
    
    
    //$("#pagelet_home_stream li").each(function (a,b) {
    //       createBox2DObjects($(b));
    //});

}


function createBox2DObjects(domObj) {

        //var domObj = $(htmlDivName);
        //var domPos = $(htmlDivName).position();
        //clientHeight: 40
        //clientLeft: 0
        //clientTop: 0
        //clientWidth: 179

        var domPos = domObj.offset();
        var width = domObj.width() / 2 ;
        var height = domObj.height() / 2;
        var left = domPos.left;
        var top = domPos.top;
        //var width = width/2;
        //var height = height/2;


        //var x = (domPos.left) + width;
        //var y = (domPos.top) + height;
        var x = left + width;
        var y = top + height;
        var body = addBodyToWorld(x,y,width,height, false);
        body.m_userData = {domObj:domObj, width:width, height:height, xpos: left, ypos: top};
        
        //Reset DOM object position for use with CSS3 positioning
        domObj.css({'left':'0px', 'top':'0px'});
};
    

function addBodyToWorld(x,y,width,height, static) {
      var bodyDef = new b2BodyDef;
      bodyDef.type = static ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
      bodyDef.position.x = x / SCALE;
      bodyDef.position.y = y / SCALE

      var fixDef = new b2FixtureDef;
          fixDef.density = 1.5;
          fixDef.friction = 0.3;
          fixDef.restitution = 0.4;

      fixDef.shape = new b2PolygonShape;
      fixDef.shape.SetAsBox(width / SCALE, height / SCALE);
      return world.CreateBody(bodyDef).CreateFixture(fixDef);
}


function getNewCssString(x, y, r){
       var css = {'-webkit-transform':'translate(' + x + 'px,' + y + 'px) rotate(' + r  + 'deg)', 
                   '-moz-transform':'translate(' + x + 'px,' + y + 'px) rotate(' + r  + 'deg)', 
                   '-ms-transform':'translate(' + x + 'px,' + y + 'px) rotate(' + r  + 'deg)'  , 
                   '-o-transform':'translate(' + x + 'px,' + y + 'px) rotate(' + r  + 'deg)', 
                   'transform':'translate(' + x + 'px,' + y + 'px) rotate(' + r  + 'deg)'};

        return css;
}


//Animate DOM objects
function drawDOMObjects() {
      var i = 0;
      for (var b = world.m_bodyList; b; b = b.m_next) {
             for (var f = b.m_fixtureList; f; f = f.m_next) {
                if (f.m_userData) {
                  //Retrieve positions and rotations from the Box2d world
                  //var x = Math.floor((f.m_body.m_xf.position.x * SCALE) - f.m_userData.width);
                  //var y = Math.floor((f.m_body.m_xf.position.y * SCALE) - f.m_userData.height);
                  var newXpos = Math.floor((f.m_body.m_xf.position.x * SCALE) - f.m_userData.width );
                  var newYpos = Math.floor((f.m_body.m_xf.position.y * SCALE) - f.m_userData.height);
                  var delX = newXpos - f.m_userData.xpos;
                  var delY = newYpos  - f.m_userData.ypos;
                  //CSS3 transform does not like negative values or infitate decimals
                  var r = Math.round(((f.m_body.m_sweep.a + PI2) % PI2) * R2D * 100) / 100;
                  var css = getNewCssString(delX, delY, r);
                  f.m_userData.domObj.css(css);
                  f.m_userData.xpos = newXpos;
                  f.m_userData.ypos = newYpos;
                }
             }
      }
};

});