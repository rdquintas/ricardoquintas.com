var projects = [{
    name: "Lisbon Swingers",
    description: "Big band Jazz Orchestra. This responsive website required complex UI/UX components and subtle animations. All done with plain and pure CSS, no framework.",
    image: "lisbonswingers.jpg",
    url: {
        ricardo: "http://www.lisbonswingers.com/index_en.html",
        github: "https://github.com/rdquintas/LisbonSwingers",
        simple: "lisbonswingers.com",
        normal: "http://www.lisbonswingers.com/index_en.html"
    },
    skills: ["jQuery", "LESS"]
}, {
    name: "Unplace Museum",
    description: "This project was for one of the biggest Modern Art institutions in Portugal (Fundação Calouste Gulbenkian). The project was for a temporary international exhibition of world-wide modern artists. Site required inovative design and simple CMS support. Extensive use of PACKERY for the layout.",
    image: "unplace.jpg",
    url: {
        ricardo: "http://www.ricardoquintas.com/portfolio/unplace/#%7B%22language%22%3A%22en%22%2C%22project_id%22%3Anull%2C%22tour_id%22%3Anull%7D",
        github: "https://github.com/rdquintas/unplace.org",
        simple: "unplace.org",
        normal: "http://www.unplace.org"
    },
    skills: ["jQuery", "LESS"]
}, {
    name: "Santinho",
    description: "Proof of concept for a religious institution. Features inovative UI/UX components.",
    image: "santinho.jpg",
    url: {
        ricardo: "http://www.ricardoquintas.com/portfolio/santinho",
        github: "https://github.com/rdquintas/santinho",
        simple: "",
        normal: ""
    },
    skills: ["jQuery"]
}, {
    name: "Alexandre Camarão",
    description: "Web portfolio of Portguese modern art artist Alexandre Camarão. This website uses the flat file CMS framework: GRAV.",
    image: "alexandrecamarao.jpg",
    url: {
        ricardo: "http://www.ricardoquintas.com/portfolio/alexandre_camarao",
        github: "https://github.com/rdquintas/alexandrecamarao.com",
        simple: "alexandrecamarao.com",
        normal: "http://www.alexandrecamarao.com"
    },
    skills: ["jQuery", "PHP", "LESS"]
}, {
    name: "AFSO",
    description: "Website for Portguese ONG, AFSO. This website uses the flat file CMS framework: GRAV.",
    image: "afso.jpg",
    url: {
        ricardo: "http://www.ricardoquintas.com/portfolio/afso",
        github: "https://github.com/rdquintas/afso.pt",
        simple: "afso.pt",
        normal: "http://www.afso.pt"
    },
    skills: ["jQuery", "PHP", "LESS"]
}, {
    name: "Alphalink",
    description: "Civil Engineer company. A simple website to display the company portfolio. This website uses the flat file CMS framework: GRAV.",
    image: "alphalink.jpg",
    url: {
        ricardo: "http://ricardoquintas.com/portfolio/alphalink",
        github: "https://github.com/rdquintas/Alphalink",
        simple: "alphalink.pt",
        normal: "http://www.alphalink.pt"
    },
    skills: ["jQuery", "PHP", "LESS"]
}, {
    name: "Ricardo Quintas",
    description: "My own website. This responsive single-page website features some simple animations.",
    image: "ricardoquintas.jpg",
    url: {
        ricardo: "http://ricardoquintas.com/",
        github: "https://github.com/rdquintas/ricardoquintas.com",
        simple: "ricardoquintas.com",
        normal: "http://www.ricardoquintas.com"
    },
    skills: ["jQuery", "LESS", "Bootstrap"]
}, {
    name: "SCA",
    description: "Proof of concept for SCA, a customer I've worked for. They requested me a POC for them to show to their stake-holders. Very simple Bootstrap prototype.",
    image: "sca.jpg",
    url: {
        ricardo: "http://ricardoquintas.com/portfolio/sca",
        github: "https://github.com/rdquintas/scademo",
        simple: "sca.com",
        normal: "http://www.sca.com/"
    },
    skills: ["jQuery", "Bootstrap"]
}];

// Handlebars
Handlebars.registerHelper('skills_class', function() {
    var str = this.skills.join(" ");
    return str;
});


var source = $("#entry-template").html();
var template = Handlebars.compile(source);
var html = template(projects);
$('#dynamic-html').html(html);

// setTimeout(function() {
$('#entry-template').imagesLoaded(function() {
    // Isotope Grid
    var $grid = $('.iso-grid');
    $grid.isotope({
        itemSelector: '.iso-grid-item',
        layoutMode: 'fitRows'
    });


    $('#toggle').on("click", function() {
        $(".sidebar.menu").sidebar('toggle');
    });


    $('.menu .item').on("click", function() {
        if (this.id === "toggle") {
            return;
        }
        $(".sidebar.menu").sidebar('hide');
        setActive(this);
        var skill = $(this).attr("data-skill");

        if (skill === "All") {
            $grid.isotope({
                filter: '*'
            });
        } else {
            $grid.isotope({
                filter: '.iso-grid-item.' + skill
            });
        }

    });
});
// }, 1000);

function setActive(obj) {
    $('.menu .item').removeClass("active");
    $(obj).addClass("active");
}

// // using context
// $('.context.example .ui.sidebar')
//     .sidebar({
//         context: $('.context.example .bottom.segment')
//     })
//     .sidebar('attach events', '.context.example .menu .item');
