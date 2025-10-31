// Handlebar precompiling
var _source = $("#gbnt-template").html();
var _template = Handlebars.compile(_source);

// Packery global var
var _packeryContainer = $('.packery');

// This object will be parsed inside the URL
var _mainObject = {
    language: "pt",
    project_id: null,
    tour_id: null
};

// tour vars
var _tours = [];
var _tourInformation = null;


$(document).ready(function() {
    var tmpLang = getUrlParameter("language");

    if (tmpLang) {
        _mainObject.language = tmpLang;
    }

    parseURLobject();
    prepareTours();
    // prepareProjectData();
    applyTranslations();
});

// Adjust the layout (by refreshing the page) if user resizes window
$(window).resize(function() {
    // location.reload();
});

function applyTranslations() {
    $(".logo-text").text(doTranslation("logo_text"));
    $(".gbnt-exibithion").text(doTranslation("exibithion"));
    $(".gbnt-tour").text(doTranslation("tour"));
    $(".gbnt-about").text(doTranslation("about"));
    $(".gbnt-language").text(doTranslation("language"));
    $(".pdf-download").text(doTranslation("pdfDownload"));
    $(".pdf2-download").text(doTranslation("pdfDownload2"));
    $(".about-text p").html(doTranslation("about_text"));

    if (_mainObject.language === "pt") {
        $(".gbnt-language").html("en");
        $(".about-text a.pdf-download").attr("href", "docs/exposicao_unplace.pdf");
        $(".about-text a.pdf2-download").attr("href", "docs/unplace_ficha_tecnica.pdf");
    } else {
        $(".gbnt-language").html("pt");
        $(".about-text a.pdf-download").attr("href", "docs/unplace_exhibition.pdf");
        $(".about-text a.pdf2-download").attr("href", "docs/unplace_credits.pdf");
    }
}

function parseURLobject() {
    try {
        var url_obj = location.hash.split("#")[1];
        if (url_obj) {
            url_obj = decodeURIComponent(url_obj);
            _mainObject = JSON.parse(url_obj);
        }
    } catch (e) {
        console.log("url is clean");
    }
}

function prepareProjectData() {
    $.get("docs/projectos/lista_dos_projectos.txt", function(data) {
        var tourTitle = "";
        var tourDesc = "";

        _projectsList = data.split(",");

        // here we detect if we are processing a guided tour
        if (_mainObject.tour_id) {

            $(".gbnt-exibithion").removeClass("selected");
            $(".gbnt-tour").addClass("selected");
            $(".gbnt-about").removeClass("selected");

            if (_mainObject.language === "pt") {
                if (_mainObject.tour_id === "1") {
                    tourTitle = _tours[0][0].title;
                    tourDesc = _tours[0][0].desc;
                    _projectsList = _tours[0][0].projects.split(",");
                }

                if (_mainObject.tour_id === "2") {
                    tourTitle = _tours[1][0].title;
                    tourDesc = _tours[1][0].desc;
                    _projectsList = _tours[1][0].projects.split(",");
                }

                if (_mainObject.tour_id === "3") {
                    tourTitle = _tours[2][0].title;
                    tourDesc = _tours[2][0].desc;
                    _projectsList = _tours[2][0].projects.split(",");
                }
            } else {
                if (_mainObject.tour_id === "1") {
                    tourTitle = _tours[0][1].title;
                    tourDesc = _tours[0][1].desc;
                    _projectsList = _tours[0][1].projects.split(",");
                }

                if (_mainObject.tour_id === "2") {
                    tourTitle = _tours[1][1].title;
                    tourDesc = _tours[1][1].desc;
                    _projectsList = _tours[1][1].projects.split(",");
                }

                if (_mainObject.tour_id === "3") {
                    tourTitle = _tours[2][1].title;
                    tourDesc = _tours[2][1].desc;
                    _projectsList = _tours[2][1].projects.split(",");
                }
            }

            _tourInformation = [{
                tour_title: tourTitle,
                tour_description: tourDesc
            }];

        }

        // Loop to all the projects
        for (var i = 0; i < _projectsList.length; i++) {
            createObject(_projectsList[i]);
        }
    });
}

function checkAllDone(projID) {
    // the goal of this form  is to check that all projects are done
    // this means that we will be validating if no more string IDs are part of the projects array

    var yesWeAreReady = true;

    // this loop removes the string ID of this projID
    for (var i = 0; i < window._projectsList.length; i++) {
        if (projID === window._projectsList[i]) {
            window._projectsList.splice(i, 1);
            break;
        }
    }

    // if we still have any string ID inside the array, then we are not ready yet
    for (var ii = 0; ii < window._projectsList.length; ii++) {
        if (typeof window._projectsList[ii] === "string") {
            yesWeAreReady = false;
            break;
        }
    }

    if (yesWeAreReady) {
        // Let's party
        createHTML();
        correctSizes();
        randomizeDIVs();
        initializePackery();

        // If we are entering a tour, then open item_x
        if (_mainObject.tour_id) {
            openProject($("#item_x"));
            _packeryContainer.packery();
        }

        createEventHandlers();
        checkAllImagesAreLoaded();
        // doMobileFlashing();
    }
}

function checkAllImagesAreLoaded() {

    var $img = $('img'),
        totalImg = $img.length - 3;

    var waitImgDone = function() {
        totalImg--;
        if (!totalImg) $('.preloader').addClass("hide-me");
    };

    $('img').each(function() {
        $(this)
            .load(waitImgDone)
            .error(waitImgDone);
    });

}

function correctSizes() {
    var mainWidth = $(".gbnt-item.gbnt-size-normal").width();

    $(".gbnt-size-normal").each(function() {
        $(this).height(mainWidth);
    });

    $(".gbnt-size-wide").each(function() {
        $(this).height(mainWidth);
    });

    $(".gbnt-size-tall").each(function() {
        $(this).height(mainWidth * 2);
    });
}

function createEventHandlers() {

    // Mouse hover for logo
    $(".logo-unplace img").hover(function getIn() {
        $(this).attr("src", "img/unplace_logo_blue.png");
    }, function getOut() {
        $(this).attr("src", "img/unplace_logo.png");
    });


    // Mouse hover for fadein/fadeout Project Cover
    $(".proj-cover").hover(function getIn() {
        if ($(this).parents(".gbnt-item").attr("data-gbnt-checked") === "true" ||
            $(this).parents(".gbnt-item").hasClass("no-pointers")) {
            return;
        }
        $(this).fadeTo(100, 0);
    }, function getOut() {
        if ($(this).parents(".gbnt-item").attr("data-gbnt-checked") === "true") {
            return;
        }
        $(this).fadeTo(100, 1);
    });


    // Mouse hover for fadein/fadeout Project Text
    // this only happens if data-gbnt-checked = true, meaning, we have alredy visited this proj
    $(".proj-text").hover(function getIn() {
        if ($(this).parents("#item_x")) {
            return;
        }
        $(this).fadeTo(100, 1);
    }, function getOut() {
        if ($(this).parents("#item_x")) {
            return;
        }
        $(this).fadeTo(100, 0);
    });


    // Click event for TOUR clicked
    $(".tours a").on("click", function(e) {
        e.preventDefault();

        // Update the URL object 
        _mainObject.tour_id = $(this).attr("href");
        var str = JSON.stringify(_mainObject);
        location.hash = encodeURIComponent(str);

        location.reload();
    });


    // Click event to OPEN Project
    $(".gbnt-item").on("click", function(e) {
        if (e.target.className === "btn-view-proj") {
            return;
        }

        // this is the case when we click a link inside the project text
        if (e.target.tagName === "A" && e.target.classList.length === 0) {
            return;
        }

        //If event was triggered by a DIV other than gbnt-item, then get out of here
        e.preventDefault();
        if ($(this).hasClass('no-pointers')) {
            return;
        }
        if (e.target.id !== "cover") {
            return;
        }
        openProject(this);
    });


    // Click event to CLOSE Project
    $(".proj-profile .btn-close").on("click", function(e) {
        e.preventDefault();
        var gbntItemDiv = $(this).parents(".gbnt-item");
        closeProject(gbntItemDiv);
        _packeryContainer.packery(); // do reflow
    });


    // Click event for LANGUAGE
    $(".gbnt-language").on("click", function(e) {
        e.preventDefault();

        // Update the URL object 
        _mainObject.language = $(".gbnt-language").html();
        var str = JSON.stringify(_mainObject);
        location.hash = encodeURIComponent(str);

        location.reload();
    });

    // Click event for EXIBITHION
    $(".gbnt-exibithion").on("click", function(e) {
        e.preventDefault();

        $(".gbnt-exibithion").addClass("selected");
        $(".gbnt-tour").removeClass("selected");
        $(".gbnt-about").removeClass("selected");

        // Update the URL object 
        _mainObject.project_id = null;
        _mainObject.tour_id = null;

        var str = JSON.stringify(_mainObject);
        location.hash = encodeURIComponent(str);
        location.reload();
    });

    // Click event for TOUR
    $(".gbnt-tour").on("click", function(e) {
        e.preventDefault();
        $(".gbnt-exibithion").removeClass("selected");
        $(".gbnt-tour").addClass("selected");
        $(".gbnt-about").removeClass("selected");
    });


    // Click event to open TAB author
    $(".proj-profile .btn-author").on("click", function(e) {
        e.preventDefault();
        $(this).siblings(".btn-project").toggleClass("btn-selected");
        $(this).toggleClass("btn-selected");
        $(this).parent().siblings(".tab-project").toggle();
        $(this).parent().siblings(".tab-author").toggle();
    });


    // Click event to open TAB project
    $(".proj-profile .btn-project").on("click", function(e) {
        e.preventDefault();
        $(this).siblings(".btn-author").toggleClass("btn-selected");
        $(this).toggleClass("btn-selected");
        $(this).parent().siblings(".tab-project").toggle();
        $(this).parent().siblings(".tab-author").toggle();
    });


    // Click event for ABOUT link
    $("#gbnt-header .gbnt-about").on("click", function(e) {
        e.preventDefault();

        $(".gbnt-exibithion").removeClass("selected");
        $(".gbnt-tour").removeClass("selected");
        $(".gbnt-about").addClass("selected");

        $(".tours").addClass("hide-me");
        if ($("#gbnt-header").attr("data-gbnt-open") === "false") {
            $("#gbnt-header").attr("data-gbnt-open", "true");
            $(".about-text").removeClass("hide-me");
            openHeader("gbnt-about", false);
        } else {
            $("#gbnt-header").attr("data-gbnt-open", "false");
            $(".about-text").addClass("hide-me");
            closeHeader("gbnt-about", false);
        }

    });


    // Click event for TOURS link
    $("#gbnt-header .gbnt-tour").on("click", function(e) {
        e.preventDefault();


        //Check if we have to close any open item
        $(".selected-project").each(function(item) {
            closeProject(item);
        });

        $(".about-text").addClass("hide-me");
        if ($("#gbnt-header").attr("data-gbnt-open") === "false") {
            $("#gbnt-header").attr("data-gbnt-open", "true");
            $(".tours").removeClass("hide-me");
            openHeader("gbnt-tour", false);
        } else {
            $("#gbnt-header").attr("data-gbnt-open", "false");
            $(".tours").addClass("hide-me");
            closeHeader("gbnt-tour", false);
        }

    });


    // Click event for BURGER icon
    $("#gbnt-header .toggle-menu").on("click", function(e) {
        e.preventDefault();
        if ($("#gbnt-header .toggle-menu i").hasClass('fa-bars')) {
            $("#gbnt-header .toggle-menu i").removeClass('fa-bars').addClass('fa-times');
            $("#gbnt-header .gbnt-tour").addClass('no-pointers');
            $("#gbnt-header .gbnt-about").addClass('no-pointers');
            openHeader(null, true);
            $("#gbnt-header .nav").show();
        } else {
            $("#gbnt-header .toggle-menu i").removeClass('fa-times').addClass('fa-bars');
            $("#gbnt-header .gbnt-tour").removeClass('no-pointers');
            $("#gbnt-header .gbnt-about").removeClass('no-pointers');
            $("#gbnt-header .nav").hide();
            closeHeader(null, true);
        }
    });

    // Click event for CLOSE header link
    $("#gbnt-header .close-header a").on("click", function(e) {
        e.preventDefault();

        $("#gbnt-header").attr("data-gbnt-open", "false");
        $(".tours").addClass("hide-me");
        $(".about-text").addClass("hide-me");
        $(".close-header").addClass("hide-me");

        closeHeader("gbnt-tour", false);
    });


    // Close project if ESC key is pressed
    $(document).keyup(function(e) {
        if (e.keyCode === 27) {
            $(".gbnt-item").each(function() {
                if ($(this).attr("data-gbnt-checked") === "true") {
                    closeProject(this);
                    _packeryContainer.packery(); // do reflow
                    return;
                }
            });
        }
    });
}

function openHeader(selectedMenuClass, isMobile) {
    var size = "550px";
    var marginTop = "320px";

    if (selectedMenuClass === "gbnt-tour") {
        size = "170px";
        marginTop = "50px";
    }

    // var ease = "easeOutElastic";
    var ease = "swing";
    var dur = 200;

    if (isMobile) {
        size = "1500px";
        ease = "swing";
        dur = 200;
    }

    $('#gbnt-header').animate({
        height: size
    }, {
        duration: dur,
        easing: ease,
        complete: function() {
            $("." + selectedMenuClass).removeClass("no-pointers");
        }
    });

    if (!isMobile) {
        $('#gbnt-container').animate({
            "margin-top": marginTop
        }, {
            duration: dur,
            easing: ease
        });
    }
}


function closeHeader(selectedMenuClass, isMobile) {
    // var ease = "easeOutElastic";
    var ease = "swing";
    var dur = 200;

    if (isMobile) {
        ease = "swing";
        dur = 200;
    }

    $('#gbnt-header').animate({
        height: "120px"
    }, {
        duration: dur,
        easing: ease,
        complete: function() {
            $("." + selectedMenuClass).removeClass("no-pointers");
        }
    });

    if (!isMobile) {
        $('#gbnt-container').animate({
            "margin-top": "0px"
        }, {
            duration: dur,
            easing: ease
        });
    }
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }

    return false;
}

function openProject(gbntItem) {
    var mainWidth = $(gbntItem).width();

    // Set the flag to CHECKED
    $(gbntItem).attr("data-gbnt-checked", "true");

    // Store the original height (will be used when shrinking the project DIV)
    $(gbntItem).attr("data-gbnt-previous-height", $(gbntItem).height());

    // Remove pointer events from all item DIVs
    $(".gbnt-item").each(function() {
        if (this !== gbntItem) {
            $(this).addClass("no-pointers");
        }
    });

    // Hide DIV cover image
    $(gbntItem).find(".proj-cover").hide();

    // Hide DIV project text
    $(gbntItem).find(".proj-text").hide();
    if ($(gbntItem).attr("id") !== "item_x") {
        $(gbntItem).find(".proj-text").css("opacity", "0");
    }

    // Hide DIV project image
    $(gbntItem).find(".proj-img").hide();

    // Expand the project profile DIV
    $(gbntItem).addClass("selected-project");

    $(gbntItem).find(".proj-profile").removeClass("hide-me");

    // we need to have the tab-author temporarly visible, to get its height
    $(gbntItem).find(".tab-author").removeClass("hide-me");

    // Get the text box height, and enlarge the div depending on the amount of text
    var h;

    if ($(gbntItem).find(".tab-author").height() > $(gbntItem).find(".tab-project").height()) {
        h = $(gbntItem).find(".tab-author").height();
    } else {
        h = $(gbntItem).find(".tab-project").height();
    }
    $(gbntItem).height(h + 150);

    // now we can hide tab-author again
    $(gbntItem).find(".tab-author").addClass("hide-me");

    // Scroll to the open project
    if ($(document).width() < 768) {
        // For mobile scenarios
        _packeryContainer.packery('fit', gbntItem, 0, 0);
        $("html, body").animate({
            scrollTop: 0
        }, "slow");
    } else {
        // For desktop scenarios
        _packeryContainer.packery('fit', gbntItem);
        $('html, body').animate({
            scrollTop: $(gbntItem).position().top - 10
        }, 500);
    }

    // Update the URL object with the project ID
    _mainObject.project_id = parseInt($(gbntItem).attr("id").split("_")[1]);
    var str = JSON.stringify(_mainObject);
    location.hash = encodeURIComponent(str);
}

function closeProject(gbntItem) {
    // Set the flag to UNCHECKED
    $(gbntItem).attr("data-gbnt-checked", "false");

    // Restores the original height
    $(gbntItem).height($(gbntItem).attr("data-gbnt-previous-height"));

    // Show DIV project text
    $(gbntItem).find(".proj-text").show();

    // Show DIV project image
    $(gbntItem).find(".proj-img").show();

    // Hide DIV project profile
    $(gbntItem).find(".proj-profile").addClass("hide-me");

    // Remove class selected-project, for expanded project
    $(gbntItem).removeClass("selected-project");

    // Add pointer events back to ALL item DIVs
    $(".gbnt-item").each(function() {
        $(this).removeClass("no-pointers");
    });

    // Update the URL object, by removing the project ID
    _mainObject.project_id = null;
    var str = JSON.stringify(_mainObject);
    location.hash = encodeURIComponent(str);

}

function doMobileFlashing() {
    var screenSize = $(window).width();
    if (screenSize <= 768) {
        var arr = $("[id^=overlay]");
        arr.each(function() {
            var rnd = Math.floor((Math.random() * 35));
            rnd = rnd + "s";
            $(this).addClass("mobile-animation");
            $(this).css("-webkit-animation-delay", rnd);
            $(this).css("-moz-animation-delay", rnd);
            $(this).css("-o-animation-delay", rnd);
            $(this).css("animation-delay", rnd);
        });
    }
}

function createTourObj(pTitle, pDesc, pProjects) {
    var obj = {};

    obj.title = pTitle;
    obj.desc = pDesc;
    obj.projects = pProjects;

    return obj;
}

function prepareTours() {
    $.get("docs/visitas.json", function(fileData) {

        var tour1 = [];
        var tour2 = [];
        // var tour3 = [];

        tour1.push(createTourObj(fileData[0].nome_visita_1, fileData[0].descricao_visita_1, fileData[0].projectos_1));
        tour1.push(createTourObj(fileData[1].nome_visita_1, fileData[1].descricao_visita_1, fileData[0].projectos_1));

        tour2.push(createTourObj(fileData[0].nome_visita_2, fileData[0].descricao_visita_2, fileData[0].projectos_2));
        tour2.push(createTourObj(fileData[1].nome_visita_2, fileData[1].descricao_visita_2, fileData[0].projectos_2));

        // tour3.push(createTourObj(fileData[0].nome_visita_3, fileData[0].descricao_visita_3, fileData[0].projectos_3));
        // tour3.push(createTourObj(fileData[1].nome_visita_3, fileData[1].descricao_visita_3, fileData[0].projectos_3));

        _tours.push(tour1);
        _tours.push(tour2);
        // _tours.push(tour3);

        if (_mainObject.language === "pt") {
            $(".tours a.tour1").html(tour1[0].title);
            $(".tours a.tour2").html(tour2[0].title);
            // $(".tours a.tour3").html(tour3[0].title);
        } else {
            $(".tours a.tour1").html(tour1[1].title);
            $(".tours a.tour2").html(tour2[1].title);
            // $(".tours a.tour3").html(tour3[1].title);
        }

        prepareProjectData();
    }).fail(function() {
        console.error("There was an error loading visitas.json");
    });
}

function createObject(projectID) {
    $.get("docs/projectos/" + projectID + "/sumario.json", function(singleProject) {
        var theProject = null;

        if (_mainObject.language === "pt") {
            theProject = singleProject[0];
        } else {
            theProject = singleProject[1];
        }

        theProject.id = this.url.split("/")[2];
        theProject.img = theProject.imagens[0];
        theProject.img_cover = theProject.capa;

        if (theProject.www === "" && (theProject.imagens.length > 1 || theProject.videos.length !== 0)) {
            var data = JSON.stringify(theProject);
            var url = "show_proj.html?data=" + encodeURIComponent(data);
            theProject.www = url;
        }

        theProject.size_class = getSize(theProject.tipo_capa);

        window._projectsList.push(theProject);
        checkAllDone(theProject.id);
    }).fail(function() {
        var tmpID = this.url.split("/")[1];
        checkAllDone(tmpID);
    });
}

function createHTML() {
    var data = {
        tour: _tourInformation,
        project: window._projectsList
    };
    $('#gbnt-container').append(window._template(data));
}

function getSize(tipo_capa) {
    var boxSize = "gbnt-size-normal";

    if (tipo_capa === "N") {
        boxSize = "gbnt-size-normal";
    }

    if (tipo_capa === "T") {
        boxSize = "gbnt-size-tall";
    }

    if (tipo_capa === "W") {
        boxSize = "gbnt-size-wide";
    }

    return boxSize;
}

Handlebars.registerHelper('getID', function(str, projectID) {
    var val = str + projectID;
    return val;
});

Handlebars.registerHelper('getCoverImageURL', function(id, tipoCapa, capaID) {
    var url = "img/covers/normal.jpg";

    if (capaID !== "") {
        url = "docs/projectos/" + id + "/" + capaID;
    } else {
        if (tipoCapa === "N") {
            url = "img/covers/normal.jpg";
        }
        if (tipoCapa === "T") {
            url = "img/covers/tall.jpg";
        }
        if (tipoCapa === "W") {
            url = "img/covers/wide.jpg";
        }
    }
    return new Handlebars.SafeString(url);
    // return url;
});

Handlebars.registerHelper('getProjectImageURL', function(id, imgID) {
    var url = "img/black.jpg";

    if (imgID && imgID !== "") {
        url = "docs/projectos/" + id + "/" + imgID;
    }

    return new Handlebars.SafeString(url);
    // return url;
});

Handlebars.registerHelper('translateThis', function(id) {
    var text = doTranslation(id);
    return text;
});

function doTranslation(id) {
    if (_mainObject.language === "pt") {
        return translations[id][0];
    } else {
        return translations[id][1];
    }
}

function randomizeDIVs() {
    var cards = $(".gbnt-item");
    for (var i = 0; i < cards.length; i++) {
        var target = Math.floor(Math.random() * cards.length - 1) + 1;
        var target2 = Math.floor(Math.random() * cards.length - 1) + 1;
        cards.eq(target).before(cards.eq(target2));
    }

    $("#item_x").prependTo("#gbnt-container");
}

function initializePackery() {
    _packeryContainer.packery();

    if (_mainObject.project_id) {
        $(".gbnt-item").each(function() {
            var theId = $(this).attr("id").split("_")[1];
            if (_mainObject.project_id === parseInt(theId)) {
                openProject(this);
                return;
            }
        });
    }
}
