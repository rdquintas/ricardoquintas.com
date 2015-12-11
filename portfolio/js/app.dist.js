$(document).ready(function() {
    $.slidebars();
    $("#nav-menu ul").clone().appendTo(".sb-slidebar");

    // var year = 
    $("#footer .year").html(new Date().getFullYear());
});

// Handlebars get the skill CSS class
Handlebars.registerHelper('skills_class', function() {
    var str = this.skills.join(" ");
    return str;
});

// Handlebars get the CSS color for the skill tag
Handlebars.registerHelper('get_skill_css_color', function(skill) {
    switch (skill) {
        case "LESS":
            return "blue";
            break;
        case "NodeJS":
            return "green";
            break;
        case "PHP":
            return "purple";
            break;
        case "Bootstrap":
            return "light-blue";
            break;
        case "????????":
            return "yellow";
            break;
        case "????????":
            return "orange";
            break;
        case "????????":
            return "red";
            break;
        case "????????":
            return "light-green";
            break;
        default:
            return "grey";
            break;
    }
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


    $('[id*="nav-menu"] ul li').on("click", function() {
        var skill = $(this).attr("data-skill");
        setActive(skill);
        
        $.slidebars.close();

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

function setActive(skill) {
    $('#nav-menu ul li').removeClass("active");
    $('#nav-menu-mobile ul li').removeClass("active");

    $('#nav-menu ul li.' + skill).addClass("active");
    $('#nav-menu-mobile ul li.' + skill).addClass("active");
}
