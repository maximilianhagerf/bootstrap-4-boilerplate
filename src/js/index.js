$(function () {
  // $('.menu').click(function () {
  //   $('body').toggleClass('menu-open');
  // });

  $('.design').hover(function () {
    // $('.tooltip_container--design').positionOn($('.design'), 'center');
    $('.tooltip_container--design').addClass('hover');
  });
  $('.design').mouseleave(function () {
    $('.tooltip_container--design').removeClass('hover');
    // $('.tooltip_container--design').css({
    //   top: -2000
    // });
  });

  $('.stack').hover(function () {
    // $('.tooltip_container--stack').positionOn($('.stack'), 'center');
    $('.tooltip_container--stack').addClass('hover');
  });
  $('.stack').mouseleave(function () {
    $('.tooltip_container--stack').removeClass('hover');
    // $('.tooltip_container--stack').css({
    //   top: -2000
    // });
  });
});

/////////////////////////////////

var scale;
var position = 0;

var $el1 = $(".presentation");
var $el2 = $(".web");
var $el3 = $(".logos");
var $el4 = $(".code");

var elHeight = $el1.outerHeight();
var elWidth = $el1.outerWidth();

var $wrapper = $("#main");

var starterData = {
  size: {
    width: $wrapper.width(),
    height: $wrapper.height()
  }
}

var backgroundInterval;
var imageNr = 1;
// var imageArray = ['img3.jpg', 'img2.jpg', 'img1.jpg', 'img4.jpg'];

function doResize() {
  scale = Math.min(
    $wrapper.width() / elWidth,
    $wrapper.height() / elHeight
  );
  scale *= .9;
}

function pastedSections(target, number) {
  if (position > number) {
    target.addClass('pasted');
  } else {
    target.removeClass('pasted');
  }
}

function orderSections() {
  if (position > 3) {
    position = 3;
  }
  if (position < 0) {
    position = 0;
  }
  if (position == 1) {
    $('#web').addClass('current');
    startBackgroundChange()
    changeBackground();
  } else {
    $('#web').removeClass('current');
    stopBackgroundChange()
  }

  pastedSections($el1, 0);
  pastedSections($el2, 1);
  pastedSections($el3, 2);

  scaleSections($el1, 50, 50);
  scaleSections($el2, 45, 49);
  scaleSections($el3, 40, 48);
  scaleSections($el4, 35, 47);
}

function scaleSections(target, startScaleX, startScaleY) {
  var rot = -(startScaleY-50) - position;
  var posx = (startScaleX + (position * 5));
  var posy = (startScaleY + position);
  target.css({
    transform: "translate(-" + posx + "%, -" + posy + "%) " + "scale(" + scale + ")" + "rotate(" + rot + "deg)"
  })
}

function changeBackground() {
  console.log(imageNr);
  imageNr++;
  if (imageNr > 4) {
    imageNr = 1;
  }
  $('.web-bg').css('opacity', '0');
  $('#bg' + imageNr).css('opacity', '1');
  // document.getElementById('web').style.backgroundImage = "url(img/work/" + imageArray[imageNr] + ")";
}

function startBackgroundChange() {
  // clearInterval(backgroundInterval);
  backgroundInterval = setInterval(changeBackground, 6000);
}

function stopBackgroundChange() {
  clearInterval(backgroundInterval);
  imageNr = 0;
}

function navigateSection(dir) {
  if (dir == 'right') {
    position++
  } else if (dir == 'left') {
    position--
  }
  orderSections();
}

$(window).resize(function () {
  doResize();
  orderSections();
});

$(document).keydown(
  function (e) {
    if ($('a:focus').length == 0) {
      $('a').first().focus();
    }
    if (e.keyCode == 39) {
      navigateSection('right');
    }
    if (e.keyCode == 37) {
      navigateSection('left');
    }
  }
);

// $('.navArrow--right').on("click", navigateSection('right'));
$('.navArrow--right').click(function(){
  navigateSection('right')
});

$('.navArrow--left').click(function(){
  navigateSection('left')
});

doResize();
orderSections();