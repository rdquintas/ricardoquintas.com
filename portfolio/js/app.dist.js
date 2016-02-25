$(document).ready(function () {
  var $grid
  $.slidebars()
  $('#nav-menu ul').clone().appendTo('.sb-slidebar')
  $('#footer .year').html(new Date().getFullYear())
  checkAllImagesAreLoaded()
})

// Handlebars get the skill CSS class
Handlebars.registerHelper('skills_class', function () {
  var str = this.skills.join(' ')
  return str
})

// Handlebars get the CSS color for the skill tag
Handlebars.registerHelper('get_skill_css_color', function (skill) {
  switch (skill) {
    case 'LESS':
      return 'blue'
      break
    case 'NodeJS':
      return 'green'
      break
    case 'PHP':
      return 'purple'
      break
    case 'Bootstrap':
      return 'light-blue'
      break
    case 'Javascript':
      return 'yellow'
      break
    case '????????':
      return 'orange'
      break
    case '????????':
      return 'red'
      break
    case '????????':
      return 'light-green'
      break
    default:
      return 'grey'
      break
  }
})

// Initialize Handlebars
var source = $('#entry-template').html()
var template = Handlebars.compile(source)
var html = template(this.projects)
$('#projects').html(html)

function setActive (skill) {
  $('#nav-menu ul li').removeClass('active')
  $('#nav-menu-mobile ul li').removeClass('active')
  $('#nav-menu ul li.' + skill).addClass('active')
  $('#nav-menu-mobile ul li.' + skill).addClass('active')
}

function initializeGrid () {
  $grid = $('#projects')
  $grid.isotope({
    itemSelector: '.project-item',
    layoutMode: 'fitRows'
  })

  // Capture skill-filter click events
  $('ul.menu li').on('click', function () {
    var skill = $(this).attr('data-skill')
    if (skill === 'Home') {
      return
    }
    setActive(skill)
    $.slidebars.close()
    if (skill === 'All') {
      $grid.isotope({
        filter: '*'
      })
    } else {
      $grid.isotope({
        filter: '.project-item.' + skill
      })
    }
  })

  $('#page-loader').fadeOut(500)
}

function checkAllImagesAreLoaded () {
  var $img = $('img'),
    totalImg = $img.length

  var waitImgDone = function () {
    totalImg--

    // if all images are al
    if (!totalImg) {
      initializeGrid()
    }
  }

  $('img').each(function () {
    $(this)
      .load(waitImgDone)
      .error(waitImgDone)
  })
}
