$(document).ready(function() {

    $("footer .year").html(new Date().getFullYear());

    /*============================================
    Page Preloader
    ==============================================*/
    $(window).load(function() {
        if ($("video").is(":visible")) {
            $("video").get(0).play();
        }

        $('#page-loader').fadeOut(3000);

        var cenas = $("video").height();
        $('.scrollimation').waypoint(function() {
            $(this).addClass('in');
        }, {
            offset: cenas - 50
        });
    });


    $(window).scroll(function() {
        var st = $(this).scrollTop(),
            wh = $(window).height(),
            sf = 1.2 - st / (10 * wh);

        $('#home .container').css({
            'opacity': (1.4 - st / 400)
        });

    });

    var st = $(this).scrollTop(),
        wh = $(window).height(),
        sf = 1.2 - st / (10 * wh);

    $('#home .container').css({
        'opacity': (1.4 - st / 400)
    });


    /*============================================
    Navigation Functions
    ==============================================*/
    if ($(window).scrollTop() < ($(window).height() - 300)) {
        $('#main-nav').removeClass('scrolled');
    } else {
        $('#main-nav').addClass('scrolled');
    }

    $(window).scroll(function() {
        if ($(window).scrollTop() < ($(window).height() - 300)) {
            $('#main-nav').removeClass('scrolled');
        } else {
            $('#main-nav').addClass('scrolled');
        }
    });

    /*============================================
    ScrollTo Links
    ==============================================*/
    $('a.scrollto').click(function(e) {
        $('html,body').scrollTo(this.hash, this.hash, {
            gap: {
                y: -70
            }
        });
        e.preventDefault();

        if ($('.navbar-collapse').hasClass('in')) {
            $('.navbar-collapse').removeClass('in').addClass('collapse');
        }
    });

    /*============================================
    Refresh scrollSpy function
    ==============================================*/
    function scrollSpyRefresh() {
        setTimeout(function() {
            $('body').scrollspy('refresh');
        }, 1000);
    }

    /*============================================
    Refresh waypoints function
    ==============================================*/
    function waypointsRefresh() {
        setTimeout(function() {
            $.waypoints('refresh');
        }, 1000);
    }
});