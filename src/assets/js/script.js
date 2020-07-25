import jQuery from 'jquery'
(function ($) {
  'use strict';

  /* Nav */

  $(function () {
    $('nav .nav-toggle').click(function () {
      $('.sidebar').toggle();    
    });
  });

  /* Dropdown */

  $(function () {
    $('.menu .title').click(function (e) {
      var current_dropdown = $(this).next(".dropdown");
      $(".dropdown").not(current_dropdown).slideUp();
      current_dropdown.slideToggle();

      e.stopPropagation();
    });
    
    if ($('.dropdown li').hasClass('active')) {
      $('.active').parent('.dropdown').toggle();
      $('.active').parent('.dropdown').siblings('.title').css('border-left', '4px solid #1487D6');
       $('.active').parent('.dropdown').siblings('.title').find('i, p').css('color', '#1487D6');
    }
    
    if ($('.menu .title p').hasClass('active')) {
      $('.active').parent('.title').css('border-left', '4px solid #1487D6');
      $('.active').css('color', '#1487D6');
      $('.active').siblings('i').css('color', '#1487D6');
    }
    
  });
  
  /* Select2 */
  
  $(function () {
    $('.js-example-basic-single').select2();
  });
  
  /* Select Language */
  
  var trigger = $('.language-selector .flag');
  var list = $('.language-selector .languages');

  trigger.click(function (event) {
    event.stopPropagation();
    trigger.toggleClass('active');
    list.slideToggle(200);
  });
  
  $(document).on("click", function () {
    $(list).hide();
  });
  
  list.click(function (event) {
    event.stopPropagation();
  });
  
  /* Slick */
  $('.slider').slick({
    autoplay: true,
    autoplaySpeed: 6000,
    dots: true,
    fade: true
  });
  
})(jQuery);