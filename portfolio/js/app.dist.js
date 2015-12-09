$(document).ready(function() {
    $.slidebars();
    $( "#nav-menu ul" ).clone().appendTo( ".sb-slidebar" );
});

// Handlebars
Handlebars.registerHelper('skills_class', function() {
    var str = this.skills.join(" ");
    return str;
});


var source = $("#entry-template").html();
var template = Handlebars.compile(source);
var html = template(this.projects);
$('#projects').html(html);

// setTimeout(function() {
$('#entry-template').imagesLoaded(function() {
    // Isotope Grid
    var $grid = $('#projects');
    $grid.isotope({
        itemSelector: '.project-item',
        layoutMode: 'fitRows'
    });


    $('#nav-menu ul li').on("click", function() {       
        setActive(this);
        var skill = $(this).attr("data-skill");

        if (skill === "All") {
            $grid.isotope({
                filter: '*'
            });
        } else {
            $grid.isotope({
                filter: '.project-item.' + skill
            });
        }

    });
});
// }, 1000);

function setActive(obj) {
    $('#nav-menu ul li').removeClass("active");
    $(obj).addClass("active");
}
